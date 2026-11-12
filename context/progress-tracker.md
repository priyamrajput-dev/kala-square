# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Prompt 1: Monorepo & Infrastructure Setup - DONE

## Current Goal

- Ready for Prompt 2 (Database Schema & Migrations / Next Feature)

## Completed

- **Prompt 1: Monorepo & Infrastructure Setup (DONE)**
  - Setup pnpm workspace monorepo (`apps/*`, `packages/*`).
  - Created root `package.json` with scripts: `dev`, `build`, `lint`, `typecheck`.
  - Configured shared packages:
    - `packages/config`: shared tsconfig configurations (`base`, `node`, `next`).
    - `packages/shared`: shared Zod schemas & TypeScript types (`HealthResponseSchema`, `PaginationQuerySchema`, etc.).
    - `packages/db`: Drizzle ORM configuration (`drizzle.config.ts`), client factory, and schema placeholder (no active DB connection / no tables created in Prompt 1).
  - Setup Fastify backend in `apps/api`:
    - Fastify server running on port 3001.
    - Zod validation and serialization with `fastify-type-provider-zod`.
    - Auto-generated OpenAPI / Swagger UI served at `/docs`.
    - Registered 6 feature modules with feature-first 6-file structure (routes, controller, service, repository, schema, types with TODOs):
      - `auth`
      - `artists`
      - `home`
      - `enquiries`
      - `venues`
      - `uploads`
  - Setup Next.js 16 (LTS Stable) frontend in `apps/web`:
    - Next.js 16 App Router with Tailwind CSS on port 3000.
    - Created placeholder pages returning "Coming in next prompt":
      - `/` (Home)
      - `/top-creators/[slug]` (Artist profile)
      - `/admin` (Admin dashboard)
      - `/admin/artists` (Admin artists management)
      - `/admin/home` (Admin homepage manager)
  - Created `.env.example` and environment configuration.

## In Progress

- None (Prompt 1 completed).

## Next Up

- Prompt 2: Database tables & Drizzle schema definitions, migrations, and model wiring.

## Open Questions

- None at this stage.

## Architecture Decisions

- **Tech Stack Locked**: Next.js 16 LTS + Tailwind CSS (web), Fastify + Zod + Swagger (api), Drizzle ORM + Postgres (db), pnpm workspace monorepo.
- **Feature-first Backend Architecture**: Every feature maintains strict separation of concerns across 6 layers (`routes` -> `controller` -> `service` -> `repository`, validated by `schema`, typed by `types`).
- **Swagger Documentation**: Swagger generated automatically from Zod schemas via `fastify-type-provider-zod` without manual Swagger/OpenAPI writing.

## Session Notes

- Monorepo initialized and verified with `pnpm install`, `pnpm typecheck`, `pnpm build`, and local verification of web (port 3000) and Swagger API docs (port 3001/docs).

