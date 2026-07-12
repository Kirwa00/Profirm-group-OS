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
  `/ventures/[key]/modules/[slug]`) and Server Actions (`actions.ts` files)
- `components/app-shell.tsx`, `components/side-nav.tsx` — shared TopNavBar +
  Deep Navy SideNavBar used by every page
- `components/modules/` — converted Stitch mockups (Migingo Gold financial
  hub, geological survey, fleet ops, CIL plant, hospitality asset management,
  Highlands Institute growth ops), registered in `lib/modules.ts`
- `prisma/schema.prisma`, `prisma/seed.ts` — data model + seed data
- `lib/prisma.ts` — boot-tolerant Prisma client (`safeQuery` never throws)

## Backlog

Mockups not yet converted into working pages (workflow builder, agent
monitor, document AI hub, connectivity library, knowledge base, quant
trading, manufacturing, personal health) are tracked as seeded
`CrossVenturePriority` rows — visible at `/priorities` once the DB is
connected, not in a separate doc.

Suluhu Therapy Centre mockups (acquisition analytics, marketing funnel,
patient intake, landing page) were deliberately **not** duplicated here —
that venture already has its own live platform elsewhere in this workspace.
