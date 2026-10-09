# Ship Checklist

Run through this before you call a component done or open a PR. Each item links back to the rule it checks.
Copy it into your PR description and tick the boxes.

## Wiring
- [ ] `src/components/ui/<slug>.tsx` exists, kebab-case slug, main export is `PascalCase(slug)`, `type <Name>Props` exported
- [ ] `src/docs/registry.ts` entry is in the right category, with `unique: true`, `isNew: true`, `gesture`, `dependencies`, and a full `props` table
- [ ] `src/docs/demos/<slug>.tsx` default-exports the demo, and it looks finished with realistic content (the Code tab source is automatic)
- [ ] New category? It's in both the `DocCategory` union and `NAV_ORDER`
- [ ] Imports are limited to `react`, `react-dom`, `motion/react`, `lucide-react`, `@/lib/*`, and registered `@/components/ui/*`, with no new npm deps
- [ ] `npm run check:wiring` reports 0 errors and no new warning for this slug

## API
- [ ] Renders with zero props; every prop is optional with a sensible default
- [ ] `className` is merged last with `cn()`
- [ ] Stateful widgets: controlled + uncontrolled (`value`/`defaultValue`/`onValueChange` or the toggle equivalents)
- [ ] Images: `items` with optional `src`/`alt`, plus a generated-art fallback
- [ ] Editing an existing component? Slug, export, and existing props are unchanged; new props only add behaviour
- [ ] All listeners, observers, timers, and rAF loops are cleaned up (spam the ↻ Replay button and watch the console)

## Motion ([standards §2–3](COMPONENT_STANDARDS.md#2-motion))
- [ ] Springs for UI motion; the timing ladder holds (micro 120–200 / component 250–450 / scene 600–1200 ms)
- [ ] Staggers are 30–60 ms, and elements enter from where they live
- [ ] Only transform, opacity, filter, and CSS variables are animated
- [ ] Nothing floaty, jittery, or mechanically synced
- [ ] `usePrefersReducedMotion()` branch: no loops, parallax, or particles, and the same final states (verified with DevTools emulation)

## Light / dark ([standards §4](COMPONENT_STANDARDS.md#4-light--dark))
- [ ] Looks deliberate in **both** preview themes, and in both site themes
- [ ] Every colour has a `dark:` counterpart; canvas uses `useResolvedTheme`; portals target the nearest `.dark/.light`
- [ ] Text meets 4.5:1 (large text and UI parts 3:1) in both themes; no `zinc-400` text on light

## Accessibility ([standards §5](COMPONENT_STANDARDS.md#5-accessibility))
- [ ] Fully operable by keyboard (Tab, Enter/Space, arrows where expected, Esc closes), focus returns to the trigger
- [ ] Visible `focus-visible` ring on every interactive element
- [ ] Every control has an accessible name; correct roles and states (`aria-pressed`/`checked`/`selected`/`expanded`)
- [ ] State changes are announced once via `role="status" aria-live="polite"` (errors via `role="alert"`)
- [ ] Decorative layers are `aria-hidden`; animated text has an intact `sr-only` copy
- [ ] Pointer-only gestures have a keyboard or button alternative; autoplay over 5 s can be paused

## Responsive & performance ([standards §6–7](COMPONENT_STANDARDS.md#6-responsive--touch))
- [ ] No horizontal page scroll at 390 px
- [ ] Touch targets are at least 44 px; hover effects have a tap/focus equivalent
- [ ] Canvas: DPR capped at 2, ResizeObserver, paused offscreen (IntersectionObserver) and on hidden tabs
- [ ] Smooth at 60 fps; loops settle and stop when idle

## Originality ([standards §8](COMPONENT_STANDARDS.md#8-originality--content))
- [ ] No copied code, copy, photos, logos, brand colours, or creator handles; no external image URLs
- [ ] No three.js or WebGL libraries
- [ ] Realistic, inclusive demo content (no lorem ipsum, no real people or brands)

## Build & install
- [ ] `npm run lint` is clean for the new file
- [ ] `npm run build` passes
- [ ] Test-installed from the local registry into a fresh Vite + Tailwind v4 app; `tsc -b` and `vite build` pass there ([GUIDE §7](../GUIDE.md#7-test-the-shadcn-install))
- [ ] `registry.json` was regenerated **without** `REGISTRY_BASE_URL` (no `localhost` URLs)

## Critique pass
- [ ] Ran the `visual-design-critique` lenses (hierarchy, composition, typography, colour, affordance) and fixed the top issues
- [ ] Squint test: the focal point is obvious, and it's at least as rich as the [reference components](COMPONENT_STANDARDS.md#reference-components)
