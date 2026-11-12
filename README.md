# Kalasquare

Artist Management & Booking Marketplace Monorepo.

## Tech Stack

- **Frontend**: Next.js 16 (LTS Stable) App Router + Tailwind CSS + TypeScript (`apps/web`)
- **Backend**: Node.js + Fastify + TypeScript (`apps/api`)
- **Database**: PostgreSQL + Drizzle ORM (`packages/db`)
- **Validation**: Zod as single source of truth (`packages/shared`, `apps/api`)
- **API Documentation**: Fastify Zod Type Provider + Swagger UI at `/docs`
- **Package Manager**: pnpm

## Workspace Structure

```
kalasquare/
├── apps/
│   ├── web/          # Next.js 16 App Router frontend (Port 3000)
│   └── api/          # Fastify TypeScript backend (Port 3001)
├── packages/
│   ├── shared/       # Shared Zod schemas & types
│   ├── db/           # Drizzle schema & database configuration
│   └── config/       # Shared tsconfig & tooling configuration
├── context/          # Architecture, workflow, and progress documentation
├── screenshots/      # UI reference screenshots
└── Kalasquare_Home_Page_Manager_2.html # 1:1 Reference UI layout
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start both web and api in development mode
pnpm dev

# Typecheck all packages
pnpm typecheck

# Build all packages
pnpm build
```

- Web application: http://localhost:3000
- API documentation: http://localhost:3001/docs
