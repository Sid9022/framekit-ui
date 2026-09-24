# Forge UI

**Forge UI** is an open-source, copy-paste React component library with polished core primitives and original animated components. Built with Vite, React, TypeScript, Tailwind CSS, and Motion.

> Rename the product in one place: `src/config/site.ts` (`SITE.name`, links, tagline).

## Features

- Copy-paste ownership — components live in *your* repo
- Core UI: Button, Badge, Card, Input, Dialog, Tabs, Toast, and more
- Animated originals: Magnetic Button, Spotlight Card, Scramble Text, Magnify Dock, Pixel Reveal, Ink Ripple Grid, …
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

1. Install peers: `npm install motion clsx tailwind-merge lucide-react`
2. Copy `src/lib/cn.ts` into your project
3. Open a component page → **Code** tab → copy the file into `components/ui/`

CLI (`npx forge-ui add …`) is planned — marked coming soon in the Installation docs.

## Component list

**Core:** Button, Badge, Card, Input, Textarea, Switch, Checkbox, Tabs, Accordion, Dialog, Tooltip, Dropdown Menu, Toast, Avatar, Skeleton, Progress

**Animated / unique:** Magnetic Button, Spotlight Card, Scramble Text, Magnify Dock, Tilt Card, Aurora Background, Infinite Marquee, Number Ticker, Orbiting Icons, Border Beam, Morphing Text, Spark Button, Cursor Trail, Glass Card, Swipe Cards, Typewriter, Pixel Reveal, Elastic Slider, Breathing Dot, Ink Ripple Grid

## License

MIT © Forge UI contributors
