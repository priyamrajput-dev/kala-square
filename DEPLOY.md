# Kalasquare - Production Deployment & Verification Report

## Production & Staging URLs

| Service | Target Production URL | Staging / Development URL |
| :--- | :--- | :--- |
| **Frontend** | `https://kalasquare.com` | `http://localhost:3000` |
| **Backend API** | `https://api.kalasquare.com` | `http://localhost:3001` |
| **Swagger UI Docs**| `https://api.kalasquare.com/docs` | `http://localhost:3001/docs` (and `/api/docs`) |
| **Admin Login** | `https://kalasquare.com/admin/login` | `http://localhost:3000/admin/login` |
| **Sitemap XML** | `https://kalasquare.com/sitemap.xml` | `http://localhost:3000/sitemap.xml` |
| **Robots TXT** | `https://kalasquare.com/robots.txt` | `http://localhost:3000/robots.txt` |

---

## Environment Variables Checklist

### Frontend (`apps/web/.env.production`)
- `NEXT_PUBLIC_API_URL` (e.g. `https://api.kalasquare.com`)
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://kalasquare.com`)
- `NEXT_PUBLIC_GA_ID` (optional Google Analytics measurement ID)

### Backend (`apps/api/.env.production`)
- `NODE_ENV` (`production`)
- `PORT` (`3001`)
- `DATABASE_URL` (Production PostgreSQL connection string with SSL)
- `JWT_SECRET` (Strong random 32+ characters secret for JWT tokens)
- `ADMIN_EMAIL` (Production administrator email)
- `ADMIN_PASSWORD_HASH` (Bcrypt hash of administrator password; generate using `pnpm hash-password`)
- `CORS_ORIGIN` (`https://kalasquare.com`)
- `UPLOAD_DIR` (e.g. `/tmp/uploads` or attached persistent volume path)

---

## Database Configuration

- **Supported Providers**: Neon, Supabase, Railway PostgreSQL, AWS RDS.
- **Backups**: Automatic daily backups should be enabled in the managed database dashboard (Neon point-in-time recovery / Supabase WAL-G).
- **Migration Status**:
  - `0000_pale_stick.sql`: Applied (Core schema: artists, media, work, social, venues, events, home_sections, enquiries, users)
  - `0001_slippery_rocket_raccoon.sql`: Applied (`home_configs`, venue code/price, enquiry event_type/notes)
- **Migration Execution Command**:
  ```bash
  DATABASE_URL="<production-url>" pnpm db:migrate
  ```
  *(Never use `db:push` in production; always use `db:migrate`).*
- **Seed Status**:
  ```bash
  DATABASE_URL="<production-url>" pnpm db:seed
  ```
  *(Seed script checks if data already exists to prevent duplicate rows).*

---

## Deployment Instructions

### 1. Frontend Deploy (Vercel)
1. In the Vercel Dashboard, import the Git repository.
2. Set **Root Directory** to `apps/web`.
3. Set **Framework Preset** to `Next.js`.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://api.kalasquare.com`
   - `NEXT_PUBLIC_SITE_URL=https://kalasquare.com`
5. Connect custom domain `kalasquare.com` and `www.kalasquare.com` under Project Settings -> Domains.
6. Trigger production deployment or push to `master`.

### 2. Backend Deploy (Railway / Render / Fly.io / Docker)
1. Use `apps/api/Dockerfile` or `apps/api/railway.json` / `render.yaml`.
2. Configure Environment Variables in the hosting dashboard (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `CORS_ORIGIN`, `PORT=3001`).
3. Set health check endpoint to `/api/health`.
4. Bind custom domain `api.kalasquare.com` to the service.

---

## Full Acceptance Test Results (8 Test Suites)

All 8 test suites were executed against live database and API endpoints with zero failures:

| Suite | Description | Status | Verification Details |
| :--- | :--- | :--- | :--- |
| **Suite 1** | Admin Creates New Artist, Publishes, Live Profile Opens | **PASS** | Created `test-artist-live` as Draft -> Public URL returned 404 -> Published via Admin -> Public URL returned 200 with all metadata, gallery photos, and Platinum FAQs. |
| **Suite 2** | Edit Reflects Immediately | **PASS** | Changed name to "Test Artist Live Updated", updated gallery from 2 to 3 photos -> Refreshed public endpoint -> New name and 3 photos reflected immediately. |
| **Suite 3** | Unpublish Gives 404, Draft Gives 404 | **PASS** | Unpublished `test-artist-live` -> Returned 404. Created `draft-test` as Draft -> Returned 404. |
| **Suite 4** | Mobile & Responsive Layout Testing | **PASS** | Tested 375px (single column, horizontal scroll tabs, sticky mobile CTA), 768px (2 cards/row), and 1440px desktop grids. |
| **Suite 5** | Validation Testing (Client & API boundaries) | **PASS** | Rejected spaces in slug (400), rejected duplicate slug (409), rejected Price To < Price From (400), rejected >6 videos (400), rejected enquiry without phone (400). |
| **Suite 6** | Image Upload, Refresh & Persistence | **PASS** | Uploaded file via `POST /api/admin/uploads` -> Stored on disk and served statically -> Linked to profile photo -> Remained persisted across refreshes and restarts. |
| **Suite 7** | Home Page Manager Operations | **PASS** | Changed hero heading to "Test Heading", set `rising.isVisible = false`, reordered sections -> Published -> Live public endpoint reflected changes immediately. Restored original config. |
| **Suite 8** | Enquiries End-to-End Lifecycle | **PASS** | Customer submitted enquiry -> Admin fetched new enquiry -> Updated status to "contacted" -> Added internal notes -> Persisted in PostgreSQL. |

---

## Known Architecture Limitations & Recommendations

1. **Local Disk Storage for Uploads**:
   - *Limitation*: Uploaded images are stored in `apps/api/uploads/` on local disk. In stateless container environments (like ephemeral Heroku or Render without persistent disks), uploaded files will be reset on container restart unless a persistent volume or S3/Cloudinary bucket is mounted.
   - *Recommendation*: For multi-region serverless deployments, mount an AWS S3 bucket or set `CLOUDINARY_URL`.
2. **In-Memory Rate Limiter**:
   - *Limitation*: The enquiry rate limiter is stored in an in-memory Map (`ipRateLimitMap`). If the API process restarts, the 5 requests/hour bucket resets.
   - *Recommendation*: As traffic scales across multiple horizontal API instances, back the rate limiter with Redis.
3. **Existing Remaining TODOs**:
   - `apps/api/src/lib/storage.ts`: S3 cloud storage provider abstraction for future Phase 2 migration.
   - `apps/api/src/features/uploads/uploads.types.ts`: Uploaded file metadata interface extensions for future Phase 2.

---

## Test Data Cleanup Status

The following test records were created during automated acceptance testing:
- **Test Artists**:
  - `test-artist-live` (Status: Draft)
  - `draft-test` (Status: Draft)
  - `persistence-test-artist` (Status: Published)
- **Question for User**: *Would you like me to keep these test records for your visual inspection in Admin, or run a cleanup query to remove them and keep only the 3 seeded artists (`sahil-badal`, `test-artist`, `aarav-sharma`)?*
