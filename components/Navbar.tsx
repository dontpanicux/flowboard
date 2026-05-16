'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Navbar({ email }: { email: string }) {
  const router = useRouter();
  const supabase = createClient();
  const displayName = email.split("@")[0];

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/boards" className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded" aria-label="FlowBoard home">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
              </svg>
            </div>
            <span className="font-semibold text-foreground">FlowBoard</span>
          </Link>
          <Link
            href="/boards"
            className="text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
          >
            Boards
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          aria-label={`Sign out (${displayName})`}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-2 py-1"
        >
          <span className="hidden sm:block">{displayName}</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="text-xs text-muted">Sign out</span>
        </button>
      </div>
    </header>
  );
}
