FROM oven/bun:1.4.0-alpine@sha256:07235578f79ef8c6f97d94aee7938e76f5cdba5f21ae5dbfdd3d3d38058437eb AS bun

FROM node:24.13.0-alpine@sha256:cd6fb7efa6490f039f3471a189214d5f548c11df1ff9e5b181aa49e22c14383e AS build
WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1 \
	HUSKY=0

COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
ARG APP_ENV=preview
ARG PUBLIC_POSTHOG_KEY
ARG PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
RUN APP_ENV="$APP_ENV" \
	PUBLIC_POSTHOG_KEY="$PUBLIC_POSTHOG_KEY" \
	PUBLIC_POSTHOG_HOST="$PUBLIC_POSTHOG_HOST" \
	bun run build

FROM caddy:2.10.2-alpine@sha256:4c6e91c6ed0e2fa03efd5b44747b625fec79bc9cd06ac5235a779726618e530d AS runtime

RUN addgroup -S -g 1001 app \
	&& adduser -S -D -H -u 1001 -G app app \
	&& mkdir -p /srv \
	&& chown -R app:app /srv

COPY Caddyfile /etc/caddy/Caddyfile
COPY caddy /etc/caddy/environments
COPY --from=build --chown=app:app /app/dist /srv

USER app

EXPOSE 3000

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
