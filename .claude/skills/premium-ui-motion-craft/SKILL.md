---
name: premium-ui-motion-craft
description: >-
  Use this when designing or building frontend UI, landing pages, or component
  libraries (React/Tailwind/Motion) that must look premium, original, and
  motion-rich rather than generic.
---
# Premium UI & motion craft

A checklist and recipe for shipping frontend work that feels designed, not generated.

## 1. Before coding: pick a point of view
- Write one sentence on the mood (e.g. "calm midnight paper-cut space", "tactile chrome ops console"). Every choice below must serve it.
- Collect 2–3 references (user mood boards, Mobbin/Refero-style real products). Extract *principles* (layering, rhythm, palette), never copy assets, logos, or brand colors.
- Choose a restrained palette: 1 neutral scale (zinc/slate), 1 signature accent, 1 warm counter-accent for CTAs. Define them as tokens (CSS vars / Tailwind theme), not hard-coded hexes scattered in files.
- Pick type deliberately: one display face with character + one clean UI face. Use a real type scale (e.g. 12/14/16/20/28/40/64) and tight tracking on large display text.

## 2. Composition rules
- Depth comes from layers: background field, mid scenery, foreground subject, UI chrome. Give each layer its own blur, shadow, and parallax factor.
- Use generous whitespace and an 8px spacing grid. Align to a few strong edges.
- One focal point per view. Everything else is quieter (lower contrast, smaller, slower).
- Shadows: stack 2–3 soft shadows (tight contact + wide ambient) instead of one harsh one. Paper-cut looks = offset drop-shadow per layer.
- Surfaces: subtle gradients, 1px inner highlights (`inset 0 1px 0 rgb(255 255 255 / .08)`), noise/grain at 2–4% opacity for richness.

## 3. Motion system
- Motion must communicate: enter/exit, state change, cause and effect, hierarchy. Decorative ambient motion stays slow and low-amplitude.
- Springs over linear tweens for UI: e.g. `{ type: 'spring', stiffness: 260–420, damping: 24–32, mass: 0.6–1 }`. Ambient loops use long eased durations (6–20s) with offsets so nothing syncs.
- Timing ladder: micro (hover/press) 120–200ms, component (open/expand) 250–450ms, scene (page/hero) 600–1200ms.
- Stagger children 30–60ms. Enter from where the element "lives" (menu from its trigger, toast from its edge).
- Pointer-reactive effects: lerp toward the target each frame (factor 0.08–0.2), clamp extremes, and decay to rest when the pointer leaves.
- Parallax: factors like 0.02 / 0.05 / 0.1 per depth layer; never move text layers more than a few px.
- Animate only `transform`, `opacity`, `filter` (sparingly), and CSS variables. Avoid animating layout properties on large trees; use `layout` animations or FLIP when size must change.
- Canvas/SVG for many particles or waves; requestAnimationFrame loop with DPR-aware sizing, paused when offscreen (IntersectionObserver) or tab hidden.
- 3D without three.js: CSS `perspective` + `transform-style: preserve-3d`, radial/conic gradients for spheres (highlight, core, rim light, bloom via blurred duplicate), rotating SVG meridians for mesh globes.
- Voice/audio visuals: drive everything from one smoothed `level` value (0–1). Distinct states (idle, listening, thinking, speaking) each get their own motion language, not just a speed change.

## 4. Interaction & UX quality bar
- Every interactive element has hover, focus-visible, active/pressed, disabled, and loading states.
- Keyboard: tab order, arrow keys for lists/menus/trees, Enter/Space to activate, Esc to close. Visible focus rings that match the design.
- ARIA: correct roles (`navigation`, `menu`, `tree`, `switch`, `status`, `alert`), `aria-expanded`, `aria-current`, `aria-live` for toasts/transcripts.
- Respect `prefers-reduced-motion`: keep the layout and final states, drop loops/parallax, shorten transitions.
- Touch targets ≥ 40px; hover-only affordances need a tap equivalent.
- Content realism: use believable copy and data in demos (names, timestamps, counts), not lorem ipsum.
- Empty, loading (skeleton/shimmer), error, and success states are designed, not afterthoughts.

## 5. Component API hygiene
- Named export, typed props with sensible defaults, `className` passthrough merged via a `cn()` helper.
- Controlled + uncontrolled support for stateful widgets (`value`/`defaultValue`/`onValueChange`).
- No global side effects; clean up listeners, observers, and rAF loops on unmount.
- Keep dependencies minimal and copy-paste friendly.

## 6. Performance
- Target 60fps on a mid laptop: avoid huge blur radii on moving elements, cap particle counts, use `will-change` only while animating.
- Lazy-load heavy demos; memoize expensive SVG path generation.
- Check bundle impact after adding dependencies.

## 7. Review pass before shipping
1. Squint test: is the focal point obvious, is hierarchy clear?
2. Motion test: does anything feel floaty, jittery, or synced in an obviously mechanical way? Tune springs and offsets.
3. Dark + light, small + large viewport, keyboard-only, reduced motion.
4. Compare against the references: is it at least as rich in layering and detail? If not, add depth (layers, lighting, micro-interactions) rather than more elements.
5. Build passes, no console errors, then ship.
