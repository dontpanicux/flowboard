import Link from "next/link";

interface TaskRowProps {
  task: {
    id: string;
    name: string;
    due_date: string | null;
    priority: string | null;
    columns: {
      name: string;
      boards: { id: string; name: string } | null;
    } | null;
  };
  showDate?: boolean;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysAgo(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr + "T00:00:00").getTime()) / 86400000
  );
  return diff === 1 ? "1d ago" : `${diff}d ago`;
}

export function TaskRow({ task, showDate = false }: TaskRowProps) {
  const boardId = task.columns?.boards?.id;
  const boardName = task.columns?.boards?.name ?? "Unknown board";

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {boardId ? (
            <Link
              href={`/boards/${boardId}`}
              className="text-sm font-medium text-foreground hover:text-primary truncate"
            >
              {task.name}
            </Link>
          ) : (
            <span className="text-sm font-medium text-foreground truncate">{task.name}</span>
          )}
        </div>
        <p className="text-xs text-muted mt-0.5">{boardName}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {task.priority && (
          <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${priorityColors[task.priority] ?? "bg-gray-100 text-gray-600"}`}>
            {task.priority}
          </span>
        )}
        {task.due_date && showDate && (
          <span className="text-xs text-muted">{formatDate(task.due_date)}</span>
        )}
        {task.due_date && !showDate && (
          <span className="text-xs text-danger font-medium">{daysAgo(task.due_date)}</span>
        )}
      </div>
    </div>
  );
}
