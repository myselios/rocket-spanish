FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Install Python and required packages
RUN apk add --no-cache python3 py3-pip py3-requests

# Rebuild source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED=1

# Build application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install Python and required packages for TTS scripts
RUN apk add --no-cache python3 py3-pip py3-requests python3-dev

# Python 가상환경 생성 및 패키지 설치
COPY src/scripts/requirements.txt /app/src/scripts/
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install -r /app/src/scripts/requirements.txt

# Add Python venv to PATH
ENV PATH="/app/venv/bin:$PATH"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/src/scripts ./src/scripts

# Set file permissions for TTS script and create necessary directories
RUN mkdir -p /app/data/input /app/data/output
RUN chown -R nextjs:nodejs /app/data /app/venv
RUN chmod -R 755 /app/data /app/src/scripts /app/venv

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"] 