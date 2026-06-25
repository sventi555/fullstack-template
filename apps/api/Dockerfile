FROM node:24-alpine AS base

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

################################################################################
FROM base AS prepare

RUN npm -g install turbo@^2
COPY . .
RUN turbo prune api --docker

################################################################################
FROM base AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
COPY --from=prepare /app/out/full/ .

################################################################################
FROM oven/bun:1.3.14 AS runner

WORKDIR /app

COPY --from=builder /app .

USER bun
CMD bun run --filter api start
