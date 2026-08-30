#!/usr/bin/env sh
set -eu

base_url=${1:?"usage: verify-deployment.sh <base-url> <preview|production>"}
app_env=${2:?"usage: verify-deployment.sh <base-url> <preview|production>"}
base_url=${base_url%/}

assert_status() {
	route=$1
	expected=$2
	actual=$(curl --silent --show-error --output /dev/null --write-out "%{http_code}" "$base_url$route")
	[ "$actual" = "$expected" ] || {
		echo "$route returned $actual; expected $expected" >&2
		exit 1
	}
}

for route in / /work /contact /privacy /aperture /robots.txt /sitemap.xml /health; do
	assert_status "$route" 200
done
assert_status /release-verification-not-found 404

home_headers=$(curl --silent --show-error --dump-header - --output /dev/null "$base_url/")
printf "%s" "$home_headers" | grep -qi '^X-Content-Type-Options: nosniff'
printf "%s" "$home_headers" | grep -qi '^X-Frame-Options: DENY'
printf "%s" "$home_headers" | grep -qi '^Referrer-Policy: strict-origin-when-cross-origin'
server_header=$(
	printf "%s" "$home_headers" |
		awk 'tolower($1) == "server:" { value = tolower($2); sub(/\r$/, "", value); print value; exit }'
)
if [ -n "$server_header" ] && [ "$server_header" != cloudflare ]; then
	echo "Unexpected Server header is exposed: $server_header" >&2
	exit 1
fi

health=$(curl --silent --show-error "$base_url/health")
[ "$health" = '{"status":"healthy"}' ]

home=$(curl --silent --show-error "$base_url/")
printf "%s" "$home" | grep -q 'rel="canonical" href="https://ozmah.dev/"'
if printf "%s" "$home" | grep -q 'staging\.ozmah\.dev.*canonical\|canonical.*staging\.ozmah\.dev'; then
	echo "Staging URL leaked into canonical metadata" >&2
	exit 1
fi

robots=$(curl --silent --show-error "$base_url/robots.txt")
if [ "$app_env" = production ]; then
	printf "%s" "$robots" | grep -q '^Sitemap: https://ozmah.dev/sitemap.xml$'
	if printf "%s" "$home_headers" | grep -qi '^X-Robots-Tag:'; then
		echo "Production unexpectedly has X-Robots-Tag" >&2
		exit 1
	fi
else
	printf "%s" "$robots" | grep -q '^Disallow: /$'
	printf "%s" "$home_headers" | grep -qi '^X-Robots-Tag: noindex, nofollow, noarchive'
	printf "%s" "$home_headers" | grep -qi '^Cache-Control: no-store'
	printf "%s" "$home" | grep -q 'name="robots" content="noindex, nofollow, noarchive"'
	if printf "%s" "$home" | grep -q 'AnalyticsRuntime'; then
		echo "Analytics runtime is present in preview HTML" >&2
		exit 1
	fi
fi

echo "$app_env deployment verification passed for $base_url"
