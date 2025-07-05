FROM node:22-alpine AS base
WORKDIR /app

# ----- Stage 1: Development -----
FROM base AS development
ENV NODE_ENV=development

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .
EXPOSE 3000

CMD ["npm", "run", "dev"]

# ----- Stage 2: Build -----
FROM base AS builder

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .
RUN npm run build

# ----- Stage 3: Production -----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy build output and static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]