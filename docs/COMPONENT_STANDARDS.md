# Component Standards

The Framekit quality bar, distilled from the design skills in `.claude/skills/` and from the best components already in
the repo. Every rule here appears in existing code. When in doubt, open the reference component and copy its approach.

For the visual finish (spacing rhythm, type scale, radii, hairline borders, glass materials, layered shadows, interaction states, and
content states), follow [PREMIUM_GUIDELINES.md](PREMIUM_GUIDELINES.md), a synthesis of the Vercel Web Interface Guidelines and Apple HIG.

Contents: [Reference components](#reference-components) · [API](#1-api-conventions) · [Motion](#2-motion) ·
[Reduced motion](#3-reduced-motion) · [Theming](#4-light--dark) · [Accessibility](#5-accessibility) ·
[Responsive](#6-responsive--touch) · [Performance](#7-performance) · [Originality](#8-originality--content) ·
[Visual craft](#9-visual-craft)

---

## Reference components

These are the strongest components per category: full props, live regions, reduced motion, offscreen pausing, and theme awareness.
Read the one closest to your idea before you start.

| Category | Study these | What they teach |
|----------|-------------|-----------------|
| Hero | `split-flap-hero`, `ridgeline-horizon-hero` | Scene composition, `ownBackground`, autoplay with pause/next controls, canvas terrain with `theme` |
| Animated Backgrounds | `iron-filings-field`, `grain-gradient-field` | Canvas lifecycle (DPR, ResizeObserver, IntersectionObserver, visibilitychange), keyboard-equivalent buttons, live region (iron filings); motion-value pointer glow + CSS blobs + grain with no canvas (grain field) |
| Buttons | `loop-flight-send-button`, `shredder-delete-button`, `drop-in-cart-button` | Multi-stage state machines (idle → working → done/error), status announcements |
| Toggles | `theme-reveal-toggle`, `pull-cord-lamp-toggle` | `role="switch"`, `useToggleState`, View Transitions with a reduced-motion fallback |
| Text Animations | `tumble-letters`, `scroll-text-fill`, `charm-text` | Screen-reader text kept intact (`sr-only` full string + `aria-hidden` animated letters), scroll-linked springs |
| Loading | `snake-loader`, `liquid-charge-capsule`, `particle-morph-loader` | Game state machine (autopilot → play → paused → over) with keyboard/swipe/D-pad parity and derived live-region text; progress semantics; canvas particles; scripted demo states |
| Cards | `origami-unfold-card`, `lenticular-shift-card`, `fan-deck-carousel` | CSS 3D (`perspective`, `preserve-3d`), pointer tilt with decay, carousel keyboard nav |
| Navigation | `command-menu`, `island-section-nav`, `plucked-string-tabs` | Combobox/listbox ARIA, portal into theme scope, roving tabindex, physics drawn in SVG |
| Widgets | `seat-scale-pricing`, `polar-bloom-chart`, `glow-leaderboard-list` | Data realism, value announcements, layout animation |
| Voice Agent | `mesh-pill-orb`, `star-morph-buddy` | One smoothed `level` driving the visuals; a distinct motion language per state |
| Inputs / Forms | `tumbler-lock-otp`, `crystal-strength-password` | Form semantics, error/success feedback, live validation messages |
| Portfolio | `project-filter-gallery`, `bento-profile-board`, `copy-email-button`, `scatter-desk-collage` | Items with optional `src` + `PortfolioArt` fallback, `titleAs`/`headingAs`, layout-animated filtering, status announcements |
| 404 | `lens-reveal-404` | Full-scene playfulness that still reads as a clear error page |

Older or simpler entries (some Core, Toast, Shimmer, Sidebars, and Messaging items) predate this bar. **Don't treat them as
models.** `npm run check:wiring` warns about the ones that animate without a reduced-motion path.

---

## 1. API conventions

- **Named export `PascalCase(slug)`** plus an exported `type <Name>Props`. Optional sub-exports are fine (`DEFAULT_STRING_TABS`, item types).
- **Zero-config**: every prop optional, and defaults render a finished, realistic demo.
- `className?: string` on the root, merged last via `cn(base, conditional, className)`.
- **Stateful widgets support controlled + uncontrolled** use: `value` / `defaultValue` / `onValueChange` (or
  `checked`/`defaultChecked`/`onCheckedChange` for toggles, via `useToggleState` from `@/lib/toggle`).
- **Callbacks** for meaningful events: `onSelect`, `onComplete`, `onWordChange(word, index)`, and so on.
- **Content props**: `items?: Item[]` with stable `id`s; images as optional `src` + `alt`.
- **Theme-aware JS or canvas**: `theme?: ThemeMode` (`'auto'` default).
- **Scroll-linked**: `scrollContainer?: React.RefObject<HTMLElement | null>`.
- **Headings**: `titleAs?: 'h1' | 'h2' | 'h3'` when the component renders a heading.
- **Escape hatches** for heavy effects: `interactive?: boolean`, `autoPlay?: boolean`, `intensity` / `count` ranges (document clamps in JSDoc).
- **Backwards compatibility**: never rename or remove a slug, export, or prop. New props are optional, and their defaults keep old behaviour.
- **JSDoc** on the component (one evocative paragraph) and on every prop. The docs and registry reuse this language.
- **No global side effects**: clean up every listener, observer, timer, and rAF loop. If you lock `body` scroll, restore it.
  The docs Replay button remounts demos repeatedly, so leaks show up fast.

## 2. Motion

Source of truth: `premium-ui-motion-craft`. These are the numbers the repo actually uses:

| Use | Recipe |
|-----|--------|
| Press / tap | `whileTap={{ scale: 0.94–0.97 }}`, spring `stiffness 500–600, damping 22–28` |
| Icon / state swap | `AnimatePresence mode="wait"\|"popLayout"`, spring `stiffness 420–520, damping 22–30`, blur 4px in/out |
| Panels, menus, dialogs | spring `stiffness 320–420, damping 30–36`; enter from the trigger's direction |
| Shared highlight (tabs, pills) | `layoutId` + spring `stiffness 460, damping 36` |
| Scroll-linked | `useScroll` → `useSpring(progress, { stiffness 160, damping 30, mass 0.4 })` → `useTransform` |
| Pointer follow | `useSpring(motionValue, { stiffness 280, damping 18 })`, or a rAF lerp of 0.08–0.2 per frame with decay on leave |
| Scene / hero entrances | 600–1200 ms, `ease: [0.16, 1, 0.3, 1]` (the expo-out house curve) |
| Ambient loops | 6–20 s, eased, phase-offset so nothing syncs |

- **Timing ladder**: micro 120–200 ms · component 250–450 ms · scene 600–1200 ms.
- **Stagger** children by 30–60 ms (the docs shell uses 50 ms).
- Animate only `transform`, `opacity`, `filter` (sparingly), and CSS variables. Use `layout` or FLIP for size changes.
- Motion must *mean* something: enter/exit, state change, cause → effect, or hierarchy. Decorative motion stays slow and quiet.
- Every distinct state gets its own motion character, not just a speed change (see the voice-agent components).
- Physics is welcome (springs, damped waves, inertia), but clamp `dt` (`Math.min(0.05, dt)`) and settle to rest so loops can stop.

## 3. Reduced motion

`const reduced = usePrefersReducedMotion()` in **every** animated component. Don't rely on the docs site's
`MotionConfig`, because installed copies don't have it.

| Effect | Reduced version |
|--------|-----------------|
| Enter / exit transforms | `initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}`, so it becomes an opacity fade |
| `whileTap` / `whileHover` scale | `undefined` |
| Particles, bursts, confetti | don't render them |
| Ambient loops, parallax, tilt | static frame: draw once, no rAF |
| Scroll-linked reveals | final state (`useTransform(p, [a, b], reduced ? [1, 1] : [0.16, 1])`) |
| Typewriter / scramble / flip boards | show the final text immediately |
| CSS `animate-*` utilities | add `motion-reduce:animate-none` |
| Physics sims | snap to the settled state |

Keep layout and final states identical. Reduced motion must never hide information or remove a control.

## 4. Light + dark

- Use `dark:` variants for every colour decision. They follow the nearest `.dark`/`.light` ancestor (see ARCHITECTURE),
  so the docs preview can force either theme. Never use `prefers-color-scheme` media queries.
- **Canvas or inline-style colours**: `const resolved = useResolvedTheme(rootRef, theme)`. Mirror it into a ref
  (`darkRef.current = resolved === 'dark'`) so a running rAF loop reads the current theme without restarting.
- **Portals** (dialogs, menus, toasts): portal into `trigger.closest('.dark, .light') ?? document.body` so the theme
  scope survives (see `command-menu`).
- **Contrast (WCAG AA)**: 4.5:1 for body text, 3:1 for large text and UI boundaries/icons. Pairs that pass in this repo:
  - light: `zinc-950/900/800/700/600` on white or `zinc-50`; `zinc-500` only for large or secondary text ≥ 4.5:1 (check it). **Never `zinc-400` text on light.**
  - dark: `zinc-50/100/200/300/400` on `zinc-900/950`.
  - Tinted states: `rose-800` on `rose-50` / `rose-100` on `rose-950/50`; `emerald-900` on `emerald-50` / `emerald-100` on `emerald-950/60`.
- Light mode isn't "dark mode inverted". Give it soft layered shadows (`shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)]`)
  and hairline rings (`ring-1 ring-black/[0.06]`). Dark mode usually drops the shadows for `ring-white/[0.06–0.1]` and inner highlights.
- **Full-scene components** that paint their own backdrop set `ownBackground: true` + `backgroundNote` in the registry,
  and still adapt or expose `theme`.

## 5. Accessibility

Reference skill: `accessibility-usability-review` (WCAG 2.2).

- **Native first**: `<button type="button">`, `<a href>`, `<input>`, `<label>`. Use ARIA only when there's no native element.
- **Names**: every control has an accessible name (visible text, `aria-label`, or `sr-only` text). Icon-only buttons need `aria-label`.
- **Roles and states**:
  - toggles → `role="switch"` + `aria-checked`, or a `button` with `aria-pressed`
  - tabs → `tablist`/`tab`/`tabpanel` + `aria-selected`, `aria-controls`, roving `tabIndex`, arrows/Home/End (`handleTablistKeys` from `@/lib/roving`)
  - menus/disclosures → `aria-expanded`, `aria-controls`; dialogs → `role="dialog"` + `aria-modal` + label, Esc closes, focus moves in and **returns to the trigger**
  - comboboxes → `role="combobox"` + `aria-activedescendant` + `listbox`/`option`
  - progress → `role="progressbar"` + `aria-valuenow/min/max` (or a status message)
- **Live regions**: `<span role="status" aria-live="polite" className="sr-only">` holds the *result* of state changes
  ("Copied to clipboard", "Sent", "3 of 4 poles"). Keep it mounted, change its text, and leave it empty on first render. Use `role="alert"` only for errors.
- **Animated text**: put the full string in an `sr-only` node and mark the animated letters or words `aria-hidden` (see `scroll-text-fill`).
- **Decorative layers**: `aria-hidden` on canvases, particles, glows, and generated art. Real images get a meaningful `alt`.
- **Keyboard parity**: pointer-only interactions (drag, hover, strum, pole drop) need a keyboard or button alternative
  (see the Drop pole / Reset buttons in `iron-filings-field`).
- **Focus**: visible `focus-visible` ring that matches the design: `focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300`
  (offset when on a filled surface). Never remove outlines without replacing them.
- **Autoplay** longer than 5 s needs a pause control (WCAG 2.2.2). Nothing flashes more than 3 times per second.

## 6. Responsive + touch

- **No horizontal page scroll at 390 px.** Use `w-full max-w-*`, `min-w-0` on flex children, and `overflow-x-clip` on decorative overflow.
  Horizontal strips scroll *inside* their own container (`overflow-x-auto`, hidden scrollbar).
- **Touch targets ≥ 44 px**: `min-h-11 min-w-11`, or `pointer-coarse:min-h-11` to keep compact desktop density.
- Hover-only affordances need a tap or focus equivalent. Pointer effects use Pointer Events (`onPointerMove`), not mouse-only events.
- Type scales down: `text-[2.1rem] sm:text-[3.4rem]`, and so on.

## 7. Performance

Target 60 fps on a mid-range laptop.

Canvas skeleton (from `iron-filings-field`, trimmed):

```tsx
React.useEffect(() => {
  const canvas = canvasRef.current, root = rootRef.current
  if (!canvas || !root) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  let raf = 0, visible = true, last = 0
  const resize = () => {
    const r = root.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr)
    canvas.style.width = `${r.width}px`; canvas.style.height = `${r.height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  const frame = (dt: number) => { /* update + draw; read theme from darkRef.current */ }
  const loop = (now: number) => { const dt = Math.min(0.05, (now - last) / 1000); last = now; frame(dt); raf = requestAnimationFrame(loop) }
  const start = () => { if (!raf && visible && !document.hidden && !reduced) { last = performance.now(); raf = requestAnimationFrame(loop) } }
  const stop = () => { cancelAnimationFrame(raf); raf = 0 }
  resize(); frame(0)                                   // always paint one frame (this is the reduced-motion still)
  const ro = new ResizeObserver(() => { resize(); frame(0) }); ro.observe(root)
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop() }); io.observe(root)
  const vis = () => (document.hidden ? stop() : start()); document.addEventListener('visibilitychange', vis)
  start()
  return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis) }
}, [reduced /* + props that change the simulation */])
```

- Pointer state lives in refs, not React state. Don't re-render on every `pointermove`.
- Cap particle counts and clamp user-supplied counts. Avoid large `blur()` on moving elements. Use `will-change` only while animating.
- Let simulations **settle and stop** their loop (see `plucked-string-tabs` energy check), then wake on input.
- Memoize generated SVG paths (`useMemo`), and use `React.useId()` for SVG `<defs>` ids (several instances can share a page).
- No new npm dependencies without a strong reason. Every installer inherits them.

## 8. Originality + content

- **Original work only.** Don't copy other sites' or libraries' code, copy, photos, logos, brand colours, or creator handles.
  Take *principles* from references (layering, rhythm, metaphor), never assets.
- **Art**: generated SVG/CSS/canvas (`PortfolioArt` exists for project imagery). Never hot-link external images. Accept `src` for users' own.
- **Copy and data**: believable and specific ("Mara merged 'Faster cold starts'", "Next invoice on Nov 1 for 8 seats"),
  inclusive names, no lorem ipsum, no real people or companies.
- **Icons**: `lucide-react` or hand-drawn inline SVG.
- **No three.js / WebGL libraries**: use CSS 3D (`perspective`, `transform-style: preserve-3d`), SVG, or canvas 2D.
  Spheres come from radial/conic gradients plus a blurred bloom copy, and globes from rotating SVG meridians.

## 9. Visual craft

From `premium-ui-motion-craft` §1–2 and `visual-design-critique`:

- **One point of view** per component (a one-sentence mood and metaphor), and every choice serves it.
- **Restrained palette**: a zinc/stone neutral, one signature accent, and an optional warm counter-accent. Framekit's own accents are
  `signal-*` (lilac) and `framekit-*` (orange). Use them sparingly.
- **Depth from layers**: background field → mid → subject → chrome. Stack 2–3 soft shadows (contact + ambient), use 1px inner
  highlights (`inset 0 1px 0 rgb(255 255 255 / .08)`), and grain at 2–5% opacity.
- **One focal point** per view. Secondary elements are lower contrast, smaller, and slower.
- **Type**: `font-display` (Instrument Serif) for editorial headlines with tight tracking, Geist for UI, `tabular-nums` for changing numbers.
- 8 px spacing rhythm, generous whitespace, and alignment to a few strong edges.
- **Design every state**: hover, focus-visible, active, disabled, loading, empty, error, and success.

Then run the [premium ship check](PREMIUM_GUIDELINES.md#10-ship-check-premium).

**Squint test before shipping**: is the focal point obvious? Does anything feel floaty, jittery, or mechanically synced?
Is it at least as rich as the reference components? If not, add depth (layers, lighting, micro-interactions), not more elements.
