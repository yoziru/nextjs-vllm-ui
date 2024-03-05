ARG NODE_VERSION=lts
# Install dependencies only when needed
FROM node:$NODE_VERSION-alpine AS deps
ENV YARN_CACHE_FOLDER=/opt/yarncache
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV VLLM_URL="http://localhost:8000"

COPY . .
RUN yarn build
CMD ["node_modules/.bin/next", "start"]
