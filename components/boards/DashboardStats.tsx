interface Stat {
  label: string;
  value: number;
  accent?: "default" | "danger" | "warning";
}

function StatCard({ label, value, accent = "default" }: Stat) {
  const valueColor =
    accent === "danger"
      ? "text-danger"
      : accent === "warning"
      ? "text-yellow-600"
      : "text-foreground";

  return (
    <div className="rounded-xl bg-surface p-4 shadow-sm flex flex-col gap-1">
      <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

interface DashboardStatsProps {
  totalBoards: number;
  openTasks: number;
  dueSoon: number;
  overdue: number;
}

export function DashboardStats({ totalBoards, openTasks, dueSoon, overdue }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <StatCard label="Boards" value={totalBoards} />
      <StatCard label="Open tasks" value={openTasks} />
      <StatCard label="Due this week" value={dueSoon} accent="warning" />
      <StatCard label="Overdue" value={overdue} accent={overdue > 0 ? "danger" : "default"} />
    </div>
  );
}
