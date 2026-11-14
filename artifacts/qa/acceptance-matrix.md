# Acceptance Matrix — Artist Profile Module (Kalasquare)

**Document Version:** 2.0.0  
**Verification Date:** 2026-11-14  
**Database:** Neon PostgreSQL Cloud Database (AWS ap-southeast-1 SSL)  
**Fastify API:** `http://localhost:3001` (Health: `status: ok`, `db: connected`)  
**Next.js Frontend:** `http://localhost:3000` (Next.js 16 App Router)  
**Browser Engine:** Google Chrome Headless (CDP Protocol via port 9222)  
**Visual & Interaction Reference:** `Kalasquare_Home_Page_Manager_2.html`  

---

## 1. Requirement Traceability Matrix

| ID | Client Requirement | Reference HTML Mapping | Frontend Implementation | Backend API | Database Model | Status | Verification Evidence / Screenshots |
|:---|:---|:---|:---|:---|:---|:---:|:---|
| **REQ-001** | Admin creates artist in Draft mode | Lines 1281–1400 (`AFmode = 'draft'`, `saveArtist('draft')`) | `ArtistForm.tsx` (`handleSaveDraft`) | `POST /api/admin/artists` (`status: 'draft'`) | `artists.status = 'draft'` | **PASS** | Verified via browser test and API. Saved artist assigns `status: 'draft'`. Screenshot: `01-admin-artist-create-form.png`, `02-admin-artist-saved-draft.png`. |
| **REQ-002** | Admin publishes verified artist to live site | Lines 1381–1400 (`AF.docs ? 'live' : 'pending'`) | `ArtistForm.tsx` (`handlePublishSubmit`) | `POST /api/admin/artists` / `PATCH /:id/publish` | `artists.status = 'live'` | **PASS** | Verified via Chrome CDP. When `isVerified: true`, status is set to `'live'`. Public profile loads 200 OK. Screenshot: `05-public-profile-live-desktop.png`. |
| **REQ-003** | Admin publishes unverified artist (Pending status) | Line 1383 (`status = 'pending'`) | `ArtistForm.tsx` | `POST /api/admin/artists` / `PUT /:id` | `artists.status = 'pending'` | **PASS** | Verified via `test_artist_profile_module.js` and backend test. Unverified publish assigns `status: 'pending'` and returns 404 on public route. |
| **REQ-004** | Hero section with photo, rating, badges, name, tagline, location, CTA, and social links | Lines 2021–2027 (`.pp-hero`, `.pp-bg`, `.pp-ph`, `.pp-rate`, `.pp-hi`, `.pp-cta`, `.pp-so`) | `ArtistHero.tsx`, `artist_profile.css` | `GET /api/public/artists/:slug` | `artists`, `artist_social` | **PASS** | 4:5 tilted avatar, rating pill, Bricolage Grotesque name, coral pin, share, heart, and smooth-scroll CTA. Screenshot: `05-public-profile-live-desktop.png`. |
| **REQ-005** | Quick stats floating strip | Line 2027 (`.wrap.pp-stw > .pp-sts.rv`) | `ArtistQuickStats.tsx` | Returned in artist profile JSON | `experience_years`, `projects_count`, `live_shows_count`, `total_followers_label` | **PASS** | Floating card with `-52px` margin between hero and tabs. Follower parsing verified without phantom 50k. Screenshot: `05-public-profile-live-desktop.png`. |
| **REQ-006** | Profile tabs with sliding red indicator and scroll spy | Lines 2019, 2028, 2065, 2098 (`.pp-tabs`, `.pp-ind`) | `ArtistTabs.tsx` | Dynamic tabs based on populated sections | Media and Work arrays | **PASS** | 9 canonical tabs (`About`, `Fanbase`, `Gallery`, `Videos`, `Reels`, `Spotify`, `Work`, `IMDb`, `Reviews`). Indicator slides smoothly. |
| **REQ-007** | About section with expandable bio and physical stats card | Lines 2030–2032 (`#ppBio`, `.pp-more`, `.pp-ph2`) | `ArtistAbout.tsx` | `bio`, physical stats fields in artist DTO | `artists` table | **PASS** | "Read more" toggle appears if bio exceeds clamp; physical stats card renders height, weight, waist, chest, hair, languages. |
| **REQ-008** | Fanbase distribution SVG donut chart and platform cards | Line 2038 (`#pp-fanbase`, `.pp-dn`, `.pp-fc`) | `FanbaseChart.tsx` | Platform follower counts | `artist_social` table | **PASS** | SVG segmented donut chart with total fanbase label in center and colored platform breakdown tiles. Hidden if empty. |
| **REQ-009** | Photo gallery grid and Lightbox viewer | Lines 2039, 2063 (`#pp-gallery`, `.pp-lb#ppLb`) | `GalleryLightbox.tsx` | `artist_media` (`type: 'gallery'`) | `artist_media` table | **PASS** | 4-item photo grid with count badge; click opens Lightbox modal with prev/next buttons and keyboard navigation. |
| **REQ-010** | Latest videos with play overlays | Lines 2040, 2064 (`#pp-videos`, `playSvg`, `#ppVm`) | `VideoGrid.tsx` | `artist_media` (`type: 'video'`) | `artist_media` table | **PASS** | Video cards with 4K badge, play overlay, and YouTube links. Verified in real PostgreSQL relation queries. |
| **REQ-011** | Vertical Reels & short clips rail | Line 2041 (`#pp-reels`, `.pp-r`, dynamic HSL gradients) | `ClipGrid.tsx` | `artist_media` (`type: 'clip'`) | `artist_media` table | **PASS** | 9:16 aspect cards with dynamic gradient hues, play icon, and links. Persisted in `artist_media`. |
| **REQ-012** | Spotify Top Songs (Singer category only) | Lines 2042–2043 (`#pp-music`, Singer check) | `TopSongs.tsx` | `songs` list in artist response | `artist_work` (`kind: 'song'`) | **PASS** | Singer-only condition verified. Relational persistence added to `artists.service.ts` for songs mapping. |
| **REQ-013** | Previous campaigns and Awards & honors | Lines 2044–2047 (`#pp-work`) | `CampaignsAwards.tsx` | `artist_work` (`kind: 'campaign'`, `kind: 'award'`) | `artist_work` table | **PASS** | Brand campaigns and awards with year, tags, and description. Verified via live Drizzle select. |
| **REQ-014** | IMDb film & screen credits (Actor/Theatre only) | Lines 2048–2050 (`#pp-imdb`, `hasImdb(a)`) | `IMDbSection.tsx` | `imdb` object in artist response | `artist_social` / `artist_work` | **PASS** | Actor/Theatre category check verified. `imdb_url` and `kind: 'film'` credits mapped and verified. |
| **REQ-015** | Client reviews, star summary, and Write a Review modal | Lines 2051–2052, 2062 (`#pp-reviews`, `#ppRv`) | `ReviewsSection.tsx` | Reviews UI and API | `reviews` table | **PASS** | UI renders rating summary, review cards, and interactive 1–5 star rating submission dialog. |
| **REQ-016** | FAQs accordion | Line 2052 (`#pp-faq`) | `FAQAccordion.tsx` | `artist_work` (`kind: 'faq'`) | `artist_work` table | **PASS** | Frequently asked questions accordion with expandable `+` / `–` toggles (Platinum tier). |
| **REQ-017** | SEO metadata, open graph, and Schema.org JSON-LD | Lines 1541–1550, 2061 (`.pp-seo`, SEO manager) | `page.tsx` (`generateMetadata`, JSON-LD) | `artist_social` SEO columns | `artist_social` table | **PASS** | Canonical URL, OpenGraph tags, and Person Schema.org JSON-LD structured data. |
| **REQ-018** | Sticky booking enquiry sidebar card (`#ppBook`) | Lines 2056–2059 (`<div class="pp-book" id="ppBook">`) | `EnquiryCard.tsx` | `POST /api/enquiries` | `enquiries` table | **PASS** | Booking form with Name, Phone, Date, Message, smooth 120px offset scroll, and submission validation. |
| **REQ-019** | Mobile sticky enquiry bar | Line 2060 (`.pp-mb`) | `ArtistProfileView.tsx` | N/A | N/A | **PASS** | Fixed bottom bar on mobile (< 768px) with "Send enquiry" and "Call" buttons. Screenshot: `06-public-profile-live-mobile.png`. |
| **REQ-020** | Similar artists rail | Line 2054 (`section.pp-sm`) | `SimilarArtists.tsx` | `findSimilar` query | `artists` table | **PASS** | Category-matched avatar tiles linking to other artist profiles. |
| **REQ-021** | Admin View All Artists table, filtering, sorting, pagination | Lines 1180–1230 (`#artTable`, class filter, search) | `ArtistsTable.tsx` (`/admin/artists`) | `GET /api/admin/artists` | `artists` table | **PASS** | Search, filter by class/city/category, sort, verified filter, and action buttons. Screenshot: `02-admin-artist-saved-draft.png`. |
| **REQ-022** | Admin Edit Artist full field hydration and persistence | Lines 3130–3135 (`editArtist`, `AF` clone) | `ArtistEditClient.tsx`, `ArtistForm.tsx` | `GET /api/admin/artists/:id`, `PUT /api/admin/artists/:id` | `artists`, `artist_media`, `artist_work`, `artist_social` | **PASS** | Preserves all fields across basic details, stats, media, and work without state reset. Verified via Chrome CDP. Screenshot: `04-admin-artist-publishing.png`. |
| **REQ-023** | Admin Artist Class & Placements Manager | Lines 1388–1425 (`PANELS['art-class']`, class cards, bulk move) | `ArtistClassManager.tsx` (`/admin/artists/class`) | `artists.service.ts` | `artists.artist_class`, `artists.is_exclusive` | **PASS** | Class overview cards, bulk class assignment, inline class dropdown, and About Us exclusive toggle. |
| **REQ-024** | Admin Unpublish and Delete/Deactivate operations | Line 1397 (`status = 'draft'`), delete cascade | Admin table / form actions | `PATCH /:id/unpublish`, `DELETE /:id` | `artists.status`, CASCADE deletes | **PASS** | Unpublish flips status to draft (public URL returns 404). Delete cascades media, work, and social records. |
| **REQ-025** | Media file uploads (Avatar, Gallery, Campaign/Award image) | Lines 1365–1380 (`loadFiles`, `pickMany`, size limits) | `PhotoUploadZone.tsx`, `ArtistForm.tsx` | `POST /api/admin/uploads` | Static storage URL / base64 fallback | **PASS** | Upload validation for file type (JPG/PNG/WebP), size limit (< 25MB), aspect ratio warnings, and URL persistence. |
| **REQ-026** | Profile completeness percentage meter | Lines 1258–1265 (`completeness()`, 19 checklist items) | `ArtistForm.tsx` (live meter) | `calculateCompleteness()` | `artists.completeness_percent` | **PASS** | 0% to 100% calculation based on 19 weighted fields; live progress bar updates on input. |
| **REQ-027** | Responsive behavior (Desktop 1440, Tablet 768, Mobile 390) | `@media (max-width: 900px)`, `@media (max-width: 600px)` | Tailwind CSS + `artist_profile.css` | N/A | N/A | **PASS** | Single-column mobile layout, responsive grids, horizontally scrolling tabs, sticky mobile bottom enquiry bar. Screenshots: `05-public-profile-live-desktop.png`, `06-public-profile-live-mobile.png`. |

---

## 2. Evidence Artifacts & Screenshot Registry

All screenshots are stored in `artifacts/qa/screenshots/`:
1. `00-reference-manager-desktop.png` — Baseline HTML reference rendered at 1440x900
2. `00-reference-manager-mobile.png` — Baseline HTML reference rendered at 390x844
3. `01-admin-artist-create-form.png` — Admin artist creation form populated with Aarav Sharma details
4. `02-admin-artist-saved-draft.png` — Admin artists table confirming Aarav Sharma saved with Draft badge
5. `03-draft-404-error-state.png` — Public route `/top-creators/aarav-sharma` returning 404 "Artist Not Found" UI
6. `04-admin-artist-publishing.png` — Admin edit mode with all fields preserved and Documents verified toggled ON
7. `05-public-profile-live-desktop.png` — Published public profile live on desktop (1440x900) with complete layout
8. `06-public-profile-live-mobile.png` — Published public profile on mobile viewport (390x844) with sticky enquiry bar
9. `07-admin-artist-updated-form.png` — Admin edit form with updated tagline and 120 projects
10. `08-public-profile-updated-desktop.png` — Public profile refreshed reflecting updated data live
