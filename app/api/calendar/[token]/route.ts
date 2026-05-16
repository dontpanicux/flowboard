import { type NextRequest } from "next/server";
import { createBrowserClient } from "@supabase/ssr";

function formatICSDate(dateStr: string) {
  return dateStr.replace(/-/g, "");
}

function nextDay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0].replace(/-/g, "");
}

function escapeICS(str: string) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const cleanToken = token.replace(/\.ics$/, "");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: tasks, error } = await supabase.rpc("get_tasks_by_calendar_token", {
    p_token: cleanToken,
  });

  if (error || !tasks) {
    return new Response("Not found", { status: 404 });
  }

  if (tasks.length === 0) {
    // Valid token but no tasks with due dates — return empty calendar
  }

  const events = tasks
    .map((task: any) => {
      const summary = task.priority === "high"
        ? `[High] ${task.name}`
        : task.name;
      const desc = [
        task.description ? escapeICS(task.description) : "",
        `Board: ${escapeICS(task.board_name ?? "")}`,
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
