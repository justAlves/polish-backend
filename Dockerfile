FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock* ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile || bun install

# Generate Prisma client
RUN bunx prisma generate --schema ./prisma/schema

# Production image
FROM base
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
