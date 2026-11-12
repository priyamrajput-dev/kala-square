# Progress Tracker - Kalasquare

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 3 - Prompt 3: Public Home Page (`/`) - DONE

## Current Goal

- Ready for Prompt 4: Public Artist Profile Page (`/top-creators/[slug]`)

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

- **Prompt 3: Public Home Page Implementation (DONE)**
  - Implemented 12 sections in exact order in `apps/web/src/` with mock data matching `Kalasquare_Home_Page_Manager_2.html` and screenshots 01 to 07:
    1. **Header (Sticky)**: Logo "Kala" (black) + "Square" (red), Search bar ("Search for artists, venues, events"), City dropdown ("Delhi-NCR"), Coral "Sign in" button, Hamburger icon, and sub-nav (Top Creators, Hire Artists, Events & Shows, Venues) with responsive mobile drawer.
    2. **Hero Section**: Eyebrow "DISCOVER & HIRE VERIFIED ARTISTS", H1 "Book India's Top Talent For Your Next Big Event", subtext, "Explore Artists" & "List Your Talent" CTA buttons, 3 stats ("12,000+ Verified Artists", "850+ Live Venues", "4.9★ Average Rating"), 4 gradient tiles (Coral, Orange, Blue, Violet with white outline icons), and 3 overlapping floating cards (Artist: Sahil Badal, Venue: Siri Fort Auditorium, Opportunity: Bollywood Playback).
    3. **Platinum Artists Section**: 4 cards (Jai Vijay Sachan, Vijay Vikram Singh, Dinesh Bawra, Sahil Badal) with golden Platinum badge, photo, rating, reviews count, price label, and save heart button.
    4. **New on KalaSquare Section**: 4 cards (Aarav Mehta, Tanya Bose, Ishaan Rao, Neha Arora) with coral New badge.
    5. **Find Talent By Category Section**: 12 categories in exact order (Actor, Singer, Musician, Band, Dancer, Comedian, Emcee, Speaker, Magician, DJ, Photographer, Crew / Company) with count pill and SVG outline icon.
    6. **Stage & Spotlights Section**: Large featured 2x card (The Great Indian Kala Festival 2026) on left + 2 small stacked cards on right.
    7. **Featured Events Section**: 4 event cards (The Kala Gala 2026, India's Next Voice, Kala Utsav 2026, KS Originals Live Comedy) with badges ("Trending", "New", "Filling Fast", "KS Original").
    8. **Rising Artists Section**: 4 cards (Ria Bally, Khushboo Choubey, Kunal Verma, Keshav Nagar) with black Rising badge.
    9. **Venues Section**: 3 venue cards (Comedy County, Rasā – The Stage, Stage Five Studio) with top gradient + code badge (CO, RA, ST), capacity, and price label.
    10. **FAQ Section**: Full coral `#eb4e62` background, white accordion with 4 FAQs from reference HTML, first item open by default.
    11. **Footer**: White background with 3 columns (Information, Useful Links, Follow Us On) and copyright notice.
    12. **Mobile Sticky Enquiry CTA**: Fixed bottom bar on mobile with coral "Send Enquiry" button.
  - Setup mock data in `apps/web/src/lib/mock-data.ts` and types in `apps/web/src/lib/types.ts`.
  - Configured Unsplash remote image patterns in `apps/web/next.config.ts`.
  - Verified full build (`pnpm build`) and live dev server on `http://localhost:3000`.

## In Progress

- None (Prompt 3 completed).

## Next Up

- Prompt 4 - Public Artist Profile Page - `/top-creators/[slug]`
- Prompt 5 - Admin Add / Edit Artist Form - Videos 6, Clips 8, Campaigns 6, Awards 8, FAQs 8, Gallery 12, Fanbase, SEO
- Prompt 6 - Admin Home Page Manager + View All Artists + Enquiries
- Prompt 7 - Backend APIs - Artists CRUD + Publish / Draft + Uploads + Home APIs
- Prompt 8 - Live Deploy + Testing + Acceptance

## Open Questions

- None at this stage.
