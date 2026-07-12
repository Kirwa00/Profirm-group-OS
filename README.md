# Profirm OS

Venture-management operating system for Profirm Group. Operationalizes
`Profirm_Group_Master_Operating_System.md` as a real, DB-backed app: ventures,
open decisions, next priorities, key documents, and a cross-venture
priorities/watchlist board. Design system adapted from
`stitch_sdlc_blue_gold_interface/venture_integrity/DESIGN.md` (Deep Navy +
Metallic Gold).

## Stack

Next.js 14 App Router + TypeScript + Tailwind, Prisma + Postgres, NextAuth v5
(credentials). Single deployable — Route Handlers/Server Actions are the
backend, no separate API service.

## Setup

```bash
npm install
cp .env.example .env   # already done; edit DATABASE_URL when you have a host
```

The app **boots and renders without `DATABASE_URL`** — pages show a setup
banner instead of crashing. To connect a real database (Supabase or Neon
Postgres both work):

```bash
# 1. put your connection string in .env
DATABASE_URL="postgresql://..."

# 2. push the schema and seed the 11 ventures + admin user
npm run db:push
npm run db:seed

# 3. run the app
npm run dev
```

Seeded admin login: `admin@profirmgroup.com` / `ProfirmOS2026!` (override via
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars before seeding).

## Structure

- `app/` — pages (`/`, `/ventures/[key]`, `/ventures/new`, `/priorities`,
  `/tools`, `/ventures/[key]/modules/[slug]`, `/tools/[slug]`) and Server
  Actions (`actions.ts` files)
- `components/app-shell.tsx`, `components/side-nav.tsx` — shared TopNavBar +
  Deep Navy SideNavBar used by every page
- `components/modules/` — all 14 converted Stitch mockups, registered in
  `lib/modules.ts` (venture-scoped: Migingo Gold financial hub/sensitivity
  model/geological survey/fleet ops/CIL plant, Trans Africa hospitality asset
  management, Highlands Institute growth ops, AI Startup Studio SDLC
  workspace, Trading & Quant Research, AI Knowledge Base, Manufacturing
  feasibility+costing/logistics/machinery procurement, Personal Health
  wellness dashboard/biometric tracker/health insights/nutrition planner)
  and `lib/os-tools.ts` (cross-venture: workflow builder, agent monitor,
  document AI hub, connectivity hub — not scoped to one venture)
- `prisma/schema.prisma`, `prisma/seed.ts` — data model + seed data
- `lib/prisma.ts` — boot-tolerant Prisma client (`safeQuery` never throws)

## Mockup coverage

All 29 Stitch mockups from `stitch_sdlc_blue_gold_interface/` are accounted
for: 8 source files converted into 7 venture modules (two near-duplicate
Migingo Gold plant/security exports were merged into one), 2 near-duplicate
manufacturing exports merged into one, 4 used as structural reference for the
shared shell/dashboard/new-venture form rather than standalone pages, and 4
Suluhu-specific mockups (acquisition analytics, marketing funnel, patient
intake, landing page) deliberately **not** duplicated — that venture already
has its own live platform elsewhere in this workspace.
