# Framekit UI

**Framekit UI** is an open-source, copy-paste React component library with polished core primitives and original animated components. Built with Vite, React, TypeScript, Tailwind CSS, and Motion.

> Rename the product in one place: `src/config/site.ts` (`SITE.name`, links, tagline).

## Features

- Copy-paste ownership — components live in *your* repo (install via the shadcn CLI or by hand)
- Core UI: Button, Badge, Card, Input, Dialog, Tabs, Toast, and more
- Animated originals: Magnetic Button, Spotlight Card, Scramble Text, Magnify Dock, Pixel Reveal, Ink Ripple Grid, …
- **Portfolio kit** — 22 premium portfolio components (case-study scroll, project reveal list, filter gallery, lightbox, before/after slider, career timeline, impact stats, contact form, social dock, intro preloader, …), 2 full-page templates (Studio Folio, Dev Folio) and 6 new heroes (kinetic name, spotlight reveal, depth parallax, role morph, photo strip, terminal)
- **Portfolio kit II** — 22 more originals inspired by premium personal sites: bento profile board with live widgets, command menu, island section nav, sticky card stack, pinned horizontal project reel, scroll text fill, x-ray lens cursor, charm text, big-type footer, grain gradient field, theme reveal toggle, mini desktop OS + login gate intro, route chooser hero, discovery scene, scatter desk collage, kudos wall, book-spine shelf, mesh project cards, year activity grid, now-playing widget, world-clock globe — 245 components in total
- Live docs with Preview / Code tabs (source loaded via Vite `?raw`)
- Dark mode, command palette (`⌘K`), HashRouter static hosting

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site → dist/
npm run preview  # preview production build
```

## Using a component

### With the shadcn CLI (recommended)

Framekit UI is a [shadcn registry](https://ui.shadcn.com/docs/registry). In a React + Tailwind v4 project with a `components.json` (`npx shadcn@latest init`):

```bash
npx shadcn@latest add https://framekit-ui.vercel.app/r/loop-flight-send-button.json
```

Or register the namespace once in `components.json`:

```json
{
  "registries": {
    "@framekit": "https://framekit-ui.vercel.app/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @framekit/ghost-gobbler-skull
```

The CLI copies the component, its shared helpers (`lib/cn.ts`, `lib/use-reduced-motion.ts`, …), npm deps and theme tokens. Index: https://framekit-ui.vercel.app/r/registry.json

### Manually

1. Install peers: `npm install motion clsx tailwind-merge lucide-react`
2. Copy `src/lib/cn.ts` (and any other `src/lib/*` helper the component imports) into your project
3. Open a component page → **Code** tab → copy the file into `components/ui/`

### Registry build

`registry.json` is generated from `src/docs/registry.ts` + the sources by `scripts/build-registry.mjs`; `npm run registry:build` (run automatically as `prebuild`) emits `public/r/*.json` via `shadcn build`.

## Component list

**Core:** Button, Badge, Card, Input, Textarea, Switch, Checkbox, Tabs, Accordion, Dialog, Tooltip, Dropdown Menu, Toast, Avatar, Skeleton, Progress

**Animated / unique:** Magnetic Button, Spotlight Card, Scramble Text, Magnify Dock, Tilt Card, Aurora Background, Infinite Marquee, Number Ticker, Orbiting Icons, Border Beam, Morphing Text, Spark Button, Cursor Trail, Glass Card, Swipe Cards, Typewriter, Pixel Reveal, Elastic Slider, Breathing Dot, Ink Ripple Grid

## Contributing

New components are welcome. Start with **[GUIDE.md](GUIDE.md)** (setup → template → wiring → test install → PR).
AI coding agents read [AGENTS.md](AGENTS.md); quality bar in [docs/COMPONENT_STANDARDS.md](docs/COMPONENT_STANDARDS.md).

All five design skill packs are included in `.claude/skills/` and can be read by any coding agent—no private setup required.
See the [portable agent workflow](GUIDE.md#a-portable-agent-workflow) and the
[Particle Mesh Gallery integration example](docs/PARTICLE_MESH_GALLERY.md) for canvas assets, gestures, and controlled state.

## License

MIT © Framekit UI contributors
