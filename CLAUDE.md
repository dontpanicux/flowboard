# FlowBoard — Claude Code Context

## Project
Kanban-style task management web app. Design source: Figma file `R0Qnpaq1cfqIrSCFxZLSY5`.
- Components page: `node-id=0:1`
- Designs page: `node-id=4:277`
- GitHub: https://github.com/dontpanicux/flowboard

## Tech Stack
- **Framework**: Next.js (App Router) — see AGENTS.md for version-specific notes
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database + Auth**: Supabase (Postgres + Auth)
- **Hosting**: Vercel
- **Drag & Drop**: `@hello-pangea/dnd`

## Key Commands
```bash
npm run dev          # Start local dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint

supabase start       # Start local Supabase stack
supabase db push     # Push migrations to linked project
supabase gen types typescript --linked > lib/types/database.types.ts
supabase migration new <name>

vercel               # Deploy to preview
vercel --prod        # Deploy to production
```

## Environment Variables
Required in `.env.local` (never commit):
```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```
Same vars must be set in Vercel dashboard under Project → Settings → Environment Variables.

## Project Structure
```
app/
  (auth)/login/page.tsx        # Sign in / magic link / sign up
  (app)/layout.tsx             # Protected layout
  (app)/boards/page.tsx        # My Boards grid
  (app)/boards/[id]/page.tsx   # Kanban board view
  auth/callback/route.ts       # Supabase OAuth + magic link callback
  layout.tsx                   # Root layout
  page.tsx                     # Redirects to /boards or /login

components/
  ui/Button.tsx
  ui/InputField.tsx
  ui/Toggle.tsx
  ui/Modal.tsx
  auth/AuthForm.tsx
  boards/BoardCard.tsx
  boards/BoardsGrid.tsx
  boards/CreateBoardModal.tsx
  kanban/Column.tsx
  kanban/TaskCard.tsx
  kanban/CreateTaskModal.tsx

lib/
  supabase/client.ts           # Browser Supabase client
  supabase/server.ts           # Server-side Supabase client (cookies)
  supabase/middleware.ts       # Session refresh helper
  types/database.types.ts      # Auto-generated — run supabase gen types to refresh

middleware.ts                  # Route protection
supabase/migrations/           # SQL migration files
```

## Design Tokens (Figma)
- Primary: `#7C3AED` (violet)
- Background: light gray (`#F3F4F6`)
- Cards: white
- Navbar: white with bottom border

## Supabase Schema
Tables: `profiles`, `boards`, `columns`, `tasks`
- RLS enabled on all tables
- `profiles` auto-created on sign-up via trigger on `auth.users`
- Users access only their own data — enforced at DB level via RLS

## Auth Providers
Email + password, Magic link, GitHub OAuth

## Conventions
- Server components by default; `'use client'` only for interactivity
- Server Supabase client for server components/routes; browser client for client components
- Never use `service_role` key in client code
- Never filter by user ID in app code — RLS handles it at the DB level
