FROM node:24-alpine AS base

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

################################################################################
FROM base AS prepare

RUN npm -g install turbo@^2
COPY . .
RUN turbo prune client --docker

################################################################################
FROM base AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY --from=prepare /app/out/full/ .
RUN pnpm turbo build

################################################################################
FROM nginx:alpine AS runner

RUN apk add --no-cache bash

WORKDIR /app

COPY --from=builder /app/apps/client/dist /usr/share/nginx/html
COPY --from=builder /app/apps/client/server/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/apps/client/server/entrypoint.sh ./

CMD ./entrypoint.sh
