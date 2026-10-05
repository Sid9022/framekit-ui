# Prompt for external LLMs

Use this when working with an assistant that can't read the repo itself (ChatGPT, Gemini web, Claude.ai chat, and so on).
Agents that *can* read the repo (Claude Code, Codex, Cursor, Copilot, Gemini CLI) should just read [AGENTS.md](../AGENTS.md).

## 1. Paste this prompt

Replace the last line with your task.

```text
You are helping me contribute to Framekit UI, an open-source React component library.

Repo: https://github.com/Sid9022/framekit-ui
Docs / live site: https://framekit-ui.vercel.app
Install: npx shadcn@latest add https://framekit-ui.vercel.app/r/<slug>.json

Stack: React 19, TypeScript, Tailwind CSS v4, motion (import from "motion/react"), lucide-react.
The local folder is often named forge-ui; the brand is Framekit.

I'm attaching: AGENTS.md, GUIDE.md, docs/COMPONENT_STANDARDS.md, docs/CHECKLIST.md, src/docs/registry.ts,
src/lib/cn.ts, src/lib/use-reduced-motion.ts, src/lib/use-resolved-theme.ts, 2–3 components from the target
category, and the skill file(s) premium-ui-motion-craft (plus others as relevant). Treat AGENTS.md and
COMPONENT_STANDARDS.md as binding.

Rules for every new component:
1. One self-contained file: src/components/ui/<slug>.tsx (kebab-case slug), main export PascalCase(slug).
   Local imports only from @/lib/* or registered @/components/ui/*.
2. Typed props with sensible defaults; renders with zero props. Keep existing slugs/exports/props stable; only add optional props.
3. Wire it fully: entry in src/docs/registry.ts (unique: true, isNew: true, gesture, dependencies, props table),
   demo in src/docs/demos.tsx, ?raw import + map entry in src/docs/sources.ts. New categories need DocCategory + NAV_ORDER updates.
4. Premium motion: springs, stagger (30–60ms), layout animation, scroll-linked effects. Import from "motion/react".
   Always branch on usePrefersReducedMotion() (don't rely on a global MotionConfig).
5. Light AND dark must look correct (class-based dark: variants; useResolvedTheme for canvas). WCAG AA contrast.
   Keyboard access, accessible names, 44px touch targets, aria-live for status changes. No horizontal page scroll at 390px.
6. Original work only: no copying other sites' code, copy, photos, logos, brand colours, or creator handles.
   Use generated SVG/CSS art; allow an items prop with optional src for real images.
7. No three.js. CSS 3D, SVG, or canvas 2D only.
8. Use helpers: cn from @/lib/cn, usePrefersReducedMotion from @/lib/use-reduced-motion, useResolvedTheme from @/lib/use-resolved-theme.
9. npm run check:wiring and npm run build must pass (prebuild runs registry:build). Test install with shadcn add from the built /r/<slug>.json.

Quality bar: outstanding UI/UX and motion, not generic. When unsure, match the reference components listed in
COMPONENT_STANDARDS.md.

Before writing code: state the one-sentence mood/metaphor, the slug, the props API, the state machine, and the
reduced-motion version. Then output the full component file and the exact additions for registry.ts, demos.tsx,
and sources.ts. Finish by walking through docs/CHECKLIST.md and flagging anything you couldn't verify.

My task for this session: [describe the component or category to add].
```

## 2. Attach these files

| Always | When relevant |
|--------|---------------|
| `AGENTS.md` | `src/lib/toggle.ts` (toggles), `src/lib/roving.ts` (tabs/radio groups) |
| `docs/COMPONENT_STANDARDS.md` | `src/lib/portfolio-art.tsx` (anything with images) |
| `docs/CHECKLIST.md` | `src/index.css` (theme tokens, dark variant) |
| `src/docs/registry.ts` | `docs/ARCHITECTURE.md` (registry/pipeline changes) |
| `src/lib/cn.ts`, `use-reduced-motion.ts`, `use-resolved-theme.ts` | `.claude/skills/accessibility-usability-review/SKILL.md` (complex widgets) |
| 2–3 sibling components (see the reference table) | `.claude/skills/interaction-feedback-patterns/SKILL.md` (stateful flows, forms) |
| `.claude/skills/premium-ui-motion-craft/SKILL.md` | `.claude/skills/visual-design-critique/SKILL.md` (review pass on a screenshot) |
| | `.claude/skills/design-system-foundations/SKILL.md` (tokens, new categories) |

`src/docs/demos.tsx` (about 2,200 lines) and `src/docs/sources.ts` are large. Instead of attaching them, tell the LLM they're
plain maps keyed by slug (GUIDE §5b/§5c shows the exact shape).

## 3. Compact motion checklist (if you can't attach the skill)

```text
Use this when building Framekit UI:
- Pick a one-sentence mood/metaphor first; every choice serves it
- Prefer spring motion over linear ease (UI: stiffness 260–520, damping 22–36)
- Timing ladder: micro 120–200ms, component 250–450ms, scene 600–1200ms; expo-out ease [0.16, 1, 0.3, 1]
- Stagger children 30–60ms; enter from where the element lives
- Hover: subtle scale/translate; press: scale 0.94–0.97
- Animate transform/opacity/filter only; use layout/FLIP for size changes
- Canvas: DPR ≤ 2, ResizeObserver, pause offscreen + on hidden tab, settle loops to rest
- Always provide a reduced-motion path (same final states, no loops/parallax/particles)
- Light and dark both polished (dark: variants, layered soft shadows in light, hairline rings in dark)
- Every state designed: hover, focus-visible, active, disabled, loading, empty, error, success
- Avoid gimmicks that hurt readability
```

## 4. After the LLM answers

Paste its output into the repo, then run `npm run check:wiring`, `npm run build`, and the browser checks in
[GUIDE §6](../GUIDE.md#6-verify-in-the-browser). External LLMs can't run code, so treat their "verified" claims as unverified.
