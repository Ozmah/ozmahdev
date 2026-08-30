# Release checklist

## Before repository migration

- [ ] Manual desktop and mobile review completed.
- [ ] `/aperture` controls, keyboard navigation, drag/resize, clipboard, and download verified.
- [ ] Client navigation and avatar persistence show no visible flicker.
- [ ] `bun run glados` passes.
- [ ] Preview and production container smoke tests pass.
- [ ] Dependency audit reviewed.

## Repository migration

- [ ] Create a migration branch from the current `develop` branch.
- [ ] Tag or otherwise preserve the final TanStack revision.
- [ ] Keep `.git/`; replace only the working tree.
- [ ] Preserve the local `.env` file without copying it into the Astro staging directory.
- [ ] Preserve local `.opencode/` state without adding it to Git.
- [ ] Replace `.env.schema`, but preserve and never commit secret-bearing `.env` variants.
- [ ] Do not copy `node_modules/`, `.astro/`, `dist/`, or local editor state.
- [ ] Remove legacy `node_modules/`, `.output/`, and `.tanstack/` before reinstalling.
- [ ] Confirm the migrated Husky hooks and Greptile file map reference Astro paths.
- [ ] Review deletions before committing.
- [ ] Run the complete quality gate and both container smoke tests from the migrated repository.

## Railway staging

- [ ] Create an isolated staging environment/service.
- [ ] Deploy only the migration branch.
- [ ] Set `APP_ENV=preview` during build and runtime.
- [ ] Do not configure `PUBLIC_POSTHOG_KEY`.
- [ ] Attach only `staging.ozmah.dev`.
- [ ] Leave `ozmah.dev` and `www.ozmah.dev` untouched.
- [ ] Run `./scripts/verify-deployment.sh https://staging.ozmah.dev preview`.
- [ ] Verify responsive layout, accessibility, SEO metadata, Open Graph image, and browser console.
- [ ] Run Lighthouse; ignore the intentional crawlability failure caused by preview `noindex`.

## Production promotion

- [ ] Set `APP_ENV=production` during build and runtime.
- [ ] Configure the public PostHog project token only after staging QA.
- [ ] Confirm `robots.txt`, sitemap, canonicals, analytics privacy controls, and security headers.
- [ ] Run `./scripts/verify-deployment.sh https://ozmah.dev production`.
- [ ] Preserve the previous deployment for immediate rollback.
