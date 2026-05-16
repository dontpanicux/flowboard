import { type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

function formatICSDate(dateStr: string) {
  return dateStr.replace(/-/g, "");
}

function nextDay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0].replace(/-/g, "");
}

function escapeICS(str: string) {
  return str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Strip .ics suffix if present
  const cleanToken = token.replace(/\.ics$/, "");

  const supabase = createServiceClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("calendar_token", cleanToken)
    .single();

  if (!profile) {
    return new Response("Not found", { status: 404 });
  }

  // Fetch all tasks with due dates for this user via join
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, name, description, due_date, priority, columns(name, boards(id, name, user_id))")
    .not("due_date", "is", null);

  // Filter to only this user's tasks (RLS not active with service role)
  const userTasks = (tasks ?? []).filter(
    (t: any) => t.columns?.boards?.user_id === profile.id
  );

  const events = userTasks
    .map((task: any) => {
      const summary = task.priority === "high"
        ? `[High] ${task.name}`
        : task.name;
      const boardName = task.columns?.boards?.name ?? "FlowBoard";
      const desc = [
        task.description ? escapeICS(task.description) : "",
        `Board: ${escapeICS(boardName)}`,
        task.priority ? `Priority: ${task.priority}` : "",
      ]
        .filter(Boolean)
        .join("\\n");

      return [
        "BEGIN:VEVENT",
        `UID:flowboard-${task.id}@flowboard`,
        `DTSTART;VALUE=DATE:${formatICSDate(task.due_date)}`,
        `DTEND;VALUE=DATE:${nextDay(task.due_date)}`,
        `SUMMARY:${escapeICS(summary)}`,
        desc ? `DESCRIPTION:${desc}` : "",
        "END:VEVENT",
      ]
        .filter(Boolean)
        .join("\r\n");
    })
    .join("\r\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FlowBoard//FlowBoard//EN",
    "X-WR-CALNAME:FlowBoard Tasks",
    "X-WR-TIMEZONE:UTC",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="flowboard.ics"',
      "Cache-Control": "no-cache",
    },
  });
}
