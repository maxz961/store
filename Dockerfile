FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.4

WORKDIR /app

# Install dependencies
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Generate Prisma client and build
RUN pnpm --filter @store/shared prisma:generate:ci
RUN pnpm --filter shared build
RUN pnpm --filter backend build:prod

EXPOSE 3001

CMD ["node", "apps/backend/dist/apps/backend/src/main"]
