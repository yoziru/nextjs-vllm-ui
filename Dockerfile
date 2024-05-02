ARG NODE_VERSION=lts
# Install dependencies only when needed
FROM node:$NODE_VERSION-alpine AS builder
ENV YARN_CACHE_FOLDER=/opt/yarncache
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
# patch logging for requestHandler
RUN sed -Ei \
    -e '/await requestHandler/iconst __start = new Date;' \
    -e '/await requestHandler/aconsole.log(`[${__start.toISOString()}] ${((new Date - __start) / 1000).toFixed(3)} ${req.method} ${req.url}`);' \
    node_modules/next/dist/server/lib/start-server.js

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV VLLM_URL="http://localhost:8000"
ENV VLLM_API_KEY=""

COPY . .
RUN yarn build

# Production image, copy all the files and run next
FROM node:$NODE_VERSION-alpine AS runner
WORKDIR /opt/app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

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

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
