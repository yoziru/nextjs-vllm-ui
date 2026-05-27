ARG NODE_VERSION=24.15.0
ARG AUBE_VERSION=1.16.0
# Install dependencies only when needed
FROM node:$NODE_VERSION-alpine AS builder
ARG AUBE_VERSION
WORKDIR /opt/app

# Copy only the necessary files for dependency installation
COPY package.json aube-lock.yaml aube-workspace.yaml ./

RUN npm install -g --ignore-scripts=false @endevco/aube@$AUBE_VERSION && aube ci
# patch logging for requestHandler
RUN sed -Ei \
    -e '/await requestHandler/iconst __start = new Date;' \
    -e '/await requestHandler/aconsole.log(`[${__start.toISOString()}] ${((new Date - __start) / 1000).toFixed(3)} ${req.method} ${req.url}`);' \
    node_modules/next/dist/server/lib/start-server.js

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV VLLM_URL=""
ENV VLLM_API_KEY=""

COPY . .
RUN aube build

# Production image, copy all the files and run next
FROM node:$NODE_VERSION-alpine AS runner
WORKDIR /opt/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /opt/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /opt/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /opt/app/.next/static ./.next/static

# Copy only the necessary files for runtime
COPY --from=builder /opt/app/package.json ./
COPY --from=builder /opt/app/aube-lock.yaml ./
COPY --from=builder /opt/app/aube-workspace.yaml ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
