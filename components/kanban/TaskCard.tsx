'use client';

import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "@/lib/types/database.types";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: (task: Task) => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick(task);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Edit task: ${task.name}`}
          className={`rounded-lg border border-border bg-surface p-3 cursor-pointer hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all ${
            snapshot.isDragging ? "shadow-lg rotate-1" : "shadow-sm"
          }`}
        >
          <p className="text-sm font-medium text-foreground">{task.name}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {task.priority && (
              <span
                className={`rounded px-1.5 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}
                aria-label={`Priority: ${task.priority}`}
              >
                {task.priority}
              </span>
            )}
            {task.due_date && (
              <span className="text-xs text-muted">
                {new Date(task.due_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
