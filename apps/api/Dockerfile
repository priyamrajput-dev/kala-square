# Kalasquare API Dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.2.2 --activate

WORKDIR /app

# Copy root and package workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies and build shared packages + api
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @kalasquare/shared build
RUN pnpm --filter @kalasquare/db build
RUN pnpm --filter @kalasquare/api build

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production

CMD ["pnpm", "--filter", "@kalasquare/api", "start"]

