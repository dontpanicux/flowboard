'use client';

import { useState, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { createClient } from "@/lib/supabase/client";
import { Column } from "./Column";
import type { Board, Column as ColumnType, Task } from "@/lib/types/database.types";

interface KanbanBoardProps {
  board: Board;
  initialColumns: ColumnType[];
  initialTasks: Task[];
}

export function KanbanBoard({ board: _board, initialColumns, initialTasks }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const supabase = createClient();

  const refresh = useCallback(async () => {
    const { data: freshTasks } = await supabase
      .from("tasks")
      .select("*")
      .in("column_id", columns.map((c) => c.id))
      .order("position");
    if (freshTasks) setTasks(freshTasks);
  }, [supabase, columns]);

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const sourceColumnTasks = tasks
      .filter((t) => t.column_id === source.droppableId)
      .sort((a, b) => a.position - b.position);

    const destColumnTasks = tasks
      .filter((t) => t.column_id === destination.droppableId && t.id !== draggableId)
      .sort((a, b) => a.position - b.position);

    destColumnTasks.splice(destination.index, 0, { ...task, column_id: destination.droppableId });

    // Optimistic update
    setTasks((prev) => {
      const others = prev.filter(
        (t) => t.column_id !== source.droppableId && t.column_id !== destination.droppableId
      );
      const updatedSource =
        source.droppableId === destination.droppableId
          ? []
          : sourceColumnTasks
              .filter((t) => t.id !== draggableId)
              .map((t, i) => ({ ...t, position: i }));
      const updatedDest = destColumnTasks.map((t, i) => ({ ...t, position: i }));
      return [...others, ...updatedSource, ...updatedDest];
    });

    // Persist to DB
    const updates = destColumnTasks.map((t, i) => ({
      id: t.id,
      column_id: destination.droppableId,
      position: i,
      name: t.name,
      description: t.description,
      priority: t.priority,
      due_date: t.due_date,
    }));

    if (source.droppableId !== destination.droppableId) {
      const sourceUpdates = sourceColumnTasks
        .filter((t) => t.id !== draggableId)
        .map((t, i) => ({
          id: t.id,
          column_id: source.droppableId,
          position: i,
          name: t.name,
          description: t.description,
          priority: t.priority,
          due_date: t.due_date,
        }));
      updates.push(...sourceUpdates);
    }

    for (const update of updates) {
      await supabase.from("tasks").update({
        column_id: update.column_id,
        position: update.position,
      }).eq("id", update.id);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-6 h-full items-start">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter((t) => t.column_id === column.id).sort((a, b) => a.position - b.position)}
            onRefresh={refresh}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
