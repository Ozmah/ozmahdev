#!/usr/bin/env sh
set -eu

image=${1:?"usage: smoke-container.sh <image> <preview|production> [port]"}
app_env=${2:?"usage: smoke-container.sh <image> <preview|production> [port]"}
port=${3:-3100}
name="ozmah-astro-smoke-$$"

cleanup() {
	docker rm -f "$name" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

docker run -d \
	--name "$name" \
	-p "$port:$port" \
	-e APP_ENV="$app_env" \
	-e PORT="$port" \
	"$image" >/dev/null

ready=false
attempt=1
while [ "$attempt" -le 30 ]; do
	if curl --fail --silent --show-error "http://127.0.0.1:$port/health" >/dev/null 2>&1; then
		ready=true
		break
	fi
	attempt=$((attempt + 1))
	sleep 0.2
done

if [ "$ready" != true ]; then
	docker logs "$name"
	exit 1
fi

assert_status() {
	route=$1
	expected=$2
	actual=$(curl --silent --output /dev/null --write-out "%{http_code}" "http://127.0.0.1:$port$route")
	[ "$actual" = "$expected" ] || {
		echo "$route returned $actual; expected $expected" >&2
		exit 1
	}
}

for route in / /work /contact /privacy /aperture /robots.txt /sitemap.xml /health; do
	assert_status "$route" 200
done
assert_status /does-not-exist 404

headers=$(curl --silent --dump-header - --output /dev/null "http://127.0.0.1:$port/work")
printf "%s" "$headers" | grep -qi '^X-Content-Type-Options: nosniff'
printf "%s" "$headers" | grep -qi '^X-Frame-Options: DENY'
if printf "%s" "$headers" | grep -qi '^Server:'; then
	echo "Server header must not be exposed" >&2
	exit 1
fi

health=$(curl --silent "http://127.0.0.1:$port/health")
[ "$health" = '{"status":"healthy"}' ]

redirect=$(curl --silent --dump-header - --output /dev/null "http://127.0.0.1:$port/work/")
printf "%s" "$redirect" | grep -q '^HTTP/1.1 308'
printf "%s" "$redirect" | grep -qi '^Location: /work'

robots=$(curl --silent "http://127.0.0.1:$port/robots.txt")
if [ "$app_env" = production ]; then
	printf "%s" "$robots" | grep -q '^Disallow:$'
	if printf "%s" "$headers" | grep -qi '^X-Robots-Tag:'; then
		echo "Production document unexpectedly has X-Robots-Tag" >&2
		exit 1
	fi
else
	printf "%s" "$robots" | grep -q '^Disallow: /$'
	printf "%s" "$headers" | grep -qi '^X-Robots-Tag: noindex, nofollow, noarchive'
	printf "%s" "$headers" | grep -qi '^Cache-Control: no-store'
fi

docker exec "$name" sh -c '
	[ "$(id -u)" = 1001 ]
	! command -v node >/dev/null 2>&1
	! command -v bun >/dev/null 2>&1
'

echo "$app_env container smoke test passed"
