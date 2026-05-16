import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Sign in — FlowBoard" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="white" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="white" fillOpacity="0.6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">FlowBoard</h1>
        <p className="text-sm text-muted">Manage your work, effortlessly.</p>
      </div>
      <AuthForm />
    </main>
  );
}
