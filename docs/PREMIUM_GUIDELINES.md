# Premium Guidelines

The rules that make a Framekit component feel *finished*: quiet, precise, and tactile. This is a synthesis of
the [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)
([repo](https://github.com/vercel-labs/web-interface-guidelines)), v0's design-system guidance
([Design Systems 2.0](https://v0.app/docs/design-systems-2): build only with your real tokens and components), and Apple's
[Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) (Materials and Liquid Glass,
Typography, Motion, Layout, Color, Buttons), translated into Tailwind v4 + `motion/react` numbers.

It sits on top of [COMPONENT_STANDARDS.md](COMPONENT_STANDARDS.md) (API, a11y, performance) and the `premium-ui-motion-craft`
skill. Where numbers conflict, **motion numbers come from the skill and visual finish rules come from this file.**

> One sentence to remember: *content first, chrome recedes; every edge is a hairline, every shadow has two lights,
> every motion has a cause.*

---

## 1. Layout and spacing

| Rule | Value |
|------|-------|
| Grid | 4 px base, 8 px rhythm. Use `gap-2/3/4/6/8/12`, and avoid odd values like `gap-5` and `p-7` unless optically corrected |
| Card padding | `p-4` compact · `p-5`/`p-6` default · `p-8` hero cards. Keep padding ≥ the largest inner radius |
| Section rhythm | 48–96 px between sections (`py-12 sm:py-24`) |
| Measure | Body copy `max-w-[65ch]`. Display headlines `text-balance`, body `text-pretty` (no widows) |
| Alignment | Every element aligns to a grid line, baseline, or optical centre. Nudge ±1 px when perception beats geometry (play icons, chevrons) |
| Hierarchy | Most important content top-leading. Group with space first, containers second, separators last |
| Safe areas | Full-bleed fixed UI uses `env(safe-area-inset-*)` padding |
| Responsive | Check 390, 768, 1440 and ultra-wide. No horizontal page scroll at 390 px. Strips scroll inside their own container |

## 2. Type

- **Faces**: Geist for UI, Geist Mono for code and numbers that compare, Instrument Serif (`font-display`) only for editorial
  headlines. Two faces per component at most (HIG: minimise typefaces).
- **Scale** (px): 12 · 13 · 14 · 16 · 20 · 24 · 32 · 40 · 56 · 72. UI text is 14 (`text-sm`); captions 12–13; never below 11.
- **Weights**: 400 body, 500 labels and buttons, 600 titles. Avoid thin weights (HIG). Use bold sparingly so it keeps signal.
- **Tracking**: −0.02em to −0.04em on ≥ 32 px (`tracking-tight` / `tracking-[-0.03em]`); +0.04–0.12em on ALL-CAPS micro labels.
- **Leading**: 1.1 for display, 1.5–1.6 for body.
- **Numerals**: `tabular-nums` for anything that changes or is compared (timers, prices, counters, tables). Separate numbers and
  units with a non-breaking space: `10&nbsp;MB`, `⌘&nbsp;K`.
- **Typography details**: curly quotes “ ”, the ellipsis character `…`, `translate="no"` on code tokens and product names.
- **Inputs**: ≥ 16 px font on mobile so iOS doesn't zoom.

## 3. Colour and contrast

- Neutral zinc scale + **one** accent (Framekit `signal-*` lilac) + optional warm counter-accent (`framekit-*` orange) for CTAs.
- WCAG AA: 4.5:1 body, 3:1 large text, icons and UI boundaries. **Never `zinc-400` text on light.** APCA is a good sanity check.
- **Hover, active and focus increase contrast** relative to rest.
- **Hue consistency**: on tinted surfaces, tint borders, shadows and text toward the same hue (no grey shadows on a blue card).
- Don't rely on colour alone. Pair every status colour with a label or icon.
- Light mode isn't inverted dark mode. Light uses layered shadows; dark uses lighter surfaces for elevation, hairline rings,
  and inner highlights instead of shadows. Desaturate accents a step in dark.
- Use `color-scheme: dark` in dark scopes so native scrollbars and inputs match.

## 4. Edges: radii, hairlines, shadows

**Radii**: 6 (chips) · 10 (inputs, small buttons) · 14 (buttons, menus) · 20 (cards) · 28 (sheets, hero panels) · full (pills).
**Nested radii are concentric**: inner radius = outer radius − padding (e.g. a `rounded-[28px] p-2` shell holds `rounded-[20px]` children).

**Hairlines**: borders are 1 px and **semi-transparent**, so they sit correctly on any background.

```txt
light  ring-1 ring-black/[0.06]   or border-black/[0.08]
dark   ring-1 ring-white/[0.08]   or border-white/[0.10]
inner highlight (both): shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] light · [inset_0_1px_0_rgb(255_255_255/0.08)] dark
```

**Shadows**: always ≥ 2 layers, a tight contact shadow and a wide ambient one (Vercel "layered shadows"):

```txt
rest     shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)]
raised   shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-24px_rgb(24_24_27/0.35)]
overlay  shadow-[0_2px_6px_rgb(0_0_0/0.08),0_32px_80px_-32px_rgb(0_0_0/0.45)]
dark     drop most of the shadow; use ring-white/[0.08] + inner highlight + a slightly lighter surface (zinc-900 on zinc-950)
```

## 5. Materials (glass)

From HIG *Materials / Liquid Glass*:

- **Glass is for the functional layer** (toolbars, docks, tab bars, popovers, floating controls) that floats over content.
  **Don't put glass in the content layer.** Content cards use solid or standard material surfaces.
- **Use it sparingly**: one or two glass elements per view.
- **Regular glass** (default): blur + luminosity lift, legible over anything.
  `bg-white/70 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-black/[0.06]` ·
  dark `bg-zinc-900/60 ring-white/[0.08]`. Add an inner top highlight and a soft specular gradient.
- **Clear glass**: only over rich media (photos, video, gradients). `bg-white/15 backdrop-blur-md`, and add a 35% dark dimming layer
  when the content beneath is bright.
- Thicker (more opaque) material for small or fine text; thinner material to keep context.
- Text on glass uses high-contrast "vibrant" colours (zinc-950 / white at 90%+), never mid-greys.
- Respect `prefers-reduced-transparency`: fall back to an opaque surface (`bg-white dark:bg-zinc-900`).

## 6. Motion

HIG: *purposeful, brief, precise, cancelable, optional.* Vercel: *compositor-only, interruptible, never `transition: all`.*

| Use | Recipe |
|-----|--------|
| Hover colour or contrast | CSS `transition-[color,background-color,border-color,box-shadow] duration-150 ease-out` |
| Press | `whileTap={{ scale: 0.97 }}` (0.94 for small icon buttons), spring `stiffness 500–600, damping 30` |
| State swap (icon, label) | `AnimatePresence mode="popLayout"`, spring `420–520 / 30`, 4 px blur in/out |
| Popover, menu, sheet | spring `stiffness 380, damping 34`, scale from 0.96 at the trigger (`transform-origin` = trigger) |
| Shared highlight | `layoutId`, spring `460 / 36` |
| Scene entrances | 600–900 ms `ease: [0.16, 1, 0.3, 1]`, 40 ms stagger, 8–12 px rise |
| Ambient loops | 6–20 s, eased, phase-offset, low amplitude, paused offscreen. Autoplay over 5 s needs a pause control |

- **Never animate frequent interactions heavily** (HIG): typing, scrolling lists, and rows hovered constantly get colour-only feedback.
- Animate only `transform`, `opacity`, `filter` (small radii), and CSS variables. Anchor `transform-origin` where motion physically starts.
- SVG transforms go on `<g>` wrappers with `transform-box: fill-box`.
- **Reduced motion**: keep final states, swap movement for a 150 ms opacity cross-fade, drop loops, particles and parallax.

## 7. Interaction states

Every interactive element designs **rest, hover, focus-visible, active/pressed, disabled, loading, and selected**.

- **Focus**: a visible, unobscured ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600
  focus-visible:ring-offset-2 ring-offset-white dark:ring-signal-300 dark:ring-offset-zinc-950`. Use `:focus-within` on groups.
- **Targets**: ≥ 44×44 px on touch (`min-h-11` or `pointer-coarse:min-h-11`), ≥ 24 px hit area everywhere. Visual and hit targets match;
  expand small icons with padding, not with invisible overlays that eat clicks.
- **Press state is mandatory** (HIG Buttons). One or two prominent buttons per view; differentiate by style, not size.
- `touch-action: manipulation` on controls; set `-webkit-tap-highlight-color: transparent` and provide your own pressed state.
- **Loading buttons** keep their label and add a spinner. Show-delay ~150–300 ms and minimum visible time ~300–500 ms.
  Loading copy ends with `…` ("Saving…").
- **Destructive actions** confirm or offer Undo.
- **Gestures have alternatives**: every drag or swipe has a click and keyboard path.
- **No dead zones**: if it looks interactive, it is. Checkbox and label share one hit target.
- Tooltips: delay the first, then show peers instantly.
- Modals and drawers: `overscroll-behavior: contain`, focus trap, Esc closes, focus returns to the trigger.

## 8. Content and states

- **Design all states**: empty (with a next step), sparse, dense, loading (skeletons mirror final layout exactly), error
  (says how to fix it), success.
- Copy is active, specific and positive: "Save API key", not "Continue". Errors guide the exit.
- Numerals for counts ("8 deployments"), locale-aware dates and currency, consistent decimals.
- Status changes are announced: `role="status" aria-live="polite"`, errors with `role="alert"`.
- Icon-only buttons get `aria-label`; decorative layers get `aria-hidden`; animated text keeps an `sr-only` copy.
- Resilient to long content: `min-w-0`, `truncate`/`line-clamp`, `break-words`.

## 9. Imagery and art

- Generated SVG/CSS/canvas art only, with an optional `src` prop for real images. Reserve space (aspect-ratio) to avoid layout shift.
- Device frames, browser chrome and mockups are **generic**: no real logos, wordmarks or trademarked shapes.
- Gradients: add 2–4% grain or dithering to avoid banding on dark fades.

## 10. Ship check (premium)

- [ ] Squint: one focal point, and the chrome recedes.
- [ ] Every edge is a hairline at the right alpha for its theme; nested radii are concentric.
- [ ] Shadows have two layers in light; dark uses rings and highlights instead.
- [ ] Glass only on the functional layer, legible in both themes, with an opaque fallback under reduced transparency.
- [ ] `tabular-nums` on changing numbers, `…` and curly quotes in copy.
- [ ] Rest/hover/focus/press/disabled/loading all designed; press feedback ≤ 150 ms.
- [ ] Springs feel crisp (no wobble on UI), and reduced motion keeps the final state.
- [ ] 44 px targets, visible focus ring, AA contrast in light **and** dark, no horizontal scroll at 390 px.
