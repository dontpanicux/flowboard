'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui/Modal";
import { InputField, TextAreaField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import type { Task } from "@/lib/types/database.types";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  columnId: string;
  task?: Task | null;
  taskCount: number;
  onSaved: () => void;
}

export function CreateTaskModal({
  open,
  onClose,
  columnId,
  task,
  taskCount,
  onSaved,
}: CreateTaskModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description ?? "");
      setPriority((task.priority ?? "") as "low" | "medium" | "high" | "");
      setDueDate(task.due_date ?? "");
    } else {
      setName("");
      setDescription("");
      setPriority("");
      setDueDate("");
    }
  }, [task, open]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      priority: (priority || null) as Task["priority"],
      due_date: dueDate || null,
    };

    if (task) {
      await supabase.from("tasks").update(payload).eq("id", task.id);
    } else {
      await supabase.from("tasks").insert({
        ...payload,
        column_id: columnId,
        position: taskCount,
      });
    }

    setLoading(false);
    onClose();
    onSaved();
  }

  async function handleDelete() {
    if (!task) return;
    setLoading(true);
    await supabase.from("tasks").delete().eq("id", task.id);
    setLoading(false);
    onClose();
    onSaved();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {task ? "Edit Task" : "Create Task"}
        </h2>
        <button onClick={onClose} className="text-muted hover:text-foreground text-xl leading-none">
          ×
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <InputField
          label="Name"
          placeholder="Enter card name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        <TextAreaField
          label="Description"
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted uppercase tracking-wide">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as typeof priority)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <InputField
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {task ? (
            <Button type="button" variant="danger-ghost" onClick={handleDelete} disabled={loading}>
              Delete card
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button type="button" variant="action" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
