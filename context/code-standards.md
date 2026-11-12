# Code Standards - Kalasquare

## General

- Keep modules small and single-purpose.
- Fix root causes. Do NOT layer workarounds.
- Do NOT mix unrelated concerns in one component or route.
- Respect system boundaries in `architecture-context.md`.

## TypeScript

- Strict mode is required throughout the project.
- Avoid `any`. Use explicit interfaces or narrowly scoped types.
- Validate unknown external input at system boundaries with Zod before trusting it.
- Use `interface` for object contracts, `type` for unions.

## Next.js 16

- Default to React Server Components.
- Add `"use client"` only when the component needs browser interactivity, hooks, or real-time state.
- Keep route handlers focused on a single responsibility.
- Long-running work belongs in background tasks, not in request handlers.

## Backend - Feature-First + Layered

- `*.routes.ts`: Only define routes + attach Zod schema. No logic.
- `*.controller.ts`: Only handle req/res, call service, return response shape.
- `*.service.ts`: Business logic only. Status logic (draft / pending / live), slug generation, completeness calculation.
- `*.repository.ts`: Only Drizzle queries. No business logic.
- `*.schema.ts`: Zod schema + DTO. Export type with `z.infer`.
- `*.types.ts`: Extra types if needed.

## Styling

- Use Tailwind tokens. Do NOT use hardcoded hex or raw Tailwind color classes like `zinc-*`.
- Colors: Background `#f3f3f5`, Card white, Coral `#eb4e62`. Define tokens in tailwind config.
- Radius: Small 10px, Card 16-20px.

## API Routes

- Validate and parse request input with Zod before any logic runs.
- Enforce auth and ownership checks before any mutation.
- Return consistent response shapes.
- Keep route handlers thin. Push complexity into service.

## Data and Storage

- Artists, Venues, Events, Enquiries belong in PostgreSQL via Drizzle.
- Images belong in file storage. Database stores only URL.
- Do NOT store large content directly in database.
- Home sections store ordered IDs in JSONB.

## File Organization

- `apps/api/src/features/<feature>/` - 6 files for that feature.
- `apps/api/src/common/` - Shared errors, middlewares, utils.
- `apps/api/src/lib/` - db, logger, storage, auth.
- `packages/shared/` - Shared Zod schemas.
- `packages/db/` - Drizzle schema.
- Name files after the responsibility they contain, not the technology.
