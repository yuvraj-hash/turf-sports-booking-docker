## Purpose

This short guide helps an AI coding assistant become productive in this repository quickly. It focuses on concrete, discoverable patterns, dev workflows, integration points, and files to inspect when making changes.

## Quick dev commands

- Install & run: this is a Vite + React TypeScript project
  - Install dependencies: use your usual package manager (project uses npm-style scripts in `package.json`).
  - Dev server: `npm run dev` (Vite server on port 5173, strictPort enabled)
  - Build: `npm run build` (runs `tsc && vite build`)
  - Preview: `npm run preview`
  - Lint: `npm run lint` (ESLint over `src`)
  - Format: `npm run format` (Prettier over `src`)

## Environment & required secrets

- Vite env vars (must be prefixed with `VITE_`):
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — required; `src/lib/supabase.ts` throws if missing.
  - `VITE_RESEND_API_KEY` — optional but required for email sending via Resend (see `src/lib/supabase.ts`).

When adding or debugging auth/email features, confirm these are set in the dev environment (.env) or the Docker configuration.

## Big-picture architecture

- Frontend-only React (Vite + TypeScript) SPA. Routing via `react-router-dom` and pages live under `src/pages/` (e.g. `Dashboard`, `Booking`, `Events`).
- Supabase is used as the primary backend (database + auth) via the client in `src/lib/supabase.ts`. This file defines typed helpers (insertBooking, signIn, signUp, resetPassword, etc.) and the Database types — update these when DB schema changes.
- Resend is used for transactional emails (confirmation / reset) inside `src/lib/supabase.ts` (guarded by the presence of `VITE_RESEND_API_KEY`).
- UI: TailwindCSS (see `tailwind.config.js` and `index.css`) and component-driven layout in `src/components/`. Modal patterns live in `src/components/modals/` and are used broadly (Login/Register/Forgot/Confirm).

## Key files to inspect for changes

- `vite.config.ts` — dev server options (port 5173), `optimizeDeps` includes/excludes (if you add new dependencies that break pre-bundling, update this).
- `package.json` — scripts and dependencies; `build` runs `tsc` first.
- `src/lib/supabase.ts` — central integration point. Contains supabase client creation, typed DB shape, all helper functions (bookings, registrations, auth flows, Resend email calls). Always check and update types here when changing DB interactions.
- `src/App.tsx` — global auth/session check (getCurrentUser) and route wiring (redirects to `/dashboard` on session). Many auth and navigation decisions are implemented here.
- `src/pages/` and `src/components/` — UI surface; look here for form handlers and how modal props are passed.

## Project-specific patterns and conventions

- Modal-driven UX: authentication and admin interactions use modal components in `src/components/modals/`. Prefer updating modal props and handlers rather than adding global state unless needed.
- Auth/session handling: `App.tsx` performs a session check with `getCurrentUser` on mount and redirects to `/dashboard` for authenticated users. New auth flows should rely on `src/lib/supabase.ts` functions (e.g., `signIn`, `signUp`, `signOut`).
- Type-first DB usage: `src/lib/supabase.ts` exports a `Database` type that describes tables and rows — maintain this type when changing DB interactions so TypeScript keeps callers safe.
- Environment checks: `src/lib/supabase.ts` validates critical env vars at import; changing this file affects app startup.

## Integration & dependency notes

- Supabase SDK version: project uses `@supabase/supabase-js` (see `package.json`). Keep version compatibility in mind when updating.
- Resend email calls are only functional if `VITE_RESEND_API_KEY` is present. If offline testing is needed, handle missing key gracefully or mock the resend client.
- Vite `optimizeDeps` is customized to exclude `lucide-react` and `react-router-dom` and to include some packages — adding UI/icon libs may require updating `optimizeDeps.include`/`exclude` to avoid dev-time module resolution issues.

## Common tasks and examples

- Add a new booking field: update the `Booking` interface and `bookings` table types inside `src/lib/supabase.ts`, then update any form components in `src/pages/Booking.tsx` or `src/components/` that submit booking data.
- Find booking insertion helper: `insertBooking` in `src/lib/supabase.ts` — reuse it rather than writing raw SQL calls from components.
- Debugging auth: check console logs from `src/lib/supabase.ts` (initialization logs) and session checks in `src/App.tsx`; ensure `VITE_SUPABASE_*` variables are present.

## What NOT to change without care

- Do not remove the env checks in `src/lib/supabase.ts` — they intentionally fail fast to avoid hard-to-debug auth issues.
- Avoid large refactors of routing in `App.tsx` without verifying redirects and the session flow (session check redirects to `/dashboard` when a user is present).

## If you need more context

- Start with these files: `src/lib/supabase.ts`, `src/App.tsx`, `vite.config.ts`, `package.json`, and `src/components/modals/`.
- Ask for sample environment values if you need to run flows that require Supabase or Resend.

If anything here is unclear or you want more detail (for example: Docker-related run steps, CI config, or missing env examples), say which area and I'll expand or iterate.
