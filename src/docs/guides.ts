/**
 * Long-form guides (/guides/<slug>). Each section opens with a plain paragraph that answers its heading on its own
 * (so it still makes sense when quoted out of context), then code or a table, then a short FAQ. Say each fact once.
 * Voice: the docs and component descriptions. Short, specific, no labels like "Short answer", no em dashes.
 *
 * Pure data (no DOM, no React) so the SAME content renders in three places:
 *  - the browser, via src/pages/GuidePage.tsx;
 *  - the prerendered static HTML (scripts/prerender.mjs) that crawlers and AI tools read;
 *  - llms.txt / llms-full.txt (scripts/build-llms.mjs).
 * Inline text uses a tiny markup: `code`, **bold** and [label](/path); see inlineParts().
 * Every claim here was checked against the codebase (registry.json, src/components/ui, docs/PREMIUM_GUIDELINES.md).
 */
import { SITE_URL_BASE } from './site-url'

export type Inline = string

export type GuideBlock =
  | { type: 'p'; text: Inline }
  | { type: 'list'; ordered?: boolean; items: Inline[] }
  | { type: 'steps'; items: { title: string; text: Inline; code?: { lang: string; code: string; label?: string } }[] }
  | { type: 'code'; lang: string; code: string; label?: string }
  /** A shadcn CLI command, shown with the docs' npm / pnpm / yarn / bun tabs. `shadcn` is everything after `shadcn@latest`. */
  | { type: 'command'; shadcn: string }
  /** An npm package install, shown with the same package-manager tabs. */
  | { type: 'install'; packages: string[] }
  /** `mono`: first column is code (styled like the props table's prop names). */
  | { type: 'table'; caption: string; head: string[]; rows: Inline[][]; mono?: boolean }
  | { type: 'note'; tone: 'tip' | 'warn'; text: Inline }
  | { type: 'examples'; title?: string; slugs: string[] }

export type GuideSection = {
  id: string
  title: string
  /** 1–3 sentences that answer the heading on their own (rendered as the section's first paragraph). */
  answer: Inline
  blocks: GuideBlock[]
}

export type Guide = {
  slug: string
  /** H1 on the page. */
  title: string
  /** Short label for nav, breadcrumbs and the sidebar. */
  navTitle: string
  /** <title> (≤ ~65 chars, without the site suffix). */
  seoTitle: string
  description: string
  /** Kicker on the OG image only. */
  eyebrow: string
  /** The lede under the H1: the whole guide in two or three sentences. */
  summary: Inline
  datePublished: string
  dateModified: string
  sections: GuideSection[]
  faq: { q: string; a: Inline }[]
  /** Component slugs linked as worked examples. */
  related: string[]
  /** schema.org HowTo for step-by-step guides. */
  howTo?: { name: string; totalTime: string; steps: { name: string; text: string }[] }
}

/* ── inline markup ───────────────────────────────────────────────────── */
export type InlinePart =
  | { kind: 'text'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'link'; text: string; href: string }

const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

export function inlineParts(s: Inline): InlinePart[] {
  const out: InlinePart[] = []
  let last = 0
  for (const m of s.matchAll(INLINE)) {
    if (m.index! > last) out.push({ kind: 'text', text: s.slice(last, m.index) })
    if (m[1] !== undefined) out.push({ kind: 'code', text: m[1] })
    else if (m[2] !== undefined) out.push({ kind: 'strong', text: m[2] })
    else out.push({ kind: 'link', text: m[3], href: m[4] })
    last = m.index! + m[0].length
  }
  if (last < s.length) out.push({ kind: 'text', text: s.slice(last) })
  return out
}

/** Plain text (markup stripped) for JSON-LD and meta. */
export function inlineText(s: Inline) {
  return inlineParts(s)
    .map((p) => p.text)
    .join('')
}

/* ── spring maths (drives the cheat-sheet table, so the numbers are computed, not typed) ── */
export type SpringMetrics = {
  /** Damping ratio ζ = c / (2√(k·m)). < 1 overshoots, 1 is critically damped. */
  zeta: number
  /** Motion / SwiftUI `bounce` = 1 − ζ (negative = overdamped). */
  bounce: number
  /** SwiftUI `response`: the undamped period 2π / √(k/m), in seconds. */
  response: number
  /** Peak overshoot as a fraction of the distance travelled. */
  overshoot: number
  /** Time until the value stays within 1 % of its target, in ms (numerical step response from rest). */
  settleMs: number
}

export function springMetrics(stiffness: number, damping: number, mass = 1): SpringMetrics {
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  const omega = Math.sqrt(stiffness / mass)
  const overshoot = zeta < 1 ? Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta)) : 0
  let x = 0
  let v = 0
  let t = 0
  let lastOut = 0
  const dt = 1 / 2000
  while (t < 4) {
    const a = (-stiffness * (x - 1) - damping * v) / mass
    v += a * dt
    x += v * dt
    t += dt
    if (Math.abs(x - 1) > 0.01) lastOut = t
  }
  return { zeta, bounce: 1 - zeta, response: (2 * Math.PI) / omega, overshoot, settleMs: Math.round((lastOut * 1000) / 10) * 10 }
}

/** CSS `linear()` approximation of a spring's step response (for CSS-only transitions). */
export function springToLinear(stiffness: number, damping: number, mass = 1, points = 24) {
  const { settleMs } = springMetrics(stiffness, damping, mass)
  const total = settleMs / 1000
  const dt = 1 / 4000
  let x = 0
  let v = 0
  const samples: number[] = []
  const step = total / (points - 1)
  let next = 0
  for (let t = 0; samples.length < points; t += dt) {
    if (t >= next - 1e-9) {
      samples.push(x)
      next += step
    }
    const a = (-stiffness * (x - 1) - damping * v) / mass
    v += a * dt
    x += v * dt
  }
  samples[samples.length - 1] = 1
  return { duration: settleMs, easing: `linear(${samples.map((s) => +s.toFixed(3)).join(', ')})` }
}

export type SpringPreset = {
  name: string
  stiffness: number
  damping: number
  mass: number
  use: string
  /** Framekit components that use exactly this spring (verified with grep). */
  examples: string[]
}

/** Framekit's recurring springs, taken from `transition={{ type: 'spring', … }}` in src/components/ui. */
export const SPRING_PRESETS: SpringPreset[] = [
  { name: 'Highlight', stiffness: 460, damping: 36, mass: 1, use: 'Shared `layoutId` pills, tab and segment indicators', examples: ['glass-segmented-control', 'glow-candle-card', 'sparkline-kpi-tile', 'onboarding-stepper'] },
  { name: 'Snappy', stiffness: 420, damping: 32, mass: 1, use: 'Icon and label swaps, list rows, menus', examples: ['command-menu', 'sortable-data-table', 'vibrancy-context-menu', 'word-cycle-text'] },
  { name: 'Press', stiffness: 600, damping: 30, mass: 1, use: 'Button press (`whileTap` scale 0.97), magnetic pulls', examples: ['magnetic-button', 'inset-settings-list'] },
  { name: 'Popover', stiffness: 380, damping: 34, mass: 1, use: 'Popovers, mega-menus, date pickers, modals', examples: ['glass-mega-navbar', 'date-range-picker', 'morph-button-modal', 'wallet-balance-card'] },
  { name: 'Card', stiffness: 380, damping: 30, mass: 1, use: 'Cards and chips that move or resize, stagger grids', examples: ['pricing-plans', 'spring-stagger-grid', 'cookie-consent', 'availability-badge'] },
  { name: 'Sheet', stiffness: 380, damping: 36, mass: 0.8, use: 'Drawers and bottom sheets, no bounce at the edge', examples: ['detent-sheet', 'deploy-timeline', 'file-tree-explorer'] },
  { name: 'Gentle', stiffness: 260, damping: 26, mass: 1, use: 'Large surfaces, hero parallax and tilt', examples: ['tilt-card', 'parallax-depth-stack', 'gradient-mesh-hero', 'curved-tile-wall'] },
  { name: 'Bouncy', stiffness: 500, damping: 18, mass: 1, use: 'Success ticks and confirmations only', examples: ['face-scan-pay-button', 'newsletter-signup', 'changelog-timeline'] },
  { name: 'Soft follow', stiffness: 120, damping: 14, mass: 1, use: 'Cursor glows, flip cards, ambient dials', examples: ['hologram-flip-card', 'now-playing-widget', 'polar-bloom-chart'] },
]

const pct = (n: number) => `${(n * 100).toFixed(n < 0.01 ? 1 : 0)}%`

function springTableRows(): Inline[][] {
  return SPRING_PRESETS.map((p) => {
    const m = springMetrics(p.stiffness, p.damping, p.mass)
    return [p.name, `${p.stiffness}`, `${p.damping}`, `${p.mass}`, m.zeta.toFixed(2), `${m.settleMs} ms`, m.overshoot < 0.001 ? 'none' : pct(m.overshoot), p.use]
  })
}

const SNAPPY_LINEAR = springToLinear(420, 32)
const U = SITE_URL_BASE

/* ── 1. install ──────────────────────────────────────────────────────── */
const install: Guide = {
  slug: 'install-animated-react-components-shadcn',
  title: 'Install animated components with the shadcn CLI',
  navTitle: 'Install with the shadcn CLI',
  seoTitle: 'Install Animated React Components with the shadcn CLI',
  description:
    'Add any Framekit UI component to a React 19 and Tailwind v4 project with one shadcn command. Requirements, the @framekit namespace, Next.js and fixes.',
  eyebrow: 'Guide · Installation',
  summary:
    'Every Framekit component installs with one command: `npx shadcn@latest add ' + U + '/r/<slug>.json`. You need React 19, Tailwind CSS v4.1+ and a shadcn `components.json`; the CLI copies the source into your repo and installs what it imports. On the Next.js App Router, add `"use client"` to the installed file.',
  datePublished: '2026-10-09',
  dateModified: '2026-10-10',
  sections: [
    {
      id: 'requirements',
      title: 'Requirements',
      answer:
        'A React 19 project on Tailwind CSS v4.1 or newer, with a shadcn `components.json` and an `@/*` import alias. The CLI installs everything else per component.',
      blocks: [
        {
          type: 'table',
          caption: 'Framekit UI requirements',
          head: ['Package', 'Version', 'Installed by'],
          mono: true,
          rows: [
            ['react, react-dom', '19.x', 'You'],
            ['tailwindcss', 'v4.1+', 'You'],
            ['motion', 'latest', 'shadcn CLI'],
            ['lucide-react', 'latest', 'shadcn CLI, for components with icons'],
            ['clsx, tailwind-merge', 'latest', 'shadcn CLI, for `lib/cn.ts`'],
          ],
        },
        { type: 'p', text: 'No `components.json` yet? Run `init` once:' },
        { type: 'command', shadcn: 'init' },
      ],
    },
    {
      id: 'install-by-url',
      title: 'Add a component',
      answer:
        'Run `npx shadcn@latest add ' + U + '/r/<slug>.json` from the project root. Every component page has the exact command, with tabs for npm, pnpm, yarn and bun.',
      blocks: [
        { type: 'p', text: 'For the [Glass App Dock](/docs/glass-app-dock):' },
        { type: 'command', shadcn: `add ${U}/r/glass-app-dock.json` },
        {
          type: 'p',
          text: 'That writes `components/ui/glass-app-dock.tsx` plus `lib/cn.ts` and `lib/use-reduced-motion.ts`, installs `motion` and `lucide-react`, and merges the Framekit theme tokens into your CSS.',
        },
        { type: 'p', text: 'Every component renders with zero props. The export is the slug in PascalCase:' },
        { type: 'code', lang: 'tsx', label: 'Import and render', code: "import { GlassAppDock } from '@/components/ui/glass-app-dock'\n\nexport function Footer() {\n  return <GlassAppDock />\n}" },
        {
          type: 'note',
          tone: 'tip',
          text: 'Headline components use `font-display` (Instrument Serif). Load it, or point `--font-display` at a font you already ship.',
        },
      ],
    },
    {
      id: 'framekit-namespace',
      title: 'Install by name',
      answer:
        'Register the `@framekit` namespace in `components.json` once, then install by name, several at a time if you like. It also unlocks `shadcn search` and `shadcn view` for the whole catalogue.',
      blocks: [
        { type: 'code', lang: 'json', label: 'components.json', code: `{\n  "registries": {\n    "@framekit": "${U}/r/{name}.json"\n  }\n}` },
        { type: 'command', shadcn: 'add @framekit/glass-app-dock @framekit/magnetic-button' },
        { type: 'code', lang: 'bash', label: 'Search and preview', code: 'npx shadcn@latest search @framekit -q dock\nnpx shadcn@latest view @framekit/magnetic-button' },
        { type: 'p', text: `The full index lives at [/r/registry.json](${U}/r/registry.json).` },
      ],
    },
    {
      id: 'nextjs',
      title: 'Next.js App Router',
      answer:
        'The components use hooks and browser APIs, and the files don’t ship a `"use client"` directive. Add it as the first line of each installed component, and Server Component pages can render it as usual.',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'components/ui/glass-app-dock.tsx', code: "'use client'\n\nimport * as React from 'react'\nimport { motion } from 'motion/react'\n// …rest of the file unchanged" },
        {
          type: 'p',
          text: 'Without it, `next build` fails on `lib/use-reduced-motion.ts`, the first hook it meets. Marking the component file is enough; what it imports becomes client code too.',
        },
      ],
    },
    {
      id: 'manual-install',
      title: 'Without the CLI',
      answer:
        'Install the packages, add the shared helpers and theme tokens, then paste the source from the component’s Code tab into `components/ui/<slug>.tsx`.',
      blocks: [
        { type: 'install', packages: ['motion', 'clsx', 'tailwind-merge', 'lucide-react'] },
        {
          type: 'p',
          text: 'Every component needs `lib/cn.ts`; animated ones also import `lib/use-reduced-motion.ts`. Both are on the [Installation](/docs/installation) page. The `@theme` tokens and the dark variant are on [Theming](/docs/theming).',
        },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      answer: 'Most failed installs come down to a missing `"use client"`, a missing `@/*` alias or a project still on Tailwind v3.',
      blocks: [
        {
          type: 'table',
          caption: 'Common install errors',
          head: ['Symptom', 'Fix'],
          rows: [
            ['“needs `useState`… only works in a Client Component”', 'Add `"use client"` to the component file.'],
            ['`Cannot find module \'@/lib/cn\'`', 'Add `"@/*"` to `paths` in `tsconfig.json` and your bundler.'],
            ['`bg-signal-600` renders nothing', 'Tokens weren’t merged. Check Tailwind v4.1+ and the CSS path in `components.json`, or paste them from [Theming](/docs/theming).'],
            ['The CLI asks to overwrite `button.tsx`', 'Core items share names with shadcn/ui. Pass `--path` to install elsewhere.'],
            ['`dark:` styles never switch', 'Use the class-based variant from [Theming](/docs/theming).'],
            ['Nothing animates', 'Reduce motion is on in your OS. That’s intended.'],
          ],
        },
      ],
    },
  ],
  faq: [
    { q: 'Is Framekit UI an npm package?', a: 'No. The CLI copies the source into your repo, so you own the file and can change anything.' },
    { q: 'Will it work with React 18 or Tailwind v3?', a: 'React 19 only; 18 isn’t tested. Tailwind v3 won’t work, because the classes and `@theme` tokens are v4 syntax.' },
    { q: 'Can I use it without TypeScript?', a: 'Yes. Set `"tsx": false` in `components.json` and the CLI converts each file to JavaScript.' },
    { q: 'How do I update a component later?', a: 'Run the same `add` command with `--diff` to see what changed, then `--overwrite` to take it. Commit first; local edits get replaced.' },
  ],
  related: ['glass-app-dock', 'magnetic-button', 'spotlight-command-palette', 'pricing-plans'],
  howTo: {
    name: 'Install a Framekit UI component with the shadcn CLI',
    totalTime: 'PT1M',
    steps: [
      { name: 'Initialise shadcn', text: 'In a React 19 and Tailwind CSS v4 project, run npx shadcn@latest init once to create components.json.' },
      { name: 'Add the component', text: `Run npx shadcn@latest add ${U}/r/<slug>.json, or npx shadcn@latest add @framekit/<slug> after registering the namespace.` },
      { name: 'Mark it as a Client Component in Next.js', text: 'On the Next.js App Router, add "use client" as the first line of the installed component file.' },
      { name: 'Import and render', text: "Import it with import { PascalCaseName } from '@/components/ui/<slug>' and render it. Every component works with zero props." },
    ],
  },
}

/* ── 2. springs ──────────────────────────────────────────────────────── */
const springs: Guide = {
  slug: 'apple-style-spring-animation-values',
  title: 'Spring animation values that feel like Apple’s',
  navTitle: 'Spring animation values',
  seoTitle: 'Apple-Style Spring Animation Values: Stiffness & Damping Cheat Sheet',
  description:
    'The nine spring presets behind Framekit UI with stiffness, damping, settle time and overshoot, plus SwiftUI conversion, easing curves and reduced motion.',
  eyebrow: 'Guide · Motion',
  summary:
    "Start with `{ type: 'spring', stiffness: 420, damping: 32 }`: it settles in about 300 ms with 2% overshoot. Go stiffer for small things, fully damped for sheets, softer for big surfaces, and save bounce for moments of delight.",
  datePublished: '2026-10-09',
  dateModified: '2026-10-10',
  sections: [
    {
      id: 'cheat-sheet',
      title: 'Presets',
      answer:
        'Springs that feel like Apple’s are fast and close to critically damped: a damping ratio of 0.75 to 1 settles in 200 to 400 ms with little visible overshoot. These are the nine springs Framekit reuses, with the numbers computed from the physics.',
      blocks: [
        {
          type: 'table',
          caption: 'Framekit spring presets for Motion. Settles = time until the value stays within 1% of its target.',
          head: ['Preset', 'Stiffness', 'Damping', 'Mass', 'Ratio', 'Settles', 'Overshoot', 'Use for'],
          rows: springTableRows(),
        },
        {
          type: 'p',
          text: 'Press looks bouncy at 0.61, but it only scales by 3%, so the overshoot is about 0.3% of the button. It reads as a snap.',
        },
        { type: 'code', lang: 'tsx', label: 'springs.ts', code: `export const SPRING = {\n${SPRING_PRESETS.map((p) => `  ${p.name.replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase()).replace(/^\w/, (c) => c.toLowerCase())}: { type: 'spring', stiffness: ${p.stiffness}, damping: ${p.damping}${p.mass !== 1 ? `, mass: ${p.mass}` : ''} },`).join('\n')}\n} as const\n\n// <motion.div layoutId="pill" transition={SPRING.highlight} />` },
        {
          type: 'p',
          text: 'See them in [Glass Segmented Control](/docs/glass-segmented-control) (Highlight), [Command Menu](/docs/command-menu) (Snappy), [Detent Sheet](/docs/detent-sheet) (Sheet) and [Face Scan Pay Button](/docs/face-scan-pay-button) (Bouncy).',
        },
      ],
    },
    {
      id: 'damping-ratio',
      title: 'Stiffness, damping and mass',
      answer:
        'Stiffness sets speed, damping removes energy and mass adds inertia. What you actually feel is the damping ratio, ζ = damping ÷ (2√(stiffness × mass)). Below 1 the value overshoots, at 1 it arrives as fast as it can without overshooting, and above 1 it creeps in.',
      blocks: [
        {
          type: 'p',
          text: 'Most UI sits between 0.8 and 0.95, sheets want 1, and anything under 0.5 is for celebrations. To go faster without changing the feel, raise stiffness and scale damping with √stiffness.',
        },
      ],
    },
    {
      id: 'swiftui',
      title: 'Converting from SwiftUI',
      answer:
        'SwiftUI uses `response` (the period in seconds) and `dampingFraction`. Convert with stiffness = (2π ÷ response)² × mass and damping = 4π × dampingFraction × mass ÷ response, or use Motion’s `visualDuration` with bounce = 1 − dampingFraction.',
      blocks: [
        { type: 'code', lang: 'ts', label: 'swiftui-to-motion.ts', code: "/** SwiftUI .spring(response:dampingFraction:) → Motion spring. */\nexport function fromSwiftUI(response: number, dampingFraction: number, mass = 1) {\n  const stiffness = Math.pow((2 * Math.PI) / response, 2) * mass\n  const damping = (4 * Math.PI * dampingFraction * mass) / response\n  return { type: 'spring' as const, stiffness, damping, mass }\n}\n\nfromSwiftUI(0.3, 0.85) // ≈ { stiffness: 439, damping: 35.6 }, close to Highlight" },
        { type: 'code', lang: 'tsx', label: 'The same idea in Motion', code: "<motion.div\n  animate={{ x: 120 }}\n  transition={{ type: 'spring', visualDuration: 0.3, bounce: 0.15 }}\n/>" },
        {
          type: 'p',
          text: 'Motion’s period is 1.2 × `visualDuration`, so that’s a 0.36 s response at ratio 0.85. Framekit’s presets run at 0.26 to 0.39 s, quicker than SwiftUI’s 0.5 s defaults.',
        },
      ],
    },
    {
      id: 'easing',
      title: 'Easing curves',
      answer:
        'When you can’t use a spring, use a strong ease-out. `cubic-bezier(0.16, 1, 0.3, 1)` is Framekit’s curve for entrances and `cubic-bezier(0.65, 0, 0.35, 1)` suits symmetric moves. If CSS needs the real spring shape, sample it into a `linear()` easing.',
      blocks: [
        {
          type: 'table',
          caption: 'Easing curves used in Framekit and the docs shell',
          head: ['Name', 'Curve', 'Duration', 'Use for'],
          rows: [
            ['Expo out', '`cubic-bezier(0.16, 1, 0.3, 1)`', '320 ms components, 600 to 900 ms scenes', 'Entrances and reveals'],
            ['Standard', '`cubic-bezier(0.2, 0, 0, 1)`', '160 to 320 ms', 'Shimmers, small tweens'],
            ['In-out cubic', '`cubic-bezier(0.65, 0, 0.35, 1)`', '400 to 800 ms', 'Symmetric moves, morphs, loops'],
            ['Hover', '`ease-out`', '150 ms', 'Colour, border and shadow only'],
          ],
        },
        { type: 'code', lang: 'css', label: `Snappy (420 / 32) as CSS linear(), ${SNAPPY_LINEAR.duration} ms`, code: `.menu {\n  transition: transform ${SNAPPY_LINEAR.duration}ms ${SNAPPY_LINEAR.easing};\n}` },
        {
          type: 'p',
          text: 'The docs shell keeps its timing in CSS variables: `--duration-micro: 160ms`, `--duration-component: 320ms` and `--duration-scene: 720ms`. Never use `transition: all`.',
        },
      ],
    },
    {
      id: 'reduced-motion',
      title: 'Reduced motion',
      answer:
        'Keep the final state and drop the movement: slides, scales and parallax become a 150 ms opacity fade, and loops stop. Check `prefers-reduced-motion` inside the component, because an app-level `MotionConfig` doesn’t travel with a copied file.',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'The pattern every Framekit component uses', code: "import { motion } from 'motion/react'\nimport { usePrefersReducedMotion } from '@/lib/use-reduced-motion'\n\nconst SNAPPY = { type: 'spring', stiffness: 420, damping: 32 } as const\n\nexport function Panel({ open }: { open: boolean }) {\n  const reduced = usePrefersReducedMotion()\n  return (\n    <motion.div\n      initial={false}\n      animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: reduced ? 0 : 8, scale: reduced ? 1 : 0.96 }}\n      transition={reduced ? { duration: 0.15 } : SNAPPY}\n    />\n  )\n}" },
        {
          type: 'p',
          text: '`<MotionConfig reducedMotion="user">` is still a good app-wide default: Motion skips transform and layout animations and keeps opacity. The [accessible motion checklist](/guides/accessible-motion-react-checklist) covers focus, keyboard and pause controls.',
        },
      ],
    },
  ],
  faq: [
        { q: 'Should I use a spring or an easing curve?', a: 'A spring for anything people can interrupt or drag, because it keeps velocity. A curve for entrances, colour and CSS-only effects.' },
    { q: 'Why does my spring wobble?', a: 'The damping ratio is too low. Raise damping or lower stiffness until damping ÷ (2√(stiffness × mass)) is at least 0.75.' },
    { q: 'What does Motion use if I don’t set any values?', a: 'Transforms default to stiffness 500, damping 25 (ratio 0.56, visibly bouncy). A bare `type: "spring"` gets 100 and 10. Set values explicitly.' },
  ],
  related: ['glass-segmented-control', 'magnetic-button', 'detent-sheet', 'spring-stagger-grid'],
}

/* ── 3. accessibility ────────────────────────────────────────────────── */
const a11y: Guide = {
  slug: 'accessible-motion-react-checklist',
  title: 'Accessible motion: a checklist for animated React components',
  navTitle: 'Accessible motion checklist',
  seoTitle: 'Accessible Motion in React: WCAG 2.2 Checklist for Animated UI',
  description:
    'A WCAG 2.2 checklist for animated React components: reduced motion and transparency, focus, keyboard, status messages, target size and pause controls.',
  eyebrow: 'Guide · Accessibility',
  summary:
    'Animation should never be the only way to see, reach or understand something. Honour reduced motion and transparency, show a focus ring, support the keyboard, announce status changes, use 44 px touch targets and let people pause loops. Each section shows the code Framekit uses.',
  datePublished: '2026-10-09',
  dateModified: '2026-10-10',
  sections: [
    {
      id: 'reduced-motion',
      title: 'Reduced motion',
      answer:
        'When `prefers-reduced-motion: reduce` matches, keep final states, swap movement for a short fade and stop loops, parallax and particles. Large motion can make people with vestibular disorders feel sick (WCAG 2.3.3).',
      blocks: [
        { type: 'p', text: 'Every animated Framekit component ships this hook as `lib/use-reduced-motion.ts`:' },
        { type: 'code', lang: 'ts', label: 'lib/use-reduced-motion.ts', code: "import { useEffect, useState } from 'react'\n\nexport function usePrefersReducedMotion() {\n  const [reduced, setReduced] = useState(false)\n  useEffect(() => {\n    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')\n    const update = () => setReduced(mq.matches)\n    update()\n    mq.addEventListener('change', update)\n    return () => mq.removeEventListener('change', update)\n  }, [])\n  return reduced\n}" },
        {
          type: 'p',
          text: 'Branch on it inside the component so copied files keep the behaviour. With it on, [Perspective Tunnel Carousel](/docs/perspective-tunnel-carousel) becomes a static scroll-snap row and [Infinite Marquee](/docs/infinite-marquee) wraps into a still grid. Chrome DevTools can emulate the setting from its Rendering panel.',
        },
      ],
    },
    {
      id: 'reduced-transparency',
      title: 'Reduced transparency',
      answer:
        'Glass lowers text contrast over busy backgrounds. When `prefers-reduced-transparency: reduce` matches, swap the translucent surface for an opaque one (WCAG 1.4.3 and 1.4.11).',
      blocks: [
        { type: 'p', text: 'From [Glass App Dock](/docs/glass-app-dock), using Tailwind v4’s arbitrary media variant:' },
        { type: 'code', lang: 'tsx', label: 'Opaque fallback for glass', code: '<div className="bg-white/60 backdrop-blur-2xl dark:bg-zinc-900/60\n  [@media(prefers-reduced-transparency:reduce)]:bg-white\n  [@media(prefers-reduced-transparency:reduce)]:dark:bg-zinc-900" />' },
        { type: 'note', tone: 'warn', text: 'Only Chromium browsers honour this query so far. Make the glass pass contrast on its own and treat the fallback as a bonus.' },
      ],
    },
    {
      id: 'focus-visible',
      title: 'Focus',
      answer:
        'Every control needs a visible ring on keyboard focus that sticky headers and animated layers can’t cover. Use `:focus-visible` with a 2 px ring at 3:1 contrast or better (WCAG 2.4.7 and 2.4.11).',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'Framekit’s focus ring', code: '<button className="rounded-full outline-none\n  focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2\n  ring-offset-white dark:ring-signal-300 dark:ring-offset-zinc-950">\n  Save\n</button>' },
        {
          type: 'p',
          text: 'Keep the ring out of `overflow: hidden` parents, which clip it, and give anchors under a sticky header a `scroll-margin-top`.',
        },
      ],
    },
    {
      id: 'keyboard',
      title: 'Keyboard',
      answer:
        'Anything a pointer can do must work from the keyboard, focus must never get stuck, and every drag needs a click or key alternative (WCAG 2.1.1, 2.1.2, 2.5.7). Start from native elements.',
      blocks: [
        {
          type: 'table',
          caption: 'Expected keys by pattern (WAI-ARIA Authoring Practices)',
          head: ['Pattern', 'Keys', 'Example'],
          rows: [
            ['Button, toggle', 'Enter or Space', '[Magnetic Button](/docs/magnetic-button)'],
            ['Tabs, segmented control', 'Arrows, Home, End; one Tab stop', '[Glass Segmented Control](/docs/glass-segmented-control)'],
            ['Menu, command palette', 'Up, Down, Enter; Esc closes and returns focus', '[Spotlight Command Palette](/docs/spotlight-command-palette)'],
            ['Modal dialog', 'Focus stays inside; Esc returns it to the trigger', '[Morph Button Modal](/docs/morph-button-modal)'],
            ['Swipe or drag', 'Buttons or arrow keys do the same thing', '[Swipe Cards](/docs/swipe-cards)'],
          ],
        },
        { type: 'p', text: 'Framekit’s tablists share one roving-focus handler. Simplified from `lib/roving.ts`:' },
        { type: 'code', lang: 'ts', label: 'lib/roving.ts (simplified)', code: "export function handleTablistKeys(e: React.KeyboardEvent<HTMLElement>) {\n  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role=\"tab\"]:not([disabled])'))\n  const i = items.indexOf(document.activeElement as HTMLElement)\n  let n = -1\n  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length\n  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + items.length) % items.length\n  else if (e.key === 'Home') n = 0\n  else if (e.key === 'End') n = items.length - 1\n  if (n < 0) return\n  e.preventDefault()\n  items[n].focus()\n  items[n].click()\n}" },
      ],
    },
    {
      id: 'live-regions',
      title: 'Status announcements',
      answer:
        'Put status text in a `role="status"` region that is already in the DOM, then change its text. Use `role="alert"` only for errors. Screen readers hear the change without focus moving (WCAG 4.1.3).',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'Announce what the animation shows', code: "<span role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" className=\"sr-only\">\n  {state === 'done' ? 'Ready' : state === 'error' ? 'Something went wrong' : 'Loading'}\n</span>\n\n{error && <p role=\"alert\">{error}</p>}" },
        {
          type: 'p',
          text: 'Announce the meaning (“Saved”), not the motion. Decorative layers get `aria-hidden`; animated text like scrambles keeps an `sr-only` copy.',
        },
      ],
    },
    {
      id: 'target-size',
      title: 'Target size',
      answer:
        'WCAG 2.2 asks for targets of at least 24 × 24 px (2.5.8). Framekit goes to 44 × 44 on touch screens, the size Apple recommends, with `pointer-coarse:min-h-11`, and stays compact with a mouse.',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'Compact on desktop, 44 px on touch', code: '<button className="h-8 px-3 text-xs pointer-coarse:min-h-11">Filter</button>' },
        { type: 'p', text: 'Grow small icons with padding, not invisible overlays, and don’t shrink a target mid-animation.' },
      ],
    },
    {
      id: 'pause-controls',
      title: 'Pause controls',
      answer:
        'Anything that starts on its own and runs for more than five seconds next to other content needs a pause control (WCAG 2.2.2). Marquees, carousels and ambient backgrounds all count. Pause them off-screen too.',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'A real toggle, plus automatic pausing', code: "const [paused, setPaused] = React.useState(false)\n\n<button type=\"button\" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>\n  {paused ? 'Play' : 'Pause'}\n</button>\n\n// Stop work nobody can see\nuseEffect(() => {\n  const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))\n  io.observe(ref.current!)\n  const onVis = () => setVisible(document.visibilityState === 'visible')\n  document.addEventListener('visibilitychange', onVis)\n  return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis) }\n}, [])" },
        {
          type: 'p',
          text: 'Also pause on hover and focus, never flash more than three times a second (2.3.1), and don’t autoplay with reduced motion on. [Infinite Marquee](/docs/infinite-marquee) does all three.',
        },
      ],
    },
    {
      id: 'checklist',
      title: 'The checklist',
      answer: 'Run these in both themes, at 390 px wide, with reduced motion on and off, using only a keyboard and then a screen reader.',
      blocks: [
        {
          type: 'table',
          caption: 'Accessible motion checklist (WCAG 2.2)',
          head: ['Check', 'WCAG 2.2', 'Level'],
          rows: [
            ['Reduced motion keeps final states, drops movement', '2.3.3', 'AAA'],
            ['Loops over 5 s can be paused, and pause off-screen', '2.2.2', 'A'],
            ['No more than 3 flashes a second', '2.3.1', 'A'],
            ['Glass has an opaque fallback; text passes 4.5:1', '1.4.3', 'AA'],
            ['3:1 focus ring, never hidden', '2.4.7, 2.4.11', 'AA'],
            ['Everything works from the keyboard, no traps', '2.1.1, 2.1.2', 'A'],
            ['Drags have a click or key alternative', '2.5.7', 'AA'],
            ['Status changes reach a live region', '4.1.3', 'AA'],
            ['Targets 24 px minimum, 44 px on touch', '2.5.8', 'AA'],
            ['Named controls; decorative layers `aria-hidden`', '4.1.2', 'A'],
          ],
        },
        {
          type: 'p',
          text: 'axe and Lighthouse catch only some of these, so do a keyboard pass and a VoiceOver or NVDA pass before you ship.',
        },
      ],
    },
  ],
  faq: [
    { q: 'Does WCAG require prefers-reduced-motion support?', a: 'Not at AA: 2.3.3 is AAA. But 2.2.2 (Level A) covers motion that plays on its own, and honouring the OS setting is the usual way to meet it.' },
    { q: 'Is MotionConfig reducedMotion="user" enough?', a: 'It’s a good start. It skips Motion’s transform and layout animations, but not loops, canvas or CSS animation.' },
    { q: 'What’s the minimum touch target size in WCAG 2.2?', a: '24 × 24 CSS pixels (2.5.8, AA), except inline links and well-spaced targets. Aim for 44 × 44 on touch.' },
  ],
  related: ['infinite-marquee', 'glass-segmented-control', 'cook-loading', 'morph-button-modal'],
}

export const GUIDES: Guide[] = [install, springs, a11y]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}

export const GUIDES_TITLE = 'Guides'
export const GUIDES_DESC =
  'Longer reads for the parts of Framekit UI that need more than a props table: installing with shadcn, spring values and accessible motion.'

/** shadcn / npm commands in their npm form (prerender, llms.txt, reading time). */
export const commandText = (b: Extract<GuideBlock, { type: 'command' | 'install' }>) =>
  b.type === 'command' ? `npx shadcn@latest ${b.shadcn}` : `npm install ${b.packages.join(' ')}`

/** Rough reading time from all visible text. */
export function readingMinutes(g: Guide) {
  const words = [g.summary, ...g.sections.flatMap((s) => [s.title, s.answer, ...s.blocks.map(blockText)]), ...g.faq.flatMap((f) => [f.q, f.a])]
    .join(' ')
    .split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

export function blockText(b: GuideBlock): string {
  switch (b.type) {
    case 'p':
    case 'note':
      return inlineText(b.text)
    case 'list':
      return b.items.map(inlineText).join(' ')
    case 'steps':
      return b.items.map((s) => `${s.title} ${inlineText(s.text)} ${s.code?.code ?? ''}`).join(' ')
    case 'code':
      return b.code
    case 'command':
    case 'install':
      return commandText(b)
    case 'table':
      return b.rows.flat().map(inlineText).join(' ')
    case 'examples':
      return ''
  }
}
