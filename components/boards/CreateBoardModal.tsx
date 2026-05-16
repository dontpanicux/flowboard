'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/Modal";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateBoardModal({ open, onClose }: CreateBoardModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: board, error } = await supabase
      .from("boards")
      .insert({ name: name.trim(), user_id: user.id })
      .select()
      .single();

    if (!error && board) {
      // Create default columns
      await supabase.from("columns").insert([
        { board_id: board.id, name: "To Do", position: 0 },
        { board_id: board.id, name: "In Progress", position: 1 },
        { board_id: board.id, name: "Done", position: 2 },
      ]);
      setName("");
      onClose();
      router.push(`/boards/${board.id}`);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Create board</h2>
      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <InputField
          label="Board name"
          placeholder="e.g. Product Roadmap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="action" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
            {loading ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
