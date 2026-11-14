# Progress Tracker - Kalasquare

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- **Mobile Responsiveness Restoration (Source of Truth Parity - DONE)**:
  - **Audit Across All 9 Breakpoints**: Executed automated CDP Chrome audit across 320px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, and 1920px viewports on Home (`/`), Artist Profile (`/top-creators/priyam`), and Directory (`/top-creators`). All 27 viewports passed with 0 horizontal overflow (`scrollWidth <= window.innerWidth`).
  - **DemoBar Fix**: Added `hidden sm:inline` to bold title text, allowed wrapping with compact padding on `<= 520px` screens, eliminating the fixed-width 385px container barrier.
  - **Hero Collage Fix**: Overlapping Card 2 (`.pc` - Jai Vijay Sachan) and Card 3 (`.dk` - opportunity) hidden on mobile `<= 760px` via `hidden md:flex` and `hidden md:block`, precisely mirroring `Kalasquare_Home_Page_Manager_2.html` line 1888 (`@media(max-width:760px){.dk,.pc{display:none}}`).
  - **Mobile Navigation Restoration**:
    - Replaced basic dropdown with full slide-over menu drawer (`#mDr` / `.udr`) matching original HTML lines 2859-2879 with backdrop, header, close button, custom icon rows (Timeline, Membership, KS Spotlight, Top Creators, Hire Artists, Venues, About us), and Sign in action.
    - Implemented fixed bottom navigation bar (`<nav class="bnav">`) on `<= 760px` with body padding coordination (`.sd { padding-bottom: 56px; }`).
    - Configured automatic suppression of `.bnav` on artist profile pages (`body:has(.pp-mb) .bnav`, `.pp ~ footer .bnav`), allowing the sticky enquiry bar (`.pp-mb`) to sit cleanly at the bottom without overlap.
  - **Artist Profile Scroll & Sharing Improvements**:
    - **Enquiry Scroll Offset**: Updated "Send enquiry" scroll handler to dynamically calculate header, demo bar, and sticky tabs heights (`headerOffset`), ensuring the "Book [Artist]" header and form appear centered in view rather than jumping down to the first input.
    - **Direct Share & Open in New Tab**: Resolved issue where shared profiles failed to open in new tabs by enabling direct access for pending and live profiles in both backend API and frontend views, and providing clean clipboard copy with toast confirmation.
  - **Monorepo Build & Deployment**:
    - Successfully passed full monorepo typecheck and Next.js 16 production build.
    - Committed changes to branch `main` and pushed to GitHub (`priyamrajput-dev/kala-square`).
    - Deployment auto-triggered on Vercel at `https://kala-square.vercel.app`.

- **Production Deployment to Vercel & Railway (DONE)**:
  - **GitHub Repository**: Pushed full monorepo to `https://github.com/priyamrajput-dev/kala-square` on branch `main`.
  - **Vercel Frontend Deployment**:
    - Created and linked project `kala-square` under user account (`priyamrajput00` / `priyamrajput99@gmail.com`).
    - Successfully compiled Next.js 16 App Router build (`apps/web`) with production target.
    - Production URLs:
      - **Primary Live Production URL**: `https://kala-square.vercel.app`
      - Project Alias: `https://kala-square-priyamrajput00s-projects.vercel.app`
      - Git Main Alias: `https://kala-square-git-main-priyamrajput00s-projects.vercel.app`
    - Configured production environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`).
    - Verified HTTP/2 200 responses on both home page (`/`) and artist profile routes (`/top-creators/priyam`).
  - **Railway Backend Service**:
    - Project created: `kalasquare-api` (`5cdbc14d-288b-4091-a908-e0c89ecb4b75`) in workspace `Priyam Rajput's Projects`.
    - Service created: `api` (`9c680283-8f53-4fdc-8314-a34859bde4c4`).
    - Public Domain assigned: `https://api-production-310c622d.up.railway.app`.
    - Injected production environment variables (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `CORS_ORIGIN=*`, `PORT=3001`, `NODE_ENV=production`).

- **Share Profile & New Tab Link Resolution (DONE)**:
  - **Issue Diagnosed**:
    - Previously, `ArtistHero.tsx` invoked `navigator.share({ title, text, url })`, which triggered the native OS share sheet (e.g., macOS AirDrop/Mail/Messages/Copy).
    - When users selected "Copy", the browser/OS concatenated the artist name and tagline with the URL (`priyam | KalaSquare\nckdvkmvkvknvkv\nhttp://localhost:3000/top-creators/priyam`), resulting in invalid URLs when pasted into new tabs.
    - Additionally, `fetchPublicArtistBySlug` used `next: { revalidate: 60 }`, caching 404 responses for 60 seconds on Next.js server, and `getToken()` in unauthenticated demo mode did not fall back to `DEMO_TOKEN`.
  - **Implemented Solution**:
    - Grounded behavior strictly in `Kalasquare_Home_Page_Manager_2.html` line 2134:
      - Removed `navigator.share` invocation.
      - Implemented direct clipboard copy of the clean URL (`http://localhost:3000/top-creators/[slug]`) via `navigator.clipboard.writeText` with `document.execCommand('copy')` textarea fallback.
      - Added floating toast popup (`.toast.show` with text `"Profile link copied."`) styled with `position: fixed`, `left: 50%`, `bottom: 20px`, `z-index: 9999` matching `Kalasquare_Home_Page_Manager_2.html` line 382.
      - Added toast feedback for favorites/save toggle (`"Saved to your list."` / `"Removed from your list."`) matching HTML reference line 2135.
    - Updated `apps/web/src/lib/api.ts` to use `cache: 'no-store'` and 8000ms timeout for `fetchPublicArtistBySlug` with normalized/decoded slug matching.
    - Updated `apps/web/src/lib/auth.ts` to fall back to `DEMO_TOKEN` and `DEMO_USER` when unset, ensuring admin saves always persist to Neon PostgreSQL.
    - Updated `apps/web/src/components/artist/ArtistProfileView.tsx` to preserve `initialArtist` from server without falsely overwriting with `null` from stale local storage.
    - Updated `apps/api/src/features/artists/artists.repository.ts` `findBySlug` to match slug case-insensitively via `or(eq(slug), eq(decodedSlug), ilike(decodedSlug))`.
  - **Browser Verification**:
    - Verified via Chrome CDP automation: clicking the Share button copies the exact URL to the clipboard, pops up `"Profile link copied."`, and opening that URL in a brand-new browser tab loads the live artist profile without 404s.
    - Captured verified screenshots: `share_profile_link_copied.png` and `new_page_profile_opened.png`.

- **Home Page Hero CTA Adjustment (DONE)**:
  - Preserved the visual "Join as artist" button on the Home Page Hero (`Hero.tsx`) matching reference layout.
  - Converted it to a static `<button type="button">` with no action/navigation on click, as artist self-signup is out of scope in Phase 1 per client requirements.
- Phase 8 - Prompt 8: Production Deployment, Hardening & Acceptance Testing - DONE (PROJECT COMPLETE)
- **Real-World PostgreSQL Database & Browser E2E Automation Verification (DONE)**:
  - **Database Verification (Neon PostgreSQL)**:
    - Connected live to user-provided Neon PostgreSQL instance via SSL connection pooler.
    - Successfully ran schema migrations (`0000_pale_stick.sql` and `0001_slippery_rocket_raccoon.sql`) via Drizzle Kit.
    - Verified database connectivity with Fastify API (`/api/health` returned `200 {"status":"ok","db":"connected"}`).
    - Seeded baseline data (`admin@kalasquare.com`, 3 artists, venues, events, enquiries, home configs).
    - Executed live database integration tests (`apps/api/src/test_flow.ts` and `scripts/test_artist_profile_module.js`): verified artist draft creation, 404 public protection, publication to live, and direct Drizzle ORM selection of `artists`, `artist_media`, `artist_work`, and `artist_social` tables.
  - **Browser E2E Testing (Chrome CDP via Port 9222)**:
    - Executed complete end-to-end user lifecycle: `Admin Login → Create Artist (Aarav Sharma) → Save as Draft → Public Profile 404 (Hidden) → Admin Edit Mode (Field Hydration) → Documents Verified Toggle → Publish Live → Open Public Profile (Desktop 1440x900 & Mobile 390x844) → Edit Artist (Tagline & Projects) → Save Changes → Refresh Public Profile → Verify Live Data Updates`.
    - Verified all 35+ fields preserved on edit navigation without form state wipe.
    - Verified follower count parsing with zero phantom 50k.
  - **Visual Parity & Screenshot Evidence**:
    - Captured 10 real browser screenshots in `artifacts/qa/screenshots/`:
      - `00-reference-manager-desktop.png`: Original client HTML reference on Desktop (1440x900)
      - `00-reference-manager-mobile.png`: Original client HTML reference on Mobile (390x844)
      - `01-admin-artist-create-form.png`: Admin artist creation form with filled details
      - `02-admin-artist-saved-draft.png`: Admin artists table showing newly created artist in Draft mode
      - `03-draft-404-error-state.png`: Public profile route (`/top-creators/aarav-sharma`) returning 404 "Artist Not Found"
      - `04-admin-artist-publishing.png`: Admin edit mode with preserved form values and verified toggle ON
      - `05-public-profile-live-desktop.png`: Published public profile live on Desktop with full layout
      - `06-public-profile-live-mobile.png`: Published public profile on Mobile with responsive single-column layout and sticky enquiry bottom bar
      - `07-admin-artist-updated-form.png`: Admin edit form updated with modified tagline, project count (120), and price
      - `08-public-profile-updated-desktop.png`: Published public profile refreshed, displaying updated tagline and metrics
  - **Reporting & Documentation**:
    - Updated `artifacts/qa/qa-report.md` with complete execution logs, database query evidence, and screenshot registry.
    - Updated `artifacts/qa/acceptance-matrix.md` with 27/27 PASS statuses backed by actual execution evidence.
- **Artist Profile Module — Requirement Audit, Implementation & QA (DONE)**:
  - Executed Phase 1 to Phase 9 structured QA workflow following `.agents/skills/app-qa-and-repair/SKILL.md`:
    - Generated complete Acceptance Matrix (`artifacts/qa/acceptance-matrix.md`) mapping all 27 client requirements to reference HTML, Next.js frontend, Fastify backend, and PostgreSQL schema.
    - Verified status resolution: Save as Draft assigns `status: 'draft'`, Publish with unverified documents assigns `status: 'pending'` (both returning 404 on `/top-creators/[slug]`), and Publish with verified documents assigns `status: 'live'` (returning 200).
    - Fixed Fastify service relational persistence (`apps/api/src/features/artists/artists.service.ts`): mapped `songs` (`kind: 'song'`) and `film` (`kind: 'film'`) into `artist_work` for create, update, public fetch, and edit hydration.
    - Enforced draft/pending profile 404 rejection in `ArtistProfileView.tsx`.
    - Created and executed automated test suite `scripts/test_artist_profile_module.js` passing 17/17 checks (100% green).
    - Compiled Next.js 16 production build (`pnpm --filter @kalasquare/web build`) and verified full monorepo typecheck (`pnpm -r typecheck`) with 0 errors.
    - Produced final comprehensive QA report (`artifacts/qa/qa-report.md`).
- **Send Enquiry CTA & Booking Card Interaction Alignment (DONE)**:
  - Grounded behavior strictly in `Kalasquare_Home_Page_Manager_2.html` lines 2026, 2056–2060, and 2099:
    - Hero CTA `<a className="btn fill" href="#ppBook">Send enquiry</a>` and mobile sticky bar `<div className="pp-mb">` act as direct anchor triggers (`data-pp="book"`) that scroll down to the sticky booking card (`#ppBook`, titled `Book <ArtistName>`).
    - Fixed scroll target from invalid `#pp-enquiry` to `#ppBook` with a 120px offset scroll handler (`window.scrollTo({ top: y, behavior: 'smooth' })`) and 400ms delayed input focus (`input.focus({ preventScroll: true })`).
    - Verified that HTML5 required field validation on `<form onSubmit={handleSubmit}>` cleanly focuses the first input ("Your name") when submitting without required values.
- **Comprehensive Artist Lifecycle, Edit Persistence & Reference UI Parity Verification (DONE)**:
  - **Full Field Artist Creation & Public Profile Rendering**:
    - Verified adding an artist with all 27+ possible fields (Name, Slug, Categories, Location, Tagline, Bio, Quick Stats, Physical Stats, Social Links, Fanbase split, Gallery, Videos, Clips, Songs, Campaigns, Awards, IMDb, FAQs, SEO).
    - Fixed section ordering to strictly match `Kalasquare_Home_Page_Manager_2.html` lines 2008–2067 and user reference screenshots:
      1. `ArtistHero`: Ambient blurred backdrop, 4:5 ratio avatar with -2deg tilt and 6px border, rating pill with gold star, platinum gold badge (`.pp-bd.g`), Bricolage Grotesque name, multi-line tagline, location with coral pin, specialization chips, action buttons, and social links.
      2. `ArtistQuickStats`: Floating `.wrap.pp-stw` card with `margin-top: -52px` positioned directly below the hero header and above the tabs.
      3. `ArtistTabs`: Exactly 9 tabs (`About`, `Fanbase`, `Gallery`, `Videos`, `Reels`, `Spotify`, `Work`, `IMDb`, `Reviews`) with sliding red active indicator (`.pp-ind`).
      4. `pp-g` Grid: Two columns with `<main className="pp-main">` and `<aside className="pp-side">` sticky booking card (`.pp-book`).
      5. `ArtistAbout`: Bio story with "Read more" toggle and `.pp-ph2` physical stats card.
      6. `FanbaseChart`: SVG segmented donut chart with bold total and platform tiles (`.pp-fc`).
      7. `GalleryLightbox`: 4-item photo grid with modal preview.
      8. `VideoGrid`: Latest videos with play overlays.
      9. `ClipGrid`: Vertical reels rail with dynamic gradient hues.
      10. `TopSongs`: Spotify tracks with play counts.
      11. `CampaignsAwards`: Previous brand campaigns and awards.
      12. `IMDbSection`: IMDb film & screen credits with "Known for" badge.
      13. `ReviewsSection`: Reviews summary (`0.0` or avg, stars, count), review items, and "Write a review" modal. Precedes FAQs matching `manager.html`.
      14. `FAQAccordion`: Frequently asked questions accordions with `+` / `–` toggles.
      15. `pp-seo`: SEO manager metadata display.
      16. `SimilarArtists`: Rail of avatar tiles with initial letters/photos.
      17. `pp-mb`: Mobile sticky enquiry bar.
  - **Edit Flow Hydration & State Persistence (`ArtistEditClient.tsx` & `ArtistForm.tsx`)**:
    - Fixed state loss when clicking "Edit" from "View all artists" (`/admin/artists`):
      - Enhanced `ArtistEditClient` to match by ID, slug, and default catalog ID case-insensitively.
      - Fully mapped all 35+ fields across basic info, quick stats, physical stats, fanbase metrics, media arrays (gallery, videos, clips, campaigns, awards, faqs), and SEO metadata into form state.
      - Synchronized `ArtistForm` to render `Edit artist`, `Edit profile`, and `Save changes` button when in edit mode.
      - Fixed `baseList.map` in `ArtistsTable.tsx` to preserve `item.id` and update `fol: parseFollowerCount(item.totalFollowersLabel, item)`.
    - Eliminated phantom 50k follower issue: new artists without entered followers strictly evaluate and display as `0`.
  - **Home Page Integration & Key Uniqueness (`HomeSections.tsx`)**:
    - Newly added published artists immediately appear on the respective rails (Platinum, Rising, New Artists) on the Home page.
    - Verified deduplication logic (`dedupeArtists`) ensures 100% unique React keys across all rails, preventing duplicate key console warnings.
  - **Automated Verification Test Suite**:
    - Executed test suite (`scratch/test_artist_flow.js`) verifying completeness calculation, follower parsing, edit hydration, local persistence, home rail deduplication, and layout sequence parity against `Kalasquare_Home_Page_Manager_2.html` (100% pass rate).
    - Monorepo typecheck (`pnpm -r typecheck`) passed with 0 errors across all 5 workspace projects.
    - Production build (`pnpm --filter @kalasquare/web build`) completed with 0 errors.
- **Public Artist Profile (`/top-creators/[slug]`) Pixel-to-Pixel Alignment (DONE)**:
  - **Zero Synthetic Dummy Data Fallback**:
    - Completely removed synthetic generators and fallback blocks that populated fake stats, 316k fanbase, Rick Astley videos, and fake 5.0 (1 reviews).
    - Newly created artists now render in a clean, authentic state strictly following `profileHTML(a)` from `Kalasquare_Home_Page_Manager_2.html`: if no stats, fanbase, gallery, videos, clips, songs, campaigns, awards, or IMDb entries are provided, those sections do not render.
    - Zero reviews correctly displays `0.0`, 5 empty outlined stars `#d0d0d8`, `0 reviews`, and the `.pp-em` "No reviews yet" box. Hero badge displays a gold star + `<b>New</b>` without review counts.
    - Floating sticky enquiry card (`.pp-book`) only renders the budget pill if a budget is set; otherwise it renders only the form and trust badges.
  - **Client-Side Profile Hydration (`ArtistProfileView.tsx`)**:
    - Created `ArtistProfileView` to seamlessly resolve newly added and edited artists from `localStorage` (`kalasquare_admin_artists`) when testing in the browser, preventing 404s or stale SSR cache.
    - Purged stale `.next` cache containing pre-rendered fake artifacts.
  - **Admin Edit Artist Bug Fix (`/admin/artists/[id]/edit`)**:
    - Replaced buggy server-side mapping in `EditArtistPage` that crashed on undefined properties (`quickStats`, `social`, `fanbase`, `bio`) with `<ArtistEditClient id={id} />`.
    - Loading an existing artist now preserves all form fields, tags, and category chips, displaying "Edit artist" and "Save changes".
  - **Complete CSS Extraction (`artist_profile.css`)**:
    - Audited every selector in `SITE_CSS` from `Kalasquare_Home_Page_Manager_2.html` and incorporated all missing rules (`.pp-mb`, `.pp-kn`, `.pp-ibtn`, `.pp-sc`, `.pp-sg`, `.pp-sim`, `.pp-spg`, `.pp-tl`, `.pp-wr`).
    - Verified full monorepo typecheck (`pnpm -r typecheck`) and Next.js production build (`pnpm --filter @kalasquare/web build`) succeed with zero errors.
  - **Hero Section (`ArtistHero.tsx`)**:
    - Extracted exact `.pp-hero` background styles: radial wash (`radial-gradient(900px 480px at 80% 10%, #FFE3E8, transparent 70%), linear-gradient(180deg, #FDE6EA, #FFFFFF)`), blurred photo background `.pp-bg`, and two floating ambient ring shapes (`.pp-shape.sa` 420px, `.pp-shape.sb` 240px).
    - Added `.pp-bar` with coral `< Back to home` arrow link and white rounded `Edit in Admin` button.
    - Square 1:1 avatar `.pp-ph` (253px) with -2deg tilt, `linear-gradient(160deg, #f58a9a, #eb4e62 60%, #c23048)`, 5px inner border, shadow, and letter initials fallback (90px).
    - Floating rating badge `.pp-rate` (left: -14px, bottom: 18px) with gold star `#f5a300`, bold rating number, and review count.
    - Platinum artist gold badge (`.pp-bd.g` `#FFF1C9`) and Verified blue tick badge (`.pp-bd.b` `#E3EEFF`).
    - Artist name in Bricolage Grotesque (`clamp(30px, 4vw, 50px)`), multi-line taglines (`.pp-ln`), coral pin location, white specialization chips (`.pp-sp`), coral primary CTA button, "Talk to creator" line button, and circle icon buttons (`.pp-ib` for Share and Save/Heart).
    - Connect on social links row (`.pp-so`).
  - **Floating Quick Stats Strip (`ArtistQuickStats.tsx`)**:
    - Replaced disconnected cards with unified `.wrap.pp-stw` floating white card (`margin-top: -38px; border-radius: 24px; box-shadow: 0 30px 50px -34px rgba(60,10,30,.35)`).
    - 4 metrics (Years of experience, Projects, Live shows, Total followers) with bold coral numbers (`font: 800 clamp(22px, 2.6vw, 30px) var(--hf); color: #eb4e62;`).
  - **Sticky Tabs Navigation (`ArtistTabs.tsx`)**:
    - Added sticky blurred tab bar (`.pp-tabs`) with smooth active red indicator line (`.pp-ind` height 3px `#eb4e62`) tracking active section via scrollspy.
  - **About Section (`ArtistAbout.tsx`)**:
    - Matches `.pp-bio` with collapsible "Read more" button and `.pp-ph2` physical stats box (light beige `#F6F6F7`, ruler icon, white metric tiles, verified disclaimer).
  - **Fanbase Distribution (`FanbaseChart.tsx`)**:
    - Unified `.pp-fb` container with 200x200px SVG donut chart, bold center total, and platform cards `.pp-fc` with official brand icons, uppercase platform labels, bold counts, and follower categories.
  - **Photo Gallery & Lightbox (`GalleryLightbox.tsx`)**:
    - Implemented `.pp-gal.m4` asymmetric hero grid with hover zoom, "View More" overlay for +4 photos, and full-screen lightbox modal with keyboard navigation and slide counter.
  - **Latest Videos (`VideoGrid.tsx`)**:
    - Replaced heavy box cards with clean `.pp-vg` layout: 16/9 gradient thumbnails, center play circles, bold titles, and direct embedded video player modal.
  - **Reels & Short Clips (`ClipGrid.tsx`)**:
    - Horizontal smooth-scrolling rail `.pp-rl` with 170px vertical cards (`aspect-ratio: 9/16`), center play buttons, and subtle bottom text shadow.
  - **IMDb & Screen Section (`IMDbSection.tsx`)**:
    - Yellow IMDb logo badge, `.pp-ig` grid with golden poster tops (`.pst`), film icons, year tags, bold titles, and "Known for" peach pill badges (`.kf`).
  - **Reviews Section (`ReviewsSection.tsx`)**:
    - Two-column `.pp-rs` layout: left rating box `.pp-sum` with 46px rating, 5 gold stars `#f5a300`, and count; right review cards `.pp-rv` with initial avatars; bottom "Rate this artist" gradient banner `.pp-rc`; interactive "Write a review" modal `.pp-mo`.
  - **FAQ Section (`FAQAccordion.tsx`)**:
    - Semantic `<details>` / `<summary>` accordions with red `+` / `–` toggles and expanded box shadows.
  - **Similar Artists Section (`SimilarArtists.tsx`)**:
    - Bottom beige container `.pp-sm` with horizontal rail `.pp-sr` of 140px square avatar cards with 24px border-radius, white border, and bold names.
  - **Sticky Enquiry Sidebar (`EnquiryCard.tsx`)**:
    - Floating card `.pp-book` with peach budget badge (`.pp-bg2`), form inputs, coral submit button, "Talk to creator" link, and trust guarantees.
  - **Global Profile CSS (`artist_profile.css`)**:
    - Extracted authentic `.pp-*` styles from `Kalasquare_Home_Page_Manager_2.html` and integrated cleanly into `globals.css`.
- **Edge-Case Bug Fixes: Follower Defaulting & Edit Mode State Hydration (DONE)**:
  - **Issue 1 Fixed (Edit Profile State Loss & Missing Update Option)**:
    - Wired `/admin/artists/new?edit=[id]` in `NewArtistPage` to inspect search params and load `ArtistEditClient`.
    - Enhanced `ArtistEditClient` to resolve artist profiles from `kalasquare_admin_artists`, API, or `mockArtistProfiles` with complete field mapping.
    - Added form state hydration `useEffect` inside `ArtistForm.tsx` to automatically call `reset(initialData)` and populate all category chips, switches, gallery arrays, videos, clips, campaigns, awards, and FAQs.
    - When editing an existing artist, the page title changes to `Edit artist`, chip says `Edit profile`, and the primary action button correctly displays `Save changes` (updating the artist in storage and database).
  - **Issue 2 Fixed (Phantom 50k Followers on New Artists)**:
    - Root cause: fallback `String(item.totalFollowersLabel || '50')` defaulted to `'50'` * 1000 = `50k` when no followers were entered.
    - Created `apps/web/src/lib/followers.ts` with `parseFollowerCount` and `formatFollowers`.
    - If no follower label or fanbase data is entered, followers strictly evaluate to `0` and display as `0` across both `ArtistsTable` (`/admin/artists`) and `ArtistClassPage` (`/admin/artists/class`).
- **Multi-Case Artist Creation, Cross-Page Synchronization & Verification (DONE)**:
  - **Comprehensive Edge-Case Testing & Validation Hardening**:
    - Handled minimal required input (Name, Category, City): made `photoUrl` optional with fallback avatar rendering across card components.
    - Handled draft creation: empty rows and unassigned slugs are defaulted safely (`Untitled Artist`, `draft-{timestamp}`) without triggering strict validation errors.
    - Handled full Platinum profiles: rich media, campaigns, awards, FAQs, fanbase stats, and live SEO checklist scoring (100% completeness) submit and persist smoothly.
    - Handled partial entries: auto-filtered blank repeater items (`videos`, `clips`, `campaigns`, `awards`, `faqs`) so empty rows never trigger validation rejection.
    - Sanitized gallery schemas across API and web (`z.union([z.string(), z.object({...})])`), ensuring string URLs from file pickers pass backend validation.
    - Fixed React duplicate key warning in `HomeSections.tsx` (`Encountered two children with the same key, a8`): removed duplicate mock artist entries in `mock-data.ts`, aligned IDs strictly with `Kalasquare_Home_Page_Manager_2.html` (`a7` Rohan Kapoor, `a8` Ria Bally, `a9` Khushboo Choubey, `a10` Aarav Mehta, `a11` Tanya Bose), and added defensive `dedupeArtists` utility to guarantee uniqueness across all home rails.
  - **Cross-Page Real-time Synchronization**:
    - **View All Artists (`/admin/artists`)**: Newly created/edited artists automatically prepend to the table, update class pill counters dynamically (`All`, `Platinum`, `Emerging`, `Rising`, `Standard`), respect all filters (search, city, category, verified only), and open pre-filled in edit mode.
    - **Artist Class (`/admin/artists/class`)**: Newly added artists immediately populate the class roster, reflect in the 4 top summary cards (Platinum, Emerging, Rising, Standard), support live class reassignment with badge allocation, and synchronize `About us · Exclusive` toggles (up to 6 artists max).
    - **Home Page (`/`)**: Added real-time client-side hydration for published artists: newly added Platinum artists appear on the "Platinum artists" rail, Rising artists appear on the "Rising artists" rail, and new additions appear in the new artists row.
    - **Edit Artist Route (`/admin/artists/[id]/edit`)**: Added `ArtistEditClient` component to seamlessly resolve and populate newly created local artists that do not exist in the initial static mock dataset.
- **Frontend Refinements & Admin Panel Alignment (DONE)**:
  - **Top Kalasquare Live Demo Bar Alignment**:
    - Replicated exact visual styling from user screenshot `media_1794564344403_feab0c3d.png` and `manager.html`:
      - Black `#14131b` top bar with height 52px (`--bar`).
      - Bold `Kalasquare Live Demo` title.
      - Rounded full pill navigation for `Login`, `Home`, and `Admin` (`border-radius: 999px; height: 34px; padding: 0 18px`).
      - Active pill turns pure white with black `#14131b` text and bold font (`aria-current="page"`).
      - Inactive pills feature thin border (`rgba(255,255,255,.35)`) with white text and hover state.
      - Right side helper text: "Edit in Admin, then check the Home page. Send an enquiry on Home, then check Admin → Enquiries."
      - "Reset demo" button with subtle white border.
  - **Admin Authentication Gate (`/admin/login`)**:
    - Standalone full-screen layout matching `manager.html` lines 575–625 and user reference `media_1794561747025_021b1672.jpg`:
      - Precise light grey square grid pattern with ambient coral radial glow behind the sign-in card.
      - Top-left KalaSquare brand logo (`/logo.png`).
      - 8 floating category tiles on the left grid arranged in 2 staggered rows (Singing, Actor, Models, Influencer in Row 1; Dancer, Standup, Fitness, Anchor in Row 2) with pure white background, rounded corners, soft drop shadow, and coral SVG icons.
      - Right-aligned sign-in card with `Admin panel` pill chip, `Welcome back` heading, light grey form inputs (`#edf0f2`), Show/Hide password toggle, custom coral checkbox with checkmark for `Keep me signed in`, `Forgot password?` underline link, coral `Sign in to dashboard` button, demo credentials (`admin@kalasquare.com` · `Kalasquare@2026`) with `Fill it` shortcut, and `Authorised staff only` notice.
      - Centered bottom footer: "A venture by Delhi Infomedia Private Limited" with copyright.
      - Completely excluded from the admin sidebar/header layout.
  - **Admin Layout & Sidebar Alignment (`AdminLayout.tsx`)**:
    - Extracted official KalaSquare logo (`apps/web/public/logo.png`) rendered at exact 157x34px dimensions with `.brand` and `.logo` classes.
    - Fixed sidebar width to `248px` within the 2-column `.app` grid (`grid-template-columns: 248px minmax(0, 1fr); gap: 32px; max-width: 1320px`).
    - Sidebar sits transparently on `--bg: #f3f3f5` with sticky positioning and hidden scrollbar.
    - Active link state features white card with shadow, red square bullet (`.nm::before`), and active count pill in peach `#fde6ea` with coral-dark text `#d63a50`.
    - Accordions for Home page and Artists open by default with animated rotating chevrons.
    - User profile footer `.who`: avatar circle with letter "A", bold Admin label, and coral-underlined Sign out button.
    - Top header `.top`: `Kalasquare admin` with `Sample data` pill and `View live site` button.
  - **View All Artists Page (`/admin/artists`)**:
    - Exact card, filters, tabs, table, and pagination matching user screenshot `media_1794562500635_0c9c86e2.jpg` and `manager.html`:
      - Title `View all artists` and subtitle.
      - Card `Artists` with `Same filters as the Top Creators page on the website.` and red `+ Add artist` button on top right.
      - Filter row: Search input, City select, Category select, Sort by select, and Verified only checkbox.
      - Class tabs: All 26, Platinum 8, Emerging 6, Rising 5, Standard 7.
      - Table: Letter avatar circles, artist name, `/top-creators/{slug}`, category, city, class pill, badge pill, followers, status, Edit button with pencil icon, and external link icon.
      - Pagination (`.pager`): `Showing 1–10 of 26` with red active page button `1` and buttons `2`, `3`.
  - **Add Artist / Edit Artist Page (`/admin/artists/new` & `ArtistForm.tsx`)**:
    - Re-architected entire form to match `manager.html` lines 1244–1345 and user screenshot `media_1794564013453_c5a1a7eb.jpg`:
      - Header with `New profile` chip badge.
      - Card 1 (Basic details): `.two-c` with 200x200px `.pbox` profile photo box on left with 800x800px note, `.grid-f` on right with Full name, Profile link (`kalasquare.com/top-creators/`), Category chips (unselected grey `#f6f6f7`, selected peach `#fde6ea` with coral text `#d63a50`), City select, State, Phone, Email, Summary line, and Specializations tagbox.
      - Card 2 (Class and visibility): Artist class, Budget range, Documents verified switch, Featured on home page switch, About us exclusive switch (`.swrow` and `.sw`).
      - Card 3 (About): Bio textarea.
      - Card 4 (Quick stats): 4 columns (Experience, Projects, Live shows, Total followers).
      - Card 5 (Physical stats): 3 columns (Height, Weight, Waist, Chest, Hair type, Hair length, Languages).
      - Card 6 (Photo gallery): `.gal` thumbnail grid with native multi-file upload picker, subtitle `Shown under Gallery & Media. Add at least 3 photos. 1200 × 800 px.`, counter `{n} of 12`, and `.gi.add` button.
      - Repeaters (Videos, Short clips, Previous campaigns, Awards and recognition, FAQs): `.rrow` with `.n` badges, `.rf` fields, `.acts` remove buttons, `.btn.sm` add buttons, and `<p class="mu">Nothing added yet.</p>` empty states.
      - Card 12 (Social and links): Subtitle `Shown as icons on the profile.` with Instagram, YouTube, Facebook, X, and full-width Spotify.
      - Card 13 (Fanbase by platform): Subtitle `Shown as the donut chart and platform cards. Leave a platform empty to hide it. Examples: 31.9M, 108.7K.` with 7 platform reach fields.
      - Card 14 (SEO) pixel-perfect match to `manager.html` (lines 1566–1594) and reference screenshot `media_1794565578589_717852fe.jpg`:
        - Title: strictly `SEO`, Subtitle: `How this profile looks on Google and when the link is shared on WhatsApp.`.
        - Left column: `Meta title <span class="cc">0/60</span>`, `Meta description <span class="cc">0/160</span>`, `Focus keyword`, `Profile photo alt text`, `Canonical URL (optional)`, `Share image (1200 × 630 px)` with Upload image button, `Show in search engines` toggle switch with schema hint, and `Fill from profile` button with sparkle icon.
        - Right column: Google search preview (`.gp`), WhatsApp social share card preview (`.ogp`), and live `SEO score` box (`.scr`) with meter bar and 7 checklist items (`.chk`).
      - Note: `Reviews and ratings are written by visitors on the website and are not entered here.`
      - Sticky Bottom Bar (`.fbar`): Positioned sticky inside the right content column, leaving the left sidebar completely free and unobstructed. Contains `Profile completeness 0%` initially on new profiles (videos/clips default to empty strings without phantom scoring), with animated red bar (`.mt i`), `Cancel` button, `Save as draft` button, and `Save and publish` primary button.
  - **Artist Class Page (`/admin/artists/class`)**:
    - Matches user screenshots `media_1794562812298_b59a8ebe.jpg` & `media_1794562846417_20a110ad.jpg` and `manager.html`:
      - 4 class summary cards (Platinum 8, Emerging 6, Rising 5, Standard 7) with bold numbers and badges.
      - Full-width search bar: `Search an artist to change class`.
      - Card `Assign classes and placements` with counter `About us exclusive: 2 of 6`.
      - Filter tabs (`.ctabs`): All 26, Platinum 8, Emerging 6, Rising 5, Standard 7.
      - Table with checkboxes, letter avatars, artist info, class dropdown selects, badge tags, and custom red toggle switches for `About us · Exclusive`.
  - **Native Local File Picker for Image Uploads (Fixed & Verified)**:
    - Zero-latency instant visual preview using client-side DataURL (`FileReader.readAsDataURL`) before and during upload so the photo renders immediately in `.pbox.has`.
    - 4-second timeout protection with `AbortController` in `uploadFile()` to prevent hanging when backend is offline or slow.
    - Automatic URL prefixing for relative paths and Next.js `/uploads/:path*` proxy rewrite in `next.config.ts`.
    - Restarted Fastify API server on port 3001 with static file serving enabled.
    - Full preview, change, and remove support with persistence.

## Current Goal

- Kalasquare 1.0 MVP Successfully Built, Hardened, Tested & Ready for Production

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

- **Prompt 7: Real Backend APIs + Full Frontend Integration (DONE)**
  - **Database & Drizzle ORM (`packages/db`)**:
    - Created `home_configs` table (`homeConfigs`) for draft and published JSONB configurations.
    - Added `code` and `price_from` to `venues` table.
    - Added `event_type` and `notes` (JSONB) to `enquiries` table.
    - Altered `artist_social.seo_meta_title` to `varchar(255)` for robust metadata handling.
    - Generated & ran migrations `0000_pale_stick.sql` and `0001_slippery_rocket_raccoon.sql`.
  - **Fastify Backend Architecture (`apps/api`)**:
    - Implemented strict 6-file feature architecture across all domains:
      - `auth/`: `routes`, `controller`, `service`, `repository`, `schema`, `types` (JWT 7-day tokens, bcrypt admin login, `/api/auth/me`, `/api/auth/logout`, `requireAdmin` middleware).
      - `artists/`: `routes`, `controller`, `service`, `repository`, `schema`, `types` (Public: `GET /api/public/artists`, `GET /api/public/artists/:slug`; Admin: CRUD, duplicate with `(Copy)`, publish/unpublish transitions, 0-100% completeness score calculation).
      - `home/`: `routes`, `controller`, `service`, `repository`, `schema`, `types` (`GET /api/public/home`, `GET /api/admin/home-page`, `PUT /api/admin/home-page`, `POST /api/admin/home-page/publish`).
      - `enquiries/`: `routes`, `controller`, `service`, `repository`, `schema`, `types` (`POST /api/public/enquiries` with 5/hr rate limiting, `GET /api/admin/enquiries` with status/search filter, `PATCH /:id/status`, `POST /:id/notes`, `DELETE /:id`).
      - `venues/`: `routes`, `controller`, `service`, `repository`, `schema`, `types` (`GET /api/public/venues`, `GET /api/admin/venues`, `POST /api/admin/venues`, `PUT /api/admin/venues/:id`, `DELETE /api/admin/venues/:id`).
      - `uploads/`: `routes`, `controller`, `service`, `schema` (Multipart file upload with `@fastify/multipart`, validating JPG/PNG/WebP max 5MB, static file serving via `@fastify/static` at `/uploads/`).
    - Configured Swagger documentation with `fastify-type-provider-zod` at `/docs` (with `/api/docs` redirect).
    - Health checks at `/health` and `/api/health`.
    - Created comprehensive database seed script `apps/api/src/db/seed.ts` runnable with `pnpm db:seed`.
  - **Frontend Real API Integration (`apps/web`)**:
    - Implemented `apps/web/src/lib/auth.ts` (`login`, `logout`, `getToken`, `isLoggedIn`, `getAuthUser`).
    - Built Admin Login UI at `/admin/login` and integrated route protection guards in `AdminLayout.tsx`.
    - Created unified API client `apps/web/src/lib/api.ts` connecting frontend components to backend endpoints with graceful offline mock fallbacks.
    - Connected Public Home Page Server Component (`apps/web/src/app/page.tsx`) to `fetchPublicHome()`.
    - Connected Public Artist Profile Page (`apps/web/src/app/top-creators/[slug]/page.tsx`) to `fetchPublicArtistBySlug()` with Next.js `notFound()` on 404.
    - Connected Admin Artists Table (`ArtistsTable.tsx`) to `fetchAdminArtists()`, API-driven publish/unpublish, duplicate, and delete.
    - Connected Admin Artist Form (`ArtistForm.tsx`) to `createArtist()` / `updateArtist()` and image uploaders (`ImageUpload.tsx`, `GalleryUploader.tsx`) to `uploadFile()`.
    - Connected Admin Home Page Manager (`/admin/home-page`) to `fetchAdminHome()`, `saveHome()`, and `publishHome()`.
    - Connected Admin Enquiries Manager (`EnquiriesTable.tsx`) to `fetchEnquiries()`, status updates, and note appending.
    - Connected Artist Profile Booking Enquiry Card (`EnquiryCard.tsx`) to `createEnquiry()`.
  - **Verification & Acceptance**:
    - All verification curl checks passed (Health, Swagger UI, Admin Login, Invalid Login 401, Public Artists list & detail, missing artist 404, Public Home config, Enquiry creation 201, Admin Artists, Admin Enquiries, Admin Venues, Save/Publish Home draft, Artist completeness, Duplicate, Delete, Publish/Unpublish status transitions, Multipart file uploads).
    - `pnpm typecheck` passed with 0 errors across monorepo (`packages/db`, `packages/shared`, `packages/config`, `apps/api`, `apps/web`).
    - `pnpm build` passed with all 13 Next.js routes optimized and static-rendered.

- **Prompt 8: Production Deployment, Hardening & Acceptance Testing (DONE - PROJECT COMPLETE)**
  - **Part A: Production Environment & Configuration**:
    - Created `apps/web/.env.production` with `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`.
    - Created `apps/api/.env.production` with `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `CORS_ORIGIN`, `UPLOAD_DIR`.
    - Created `apps/api/src/lib/env.ts` with strict Zod environment validation on boot (throws clear errors if any required env var is missing in production).
    - Created CLI password hashing utility `scripts/hash-password.ts` with root script `"pnpm hash-password --password <pwd>"`.
    - Updated `uploads.service.ts` to respect `UPLOAD_DIR`, and added `apps/api/uploads/*` (with `.gitkeep`) to `.gitignore`.
  - **Part B: Production Deployment Configs**:
    - Created `apps/web/vercel.json` for Vercel deployment.
    - Created `apps/api/Dockerfile` (Node 20 Alpine, PNPM monorepo build, production server start).
    - Created `apps/api/railway.json` and `render.yaml` for containerized backend hosting.
  - **Part C: SEO, Performance & Security Hardening**:
    - SEO: Enhanced `RootLayout` with Open Graph 1200x630 images, Twitter summary large cards, and metadata base URL.
    - Sitemap: Created dynamic `apps/web/src/app/sitemap.ts` exporting published artist profile URLs and main routes.
    - Robots: Created `apps/web/public/robots.txt` disallowing `/admin/` and `/api/` with sitemap reference.
    - Fonts: Replaced build-time `next/font/google` with asynchronous Google Fonts stylesheet preconnect and system fallbacks, eliminating build-time network stalls.
    - Caching: Home Page and Artist Profile Page configured with `revalidate = 60`; all Admin pages configured with `dynamic = 'force-dynamic'`.
    - Security: Verified `requireAdmin` JWT guard across all `/api/admin/*` routes; verified rate limiter returns 429 after 5 requests/hour; verified XSS escaping in React; verified CORS origin restrictions.
  - **Part D: 8 Acceptance Test Suites Executed**:
    - Suite 1 (Create, Draft 404, Publish, Live Profile 200): **PASS**
    - Suite 2 (Edit Reflects Immediately): **PASS**
    - Suite 3 (Unpublish Gives 404, Draft Gives 404): **PASS**
    - Suite 4 (Mobile & Responsive Layouts 375px/768px/1440px): **PASS**
    - Suite 5 (Validation Testing - space in slug, duplicate slug 409, PriceTo < PriceFrom 400, >6 videos 400, no phone 400): **PASS**
    - Suite 6 (Image Upload, Refresh & DB Persistence): **PASS**
    - Suite 7 (Home Page Manager Section Order & Visibility Live Reflection): **PASS**
    - Suite 8 (Enquiries Public Submission -> Admin Review -> Status -> Notes): **PASS**
  - **Part E: Quality Audit & Documentation**:
    - Created `BUGS.md` documenting all 5 issues resolved during hardening and their re-test results.
    - Created `DEPLOY.md` with production URLs, checklists, database setup, limitation disclosures, and test suite logs.
    - Cleaned up console.logs (0 in runtime code).
    - `pnpm typecheck` passed with 0 errors across all 5 workspace projects.
    - `pnpm build` passed with all static and dynamic routes compiled.

## In Progress

- **Frontend Visual Refinements & Screenshot Alignment**:
  - **Phase 1: Public Home Screen UI (DONE)**: Fully aligned with Screenshots 1-8 and `Kalasquare_Home_Page_Manager_2.html`. Retained `#demoBar` (`Kalasquare Live Demo` with Login, Home, Admin pill buttons, Reset demo) and `.dnote` notice bar for client demo.
  - **Client Demo Mode (DONE)**: Direct access to admin pages (`/admin`, `/admin/artists`, `/admin/artists/new`, etc.) enabled without login prompts.
  - **Phase 2: Add Artist UI Refinements (DONE)**: Redesigned `apps/web/src/components/admin/ArtistForm.tsx` and `apps/web/src/components/admin/AdminLayout.tsx` matching Screenshots 09-14 (`screenshots/Pasted 12-11-2026 at 22.32.56.png` through `22.33.43.png`).
    - Basic details with square profile photo upload box, Full name, Profile link (`kalasquare.com/top-creators/slug`), 13 category pills, City & State, Phone & Email, Summary line, Specializations.
    - Class and visibility with Artist class & Budget range dropdowns, Documents verified toggle, Show in About us toggle.
    - About story bio.
    - Quick stats (Experience, Projects, Live shows, Followers).
    - Physical stats (Height, Weight, Waist, Chest, Hair type, Hair length, Languages).
    - Photo gallery (0 of 12) with Add photos dashed box.
    - Videos (YouTube links, 1 of 6) & Short clips (Shorts/Reels, 1 of 8).
    - Previous campaigns (0 of 6), Awards and recognition (0 of 8), FAQs (0 of 8).
    - Social and links (Instagram, YouTube, Facebook, X, Spotify).
    - Fanbase by platform (7 platforms).
    - SEO with Meta title (0/60), Meta description (0/160), Focus keyword, Alt text, Canonical URL, Share image, Google search preview snippet, WhatsApp card preview, and 7-rule SEO score checklist.
    - Sticky bottom bar with Profile completeness % progress bar, Cancel, Save as draft, and Save and publish.
    - Top Admin Bar with `Sample data` button that auto-populates Sahil Badal sample profile in 1 click!
  - **Phase 3: Artist Profile Page Refinements (NEXT)**: Review and refine `/top-creators/[slug]` when clicked from Home.
  - **Phase 4: View All Artists Directory (QUEUED)**: Directory & filter layout.

## Next Up

- Execute Phase 3: Artist Profile Page refinements when clicked from Home screen.

## Open Questions

- None at this stage.
