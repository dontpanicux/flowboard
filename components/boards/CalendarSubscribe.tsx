'use client';

import { useState } from "react";

export function CalendarSubscribe({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/api/calendar/${token}.ics`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Subscribe to calendar
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 w-96 rounded-xl border border-border bg-surface p-4 shadow-lg">
          <h3 className="text-sm font-semibold text-foreground mb-1">Subscribe to Calendar</h3>
          <p className="text-xs text-muted mb-3">
            Copy this URL and add it as a calendar subscription in Apple Calendar, Google Calendar, or Outlook. Tasks with due dates will appear as all-day events.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <input
              readOnly
              value={url}
              className="flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-muted font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-xs text-muted space-y-1">
            <p className="font-medium text-foreground">How to subscribe:</p>
            <p>• <span className="font-medium">Apple Calendar</span> → File → New Calendar Subscription</p>
            <p>• <span className="font-medium">Google Calendar</span> → Other Calendars → From URL</p>
            <p>• <span className="font-medium">Outlook</span> → Add Calendar → From Internet</p>
          </div>
        </div>
      )}
    </div>
  );
}
