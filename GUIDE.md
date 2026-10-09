# Framekit UI — Contributor Guide

The complete path from a fresh clone to a merged component. It works for humans and for LLMs.
If you're an AI agent, read [AGENTS.md](AGENTS.md) first for the condensed rules.

**Contents**

1. [Setup](#1-setup)
2. [Orientation: where things live](#2-orientation-where-things-live)
3. [Plan the component](#3-plan-the-component)
4. [Write the component](#4-write-the-component)
5. [Wire it into the docs and registry](#5-wire-it-into-the-docs-and-registry)
6. [Verify in the browser](#6-verify-in-the-browser)
7. [Test the shadcn install](#7-test-the-shadcn-install)
8. [Open the PR](#8-open-the-pr)
9. [Troubleshooting](#9-troubleshooting)
10. [Using another LLM (ChatGPT, Gemini…)](#10-using-another-llm)

Companion docs: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) (how it works),
[docs/COMPONENT_STANDARDS.md](docs/COMPONENT_STANDARDS.md) (quality bar and patterns),
[docs/CHECKLIST.md](docs/CHECKLIST.md) (final gate), [docs/LLM_PROMPT.md](docs/LLM_PROMPT.md) (paste-ready prompt).

---

## 1. Setup

Requirements: **Node `^20.19` or `>=22.12`** (Vite 8's requirement; developed on Node 24) and npm.

```bash
git clone https://github.com/Sid9022/framekit-ui.git
cd framekit-ui
npm install
npm run dev            # → http://localhost:5173
```

For a repeatable checkout with the committed lockfile, use `npm ci` instead of `npm install`.
Check `node --version` first. Existing working installs do not need to be recreated for every contribution.
No global CLI or additional design-skill installation is required.

The site uses clean URLs (React Router `BrowserRouter`), so a component lives at `http://localhost:5173/docs/<slug>` and a
category at `/docs/category/<category-slug>`. Old `/#/docs/...` links are rewritten to the clean path on load. Link
internally with `<Link to="/docs/...">`, never with `#/` hrefs or plain `<a href>` (that reloads the page).

Useful scripts:

| Script | What it does |
|--------|--------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run check:wiring` | Fails if any component is missing its file, demo, `?raw` source, DOCS entry or NAV_ORDER category. Warns about animation without a reduced-motion path. |
| `npm run registry:build` | Regenerates `registry.json` from `src/docs/registry.ts`, then `shadcn build` emits `public/r/*.json` |
| `npm run sitemap:build` | Regenerates `public/sitemap.xml` (every docs and category URL) from `src/docs/registry.ts` |
| `npm run build` | `prebuild` (registry:build + sitemap:build), then `tsc -b && vite build`. **Must pass before a PR.** |
| `npm run lint` | oxlint (rules-of-hooks is an error) |
| `npm run preview` | Serves `dist/` on port 4180 |

> Windows note: the repo uses CRLF line endings on checkout (`core.autocrlf=true`). If you script edits, match
> `\r?\n`, not a bare `\n`.

---

## 2. Orientation: where things live

```
src/
  components/ui/<slug>.tsx   ← THE components (245+), one file each, the only thing users install
  lib/                       ← shared helpers shipped as registry:lib items
    cn.ts                       cn(): clsx + tailwind-merge
    use-reduced-motion.ts       usePrefersReducedMotion()
    use-resolved-theme.ts       useResolvedTheme(ref, 'auto'|'light'|'dark') for canvas/JS colours
    toggle.ts                   useToggleState() + ToggleBaseProps (controlled/uncontrolled switches)
    roving.ts                   handleTablistKeys(): arrow-key nav for tablists/radiogroups
    portfolio-art.tsx           PortfolioArt (generated SVG art), PortfolioProject type, SAMPLE_PROJECTS
  docs/
    registry.ts              ← DocCategory union, DOCS metadata, NAV_ORDER (sidebar order)
    demos/<slug>.tsx         ← live preview JSX, one lazy chunk per slug (helpers in demos/_shared/)
    demos.ts                 ← import.meta.glob loader: loadDemo(slug)
    sources.ts               ← lazy ?raw glob of components/ui/*.tsx: loadSource(slug) (Code tab, automatic)
    guides.ts                ← long-form /guides articles (pure data; rendered by pages/GuidePage.tsx + prerender)
  pages/ layouts/ components/docs/   ← the docs site shell (not shipped to users)
  index.css                  ← Tailwind v4 @theme tokens, custom dark variant, preview-stage styles
  config/site.ts             ← product name / links (single rename point)
scripts/
  build-registry.mjs         ← DOCS + sources → registry.json (shadcn schema)
  check-wiring.mjs           ← completeness + rules check
registry.json, public/r/     ← GENERATED, never hand-edit
.claude/skills/              ← design skill packs (see AGENTS.md)
```

How a component reaches users: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Categories** (from `NAV_ORDER`): Getting Started · Hero · Portfolio · Animated Backgrounds · Buttons · Toggles ·
Text Animations · Shimmer · Loading · 404 Animation · Toast · Vertical Scroll · Cards · Navigation · Sidebars ·
WhatsApp / Messaging · Notifications · Widgets · Voice Agent · Cursors · Search / Inputs · Inputs / Forms · Core.

To list a category's components:

```bash
rg -n "category: 'Buttons'" src/docs/registry.ts
```

---

## 3. Plan the component

Do this before writing any code. It's what separates a Framekit component from a generic one.

1. **Read 2–3 siblings** in the target category (see [reference components](docs/COMPONENT_STANDARDS.md#reference-components)).
   Note their prop names, demo framing, and how they handle `theme`, `reduced`, and status announcements.
2. **Write one sentence of mood and metaphor**, for example "tabs hanging from a taut string that vibrates when plucked" or
   "a mechanical departure board". The metaphor drives the motion. Search `registry.ts` to make sure the idea isn't already taken.
3. **Choose a slug.** kebab-case, descriptive, unique (`plucked-string-tabs`, not `tabs-2`). The export name is
   PascalCase(slug): `PluckedStringTabs`.
4. **Sketch the state machine**: idle → hover → pressed → loading → success/error, or whatever applies. Every state
   gets a visual *and* an accessible representation.
5. **Pick the rendering tech**: DOM + motion for most work; SVG for paths, rings, and morphs; canvas 2D for many
   particles or physics. **Never three.js.**
6. **Decide the reduced-motion version** up front: the same layout and final states, no loops or parallax, opacity cross-fades.

Use the `premium-ui-motion-craft` skill (`.claude/skills/premium-ui-motion-craft/SKILL.md`) for the point of view, timing
ladder, and spring values.

---

## 4. Write the component

Create `src/components/ui/<slug>.tsx`. This template compiles and passes the wiring check. It shows the house
conventions: named export, typed props with defaults, controlled + uncontrolled state, spring motion, reduced-motion
branches, `dark:` variants, a 44 px target, focus ring, and a polite live region.

```tsx
import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type LikeBurstButtonProps = {
  /** Controlled liked state. */
  liked?: boolean
  /** Uncontrolled initial state. */
  defaultLiked?: boolean
  onLikedChange?: (liked: boolean) => void
  /** Count shown next to the heart (the liked state adds 1). */
  count?: number
  /** Accessible name for the button. */
  label?: string
  className?: string
}

const RAYS = 8

/**
 * Like Burst Button — the heart pops on a spring, eight rays burst outward, and the
 * counter rolls to its new value. Announces the change through a polite live region.
 */
export function LikeBurstButton({
  liked: likedProp,
  defaultLiked = false,
  onLikedChange,
  count = 128,
  label = 'Like',
  className,
}: LikeBurstButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultLiked)
  const liked = likedProp ?? inner
  const [burst, setBurst] = React.useState(0)
  const total = count + (liked ? 1 : 0)

  const toggle = () => {
    const next = !liked
    if (likedProp === undefined) setInner(next)
    onLikedChange?.(next)
    if (next) setBurst((b) => b + 1)
  }

  return (
    <>
      <motion.button
        type="button"
        aria-pressed={liked}
        aria-label={label}
        onClick={toggle}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 520, damping: 28 }}
        className={cn(
          'relative inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-sm outline-none transition-colors duration-200',
          'focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
          liked
            ? 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-400/40 dark:bg-rose-950/50 dark:text-rose-100'
            : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500',
          className,
        )}
      >
        <span className="relative grid h-5 w-5 place-items-center">
          {!reduced && burst > 0 && (
            <span key={burst} aria-hidden className="pointer-events-none absolute inset-0">
              {Array.from({ length: RAYS }, (_, i) => {
                const a = (i / RAYS) * Math.PI * 2
                return (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 dark:bg-rose-400"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: Math.cos(a) * 18, y: Math.sin(a) * 18, opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.04 }}
                  />
                )
              })}
            </span>
          )}
          <motion.span
            key={liked ? 'on' : 'off'}
            initial={reduced ? false : { scale: liked ? 0.4 : 1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 14 }}
            className="grid"
          >
            <Heart aria-hidden className={cn('h-5 w-5', liked && 'fill-current')} />
          </motion.span>
        </span>
        <span className="relative inline-grid overflow-hidden tabular-nums [&>*]:col-start-1 [&>*]:row-start-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={total}
              initial={reduced ? { opacity: 0 } : { y: liked ? 12 : -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: liked ? -12 : 12, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            >
              {total}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
      <span role="status" aria-live="polite" className="sr-only">
        {burst > 0 || liked !== defaultLiked ? `${liked ? 'Liked' : 'Like removed'}. ${total} likes.` : ''}
      </span>
    </>
  )
}
```

Rules of thumb (the full list is in [COMPONENT_STANDARDS](docs/COMPONENT_STANDARDS.md)):

- **Only these imports**: `react`, `react-dom` (portals), `motion/react`, `lucide-react`, `@/lib/*`, and
  `@/components/ui/<registered-slug>`. Anything else local makes `build-registry.mjs` throw. Any new npm package
  becomes a dependency for every installer, so ask first.
- **Zero-prop render** must look finished, with realistic copy and data (names, times, counts), never lorem ipsum.
- **Images**: accept `items?: { …; src?: string; alt?: string }[]` and fall back to generated art
  (`PortfolioArt` from `@/lib/portfolio-art`, or your own SVG/CSS).
- **Scroll-linked** components accept `scrollContainer?: React.RefObject<HTMLElement | null>` so the docs preview
  (an inner scroll box) and users' layouts both work.
- **Headline components** that render an `<h1>`/`<h2>` accept `titleAs` / `headingAs` so users control the outline.
- **Brand tokens** (`signal-*` lilac, `framekit-*` orange, `font-display`) are fine to use. The registry automatically
  ships the `framekit-theme` item when it detects them.

---

## 5. Wire it into the docs and registry

### 5a. `src/docs/registry.ts`: the metadata

Add an entry under the matching `// <Category>` comment inside `DOCS`:

```ts
{ slug: 'like-burst-button', title: 'Like Burst Button', description: 'A like button whose heart pops on a spring while rays burst outward and the counter rolls.', category: 'Buttons', unique: true, isNew: true, dependencies: ['motion', 'lucide-react'], gesture: 'Click the heart — it pops, bursts and the count rolls.', props: [
  { name: 'liked', type: 'boolean', description: 'Controlled liked state.' },
  { name: 'defaultLiked', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
  { name: 'onLikedChange', type: '(liked: boolean) => void', description: 'Fires when the state flips.' },
  { name: 'count', type: 'number', default: '128', description: 'Base count; liking adds 1.' },
  { name: 'label', type: 'string', default: "'Like'", description: 'Accessible name.' },
] },
```

| Field | Notes |
|-------|-------|
| `slug` | Same as the filename. Becomes the URL, registry item name, and install target. **Never change it after release.** |
| `title` / `description` | `description` is reused as the registry description (shown by the CLI). Make it one vivid sentence about what *happens*. |
| `category` | Must be a `DocCategory` member. |
| `unique: true, isNew: true` | Required for new originals (they show the NEW badge). |
| `gesture` | Shown under the preview: tell people how to interact ("Drag the card…", "Scroll —…"). |
| `dependencies` | Display only (the registry detects real deps from imports). List npm packages: `['motion', 'lucide-react']`. |
| `props` | Props table. Group related props as `'ctaLabel / onCta'`, and wrap string defaults in quotes: `"'Like'"`. |
| `ownBackground` + `backgroundNote` | For full-scene components (heroes, backgrounds) that paint their own backdrop. |

**New category?** Add it to both the `DocCategory` union at the top **and** `NAV_ORDER` (its position sets the sidebar
order). `npm run check:wiring` fails if you forget `NAV_ORDER`.

### 5b. `src/docs/demos/<slug>.tsx`: the live preview

Create one file per component. `src/docs/demos.ts` finds it with `import.meta.glob`, so it becomes its own lazy chunk
and only loads on that docs page:

```tsx
// src/docs/demos/like-burst-button.tsx
import { LikeBurstButton } from '@/components/ui/like-burst-button'

const demo = <LikeBurstButton />
export default demo
```

If the demo needs state, scripted playback, or controls, write a small `function XDemo()` in the same file
(see `demos/particle-morph-loader.tsx`, `demos/glass-bubble-buddy.tsx`). Shared helpers live in `demos/_shared/`.
Scroll-driven components go inside `PfScrollFrame` (`demos/_shared/pf-scroll-frame.tsx`) so they have a scroll container:

```tsx
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function ScrollTextFillDemo() {
  return (
    <PfScrollFrame label="Scroll text fill preview (scrollable)" height={480}>
      {(ref) => <ScrollTextFill scrollContainer={ref} />}
    </PfScrollFrame>
  )
}
```

The preview stage is `min-h-[340px]`, centred, and wraps the demo in a `.light` or `.dark` class from the preview theme toggle.
Constrain wide demos with `className="max-w-3xl"` and so on.

### 5c. The Code tab: automatic

`src/docs/sources.ts` lazy-globs `src/components/ui/*.tsx` with `?raw`, so the Code tab picks up the new file with no wiring.

### 5d. Check it

```bash
npm run check:wiring    # must say 0 error(s)
```

---

## 6. Verify in the browser

Open `http://localhost:5173/docs/<slug>` and check each of these:

- **Both themes**: use the sun/moon toggle in the preview toolbar (it's independent of the site theme), then also flip
  the site theme. Text, borders, and focus rings must stay readable (AA).
- **Replay**: the ↻ button remounts the demo. Entry animations should replay cleanly with no leftover timers.
- **Keyboard only**: Tab in, operate with Enter/Space and arrows, and Esc closes anything that opens. Focus is always visible.
- **Reduced motion**: in Chrome DevTools, open Rendering → *Emulate CSS prefers-reduced-motion: reduce* and reload. Loops
  and parallax stop, and final states still render.
- **390 px wide**: DevTools device toolbar. Nothing should overflow horizontally (`document.documentElement.scrollWidth <= innerWidth`).
- **Touch**: targets are at least 44 px (`min-h-11`, or `pointer-coarse:min-h-11` to keep desktop density), and hover-only effects have a tap equivalent.
- **Console**: no errors or warnings, and no rAF loops left running after you navigate away.
- **Screen reader** (spot-check with NVDA or VoiceOver): the name, role, and state are announced, and status changes are spoken once.

> For agents driving a browser: if the page isn't being painted (a hidden pane or a background tab), CSS transitions
> can freeze, and `getComputedStyle` will report mid-transition colours. Set `el.style.transition = 'none'` before you
> measure.

---

## 7. Test the shadcn install

This step proves the component works outside this repo: deps resolve, `@/lib` helpers arrive, theme tokens are added, and
it type-checks in a strict project. (Verified on Windows with shadcn 4.x and Vite 8.)

**Terminal 1, in framekit-ui**: build the registry against your local server, then serve it:

```bash
# bash / zsh
REGISTRY_BASE_URL=http://localhost:5173 npm run registry:build
npm run dev
```

```powershell
# PowerShell
$env:REGISTRY_BASE_URL='http://localhost:5173'; npm run registry:build; Remove-Item Env:REGISTRY_BASE_URL
npm run dev
```

`curl http://localhost:5173/r/<slug>.json` should return the item, and its `registryDependencies` should point at `localhost`.

**Terminal 2: a throwaway app** (once; keep it outside the repo):

```bash
npm create vite@latest fk-install-test -- --template react-ts --no-interactive
cd fk-install-test
npm install
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node
```

- `vite.config.ts`: add `tailwindcss()` to `plugins` and `resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } }`
- `tsconfig.json` and `tsconfig.app.json`: add `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }` to `compilerOptions`
  (TypeScript 6 also needs `"ignoreDeprecations": "6.0"` in `tsconfig.app.json` for `baseUrl`)
- `src/index.css`: `@import "tailwindcss";`

```bash
npx shadcn@latest init -d
npx shadcn@latest add http://localhost:5173/r/<slug>.json -y
```

Render the component in `src/App.tsx`, then:

```bash
npx tsc -b
npx vite build
npm run dev
```

All three should pass, and the component should look like the docs preview.

**Afterwards, in framekit-ui, restore the production URLs:**

```bash
npm run registry:build
```

`registry.json` is committed, so never commit it with `localhost` URLs. (`npm run build` also regenerates it.)

---

## 8. Open the PR

1. Run through [docs/CHECKLIST.md](docs/CHECKLIST.md).
2. `npm run check:wiring && npm run build` (both green).
3. Commit only what you meant to change:
   - `src/components/ui/<slug>.tsx`
   - `src/docs/registry.ts`, `src/docs/demos/<slug>.tsx`
   - the regenerated `registry.json`
4. Branch name: `feat/<slug>`. Commit style follows history: `feat(<scope>): …`, `fix(<slug>): …`, `chore(registry): …`.
5. In the PR description, include what it is, the interaction, screenshots in light and dark (and a GIF if motion is the point), and the a11y notes
   (keyboard map, what's announced, and reduced-motion behaviour).

**Changing an existing component?** Keep the slug, export name, and existing props exactly. Only add **optional** props with
defaults that preserve the current behaviour. Users have copies in their repos, and docs links and the CLI depend on the slug.

---

## 9. Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `build-registry.mjs: unsupported local import "…"` | The component imports a local file that isn't `@/lib/<helper>` or a registered `@/components/ui/<slug>`. Inline it or move it into `src/lib/`. |
| `DOCS entries without a component file: x` | The registry.ts slug doesn't match the filename. |
| Preview says "No live preview for this entry." | Missing `demos` map entry (or the key is misspelled). `check:wiring` catches this. |
| Code tab says "// Source unavailable" | Missing `?raw` import or `sources` map entry. |
| Component isn't in the sidebar | The category isn't in `NAV_ORDER`. |
| `dark:` styles not applying | Something between the component and the `.dark` ancestor has class `light`, or you used `prefers-color-scheme` media queries instead of `dark:`. For canvas, use `useResolvedTheme`. |
| Works on the docs site but animates under reduced motion once installed | You relied on the site's `<MotionConfig reducedMotion="user">`. Branch on `usePrefersReducedMotion()` in the component. |
| `tsc` complains about `baseUrl` in the test app | Add `"ignoreDeprecations": "6.0"` (TypeScript 6). |
| Huge `DocPage` chunk warning in the build | Expected (every demo and source in one lazy chunk). Not your problem. |

---

## 10. Using another LLM

Paste the prompt from [docs/LLM_PROMPT.md](docs/LLM_PROMPT.md) and attach (or paste) the files it lists. Tools that read
repo files (Codex, Cursor, Copilot, Gemini CLI) pick up [AGENTS.md](AGENTS.md) automatically. Claude Code reads
[CLAUDE.md](CLAUDE.md) and auto-loads `.claude/skills/`. For other tools, paste the skill files from
`.claude/skills/*/SKILL.md` as needed (premium-ui-motion-craft first).

### A portable agent workflow

The five design packs are checked into `.claude/skills/`; their Markdown works with any agent that can read files.
An adjacent `framekit-skills-export/` is an optional shared copy, not a runtime dependency or a required machine-specific path.
Read `premium-ui-motion-craft` first, then `design-system-foundations` and `interaction-feedback-patterns` when designing;
use `accessibility-usability-review` and `visual-design-critique` before delivery. The premium pack owns conflicting motion numbers.

1. Read the repo instructions, inspect `git status --short`, and preserve existing work.
2. Read the registry, helpers, standards, and three siblings. Use `src/index.css` for theme facts rather than inventing tokens.
3. Describe the interaction states, public props, asset strategy, keyboard controls, and reduced-motion path.
4. Implement all four wiring points, then run wiring, lint, build, browser checks, and a separate install test.
5. Report actual results and any unverified checks. Do not commit, push, or publish without a maintainer request.

For a worked canvas integration example, see [Particle Mesh Gallery](docs/PARTICLE_MESH_GALLERY.md): image CORS,
generated fallbacks, reversible gestures, controlled state, and animation lifecycle considerations.
