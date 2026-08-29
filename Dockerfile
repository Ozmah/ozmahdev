# syntax=docker/dockerfile:1

ARG BUN_VERSION=1.4.0

FROM oven/bun:${BUN_VERSION}-debian AS dependencies
WORKDIR /app

COPY --link package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM dependencies AS builder
WORKDIR /app

COPY --link . .

ENV NODE_ENV=production
ENV APP_ENV=production

RUN bun run glados

FROM oven/bun:${BUN_VERSION}-debian AS runner
WORKDIR /app

RUN groupadd --gid 1001 --system ozmah \
	&& useradd --uid 1001 --gid ozmah --system --create-home ozmah

COPY --from=builder --chown=ozmah:ozmah /app/.output ./.output

ENV NODE_ENV=production
ENV APP_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

USER ozmah

CMD ["bun", ".output/server/index.mjs"]
