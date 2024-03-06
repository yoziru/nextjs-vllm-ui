ARG NODE_VERSION=lts
# Install dependencies only when needed
FROM node:$NODE_VERSION-alpine AS builder
ENV YARN_CACHE_FOLDER=/opt/yarncache
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV VLLM_URL="http://localhost:8000"

COPY . .
RUN yarn build

# Production image, copy all the files and run next
FROM node:$NODE_VERSION-alpine AS runner
WORKDIR /opt/app

ENV NODE_ENV production
ENV NEXT_SHARP_PATH=/tmp/node_modules/sharp
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /opt/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs --link /opt/app/node_modules/sharp /tmp/node_modules/sharp
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /opt/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /opt/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
