# Architecture

How Framekit UI is put together: the docs site, the shadcn registry pipeline, and the theme system.
Read this when you need to change anything beyond a single component.

## The big picture

```
                         ┌───────────────────────────── src/docs/registry.ts ─────────────────────────────┐
                         │ DocCategory union · DOCS[] (slug, title, description, category, props, …)       │
                         │ NAV_ORDER (sidebar order) · getNavGroups / getPrevNext / categorySlug           │
                         └──────────────┬───────────────────────────────────────────────┬──────────────────┘
                                        │                                               │
             docs site (Vite SPA)       │                                               │   shadcn registry
  ┌─────────────────────────────────────▼──────────┐                 ┌──────────────────▼──────────────────────┐
  │ DocsLayout (sidebar from getNavGroups)         │                 │ scripts/build-registry.mjs              │
  │ DocPage  ── demos[slug]   (src/docs/demos.tsx) │                 │  • transpiles registry.ts → DOCS        │
  │          ── sources[slug] (src/docs/sources.ts │                 │  • reads src/components/ui/<slug>.tsx   │
  │                            via ?raw imports)   │                 │  • npm deps  ← bare imports             │
  │          ── doc.props → PropsTable             │                 │  • @/lib/x   ← registry:lib item        │
  │ CategoryPage, LandingPage, CommandPalette (⌘K) │                 │  • signal-/framekit-/font-display used? │
  └────────────────────────────────────────────────┘                 │      → depends on framekit-theme        │
                                                                     │  → registry.json (committed)            │
            src/components/ui/<slug>.tsx  ◄──── single source ───────┤ shadcn build → public/r/<slug>.json     │
                                                                     └──────────────────┬──────────────────────┘
                                                                                        │ vercel (static)
                                                          https://framekit-ui.vercel.app/r/<slug>.json
                                                                                        │
                                                          npx shadcn@latest add …/r/<slug>.json
```

One component file feeds three consumers: the live preview (`demos.tsx` imports it), the Code tab (`sources.ts` imports
it as a raw string), and the CLI registry (`build-registry.mjs` reads it from disk). Because they all share one file,
**the file is the product**. Anything the component needs must be inside it or in `src/lib/`.

## The registry pipeline (`npm run registry:build`)

`scripts/build-registry.mjs`:

1. Transpiles `src/docs/registry.ts` with TypeScript and imports `DOCS`. Every entry except `Getting Started` is a component.
2. For each component, reads `src/components/ui/<slug>.tsx` and scans imports:
   - Bare specifiers become `dependencies` (`react` and `react-dom` are excluded). `motion/react` becomes `motion`.
   - `@/lib/<name>` becomes a `registryDependencies` URL for that lib item, and marks the lib as used.
   - `@/components/ui/<slug>` (registered slugs only) becomes a `registryDependencies` URL for that component.
   - **Any other local import throws.**
   - If the code mentions `signal-NNN`, `framekit-NNN`, `font-display`, or `framekit-scroll`, it gets a dependency on `framekit-theme`.
3. Emits `registry:lib` items only for the libs that are actually used. Titles and descriptions come from `libMeta` in the script,
   so a **new** helper in `src/lib/` should get a `libMeta` entry.
4. Emits the `framekit-theme` (`registry:theme`) item: the colour scales parsed from `@theme` in `src/index.css`, `--font-display`,
   and the `.framekit-scroll` scrollbar CSS.
5. Writes `registry.json`. Then `shadcn build ./registry.json -o ./public/r` inlines the file contents into one JSON per item.

`REGISTRY_BASE_URL` overrides the host used in `registryDependencies` (default `https://framekit-ui.vercel.app`). Use it
for local install tests, then rebuild without it before committing (see [GUIDE §7](../GUIDE.md#7-test-the-shadcn-install)).

Installed layout in a user's project (default shadcn aliases): `components/ui/<slug>.tsx`, `lib/cn.ts`,
`lib/use-reduced-motion.ts`, and so on, plus tokens merged into their CSS. Components therefore must import helpers as
`@/lib/<name>`, exactly.

## SEO: prerendered HTML, metadata and llms.txt

The site is a client-rendered SPA, so crawlers that don't run JavaScript (GPTBot, PerplexityBot, ClaudeBot…) would see an
empty `<div id="root">`. The build fixes that without SSR:

- `src/docs/seo.ts` is the single source for every route's title, description, canonical and JSON-LD
  (`routeSeo(pathname)`), plus `sitemapRoutes()`. It's pure data, imported by `<RouteHead>` in the browser and by the scripts below.
- `src/docs/faq.ts` holds the landing FAQ. The visible FAQ section and the `FAQPage` schema both read it, so they always match.
- Prebuild: `scripts/build-sitemap.mjs` → `public/sitemap.xml`; `scripts/build-llms.mjs` → `public/llms.txt` + `public/llms-full.txt`.
- Build (last step): `scripts/prerender.mjs` writes `dist/<path>/index.html` for every sitemap route: per-route `<head>` tags and
  JSON-LD, and a static content shell inside `#root` (H1, intro, install command, usage, props table, related links, FAQ).
  It also writes `dist/404.html` (noindex), which Vercel serves with a real 404 for unknown paths; the SPA still boots on it.
- The client keeps using `createRoot` (no hydration), which replaces the shell on first commit. With JS on, the shell is
  `visibility: hidden` (via `html[data-js]`) so users see exactly what they saw before.
- `vercel.json` has no SPA catch-all any more: real files win, `/docs` redirects to `/docs/introduction`, unknown paths 404.
  **A new client route needs a prerendered file** (add it to `sitemapRoutes()`), otherwise it will 404 on a hard load.
- Scripts load the TS modules with `scripts/lib/load-ts.mjs` (TypeScript transpile, no bundler), so keep `seo.ts`,
  `faq.ts`, `registry.ts` and `config/site.ts` free of DOM/React imports.

## The docs site

- **Entry**: `src/main.tsx` → `BrowserRouter` → `App.tsx` (ThemeProvider, `MotionConfig reducedMotion="user"`, ToastProvider,
  CommandPaletteProvider). Routes: `/` (landing), `/docs/:slug`, and `/docs/category/:category` (clean URLs, no `#`).
  `main.tsx` rewrites legacy `/#/docs/...` links to the clean path with `history.replaceState` before the router mounts.
- **Route effects** (`components/route-effects.tsx`): `<RouteHead />` sets `document.title`, meta description,
  `<link rel="canonical">`, `og:url` / `og:title` per route (noindex on not-found); `<ScrollManager />` scrolls to top
  (or to `#anchor`) on navigation and restores the saved position on Back/Forward. Pages must not set `document.title` themselves.
  `DocPage` and `CategoryPage` are lazy-loaded because they pull in every demo and raw source (about 2.7 MB).
- **Sidebar** (`layouts/DocsLayout.tsx`) = `getNavGroups()` = `NAV_ORDER` filtered to non-empty categories.
- **DocPage** (`pages/DocPage.tsx`):
  - Header badges: `isNew` → NEW, `unique` → Original, `ownBackground` → "Brings its own background".
  - Preview / Code tabs. The preview stage is a `.framekit-stage` div with a `light` or `dark` class from the
    **preview theme toggle** (`components/docs/preview-theme-toggle.tsx`, persisted in `localStorage['framekit-preview-theme']`,
    independent of the site theme). The ↻ Replay button remounts the demo via a `key`.
  - A `PreviewBoundary` error boundary plus `Suspense` wrap each demo.
  - `doc.gesture` is rendered under the stage.
  - The install block (`components/docs/install-block.tsx`) offers URL and `@framekit/<slug>` forms per package manager.
  - The usage import is derived from source: `export function|const PascalCase(slug)` is preferred, otherwise the first
    exported PascalCase name. **Name your main export PascalCase(slug).**
  - The props table comes from `doc.props`, and the dependencies list from `doc.dependencies`.
- **Landing page**: counts come from `componentDocs.length` (never hard-code numbers). The category grid shows the 10
  largest categories first.
- **Command palette** (⌘K) searches `DOCS`.
- **Analytics**: `@vercel/analytics` via `components/route-analytics.tsx` and copy tracking in the code blocks.

## Theme system

- **Tailwind v4, CSS-first**: `src/index.css` has `@import "tailwindcss"` and an `@theme` block. There is no `tailwind.config`.
- **Scoped dark mode**: a custom variant
  `@custom-variant dark (&:where(.dark, .dark *):not(:where(.light, .light *):not(:where(.light .dark, .light .dark *))));`
  makes `dark:` follow the **nearest** `.dark` / `.light` ancestor. This lets the preview stage force a theme inside
  either site theme. Components must therefore use `dark:` classes, never `@media (prefers-color-scheme)`.
- **JS and canvas colours**: `useResolvedTheme(ref, mode)` walks up from `ref` to find the nearest `.dark`/`.light` and
  re-resolves with a `MutationObserver` when classes change. Expose `theme?: ThemeMode` (`'auto' | 'light' | 'dark'`) on such components.
- **Tokens**:
  - `framekit-50…950`: orange (logo and legacy accent)
  - `signal-50…900`: muted lilac, the house accent; use it sparingly (focus rings use `signal-600` light / `signal-300` dark)
  - `font-display`: Instrument Serif (editorial headlines); `font-sans`: Geist; `font-mono`: Geist Mono
  - Motion tokens for the docs shell: `--ease-out-expo`, `--ease-standard`, `--duration-micro|component|scene`
  - Shell text tokens: `--fk-text-muted` / `--fk-text-subtle` (AA on both themes). Note that zinc-400 is **not** AA for light-mode text.
- **Initial theme**: an inline script in `index.html` applies `localStorage['framekit-theme']` or the OS preference before first paint.

## Hosting

Vercel static hosting (`vercel.json`): `/r/*` is served as JSON with CORS `*` and a 5-minute edge cache, `/assets/*` is cached
immutably, real files in `public/` (favicon, og.png, robots.txt, sitemap.xml, …) are served as-is, and every other path
(SPA fallback, excluding `/r/` and `/assets/`) rewrites to `index.html`. Vite's `base` is `/` so deep links load assets.
`public/r/`, `public/sitemap.xml` and `dist/` are gitignored and produced at build time (`prebuild`). `research/` holds internal
inspiration notes (gitignored, not published).

## Adding a shared helper to `src/lib/`

Only do this when two or more components genuinely need it. Then:

1. Create `src/lib/<name>.ts(x)` (kebab-case, no imports beyond `react`, `clsx`, `tailwind-merge`, or other `@/lib/*` files).
2. Add a `libMeta` entry (title and description) in `scripts/build-registry.mjs`.
3. If the Installation guide page should show it, add it to the "shared helpers" section of `pages/DocPage.tsx` and to `sources.ts`.

Keep helpers small and stable. Every installed component that imports one pulls it in, and changing a helper's API breaks users' copies.
