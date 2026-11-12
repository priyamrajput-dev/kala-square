# Progress Tracker - Kalasquare

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 2 - Prompt 2: DB Schema + Drizzle + Shared Zod Schemas - DONE

## Current Goal

- Ready for Prompt 3: Public Home Page Implementation

## Completed

- **Prompt 1: Monorepo & Infrastructure Setup (DONE)**
  - Reference HTML analyzed (`Kalasquare_Home_Page_Manager_2.html`).
  - 14 screenshots analyzed (Home Page + Add Artist Form).
  - Tech stack locked: PNPM monorepo, Next.js 16 LTS + Tailwind CSS, Fastify + Zod + Swagger, PostgreSQL + Drizzle ORM.
  - Setup `apps/web` (Next.js 16 App Router on :3000) with placeholder routes.
  - Setup `apps/api` (Fastify on :3001) with Zod Type Provider and Swagger UI on `/docs`.
  - Created 6 feature modules with 6-file structure (TODOs).
  - Created `packages/shared`, `packages/db`, `packages/config`.
  - Context files synced with single source of truth.

- **Prompt 2: DB Schema + Drizzle + Shared Zod Schemas (DONE)**
  - Created all 9 Drizzle PostgreSQL tables in `packages/db/src/schema/`:
    - `artists.ts` (33 columns, slug unique, JSONB categories/specializations/languages, budgetRange, artistClass, completeness)
    - `artist_media.ts` (8 columns, artistId FK cascade, type gallery/video/clip, url, sortOrder)
    - `artist_work.ts` (11 columns, artistId FK cascade, kind campaign/award/faq, title/question, description/answer, year, category, imageUrl)
    - `artist_social.ts` (23 columns, artistId FK unique cascade, social URLs, follower labels, full SEO fields & score)
    - `venues.ts` (13 columns, slug unique, city, state, capacity, priceLabel, imageUrl, description, status)
    - `events.ts` (13 columns, slug unique, date, city, venueName, category, badge, imageUrl, description, status)
    - `home_sections.ts` (8 columns, sectionKey unique, title, orderedIds JSONB, heroImages JSONB, isVisible)
    - `enquiries.ts` (12 columns, artistId FK nullable, name, phone, email, city, eventDate, budgetRange, message, status)
    - `users.ts` (7 columns, email unique, passwordHash, name, role admin)
  - Generated initial migration `0000_pale_stick.sql` via `drizzle-kit generate`.
  - Created shared Zod schemas with TypeScript types in `packages/shared/src/schemas/`:
    - `artist.schema.ts` (`artistCreateSchema`, `artistUpdateSchema`, `artistPublishSchema`, `artistMediaSchema`, `artistWorkSchema`, `artistSocialSchema`)
    - `home.schema.ts` (`homeSectionUpdateSchema`, `homeSectionSchema`, `heroImageItemSchema`)
    - `enquiry.schema.ts` (`enquiryCreateSchema`, `enquiryUpdateStatusSchema`, `enquirySchema`)
    - `auth.schema.ts` (`adminLoginSchema`, `authResponseSchema`)
    - `venue.schema.ts` (`venueCreateSchema`, `venueUpdateSchema`)
    - `event.schema.ts` (`eventCreateSchema`, `eventUpdateSchema`)
  - Updated all feature schema files in `apps/api/src/features/` (`artists`, `home`, `enquiries`, `auth`, `venues`) to import and re-export from `@kalasquare/shared`.
  - Both `pnpm typecheck` and `pnpm build` pass with 0 errors.

## In Progress

- None (Prompt 2 completed).

## Next Up

- Prompt 3 - Public Home Page
- Prompt 4 - Public Artist Profile Page - `/top-creators/[slug]`
- Prompt 5 - Admin Add / Edit Artist Form - Videos 6, Clips 8, Campaigns 6, Awards 8, FAQs 8, Gallery 12, Fanbase, SEO
- Prompt 6 - Admin Home Page Manager + View All Artists + Enquiries
- Prompt 7 - Backend APIs - Artists CRUD + Publish / Draft + Uploads + Home APIs
- Prompt 8 - Live Deploy + Testing + Acceptance

## Open Questions

- Real auth provider? Custom JWT or NextAuth? - Decide in Prompt 7
- Image storage? Local or S3 / Cloudinary? - Decide in Prompt 7
- WhatsApp automation? Phase 1 only placeholder

## Architecture Decisions

- PNPM only, not Bun - Stability + Vercel support
- Next.js 16 LTS Stable - Current LTS
- Zod only for validation, not TypeBox - Everyone knows Zod, Swagger from Zod
- Backend Feature-First: routes -> controller -> service -> repository
- Design: Screenshots + HTML are source of truth, 1 pixel difference not allowed
- Six File Methodology: context/ folder is source of truth

## Session Notes

- User previously shared Ghost AI files - They were only a template. Content is Kalasquare, not Ghost AI.
- Clerk / Prisma / Liveblocks / Dark Theme must NOT appear in Kalasquare.
- Prompts are in English, conversation with user is in Hinglish.
- Prompts are given one by one, not all at once.
