# Observability

`ozmah.dev` uses PostHog for privacy-preserving, cookie-free web analytics. The implementation deliberately collects useful aggregate signals without creating persistent visitor profiles.

## Data contract

Collected:

- Pageviews and pageleaves using sanitized pathnames.
- Maximum scroll depth and page duration.
- Referring domain plus allowlisted `utm_source`, `utm_medium`, and `utm_campaign` values.
- Approximate country, browser family, operating system, and device category.
- LCP, INP, CLS, and FCP without DOM attribution or network timing.
- Explicit `contact_started` and `outbound_link_clicked` events containing fixed enums and public project slugs.

Not collected:

- Cookies, local storage, or session storage.
- Identified people or persistent profiles.
- Session replay, heatmaps, interaction autocapture, form values, DOM text, or console logs.
- Query strings, URL fragments, full referrer URLs, advertising click IDs, exact screen dimensions, or device models.
- Automatic exception messages or stack traces.

PostHog still receives ephemeral pseudonymous device, session, and window identifiers. They are not persisted in browser storage or linked to an identified person.

## PostHog project setup

Use a dedicated PostHog project for `ozmah.dev`; never reuse the Tarkov Farm project token.

1. Set `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` as Railway build variables.
2. Keep the default host `https://us.i.posthog.com` for a US project token.
3. In **Settings → Project → General → IP data capture configuration**, enable **Discard client IP data**.
4. Keep GeoIP enrichment enabled so country can be derived before the raw IP is discarded.
5. Remove precise GeoIP properties through a PostHog transformation if they appear: city, postal code, subdivision, latitude, longitude, and timezone. Retain only country name/code and continent.
6. Do not enable PostHog's cookieless server hash mode. This application already avoids browser persistence; server hash mode removes IP before GeoIP and therefore loses country data.
7. Keep session replay, surveys, heatmaps, autocapture, exception autocapture, and feature flags disabled in the project UI.
8. Select a maximum 12-month retention and require MFA for project access.

The project token is public by design. Never put a PostHog Personal API Key in a `PUBLIC_*` variable.

## Suggested dashboards

### Acquisition

- Sessions and pageviews over 28 and 90 days.
- Landing pages by channel type, `utm_source`, and `$referring_domain`.
- Country and device category.
- Organic traffic separated from referral, social, and direct traffic.

### Portfolio outcomes

- Funnel: `/` → `/work` → `outbound_link_clicked`.
- Funnel: landing page → `/contact` → `contact_started`.
- Outbound clicks by `project_slug`.
- Contact starts by `channel`.

### Experience

- P75 and P90 for LCP, INP, and CLS by route and device category.
- FCP as a supporting diagnostic, not a Core Web Vital.
- Page duration and maximum scroll percentage.
- Browser and OS breakdown only when investigating compatibility.

Use absolute numbers and 28–90 day windows while traffic is low. Do not make decisions from daily percentages based on one or two conversions.

## SEO boundaries

PostHog does not report search queries, ranking, indexing, crawl coverage, or reliable crawler traffic. Configure Google Search Console and Bing Webmaster Tools separately. Railway/server logs and an external uptime monitor remain the sources for HTTP failures, bots, SSR errors, and availability.

## Production verification

Before considering analytics active:

1. Verify no PostHog request is made in development, test, preview without a key, GPC, or DNT.
2. Inspect real `$pageview`, `$pageleave`, and `$web_vitals` payloads for query strings, fragments, PII, and precise geolocation.
3. Confirm the browser creates no PostHog cookies or storage entries.
4. Confirm `$ip` is absent from stored events.
5. Confirm country properties remain available.
6. Confirm one pageview per document navigation.
7. Confirm the production CSP reports no unexpected origins. Enforcing it requires a separate hash migration for Astro's inline island scripts; do not simply rename the header.
