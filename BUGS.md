# Kalasquare - Prompt 8 Bug Log & Quality Audit

All bugs discovered during Prompt 8 production configuration, performance testing, and 8-suite acceptance verification are documented below along with their root-cause fixes and verification results.

---

### Bug 1: Google Fonts Build-Time Timeout in Next.js 16 (`next/font/google`)
- **Severity**: High (Blocks static build in CI/CD, Docker, and isolated build environments)
- **Component**: `apps/web/src/app/layout.tsx`
- **Root Cause**: `next/font/google` attempts to fetch font binaries from `fonts.googleapis.com` synchronously at build time. When outbound network access has jitter, DNS delays, or environment sandbox isolation, Next.js hangs in retry loops (`Retrying 1/3... 2/3...`) and eventually errors.
- **Fix**: Replaced `next/font/google` in `layout.tsx` with standard `<link rel="preconnect">` and Google Fonts stylesheet links in `<head>`, and updated `globals.css` with reliable system fallbacks (`'Bricolage Grotesque', Georgia, sans-serif` and `'DM Sans', system-ui, sans-serif`).
- **Re-test Result**: `pnpm -r build` passes cleanly in ~17 seconds with 0 font errors.

---

### Bug 2: Missing HTTP 429 Status Code on Enquiry Rate Limiting
- **Severity**: Medium (Functional Requirement)
- **Component**: `apps/api/src/features/enquiries/enquiries.service.ts`, `apps/api/src/common/errors.ts`
- **Root Cause**: `checkRateLimit` threw `ValidationError`, which defaulted to HTTP 400 Bad Request instead of HTTP 429 Too Many Requests.
- **Fix**: Created `RateLimitError` class in `apps/api/src/common/errors.ts` returning HTTP status 429 (`RATE_LIMIT_EXCEEDED`), and threw it in `EnquiriesService.checkRateLimit`.
- **Re-test Result**: Test Suite 5 verified that the 1st through 5th enquiries succeed with HTTP 201, while the 6th enquiry within 1 hour returns HTTP 429.

---

### Bug 3: Missing `priceTo >= priceFrom` Validation on API Route Level
- **Severity**: Medium (Data Integrity)
- **Component**: `apps/api/src/features/artists/artists.routes.ts`
- **Root Cause**: Route schemas for `POST /admin/artists` and `PUT /admin/artists/:id` used `artistBaseSchema` instead of `artistFormSchema` (which contains the `.refine()` check enforcing `priceTo >= priceFrom`).
- **Fix**: Replaced `body: artistBaseSchema` with `body: artistFormSchema` on both endpoints in `artists.routes.ts`.
- **Re-test Result**: An artist create payload with `priceFrom: 50000, priceTo: 10000` is immediately rejected with HTTP 400 and validation message `"Price To must be greater than or equal to Price From"`.

---

### Bug 4: Inconsistent Profile Photo Field Name on Public Artist Endpoint
- **Severity**: Medium (UI Data Presentation)
- **Component**: `apps/api/src/features/artists/artists.service.ts`
- **Root Cause**: Public endpoint returned `profilePhotoUrl` but `ArtistProfile` frontend interface expected `photoUrl`.
- **Fix**: Updated `getPublicArtistBySlug` in `artists.service.ts` to return both `photoUrl` and `profilePhotoUrl`.
- **Re-test Result**: Test Suite 6 verified that uploaded photos persist and render directly in `photoUrl`.

---

### Bug 5: `GalleryItem.id` Type Incompatibility on Form Submission
- **Severity**: Low (TypeScript Build Error)
- **Component**: `apps/api/src/features/artists/artists.schema.ts`, `apps/web/src/lib/validators/artist-form.ts`, `apps/web/src/components/admin/GalleryUploader.tsx`
- **Root Cause**: `galleryItemFormSchema` strictly required `id: z.string()`, rejecting payloads where `id` was generated dynamically or omitted during raw API testing.
- **Fix**: Made `id` optional in `galleryItemFormSchema` (`id: z.string().optional()`) and updated `GalleryItem` interface in `GalleryUploader.tsx`.
- **Re-test Result**: `pnpm typecheck` passed with 0 errors across all 5 workspace projects.

