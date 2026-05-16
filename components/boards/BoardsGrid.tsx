'use client';

import { useState } from "react";
import type { Board } from "@/lib/types/database.types";
import { BoardCard } from "./BoardCard";
import { CreateBoardModal } from "./CreateBoardModal";
import { Button } from "@/components/ui/Button";

export function BoardsGrid({ boards }: { boards: Board[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Boards</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Create board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
          <p className="text-muted">No boards yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Create your first board
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}

      <CreateBoardModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
