import { createClient } from "@/lib/supabase/server";
import { BoardsGrid } from "@/components/boards/BoardsGrid";

export const metadata = { title: "My Boards — FlowBoard" };

export default async function BoardsPage() {
  const supabase = await createClient();
  const { data: boards } = await supabase
    .from("boards")
    .select("*")
    .order("created_at", { ascending: false });

  return <BoardsGrid boards={boards ?? []} />;
}
