# AGENTS.md - Kalasquare - Read This First

## Important - Do Not Recreate Context Files

The user has already pasted 6 context files in the context/ folder. Do NOT recreate them, do NOT overwrite them.

The user previously shared 6-7 files from a different project (Ghost AI) only as a template to understand the structure. Do NOT use the content of those Ghost AI files. The Kalasquare files in context/ are the single source of truth.

## Read These Files In This Order Before Writing Any Code

1. `context/project-overview.md` - What to build
2. `context/architecture-context.md` - How to build it
3. `context/ui-context.md` - How it should look
4. `context/code-standards.md` - How to write code
5. `context/ai-workflow-rules.md` - How to work step by step
6. `context/progress-tracker.md` - Current progress

## Tech Stack - Locked - Do Not Change

- **Frontend**: Next.js 16 (LTS Stable) App Router + Tailwind CSS + TypeScript
- **Backend**: Node.js + Fastify + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod everywhere
- **API Docs**: fastify-type-provider-zod + @fastify/swagger, Swagger UI at /docs
- **Package Manager**: PNPM only

Do NOT use Clerk, Prisma, Liveblocks, Trigger.dev, Vercel Blob, React Flow, Dark Theme. None of these are used in Kalasquare.

## Golden Rules - To Prevent Hallucination

- If it is not written in the context files, do NOT build it. Do NOT invent.
- If a requirement is ambiguous, resolve it in the relevant context file first, then implement.
- If a requirement is missing, add it as an Open Question in progress-tracker.md before writing code.
- After every meaningful change, update context/progress-tracker.md.
- If implementation changes architecture, scope, or standards, update the relevant context file first, then continue.
- Work on one feature unit at a time. Do NOT combine unrelated features in one step.
