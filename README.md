# OzmahDev

This is my personal site.

A technical personal space: projects, notes, homelab work, games, experiments, and the visual system behind `ozmah.dev`.

## Stack

- TanStack Start
- TanStack Router
- TanStack Query
- React 19
- TypeScript
- Tailwind CSS v4
- Nitro
- Bun
- Biome

## Requirements

- Bun

## Install

```bash
bun install
```

## Development

```bash
bun run dev
```

Local server:

```txt
http://localhost:3000
```

## Quality gate

```bash
bun run glados
```

Runs:

1. Biome check
2. TypeScript check
3. Production build

## Useful scripts

```bash
bun run dev          # start dev server
bun run build        # production build
bun run check-types  # TypeScript only
bun run check        # Biome check with writes
bun run glados       # full validation gate
```

## Aperture

`/aperture` is the component lab.

It exists to test the design system before real pages depend on it: typography, palette, buttons, inputs, terminal frames, wordmarks, and layout behavior.

If a reusable component works on a page but fails in `/aperture`, the component is wrong.

## Notes

- Components are custom on purpose. Plans on adding shadcn and customize it.
- Global shell owns horizontal page padding.
- Page compositions own vertical rhythm.
- The visual system is intentionally personal, technical, and experimental.
- Code is MIT licensed. Third-party fonts, palettes, names, logos, and assets remain under their respective licenses.
