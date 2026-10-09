/**
 * Long-form guides (/guides/<slug>), written to pass the "Island Test": every section opens with a 2–3 sentence
 * direct answer that still makes sense when quoted on its own, then steps / tables / code, then a short FAQ.
 *
 * Pure data (no DOM, no React) so the SAME content renders in three places:
 *  - the browser, via src/pages/GuidePage.tsx;
 *  - the prerendered static HTML (scripts/prerender.mjs) that crawlers and AI tools read;
 *  - llms.txt / llms-full.txt (scripts/build-llms.mjs).
 * Inline text uses a tiny markup: `code`, **bold** and [label](/path) — see inlineParts().
 * Every claim here was checked against the codebase (registry.json, src/components/ui, docs/PREMIUM_GUIDELINES.md).
 */
import { SITE_URL_BASE } from './site-url'

export type Inline = string

export type GuideBlock =
  | { type: 'p'; text: Inline }
  | { type: 'list'; ordered?: boolean; items: Inline[] }
  | { type: 'steps'; items: { title: string; text: Inline; code?: { lang: string; code: string; label?: string } }[] }
  | { type: 'code'; lang: string; code: string; label?: string }
  | { type: 'table'; caption: string; head: string[]; rows: Inline[][] }
  | { type: 'note'; tone: 'tip' | 'warn'; text: Inline }
  | { type: 'examples'; title?: string; slugs: string[] }

export type GuideSection = {
  id: string
  title: string
  /** 2–3 sentences that answer the heading on their own (the quotable "island"). */
  answer: Inline
  blocks: GuideBlock[]
}

export type Guide = {
  slug: string
  /** H1 on the page. */
  title: string
  /** Short label for nav and cards. */
  navTitle: string
  /** <title> (≤ ~65 chars, without the site suffix). */
  seoTitle: string
  description: string
  eyebrow: string
  /** One-paragraph TL;DR shown under the H1. */
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
  { name: 'Highlight', stiffness: 460, damping: 36, mass: 1, use: 'Shared `layoutId` pills, tab and segment indicators, chart cursors', examples: ['glass-segmented-control', 'glow-candle-card', 'sparkline-kpi-tile', 'onboarding-stepper'] },
  { name: 'Snappy', stiffness: 420, damping: 32, mass: 1, use: 'State swaps: icon/label changes, list rows, menus opening inside a surface', examples: ['command-menu', 'sortable-data-table', 'vibrancy-context-menu', 'word-cycle-text'] },
  { name: 'Press', stiffness: 600, damping: 30, mass: 1, use: 'Button press and release (`whileTap` scale 0.97), magnetic pulls', examples: ['magnetic-button', 'inset-settings-list'] },
  { name: 'Popover', stiffness: 380, damping: 34, mass: 1, use: 'Popovers, mega-menus, date pickers, modals scaling from the trigger', examples: ['glass-mega-navbar', 'date-range-picker', 'morph-button-modal', 'wallet-balance-card'] },
  { name: 'Card', stiffness: 380, damping: 30, mass: 1, use: 'Cards and chips that move or resize in a layout, stagger grids', examples: ['pricing-plans', 'spring-stagger-grid', 'cookie-consent', 'availability-badge'] },
  { name: 'Sheet', stiffness: 380, damping: 36, mass: 0.8, use: 'Drawers and bottom sheets: critically damped, no bounce at the edge', examples: ['detent-sheet', 'deploy-timeline', 'file-tree-explorer'] },
  { name: 'Gentle', stiffness: 260, damping: 26, mass: 1, use: 'Large surfaces, hero parallax and tilt that should feel heavy', examples: ['tilt-card', 'parallax-depth-stack', 'gradient-mesh-hero', 'curved-tile-wall'] },
  { name: 'Bouncy', stiffness: 500, damping: 18, mass: 1, use: 'Moments of delight only: success ticks, confirmations, badges popping in', examples: ['face-scan-pay-button', 'newsletter-signup', 'changelog-timeline'] },
  { name: 'Soft follow', stiffness: 120, damping: 14, mass: 1, use: 'Slow followers: cursor-tracked glows, flip cards, ambient dials', examples: ['hologram-flip-card', 'now-playing-widget', 'polar-bloom-chart'] },
]

const pct = (n: number) => `${(n * 100).toFixed(n < 0.01 ? 1 : 0)}%`

function springTableRows(): Inline[][] {
  return SPRING_PRESETS.map((p) => {
    const m = springMetrics(p.stiffness, p.damping, p.mass)
    return [
      `**${p.name}**`,
      `\`${p.stiffness}\``,
      `\`${p.damping}\``,
      `\`${p.mass}\``,
      m.zeta.toFixed(2),
      `~${m.settleMs} ms`,
      m.overshoot < 0.001 ? 'none' : pct(m.overshoot),
      p.use,
    ]
  })
}

const SNAPPY_LINEAR = springToLinear(420, 32)
const U = SITE_URL_BASE

/* ── 1. install ──────────────────────────────────────────────────────── */
const install: Guide = {
  slug: 'install-animated-react-components-shadcn',
  title: 'How to install animated React components with the shadcn CLI',
  navTitle: 'Install with the shadcn CLI',
  seoTitle: 'Install Animated React Components with the shadcn CLI',
  description:
    'Add any Framekit UI component to a React 19 + Tailwind v4 project with one shadcn command or the @framekit namespace. Requirements, Next.js notes and fixes.',
  eyebrow: 'Guide · Installation',
  summary:
    'Run `npx shadcn@latest add ' + U + '/r/<slug>.json` in a React 19 project that uses Tailwind CSS v4 and has a shadcn `components.json`. The CLI copies the component into `components/ui`, adds the small helpers it imports (`lib/cn.ts`, `lib/use-reduced-motion.ts`), installs `motion`, `lucide-react`, `clsx` and `tailwind-merge` as needed, and merges the Framekit colour tokens into your CSS. In the Next.js App Router, add `"use client"` to the top of the component file.',
  datePublished: '2026-10-09',
  dateModified: '2026-10-09',
  sections: [
    {
      id: 'requirements',
      title: 'What do you need before installing a Framekit component?',
      answer:
        'You need a React 19 project on **Tailwind CSS v4.1 or newer** with a shadcn `components.json` and an `@/*` import alias. Everything else (Motion, Lucide icons, the `cn` helper and the colour tokens) is installed by the shadcn CLI per component, so there is nothing to add by hand first.',
      blocks: [
        {
          type: 'table',
          caption: 'Framekit UI requirements',
          head: ['Requirement', 'Version', 'Who installs it', 'Why'],
          rows: [
            ['`react`, `react-dom`', '19.x (built on 19.2)', 'You', 'Components are written and tested against React 19.'],
            ['`tailwindcss`', 'v4.1+', 'You', 'Classes use v4 syntax such as `pointer-coarse:min-h-11` and `[@media(prefers-reduced-transparency:reduce)]:…`; tokens are v4 `@theme` variables.'],
            ['`components.json` + `@/*` alias', 'shadcn', 'You (`npx shadcn@latest init`)', 'Tells the CLI where `components/ui` and `lib` live.'],
            ['`motion`', 'latest', 'shadcn CLI', 'Springs, layout and gestures. Components import from `motion/react`.'],
            ['`lucide-react`', 'latest', 'shadcn CLI', 'Only for components that render icons.'],
            ['`clsx`, `tailwind-merge`', 'latest', 'shadcn CLI', 'Used by the shared `cn()` helper in `lib/cn.ts`.'],
          ],
        },
        {
          type: 'p',
          text: "No project yet? `npx shadcn@latest init` sets up `components.json` for Vite, Next.js, React Router and other React frameworks. If you already use shadcn/ui on Tailwind v4, you're ready.",
        },
      ],
    },
    {
      id: 'install-by-url',
      title: 'How do I install a component with its registry URL?',
      answer:
        'Copy the command from any component page and run it in your project root: `npx shadcn@latest add ' + U + '/r/<slug>.json`. The CLI writes the component to `components/ui/<slug>.tsx`, resolves its helper files and npm dependencies, and updates your global CSS with the tokens it uses.',
      blocks: [
        {
          type: 'steps',
          items: [
            { title: 'Initialise shadcn (once per project)', text: 'Skip this if your project already has a `components.json`.', code: { lang: 'bash', code: 'npx shadcn@latest init' } },
            {
              title: 'Add the component',
              text: 'Every Framekit docs page shows its exact command. For example, the [Glass App Dock](/docs/glass-app-dock):',
              code: { lang: 'bash', code: `npx shadcn@latest add ${U}/r/glass-app-dock.json` },
            },
            {
              title: 'Check what was written',
              text: 'For the dock the CLI creates `components/ui/glass-app-dock.tsx`, `lib/cn.ts` and `lib/use-reduced-motion.ts`, installs `motion`, `lucide-react`, `clsx` and `tailwind-merge`, and adds the `signal-*` / `framekit-*` colour tokens and `--font-display` to the CSS file named in `components.json`.',
            },
            {
              title: 'Import and render it',
              text: 'Every component renders with zero props and realistic demo content, so you can drop it in first and customise later. The import name is the PascalCase slug.',
              code: { lang: 'tsx', code: "import { GlassAppDock } from '@/components/ui/glass-app-dock'\n\nexport function Footer() {\n  return <GlassAppDock />\n}" },
            },
          ],
        },
        {
          type: 'table',
          caption: 'The same command for each package manager',
          head: ['Package manager', 'Command'],
          rows: [
            ['npm', `\`npx shadcn@latest add ${U}/r/<slug>.json\``],
            ['pnpm', `\`pnpm dlx shadcn@latest add ${U}/r/<slug>.json\``],
            ['yarn', `\`yarn dlx shadcn@latest add ${U}/r/<slug>.json\``],
            ['bun', `\`bunx --bun shadcn@latest add ${U}/r/<slug>.json\``],
          ],
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Headline components use `font-display` (Instrument Serif). The CLI reminds you after install: load the font (Google Fonts or `@fontsource/instrument-serif`) or point `--font-display` at a font you already use.',
        },
      ],
    },
    {
      id: 'framekit-namespace',
      title: 'How do I install by name with the @framekit namespace?',
      answer:
        'Add `"@framekit": "' + U + '/r/{name}.json"` under `registries` in `components.json`, then run `npx shadcn@latest add @framekit/<slug>`. The namespace also unlocks `shadcn search` and `shadcn view` for the whole Framekit catalogue.',
      blocks: [
        { type: 'code', lang: 'json', label: 'components.json', code: `{\n  "registries": {\n    "@framekit": "${U}/r/{name}.json"\n  }\n}` },
        { type: 'code', lang: 'bash', label: 'Install, search and preview by name', code: 'npx shadcn@latest add @framekit/glass-app-dock @framekit/magnetic-button\nnpx shadcn@latest search @framekit -q dock\nnpx shadcn@latest view @framekit/magnetic-button' },
        { type: 'p', text: `The full machine-readable index is at [/r/registry.json](${U}/r/registry.json). Each item lists its npm \`dependencies\` and \`registryDependencies\`, so the CLI always pulls the right helpers.` },
      ],
    },
    {
      id: 'nextjs',
      title: 'Do Framekit components work with the Next.js App Router?',
      answer:
        'Yes, but they are Client Components: they use React hooks and browser APIs, and the files do not ship a `"use client"` directive. Add `"use client"` as the first line of each installed component file (or render it from a file that already has it), and it works in Server Component pages.',
      blocks: [
        {
          type: 'p',
          text: 'Without the directive, `next build` stops with: *You\'re importing a component that needs `useState`. This React Hook only works in a Client Component.* The error points at `lib/use-reduced-motion.ts` because that is the first hook it meets. Marking the component file is enough, because everything it imports becomes client code too.',
        },
        { type: 'code', lang: 'tsx', label: 'components/ui/glass-app-dock.tsx', code: "'use client'\n\nimport * as React from 'react'\nimport { motion } from 'motion/react'\n// …rest of the file unchanged" },
        { type: 'code', lang: 'tsx', label: 'app/page.tsx (a Server Component)', code: "import { GlassAppDock } from '@/components/ui/glass-app-dock'\n\nexport default function Page() {\n  return (\n    <main>\n      <GlassAppDock />\n    </main>\n  )\n}" },
        { type: 'note', tone: 'tip', text: 'Vite, React Router, Remix SPA mode, Astro islands and other client-rendered setups need no directive.' },
      ],
    },
    {
      id: 'manual-install',
      title: 'Can I install a component without the CLI?',
      answer:
        'Yes. Install `motion clsx tailwind-merge lucide-react`, add the `cn` helper and any `@/lib/*` hook the component imports, enable class-based dark mode, then paste the source from the component page’s Code tab into `components/ui/<slug>.tsx`.',
      blocks: [
        {
          type: 'steps',
          items: [
            { title: 'Install the npm packages', text: 'All four are small; `lucide-react` is only needed for components with icons.', code: { lang: 'bash', code: 'npm install motion clsx tailwind-merge lucide-react' } },
            { title: 'Add the shared helpers', text: 'Copy `lib/cn.ts` (always) and `lib/use-reduced-motion.ts` (animated components) from the [installation page](/docs/installation). Canvas scenes also import `lib/use-resolved-theme.ts`.' },
            { title: 'Add the theme tokens', text: 'Paste the `@theme` block and the `@custom-variant dark` line from [Theming](/docs/theming) into your global CSS.' },
            { title: 'Paste the component', text: 'Open the component page, switch to **Code**, copy, and save as `components/ui/<slug>.tsx`.' },
          ],
        },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'How do I fix common install errors?',
      answer:
        'Almost every install problem is one of five things: a missing `"use client"` in Next.js, a missing `@/*` alias, Tailwind v3 instead of v4, a file name that already exists, or reduced motion being on in the OS. The table lists the symptom, the cause and the fix.',
      blocks: [
        {
          type: 'table',
          caption: 'Troubleshooting Framekit installs',
          head: ['Symptom', 'Cause', 'Fix'],
          rows: [
            ['Next.js: “needs `useState`… only works in a Client Component”', 'App Router renders files as Server Components by default.', 'Add `"use client"` to the top of the component file.'],
            ['`Cannot find module \'@/lib/cn\'`', 'No `@/*` path alias, or `components.json` aliases point elsewhere.', 'Add `"paths": { "@/*": ["./src/*"] }` (or `./*`) to `tsconfig.json` and the same alias to your bundler.'],
            ['Colours like `bg-signal-600` render as nothing', 'Tokens were not merged (Tailwind v3, or the wrong CSS path in `components.json`).', 'Upgrade to Tailwind v4.1+, fix `tailwind.css` in `components.json`, or paste the tokens from [Theming](/docs/theming).'],
            ['CLI asks to overwrite `button.tsx`, `card.tsx`…', 'Core items share names with shadcn/ui primitives.', 'Answer no and pass `--path` to install elsewhere, or `--overwrite` if you want Framekit’s version.'],
            ['Dark styles never switch', 'Your `dark:` variant is media-based or missing.', 'Use the class-based `@custom-variant dark` from [Theming](/docs/theming) and toggle a `dark` class on `<html>`.'],
            ['Animations do not play', 'Reduce motion is on in the OS; components keep the final state on purpose.', 'Expected behaviour. Turn the OS setting off to preview motion.'],
            ['`404` for `/r/<slug>.json`', 'Typo or renamed slug.', `Search with \`npx shadcn@latest search @framekit -q <word>\` or open [/r/registry.json](${U}/r/registry.json).`],
          ],
        },
      ],
    },
  ],
  faq: [
    { q: 'Is Framekit UI an npm package?', a: 'No. Like shadcn/ui, components are copied into your project as source files you own and can edit. The shadcn CLI only automates the copy and installs the few npm packages each component needs.' },
    { q: 'Does Framekit UI work with React 18?', a: 'It is built and tested on React 19 (19.2), and React 19 is the supported version. Many components may run on React 18, but that is not tested or supported.' },
    { q: 'Does it work with Tailwind CSS v3?', a: 'No. Components use Tailwind v4.1 syntax and v4 `@theme` tokens. Upgrade with the official Tailwind v4 upgrade tool first.' },
    { q: 'Do I need TypeScript?', a: 'Components are written in TypeScript (`.tsx`) with typed props. The shadcn CLI can convert them to JavaScript when `"tsx": false` is set in `components.json`.' },
    { q: 'How do I update a component later?', a: 'Run the same `add` command again; the CLI asks before overwriting. Use `npx shadcn@latest add <url> --diff` first to see what changed.' },
  ],
  related: ['glass-app-dock', 'magnetic-button', 'spotlight-command-palette', 'pricing-plans', 'perspective-tunnel-carousel'],
  howTo: {
    name: 'Install a Framekit UI component with the shadcn CLI',
    totalTime: 'PT1M',
    steps: [
      { name: 'Initialise shadcn', text: 'In a React 19 + Tailwind CSS v4 project, run npx shadcn@latest init once to create components.json.' },
      { name: 'Add the component', text: `Run npx shadcn@latest add ${U}/r/<slug>.json (or npx shadcn@latest add @framekit/<slug> after registering the namespace).` },
      { name: 'Mark it as a Client Component in Next.js', text: 'In the Next.js App Router, add "use client" as the first line of the installed component file.' },
      { name: 'Import and render', text: "Import it with import { PascalCaseName } from '@/components/ui/<slug>' and render it; every component works with zero props." },
    ],
  },
}

/* ── 2. springs ──────────────────────────────────────────────────────── */
const springs: Guide = {
  slug: 'apple-style-spring-animation-values',
  title: 'Apple-style spring animation values: a cheat sheet for React and Motion',
  navTitle: 'Spring animation values',
  seoTitle: 'Apple-Style Spring Animation Values: Stiffness & Damping Cheat Sheet',
  description:
    'Named spring presets (stiffness, damping, mass) with damping ratio, settle time and overshoot, taken from 300+ Framekit components. Plus SwiftUI conversion, easing equivalents and reduced-motion rules.',
  eyebrow: 'Guide · Motion',
  summary:
    'For UI that feels like Apple’s, use a spring with a damping ratio between about 0.75 and 1: `{ type: "spring", stiffness: 420, damping: 32 }` is a good default that settles in about 300 ms with roughly 2% overshoot. Go stiffer for small, frequent things (highlights, presses), fully damped for sheets and drawers, softer for large surfaces, and keep visible bounce (ratio below 0.5) for rare moments of delight. When the user prefers reduced motion, replace the movement with a 150 ms opacity cross-fade.',
  datePublished: '2026-10-09',
  dateModified: '2026-10-09',
  sections: [
    {
      id: 'cheat-sheet',
      title: 'What stiffness and damping values feel like Apple’s UI?',
      answer:
        'Apple-style UI springs are fast and nearly critically damped: a damping ratio of about 0.75–1.0 settles in 200–400 ms with little or no visible overshoot. The table lists the nine springs Framekit reuses across its components, with their damping ratio, settle time and overshoot computed from the physics.',
      blocks: [
        {
          type: 'table',
          caption: 'Framekit spring presets (Motion `type: "spring"`). Settle = time to stay within 1% of the target, from rest.',
          head: ['Preset', 'Stiffness', 'Damping', 'Mass', 'Damping ratio', 'Settles', 'Overshoot', 'Use it for'],
          rows: springTableRows(),
        },
        { type: 'note', tone: 'tip', text: '**Press** has the lowest ratio of the UI presets (0.61), but it only animates a 3% scale change, so a 9% overshoot of that is about 0.3% of the button’s size: you feel snap, not wobble. Overshoot always scales with the distance travelled.' },
        { type: 'code', lang: 'tsx', label: 'springs.ts', code: `export const SPRING = {\n${SPRING_PRESETS.map((p) => `  ${p.name.replace(/\s+(\w)/g, (_, c: string) => c.toUpperCase()).replace(/^\w/, (c) => c.toLowerCase())}: { type: 'spring', stiffness: ${p.stiffness}, damping: ${p.damping}${p.mass !== 1 ? `, mass: ${p.mass}` : ''} },`).join('\n')}\n} as const\n\n// <motion.div layoutId="pill" transition={SPRING.highlight} />` },
        { type: 'examples', title: 'See them in components', slugs: ['glass-segmented-control', 'command-menu', 'magnetic-button', 'glass-mega-navbar', 'pricing-plans', 'detent-sheet', 'tilt-card', 'face-scan-pay-button'] },
      ],
    },
    {
      id: 'damping-ratio',
      title: 'How do stiffness, damping and mass change the feel?',
      answer:
        'Stiffness sets speed, damping removes energy, and mass adds inertia. What you actually perceive is the damping ratio ζ = damping ÷ (2·√(stiffness·mass)): below 1 the value overshoots and bounces, at 1 it arrives as fast as possible without overshoot, and above 1 it creeps in.',
      blocks: [
        {
          type: 'table',
          caption: 'Reading a damping ratio',
          head: ['Damping ratio ζ', 'Motion `bounce`', 'Feels like', 'Use for'],
          rows: [
            ['1.0 or more', '0 (or below)', 'Settles without overshoot', 'Sheets, drawers, anything anchored to an edge'],
            ['0.8 – 0.95', '0.05 – 0.2', 'Crisp, “Apple-like”, a hint of life', 'Highlights, popovers, most UI'],
            ['0.65 – 0.8', '0.2 – 0.35', 'Lively, visible but small overshoot', 'Cards, presses, state swaps'],
            ['below 0.5', 'above 0.5', 'Bouncy, toy-like', 'Rare celebrations only, never navigation'],
          ],
        },
        {
          type: 'list',
          items: [
            'Raise **stiffness** to make it faster without changing the character (keep ζ constant by raising damping with √stiffness).',
            'Lower **mass** below 1 (Framekit uses 0.4–0.9 on small elements) to make light things react instantly.',
            'Springs are **interruptible**: a new target keeps the current velocity, which is why they beat fixed-duration tweens for gestures.',
          ],
        },
      ],
    },
    {
      id: 'swiftui',
      title: 'How do I convert SwiftUI spring values to Motion (Framer Motion)?',
      answer:
        'SwiftUI describes a spring by `response` (period in seconds) and `dampingFraction`; Motion uses stiffness and damping. Convert with stiffness = (2π ÷ response)² × mass and damping = 4π × dampingFraction × mass ÷ response, or skip the maths and use Motion’s `visualDuration` and `bounce`, where bounce = 1 − dampingFraction.',
      blocks: [
        { type: 'code', lang: 'ts', label: 'swiftui-to-motion.ts', code: "/** SwiftUI .spring(response:dampingFraction:) → Motion spring. */\nexport function fromSwiftUI(response: number, dampingFraction: number, mass = 1) {\n  const stiffness = Math.pow((2 * Math.PI) / response, 2) * mass\n  const damping = (4 * Math.PI * dampingFraction * mass) / response\n  return { type: 'spring' as const, stiffness, damping, mass }\n}\n\nfromSwiftUI(0.3, 0.85) // ≈ { stiffness: 439, damping: 35.6 }, close to Framekit's “Highlight”" },
        { type: 'code', lang: 'tsx', label: 'Or describe it the SwiftUI way', code: "<motion.div\n  animate={{ x: 120 }}\n  transition={{ type: 'spring', visualDuration: 0.3, bounce: 0.15 }}\n/>" },
        { type: 'p', text: 'Motion turns `visualDuration` into a spring whose period (SwiftUI’s `response`) is 1.2 × `visualDuration`, with damping ratio 1 − `bounce`. So `visualDuration: 0.3, bounce: 0.15` is a spring with response 0.36 s and ratio 0.85.' },
        { type: 'p', text: 'SwiftUI’s built-in `.smooth`, `.snappy` and `.bouncy` springs share a 0.5 s duration and differ only in bounce (0, about 0.15 and about 0.3). Framekit’s UI presets are faster (response 0.26–0.39 s, all except Soft follow) because web UI elements travel shorter distances.' },
      ],
    },
    {
      id: 'easing',
      title: 'What easing curves match these springs when I can’t use a spring?',
      answer:
        'For CSS transitions and fixed-duration tweens, use a strong ease-out: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances (Framekit’s most-used curve) and `cubic-bezier(0.65, 0, 0.35, 1)` for symmetric moves. When you need the real spring shape in CSS, generate a `linear()` easing from the spring curve.',
      blocks: [
        {
          type: 'table',
          caption: 'Easing curves used in Framekit components and the docs shell',
          head: ['Name', 'Curve', 'Duration', 'Use for'],
          rows: [
            ['Expo out (`--ease-out-expo`)', '`cubic-bezier(0.16, 1, 0.3, 1)`', '600–900 ms scenes, 320 ms components', 'Entrances, reveals, scroll-in content'],
            ['Quint out', '`cubic-bezier(0.22, 1, 0.36, 1)`', '300–600 ms', 'Softer entrances, number tickers'],
            ['Standard (`--ease-standard`)', '`cubic-bezier(0.2, 0, 0, 1)`', '160–320 ms', 'Shimmers, small UI tweens'],
            ['In-out cubic', '`cubic-bezier(0.65, 0, 0.35, 1)`', '400–800 ms', 'Symmetric moves, morphs, loops'],
            ['Hover colour', '`ease-out`', '150 ms', 'Colour, background, border and shadow only'],
          ],
        },
        { type: 'code', lang: 'css', label: `CSS linear() approximation of “Snappy” (420 / 32), ${SNAPPY_LINEAR.duration} ms`, code: `.menu {\n  transition: transform ${SNAPPY_LINEAR.duration}ms ${SNAPPY_LINEAR.easing};\n}` },
        { type: 'p', text: 'The docs shell exposes the timing ladder as CSS variables: `--duration-micro: 160ms`, `--duration-component: 320ms` and `--duration-scene: 720ms`. Never use `transition: all`; list the properties you animate.' },
      ],
    },
    {
      id: 'reduced-motion',
      title: 'How should springs behave when the user prefers reduced motion?',
      answer:
        'Keep the final state and the meaning, drop the movement: swap position, scale and parallax for a 150 ms opacity cross-fade and stop loops entirely. Read `prefers-reduced-motion` in every component, because a global `MotionConfig` in your app doesn’t travel with a copied component.',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'The pattern every Framekit component uses', code: "import { motion } from 'motion/react'\nimport { usePrefersReducedMotion } from '@/lib/use-reduced-motion'\n\nconst SNAPPY = { type: 'spring', stiffness: 420, damping: 32 } as const\n\nexport function Panel({ open }: { open: boolean }) {\n  const reduced = usePrefersReducedMotion()\n  return (\n    <motion.div\n      initial={false}\n      animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: reduced ? 0 : 8, scale: reduced ? 1 : 0.96 }}\n      transition={reduced ? { duration: 0.15 } : SNAPPY}\n    />\n  )\n}" },
        {
          type: 'list',
          items: [
            '**Keep**: final positions, colour and opacity changes, focus movement, progress that carries information.',
            '**Replace**: slides, scales and layout moves become a 150 ms cross-fade.',
            '**Drop**: ambient loops, particles, parallax, auto-advancing carousels.',
            'App-wide, `<MotionConfig reducedMotion="user">` makes Motion skip transform and layout animations while keeping opacity. Framekit’s docs site uses it, but components still branch on the hook so installed copies behave the same.',
          ],
        },
        { type: 'p', text: 'More rules for keyboard, focus, live regions and pause controls are in the [accessible motion checklist](/guides/accessible-motion-react-checklist).' },
      ],
    },
  ],
  faq: [
    { q: 'What is a good default spring for React UI?', a: '`{ type: "spring", stiffness: 420, damping: 32 }` (damping ratio about 0.78). It settles in roughly 300 ms with about 2% overshoot, which reads as crisp without feeling bouncy.' },
    { q: 'Spring or duration-based easing?', a: 'Use springs for anything the user can interrupt or drag (toggles, sheets, layout changes, gestures), because they keep velocity. Use fixed-duration easing for choreographed entrances, colour changes and CSS-only effects.' },
    { q: 'Why does my spring wobble?', a: 'The damping ratio is too low. Raise damping (or lower stiffness) until damping ÷ (2·√(stiffness·mass)) is at least 0.75 for UI.' },
    { q: 'What are Motion’s default spring values?', a: 'With no transition at all, Motion animates `x`/`y`/`rotate` with stiffness 500 and damping 25 (ratio about 0.56, visibly bouncy) and `scale` with stiffness 550, damping 30. A bare `type: "spring"` with no other values uses stiffness 100, damping 10, mass 1 (ratio 0.5). Pass explicit values so every element feels the same.' },
  ],
  related: ['glass-segmented-control', 'magnetic-button', 'detent-sheet', 'spring-stagger-grid', 'spring-reorder-list', 'pricing-plans'],
}

/* ── 3. accessibility ────────────────────────────────────────────────── */
const a11y: Guide = {
  slug: 'accessible-motion-react-checklist',
  title: 'Accessible motion in React: a WCAG 2.2 checklist for animated components',
  navTitle: 'Accessible motion checklist',
  seoTitle: 'Accessible Motion in React: WCAG 2.2 Checklist for Animated UI',
  description:
    'A practical WCAG 2.2 checklist for animated React components: reduced motion, reduced transparency, focus-visible, keyboard, live regions, target sizes and pause controls, with code.',
  eyebrow: 'Guide · Accessibility',
  summary:
    'An animated component is accessible when it (1) respects `prefers-reduced-motion`, (2) stays legible without transparency, (3) shows a visible focus ring, (4) works fully from the keyboard, (5) announces status changes in a live region, (6) has touch targets of at least 24 px (44 px is better), and (7) lets people pause anything that moves for more than five seconds. Each rule below maps to a WCAG 2.2 success criterion, shows the code, and links a Framekit component that implements it.',
  datePublished: '2026-10-09',
  dateModified: '2026-10-09',
  sections: [
    {
      id: 'reduced-motion',
      title: 'How do I respect prefers-reduced-motion in React?',
      answer:
        'Read the `prefers-reduced-motion: reduce` media query in the component and, when it matches, keep final states but replace movement with a short cross-fade and stop loops, parallax and particles. This supports WCAG 2.3.3 Animation from Interactions (AAA) and helps people with vestibular disorders, for whom large motion can cause nausea.',
      blocks: [
        { type: 'code', lang: 'ts', label: 'lib/use-reduced-motion.ts (ships with every animated Framekit component)', code: "import { useEffect, useState } from 'react'\n\nexport function usePrefersReducedMotion() {\n  const [reduced, setReduced] = useState(false)\n  useEffect(() => {\n    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')\n    const update = () => setReduced(mq.matches)\n    update()\n    mq.addEventListener('change', update)\n    return () => mq.removeEventListener('change', update)\n  }, [])\n  return reduced\n}" },
        {
          type: 'list',
          items: [
            'Branch on the hook inside the component, not only in an app-level `MotionConfig`, so copied components keep the behaviour.',
            'For CSS animations use Tailwind’s `motion-reduce:` / `motion-safe:` variants, e.g. `motion-reduce:animate-none`.',
            'Never hide content behind an animation: with motion reduced, everything must still be reachable and readable.',
            'Test it: macOS **System Settings → Accessibility → Display → Reduce motion**, or Chrome DevTools **Rendering → Emulate CSS prefers-reduced-motion**.',
          ],
        },
        { type: 'examples', slugs: ['infinite-marquee', 'perspective-tunnel-carousel', 'magnetic-button', 'liquid-glass-tab-bar'] },
      ],
    },
    {
      id: 'reduced-transparency',
      title: 'How do I support reduced transparency on glass UI?',
      answer:
        'Swap translucent, blurred surfaces for opaque ones when `prefers-reduced-transparency: reduce` matches. Glass lowers text contrast over busy backgrounds, so the opaque fallback protects WCAG 1.4.3 Contrast (Minimum, AA) and 1.4.11 Non-text Contrast (AA).',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'Tailwind v4 arbitrary media variant (from Glass App Dock)', code: '<div className="bg-white/60 backdrop-blur-2xl dark:bg-zinc-900/60\n  [@media(prefers-reduced-transparency:reduce)]:bg-white\n  [@media(prefers-reduced-transparency:reduce)]:dark:bg-zinc-900" />' },
        { type: 'note', tone: 'warn', text: 'Support is uneven: Chromium-based browsers honour `prefers-reduced-transparency`, others ignore it. Design glass that meets contrast on its own, and treat the media query as an extra.' },
        { type: 'examples', slugs: ['glass-app-dock', 'detent-sheet', 'glass-mega-navbar', 'glass-card'] },
      ],
    },
    {
      id: 'focus-visible',
      title: 'How should focus look on animated components?',
      answer:
        'Every interactive element needs a clearly visible focus indicator on keyboard focus, and it must not be hidden by sticky headers or animated layers. Use `:focus-visible` so mouse users aren’t distracted, with a 2 px ring at 3:1 contrast or more (WCAG 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured, 1.4.11 Non-text Contrast).',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'Framekit’s focus ring', code: '<button className="rounded-full outline-none\n  focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2\n  ring-offset-white dark:ring-signal-300 dark:ring-offset-zinc-950">\n  Save\n</button>' },
        {
          type: 'list',
          items: [
            'Never `outline: none` without a replacement.',
            'Keep the ring outside transformed or clipped layers: a parent with `overflow: hidden` can cut it off.',
            'Use `scroll-margin-top` on anchors and focus targets under a sticky header, so focus is never obscured.',
            'Groups (cards with several actions) can show `focus-within` on the container in addition to each control.',
          ],
        },
        { type: 'examples', slugs: ['glass-segmented-control', 'pricing-plans', 'faq-accordion'] },
      ],
    },
    {
      id: 'keyboard',
      title: 'What keyboard support does an animated component need?',
      answer:
        'Everything a pointer can do must also work from the keyboard (WCAG 2.1.1 Keyboard), focus must never get trapped (2.1.2), and drag gestures need a single-pointer or keyboard alternative (2.5.7 Dragging Movements, new in WCAG 2.2). Start from native elements, then add the expected keys for each pattern.',
      blocks: [
        {
          type: 'table',
          caption: 'Expected keys by pattern (WAI-ARIA Authoring Practices)',
          head: ['Pattern', 'Keys', 'Framekit example'],
          rows: [
            ['Button, toggle', 'Tab to focus, Enter / Space to activate', '[Magnetic Button](/docs/magnetic-button)'],
            ['Tabs, segmented control', 'Arrow keys move, Home / End jump, one Tab stop (roving `tabIndex`)', '[Glass Segmented Control](/docs/glass-segmented-control)'],
            ['Menu, command palette', 'Arrow Up / Down, Enter to run, Esc to close and return focus', '[Spotlight Command Palette](/docs/spotlight-command-palette)'],
            ['Modal dialog', 'Focus moves in, Tab is trapped inside, Esc closes, focus returns to the trigger', '[Morph Button Modal](/docs/morph-button-modal)'],
            ['Swipe or drag', 'A button or arrow-key alternative for every drag', '[Swipe Cards](/docs/swipe-cards)'],
          ],
        },
        { type: 'code', lang: 'ts', label: 'Roving focus for a tablist (lib/roving.ts, simplified)', code: "export function handleTablistKeys(e: React.KeyboardEvent<HTMLElement>) {\n  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role=\"tab\"]:not([disabled])'))\n  const i = items.indexOf(document.activeElement as HTMLElement)\n  let n = -1\n  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length\n  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + items.length) % items.length\n  else if (e.key === 'Home') n = 0\n  else if (e.key === 'End') n = items.length - 1\n  if (n < 0) return\n  e.preventDefault()\n  items[n].focus()\n  items[n].click()\n}" },
      ],
    },
    {
      id: 'live-regions',
      title: 'How do I announce animated status changes to screen readers?',
      answer:
        'Put status text in a live region (`role="status"` with `aria-live="polite"`) that exists in the DOM before the change, and update its text when the state changes. Use `role="alert"` only for errors that need attention. This meets WCAG 4.1.3 Status Messages (AA) without moving focus.',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'Announce what the animation shows', code: "<span role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" className=\"sr-only\">\n  {state === 'done' ? 'Ready' : state === 'error' ? 'Something went wrong' : 'Loading'}\n</span>\n\n{error && <p role=\"alert\">{error}</p>}" },
        {
          type: 'list',
          items: [
            'Announce the meaning (“Saved”), not the motion (“checkmark animating”).',
            'Mount the region once and change its text; a region that is created together with its message is often not read.',
            'Mark decorative animated layers `aria-hidden`, and keep an `sr-only` copy of animated text (scrambles, typewriters, split letters).',
          ],
        },
        { type: 'examples', slugs: ['cook-loading', 'contact-form-card', 'toast', 'cloud-launch-publish-button'] },
      ],
    },
    {
      id: 'target-size',
      title: 'How big should touch targets be?',
      answer:
        'WCAG 2.2 requires interactive targets of at least 24 × 24 CSS pixels, or enough spacing around smaller ones (2.5.8 Target Size Minimum, AA). Apple’s guidance and WCAG 2.5.5 (AAA) recommend 44 × 44, which is what Framekit uses on touch screens via `pointer-coarse:min-h-11`.',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'Compact on desktop, 44 px on touch', code: '<button className="h-8 px-3 text-xs pointer-coarse:min-h-11">Filter</button>' },
        {
          type: 'list',
          items: [
            'Make the visual target and the hit target the same element; grow small icons with padding, not invisible overlays.',
            'Don’t shrink targets mid-animation (for example while a dock icon scales down).',
            'Leave at least 8 px between adjacent targets in dense toolbars.',
          ],
        },
        { type: 'examples', slugs: ['button', 'glass-segmented-control', 'liquid-glass-tab-bar'] },
      ],
    },
    {
      id: 'pause-controls',
      title: 'When does animation need a pause button?',
      answer:
        'Any movement that starts automatically, lasts more than five seconds and plays alongside other content needs a way to pause, stop or hide it (WCAG 2.2.2 Pause, Stop, Hide, Level A). Marquees, carousels, ambient backgrounds and looping loaders all qualify; also pause them off-screen and in background tabs.',
      blocks: [
        { type: 'code', lang: 'tsx', label: 'A real toggle button, plus automatic pausing', code: "const [paused, setPaused] = React.useState(false)\n\n<button type=\"button\" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>\n  {paused ? 'Play' : 'Pause'}\n</button>\n\n// Stop work nobody can see\nuseEffect(() => {\n  const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))\n  io.observe(ref.current!)\n  const onVis = () => setVisible(document.visibilityState === 'visible')\n  document.addEventListener('visibilitychange', onVis)\n  return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis) }\n}, [])" },
        {
          type: 'list',
          items: [
            'Pause on hover and on focus inside, too, so people can read a moving item.',
            'Never flash more than three times per second (WCAG 2.3.1).',
            'With reduced motion, don’t autoplay at all.',
          ],
        },
        { type: 'examples', slugs: ['infinite-marquee', 'perspective-tunnel-carousel', 'cook-loading', 'velocity-marquee'] },
      ],
    },
    {
      id: 'checklist',
      title: 'What is the complete accessible-motion checklist?',
      answer:
        'Ten checks cover almost every animated component. Run them in light and dark mode, at 390 px wide, with reduced motion on and off, and with a keyboard and a screen reader.',
      blocks: [
        {
          type: 'table',
          caption: 'Accessible motion checklist (WCAG 2.2)',
          head: ['#', 'Check', 'WCAG 2.2', 'Level'],
          rows: [
            ['1', 'Reduced motion keeps final states and drops movement, loops and parallax', '2.3.3 Animation from Interactions', 'AAA'],
            ['2', 'Anything moving for more than 5 s can be paused, and pauses off-screen', '2.2.2 Pause, Stop, Hide', 'A'],
            ['3', 'Nothing flashes more than 3 times a second', '2.3.1 Three Flashes or Below Threshold', 'A'],
            ['4', 'Glass has an opaque fallback; text passes 4.5:1 in both themes', '1.4.3 Contrast (Minimum)', 'AA'],
            ['5', 'Visible focus ring at 3:1, never hidden by sticky or animated layers', '2.4.7 Focus Visible · 2.4.11 Focus Not Obscured', 'AA'],
            ['6', 'Every action works from the keyboard, with no traps', '2.1.1 Keyboard · 2.1.2 No Keyboard Trap', 'A'],
            ['7', 'Drag and swipe have a click or key alternative', '2.5.7 Dragging Movements', 'AA'],
            ['8', 'Status changes are announced in a live region', '4.1.3 Status Messages', 'AA'],
            ['9', 'Targets are at least 24 px (44 px on touch)', '2.5.8 Target Size (Minimum)', 'AA'],
            ['10', 'Controls have accessible names; decorative layers are `aria-hidden`', '4.1.2 Name, Role, Value', 'A'],
          ],
        },
        { type: 'p', text: 'Automated tools such as axe or Lighthouse catch only part of these. Do a keyboard-only pass and a VoiceOver or NVDA pass before you ship. For motion values that pass the “crisp, not floaty” test, see the [spring cheat sheet](/guides/apple-style-spring-animation-values).' },
      ],
    },
  ],
  faq: [
    { q: 'Is respecting prefers-reduced-motion required by WCAG?', a: 'Not directly at AA. WCAG 2.3.3 Animation from Interactions is AAA, but 2.2.2 Pause, Stop, Hide (Level A) applies to auto-playing motion, and honouring the OS setting is the expected way to meet both.' },
    { q: 'Does MotionConfig reducedMotion="user" make my app accessible?', a: 'It is a good default: Motion then skips transform and layout animations for users who prefer reduced motion. It doesn’t pause loops, canvas or CSS animations, add focus styles or announce changes, so the rest of this checklist still applies.' },
    { q: 'What is the minimum touch target size in WCAG 2.2?', a: '24 × 24 CSS pixels (2.5.8, AA), with exceptions for inline links and targets that have enough spacing. 44 × 44 (2.5.5, AAA) is the recommended size for touch.' },
    { q: 'Which screen readers should I test with?', a: 'VoiceOver on macOS and iOS, NVDA on Windows, and TalkBack on Android cover most users. Test the main flows, not every state.' },
  ],
  related: ['infinite-marquee', 'glass-segmented-control', 'cook-loading', 'morph-button-modal', 'swipe-cards', 'glass-app-dock'],
}

export const GUIDES: Guide[] = [install, springs, a11y]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}

export const GUIDES_TITLE = 'Guides'
export const GUIDES_DESC =
  'In-depth guides for building premium, accessible animated interfaces with React, Tailwind CSS and Motion: installing with shadcn, spring values and accessible motion.'

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
    case 'table':
      return b.rows.flat().map(inlineText).join(' ')
    case 'examples':
      return ''
  }
}
