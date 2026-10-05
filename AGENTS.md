# AGENTS.md — Framekit UI

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, Gemini, ChatGPT…) working in this repo.
Humans: start at [GUIDE.md](GUIDE.md).

## What this repo is

**Framekit UI** is an open-source, copy-paste React component library and its docs site. Every component is also a
[shadcn registry](https://ui.shadcn.com/docs/registry) item. People install it with:

```bash
npx shadcn@latest add https://framekit-ui.vercel.app/r/<slug>.json
```

- Repo: https://github.com/Sid9022/framekit-ui · Live docs: https://framekit-ui.vercel.app
- Stack: React 19, TypeScript, Vite 8, Tailwind CSS v4, `motion` (import from `"motion/react"`), `lucide-react`
- The local folder is sometimes named `forge-ui`. The brand is **Framekit**. The product name lives only in `src/config/site.ts`.

## Commands

```bash
npm install
npm run dev            # http://localhost:5173 (HashRouter: /#/docs/<slug>)
npm run check:wiring   # every component has a file, demo, ?raw source, DOCS entry, and NAV_ORDER category
npm run build          # prebuild → registry:build, then tsc -b && vite build. MUST pass.
npm run lint           # oxlint
npm run preview        # serve dist/ on :4180
```

## Read before writing code

1. [README.md](README.md)
2. [`src/docs/registry.ts`](src/docs/registry.ts): `DocCategory`, `DocEntry`, `DOCS`, `NAV_ORDER`
3. 2–3 existing components in `src/components/ui/` from the **same category** you're adding to (find them by `category:` in `registry.ts`)
4. `src/lib/cn.ts`, `src/lib/use-reduced-motion.ts`, `src/lib/use-resolved-theme.ts` (plus `toggle.ts`, `roving.ts`, `portfolio-art.tsx` if relevant)
5. [docs/COMPONENT_STANDARDS.md](docs/COMPONENT_STANDARDS.md): the quality bar, with copyable patterns

Deeper context: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) explains how the docs site and registry pipeline fit together.

## Adding a component: the 4 touch points

| # | File | What to add |
|---|------|-------------|
| 1 | `src/components/ui/<slug>.tsx` | The component. One self-contained file, kebab-case slug, **named export = PascalCase(slug)** |
| 2 | `src/docs/registry.ts` | A `DOCS` entry under the right category comment: `unique: true, isNew: true`, `gesture`, `dependencies`, `props` |
| 3 | `src/docs/demos.tsx` | Import + entry in the `demos` map (or `portfolio2Demos` for Portfolio-kit items) keyed by slug |
| 4 | `src/docs/sources.ts` | `import xSrc from '../components/ui/<slug>.tsx?raw'` + `'<slug>': xSrc` in `sources` |

A new category also needs a member in the `DocCategory` union **and** in `NAV_ORDER`. Do **not** hand-edit `registry.json`
or `public/r/`. They're generated. Full walkthrough with templates: [GUIDE.md](GUIDE.md).

## Hard rules

1. **One self-contained file per component.** Local imports may only be `@/lib/<helper>` or `@/components/ui/<registered-slug>`.
   Anything else makes `scripts/build-registry.mjs` throw.
2. **Typed props with sensible defaults.** It must render with zero props and realistic demo content. Accept `className` and merge it with `cn()`.
   Never rename existing slugs or exports, and never remove or rename props. Only add **optional** props.
3. **Fully wired** (the 4 touch points). `npm run check:wiring` must report 0 errors.
4. **Premium motion.** Use springs, staggers (30–60 ms), layout animation, scroll-linked effects. Import from `"motion/react"`, never `framer-motion`.
   **Always** branch on `usePrefersReducedMotion()`: keep final states, drop loops and parallax, cross-fade instead of moving.
   Don't rely on the docs site's global `MotionConfig`. Installed copies don't get it.
5. **Light and dark both correct.** Use class-based `dark:` variants (the variant follows the nearest `.dark` / `.light` ancestor).
   Canvas and JS-drawn colours come from `useResolvedTheme(ref, theme)`. Meet WCAG AA contrast in both themes.
6. **Accessible.** Native elements first. Keyboard support (Tab, Enter/Space, arrows for lists/tabs, Esc to close). Accessible names, visible
   `focus-visible` rings, 44 px touch targets (`pointer-coarse:min-h-11` or `min-h-11`), and `aria-live="polite"` for status changes.
   Decorative layers get `aria-hidden`. No horizontal page scroll at **390 px** width.
7. **Original work only.** Don't copy other sites' code, copy, photos, logos, brand colours, or creator handles. Use generated SVG/CSS/canvas art.
   Accept an `items` prop with an optional `src` so users can supply real images.
8. **No three.js** (or any WebGL lib). Use CSS 3D (`perspective`, `preserve-3d`), SVG, or canvas 2D only.
9. **Use the helpers**: `cn` from `@/lib/cn`, `usePrefersReducedMotion` from `@/lib/use-reduced-motion`,
   `useResolvedTheme` from `@/lib/use-resolved-theme`.
10. **Ship check**: `npm run check:wiring` passes, `npm run build` passes, and you've test-installed from the built `/r/<slug>.json`
    (see [GUIDE.md §7](GUIDE.md#7-test-the-shadcn-install)).

Quality bar: outstanding UI/UX and motion, not generic. When unsure, match the best recent components, which are listed in
[docs/COMPONENT_STANDARDS.md](docs/COMPONENT_STANDARDS.md#reference-components). Finish with [docs/CHECKLIST.md](docs/CHECKLIST.md).

## Design skills

Five skill packs live in [`.claude/skills/`](.claude/skills). Claude Code loads them automatically. Other agents should read the
`SKILL.md` files directly:

| Skill | Use it for |
|-------|-----------|
| `premium-ui-motion-craft` | **Primary.** Point of view, layering, spring recipes, timing ladder, ship checklist. Its numbers win on conflicts. |
| `design-system-foundations` | Tokens, theming/dark mode, colour, type scale, spacing, naming |
| `interaction-feedback-patterns` | State machines, micro-interactions, loading/error/success feedback, forms, gestures, UX copy |
| `accessibility-usability-review` | WCAG 2.2 audit, keyboard/screen-reader passes, heuristic evaluation |
| `visual-design-critique` | Final critique pass on hierarchy, composition, typography, colour, affordance |

## Don'ts

- Don't add runtime dependencies beyond `motion`, `lucide-react`, `clsx`, and `tailwind-merge` without asking.
- Don't edit generated files (`registry.json`, `public/r/**`) or the `research/` folder (internal, gitignored).
- Don't add global CSS for a component. Keep styles in Tailwind classes or inline `style` inside the component file.
  The only shared CSS that ships is the `framekit-theme` registry item (the `signal-*` / `framekit-*` scales, `font-display`, and `.framekit-scroll`).
- Don't commit or push unless the maintainer asks.
