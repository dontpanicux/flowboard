'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Toggle } from "@/components/ui/Toggle";

type Tab = "Password" | "Magic link" | "Sign up";

export function AuthForm() {
  const [tab, setTab] = useState<Tab>("Password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (tab === "Password") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ text: error.message, error: true });
      } else {
        router.push("/boards");
        router.refresh();
      }
    } else if (tab === "Magic link") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) {
        setMessage({ text: error.message, error: true });
      } else {
        setMessage({ text: "Check your email for a login link." });
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) {
        setMessage({ text: error.message, error: true });
      } else {
        setMessage({ text: "Account created — check your email to confirm." });
      }
    }

    setLoading(false);
  }

  async function handleGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-surface p-8 shadow-sm border border-border">
      <Toggle
        options={["Password", "Magic link", "Sign up"]}
        value={tab}
        onChange={(v) => { setTab(v as Tab); setMessage(null); }}
      />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <InputField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {(tab === "Password" || tab === "Sign up") && (
          <div className="flex flex-col gap-1">
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {tab === "Password" && (
              <button
                type="button"
                className="self-end text-xs text-primary hover:underline"
                onClick={async () => {
                  if (!email) return setMessage({ text: "Enter your email first.", error: true });
                  await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${location.origin}/auth/callback`,
                  });
                  setMessage({ text: "Password reset email sent." });
                }}
              >
                Forgot password?
              </button>
            )}
          </div>
        )}

        {message && (
          <p className={`text-sm ${message.error ? "text-danger" : "text-green-600"}`}>
            {message.text}
          </p>
        )}

        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? "Loading…" : tab === "Password" ? "Sign in" : tab === "Magic link" ? "Send link" : "Create account"}
        </Button>
      </form>

      <div className="relative my-4 flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <Button type="button" variant="secondary" fullWidth onClick={handleGitHub}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
        </svg>
        Continue with GitHub
      </Button>
    </div>
  );
}
