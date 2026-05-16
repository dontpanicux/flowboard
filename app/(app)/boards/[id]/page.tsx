import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: board } = await supabase.from("boards").select("name").eq("id", id).single();
  return { title: board ? `${board.name} — FlowBoard` : "Board — FlowBoard" };
}

export default async function BoardPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: board } = await supabase.from("boards").select("*").eq("id", id).single();
  if (!board) notFound();

  const { data: columns } = await supabase
    .from("columns")
    .select("*")
    .eq("board_id", id)
    .order("position");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .in("column_id", (columns ?? []).map((c) => c.id))
    .order("position");

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-surface px-6 py-3">
        <nav className="text-sm text-muted">
          <span>Boards</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-foreground">{board.name}</span>
          <span className="ml-2 text-xs">
            {columns?.length ?? 0} {(columns?.length ?? 0) === 1 ? "column" : "columns"}
          </span>
        </nav>
      </div>
      <KanbanBoard
        board={board}
        initialColumns={columns ?? []}
        initialTasks={tasks ?? []}
      />
    </div>
  );
}
