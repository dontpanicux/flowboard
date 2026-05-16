import Link from "next/link";
import type { Board } from "@/lib/types/database.types";

export function BoardCard({ board }: { board: Board }) {
  const date = new Date(board.created_at ?? "").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/boards/${board.id}`}
      className="block rounded-xl border border-border bg-surface p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
    >
      <h3 className="font-semibold text-foreground">{board.name}</h3>
      <p className="mt-1 text-xs text-muted">{date}</p>
    </Link>
  );
}
