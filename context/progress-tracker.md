# Progress Tracker - Kalasquare

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 6 - Prompt 6: Admin Home Page Manager + View All Artists + Enquiries - DONE

## Current Goal

- Ready for Prompt 7: Backend APIs - Artists CRUD + Publish / Draft + Uploads + Home APIs

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
    1. Header (Sticky)
    2. Hero Section
    3. Platinum Artists Section
    4. New on KalaSquare Section
    5. Find Talent By Category Section (12 categories)
    6. Stage & Spotlights Section
    7. Featured Events Section
    8. Rising Artists Section
    9. Venues Section
    10. FAQ Section
    11. Footer
    12. Mobile Sticky Enquiry CTA
  - Setup mock data in `apps/web/src/lib/mock-data.ts` and types in `apps/web/src/lib/types.ts`.
  - Configured Unsplash remote image patterns in `apps/web/next.config.ts`.
  - Verified full build (`pnpm build`) and live dev server on `http://localhost:3000`.

- **Prompt 4: Public Artist Profile Page Implementation (DONE)**
  - Built dynamic route `/top-creators/[slug]` with `generateStaticParams` for mock slugs: `sahil-badal`, `test-artist`, `aarav-sharma`.
  - Implemented branded 404 page in `apps/web/src/app/not-found.tsx` and `notFound()` handling for unknown slugs.
  - Dynamic SEO metadata (Title, Bio description, Canonical URL, Open Graph image) and JSON-LD `Person` schema.
  - Extended `apps/web/src/lib/types.ts` with `ArtistProfile` and component interfaces.
  - Extended `apps/web/src/lib/mock-data.ts` with 3 complete, rich artist profiles:
    - `sahil-badal`: Platinum Singer (Top Songs, FAQs, Sufi/Bollywood fusion, 12 gallery photos)
    - `test-artist`: Actor with IMDb (Vijay Vikram Singh, voice of Bigg Boss, Film & screen, no Top Songs)
    - `aarav-sharma`: Rising Dancer (Contemporary fusion, no Top Songs, no IMDb, no FAQs)
  - Created 15 modular artist components in `apps/web/src/components/artist/`:
    1. `ArtistHero`: 800x800 square photo (320px desktop), rating overlay, Platinum golden / Verified blue badges, name, tagline, location, category pills (Peach bg, Coral text), action buttons ("Send Enquiry", "Talk to creator", "Share", "Save" heart toggle), social links.
    2. `ArtistTabs` (Client): Sticky navigation bar with scroll-spy, active Coral indicator, horizontal scroll on mobile, conditional tabs (hides IMDb/Spotify/FAQs if data is missing).
    3. `ArtistAbout`: Two columns (2/3 bio with "Read more" toggle, 1/3 physical stats card with ruler icon and verification badge).
    4. `ArtistQuickStats`: 4 cards row (Experience, Projects, Live Shows, Followers).
    5. `FanbaseChart`: Pure SVG Donut chart with segmented circles and centered total count, platform cards grid (Spotify, YouTube, Instagram, Facebook, Deezer, SoundCloud, TikTok).
    6. `GalleryLightbox` (Client): 4-photo grid (aspect 3/2) with "+X View More" overlay, Lightbox modal with Prev/Next buttons, close, counter, and keyboard arrow/Escape navigation.
    7. `VideoGrid`: 3 YouTube video cards with thumbnail, play button, and external link.
    8. `ClipGrid`: 4 vertical cards (9:16 aspect ratio) for short clips and reels.
    9. `TopSongs`: Singer-only section with Spotify green badge, track titles, plays, duration, and direct Spotify links.
    10. `CampaignsAwards`: Previous brand campaigns and awards/honors cards with trophy icons.
    11. `IMDbSection`: Actor-only section with IMDb yellow badge, score, known-for list, and screen credits.
    12. `FAQAccordion` (Client): Platinum-only accordion with first item open by default.
    13. `ReviewsSection` (Client): Average rating, stars, total reviews note, 3 mock reviews, "Write a Review" button with notification.
    14. `SimilarArtists`: 4 similar artist cards reusing `ArtistCard`.
    15. `EnquiryCard` (Client): Desktop sticky card with budget range, validation form, success state ("Enquiry sent!"), phone call link, trust points + Mobile sticky bottom bar.
  - Added `i.ytimg.com` to `next.config.ts` for YouTube thumbnail support.
  - Added skeleton loader `loading.tsx` in `/top-creators/[slug]`.
  - Automated tests verified 100% of functional requirements and conditional visibility rules.
  - `pnpm typecheck` and `pnpm build` passed with zero errors.

- **Prompt 5: Admin Add / Edit Artist Form (DONE)**
  - Added dependencies `react-hook-form` (`^7.71.1`) and `@hookform/resolvers` (`^5.2.2`) in `apps/web`.
  - Built Zod form validators in `apps/web/src/lib/validators/artist-form.ts`:
    - Full publish validation schema (`artistFormSchema`) enforcing requirements across all sections.
    - Relaxed draft schema (`artistDraftSchema`) requiring only `name`.
  - Built weighted completeness algorithm (0-100%) in `apps/web/src/lib/completeness.ts`:
    - Weights: Basic (20%), About (15%), Categories (10%), Social (10%), Fanbase (10%), Gallery (15%), Videos (5%), Campaigns/Awards (5%), SEO (10%).
    - Dynamic next-step actionable tip directing user to incomplete sections.
  - Built Admin Layout components in `apps/web/src/components/admin/`:
    - `AdminLayout`: Sidebar with 6 navigation items (Dashboard, Artists, Home Page Manager, Enquiries, Venues, Settings), active route indicators, mobile toggle drawer, toast for unbuilt modules.
    - `ArtistForm`: Comprehensive 10-section form with sticky left anchor nav, top bar actions, sticky bottom completeness bar, React Hook Form + Zod, auto-slug generation with custom override, character counters, modals for low completeness warning (<70%) and unpublish confirmation.
    - `FormSection`: Reusable card wrapper with scroll anchors, section icons, and descriptions.
    - `ImageUpload`: Single image picker supporting Square (1:1) and Banner (16:9) aspect preview, URL/file input, and removal.
    - `GalleryUploader`: Multi-image manager up to 12 photos, cover badge, captions, up/down reordering, remove.
    - `DynamicList`: Generic dynamic list manager for Performance Videos (max 6), Clips/Reels (max 8), Brand Campaigns (max 6), Awards (max 8), FAQs (max 8).
    - `CompletenessBar`: Visual progress bar (0-100%) with color coding and dynamic optimization tip.
    - `SEOPreview`: Live preview of canonical URL (`kalasquare.com/top-creators/{slug}`) and Google search snippet card with title, URL, and meta description.
  - Built Admin routes in `apps/web/src/app/admin/`:
    - `/admin/layout.tsx`: Root admin layout wrapping all admin subpages.
    - `/admin/page.tsx`: Admin dashboard placeholder with quick action cards.
    - `/admin/artists/page.tsx`: Artists directory placeholder with quick-edit cards for mock artists (`sahil-badal`, `test-artist`, `aarav-sharma`) and "Add New Artist" CTA.
    - `/admin/artists/new/page.tsx`: Add Artist route initializing fresh form in `create` mode.
    - `/admin/artists/[id]/edit/page.tsx`: Edit Artist route pre-filling data from `mockArtistProfiles` in `edit` mode.
  - Implemented conditional visibility:
    - FAQs section automatically hides unless Artist Class is set to 'Platinum'.
    - IMDb / Screen credits fields conditionally show when Category includes 'Actor'.
  - Implemented mock save to `localStorage['kalasquare_admin_artists']` with toast alerts and auto-redirection.
  - Verified `pnpm typecheck` (0 errors across monorepo) and Next.js static build (`pnpm build`).

- **Prompt 6: Admin Home Page Manager + View All Artists + Enquiries (DONE)**
  - **Part A: View All Artists (`/admin/artists`)**:
    - Replaced placeholder with full `ArtistsTable.tsx` component.
    - Top bar with total artist count and "+ Add Artist" primary button.
    - Live search across artist name, city, category, and slug.
    - Filter dropdowns: Category (13 categories), Artist Class (All, Platinum, Gold, Rising, New), Status (All, Published, Draft), Sort (Newest First, Name A-Z, Price Low to High, Price High to Low).
    - Table view (desktop) & cards view (mobile) with photo, name, slug, category pills, city, class badge, status badge, completeness bar, updated date, and action icons.
    - Row actions: View live profile (Eye), Edit (Pencil), Duplicate (Copy with `{slug}-copy` and toast), Publish/Unpublish toggle, Delete with `ConfirmModal`.
    - Bulk actions: Row selection checkboxes, Select All on page, floating action bar ("Publish Selected", "Unpublish Selected", "Delete Selected" with confirm modal).
    - Client-side pagination (10 per page) with prev/next navigation and range indicator.
    - Merged data from `mockArtistProfiles` and `localStorage['kalasquare_admin_artists']`.
  - **Part B: Home Page Manager (`/admin/home-page`)**:
    - Replicated layout from `Kalasquare_Home_Page_Manager_2.html`.
    - Top bar: Title, Subtitle, "Preview Home Page" (opens `/` in new tab), "Save Changes" (Coral), "Publish" (Black with confirmation modal).
    - Left sticky section list with 11 sections in exact order (Hero, Platinum Artists, New on KalaSquare, Find Talent By Category, Stage & Spotlights, Featured Events, Rising Artists, Venues, FAQ, Footer Links, Enquiry Sticky CTA).
    - Reorder Up/Down buttons and Show/Hide visibility toggles per section.
    - Right editor panel (`HomeSectionEditor.tsx`) with dedicated field editors for all 11 sections.
    - Platinum Artists selector enforcing 4 artists with warning indicator if less than 4 selected.
    - Live Mini Preview snapshot box updating dynamically as section fields change.
    - Sticky bottom bar with last saved timestamp, "Save Draft" button, and "Publish" button.
    - Zod validation schema (`homeConfigSchema`) in `apps/web/src/lib/validators/home-config.ts`.
    - Mock save to `localStorage['kalasquare_home_config']` with toast alerts.
  - **Part C: Enquiries Management (`/admin/enquiries`)**:
    - Built `EnquiriesTable.tsx` and slide-out `EnquiryDrawer.tsx` (400px width on desktop, full width on mobile).
    - Top bar with total enquiry count and filter tabs: All, New, Contacted, Booked, Closed.
    - Live search by client name, artist name, phone, or event city.
    - Table columns: Date, Customer, Requested Artist (link to profile), Event Date, Event Type, Message (truncated), Status badge, Actions.
    - Slide-out drawer with complete event specifications, artist card, quick action buttons ("Call Client" `tel:`, "WhatsApp" `wa.me`), internal admin notes (textarea + Save Note to localStorage), and status changers (Mark Contacted, Mark Booked, Close).
    - Added 8 realistic mock enquiries (`mockEnquiries`) covering all 4 status states in `apps/web/src/lib/mock-data.ts`.
  - **Part D: Public Home Page Integration**:
    - Updated `HomeSections.tsx` to read `kalasquare_home_config` from localStorage client-side in a hydration-safe manner.
    - Dynamically respects section visibility (`isVisible: false` hides section), custom headlines, custom artist rows, and custom FAQ lists.
    - Updated `AdminLayout.tsx` so Artists, Home Page Manager, and Enquiries sidebar links are active.
  - Verified `pnpm typecheck` (0 errors across monorepo) and Next.js static build (`pnpm build`).

## In Progress

- None (Prompt 6 completed).

## Next Up

- Prompt 7 - Backend APIs - Artists CRUD + Publish / Draft + Uploads + Home APIs
- Prompt 8 - Live Deploy + Testing + Acceptance

## Open Questions

- None at this stage.
