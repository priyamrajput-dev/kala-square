# Architecture Context - Kalasquare

## Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (LTS Stable) App Router + TypeScript | Public + Admin UI |
| **Styling** | Tailwind CSS | Tokens, no hardcoded hex |
| **Backend** | Node.js + Fastify + TypeScript | API, Feature-First |
| **Database** | PostgreSQL + Drizzle ORM | Artists, Venues, Events, Enquiries, Home Sections |
| **Validation** | Zod | Single source of truth, frontend + backend + Swagger |
| **API Docs** | fastify-type-provider-zod + @fastify/swagger | Zod -> JSON Schema -> Swagger UI at /docs |
| **Package Manager** | PNPM only | Monorepo, pnpm-workspace.yaml |

## Monorepo + Feature-First Backend Structure

```text
kalasquare/
AGENTS.md
context/ - Six files (this folder)
apps/web/ - Next.js 16
  src/app/, src/components/, src/lib/
apps/api/src/ - Fastify, Feature-First
  server.ts (only listen, no logic)
  app.ts (bootstrap, create Fastify instance, register plugins + all features)
  config/env.ts (env validated with Zod)
  common/ - errors, middlewares, utils (only code used by 2+ features)
  lib/ - db.ts, logger.ts, storage.ts, auth.ts
  features/
    auth/ - auth.routes.ts, auth.controller.ts, auth.service.ts, auth.repository.ts, auth.schema.ts, auth.types.ts
    artists/ - artists.routes.ts, artists.controller.ts, artists.service.ts, artists.repository.ts, artists.schema.ts, artists.types.ts
    home/ - home.routes.ts, home.controller.ts, home.service.ts, home.repository.ts, home.schema.ts, home.types.ts
    enquiries/ - enquiries.routes.ts, enquiries.controller.ts, enquiries.service.ts, enquiries.repository.ts, enquiries.schema.ts, enquiries.types.ts
    venues/ - venues.routes.ts, venues.controller.ts, venues.service.ts, venues.repository.ts, venues.schema.ts, venues.types.ts
    uploads/ - uploads.routes.ts, uploads.controller.ts, uploads.service.ts, uploads.repository.ts, uploads.schema.ts, uploads.types.ts
packages/shared/ - Shared Zod schemas used by both web and api
packages/db/ - Drizzle schema + migrations
packages/config/ - Shared tsconfig, eslint
screenshots/ - 14 reference screenshots
Kalasquare_Home_Page_Manager_2.html - Design source
```

## System Boundaries

- `apps/web` - Only UI. No DB queries. Fetches data from API.
- `apps/api/features/*` - Each feature owns its routes, controller, service, repository, schema.
- `packages/shared` - Used by both web and api.
- `packages/db` - Only schema + migrations.

## Storage Model

- **PostgreSQL**: artists, artist_media, artist_work, artist_social, venues, events, home_sections, enquiries, users.
- **File Storage**: Profile photo, gallery, share image. Local for now, S3 later. Database stores only the URL.
- **Home Sections**: home_sections table with JSONB `orderedIds` + `heroImages`.

## Auth Model

- Admin login: Email + Password, JWT.
- Only Admin can mutate (create, edit, delete, publish).
- Public routes: `GET /api/artists/:slug` (only status=live), `GET /api/home`, `GET /api/categories`.

## Invariants

1. Controller never writes a DB query. Service never handles req/res. Repository never has business logic.
2. Order is always: routes -> controller -> service -> repository. Do NOT break it.
3. No API without a Zod schema. Do NOT write Swagger manually.
4. Draft / Pending artist public URL must return 404. Only Live opens.
5. Admin save must trigger revalidatePath + revalidateTag. No stale cache.
6. Use Server Components by default. Use "use client" only when browser interactivity is required.
7. No Ghost AI stack: No Clerk, Prisma, Liveblocks, Trigger.dev, Vercel Blob.
