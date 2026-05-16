'use client';

import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";
import { CreateTaskModal } from "./CreateTaskModal";
import type { Column as ColumnType, Task } from "@/lib/types/database.types";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onRefresh: () => void;
}

export function Column({ column, tasks, onRefresh }: ColumnProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function openCreate() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-xl border border-border bg-background p-3">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-foreground">{column.name}</h3>
        <span className="text-xs text-muted">{tasks.length}</span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            role="group"
            aria-label={`${column.name} column, ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
            className={`flex flex-col gap-2 min-h-24 flex-1 rounded-lg p-1 transition-colors ${
              snapshot.isDraggingOver ? "bg-primary-light" : ""
            }`}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                  <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-xs text-muted">Drop a card here or add one below</p>
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onClick={openEdit} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={openCreate}
        className="mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted hover:text-foreground hover:bg-border/40 transition-colors"
      >
        <span className="text-base leading-none">+</span>
        <span>Add card</span>
      </button>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        columnId={column.id}
        task={editingTask}
        taskCount={tasks.length}
        onSaved={onRefresh}
      />
    </div>
  );
}
