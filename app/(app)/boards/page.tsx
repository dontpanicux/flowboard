import { createClient } from "@/lib/supabase/server";
import { Dashboard } from "@/components/boards/Dashboard";

export const metadata = { title: "My Workspace — FlowBoard" };

function isNotDone(task: { columns: { name: string } | null }) {
  return task.columns?.name?.toLowerCase() !== "done";
}

export default async function BoardsPage() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const [{ data: boards }, { data: tasksWithDue }, { data: highPriority }, { data: allTasks }] =
    await Promise.all([
      supabase.from("boards").select("*").order("created_at", { ascending: false }),
      supabase
        .from("tasks")
        .select("id, name, due_date, priority, columns(name, boards(id, name))")
        .not("due_date", "is", null)
        .order("due_date"),
      supabase
        .from("tasks")
        .select("id, name, due_date, priority, columns(name, boards(id, name))")
        .eq("priority", "high"),
      supabase
        .from("tasks")
        .select("id, column_id, columns(name)"),
    ]);

  const withDue = (tasksWithDue ?? []) as any[];
  const high = (highPriority ?? []) as any[];
  const all = (allTasks ?? []) as any[];

  const overdueTasks = withDue.filter(
    (t) => t.due_date < today && isNotDone(t)
  );
  const upcomingTasks = withDue.filter(
    (t) => t.due_date >= today && t.due_date <= nextWeek && isNotDone(t)
  );
  const highPriorityOpen = high.filter(isNotDone);
  const openTaskCount = all.filter(isNotDone).length;

  const { data: profile } = await supabase
    .from("profiles")
    .select("calendar_token")
    .single();

  return (
    <Dashboard
      boards={boards ?? []}
      overdueTasks={overdueTasks}
      highPriorityTasks={highPriorityOpen}
      upcomingTasks={upcomingTasks}
      openTaskCount={openTaskCount}
      calendarToken={profile?.calendar_token ?? ""}
    />
  );
}
