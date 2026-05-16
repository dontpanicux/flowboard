'use client';

import { useState } from "react";
import type { Board } from "@/lib/types/database.types";
import { DashboardStats } from "./DashboardStats";
import { TaskRow } from "./TaskRow";
import { BoardCard } from "./BoardCard";
import { CreateBoardModal } from "./CreateBoardModal";
import { CalendarSubscribe } from "./CalendarSubscribe";
import { Button } from "@/components/ui/Button";

type TaskWithRelations = {
  id: string;
  name: string;
  due_date: string | null;
  priority: string | null;
  columns: { name: string; boards: { id: string; name: string } | null } | null;
};

interface DashboardProps {
  boards: Board[];
  overdueTasks: TaskWithRelations[];
  highPriorityTasks: TaskWithRelations[];
  upcomingTasks: TaskWithRelations[];
  openTaskCount: number;
  calendarToken: string;
}

function SectionHeader({ icon, title, count }: { icon: string; title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span aria-hidden="true">{icon}</span>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <span className="text-xs text-muted" aria-label={`${count} items`}>({count})</span>
    </div>
  );
}

export function Dashboard({
  boards,
  overdueTasks,
  highPriorityTasks,
  upcomingTasks,
  openTaskCount,
  calendarToken,
}: DashboardProps) {
  const [showModal, setShowModal] = useState(false);

  const dueSoon = upcomingTasks.length;
  const overdue = overdueTasks.length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Workspace</h1>
        <div className="flex items-center gap-4">
          <CalendarSubscribe token={calendarToken} />
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Create board
          </Button>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats
        totalBoards={boards.length}
        openTasks={openTaskCount}
        dueSoon={dueSoon}
        overdue={overdue}
      />

      {/* Task sections */}
      {(overdueTasks.length > 0 || highPriorityTasks.length > 0 || upcomingTasks.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-3 mb-10">
          {/* Overdue */}
          {overdueTasks.length > 0 && (
            <div className="rounded-xl bg-surface p-4 shadow-sm border-l-4 border-danger">
              <SectionHeader icon="⚠️" title="Overdue" count={overdueTasks.length} />
              {overdueTasks.map((task) => (
                <TaskRow key={task.id} task={task} showDate={false} />
              ))}
            </div>
          )}

          {/* High priority */}
          {highPriorityTasks.length > 0 && (
            <div className="rounded-xl bg-surface p-4 shadow-sm border-l-4 border-red-400">
              <SectionHeader icon="🔴" title="High Priority" count={highPriorityTasks.length} />
              {highPriorityTasks.map((task) => (
                <TaskRow key={task.id} task={task} showDate={true} />
              ))}
            </div>
          )}

          {/* Upcoming */}
          {upcomingTasks.length > 0 && (
            <div className="rounded-xl bg-surface p-4 shadow-sm border-l-4 border-yellow-400">
              <SectionHeader icon="📅" title="Due this week" count={upcomingTasks.length} />
              {upcomingTasks.map((task) => (
                <TaskRow key={task.id} task={task} showDate={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Boards grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Boards</h2>
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
