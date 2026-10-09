/**
 * Landing-page FAQ. One source for the visible FAQ section (src/pages/landing/Sections.tsx) and the
 * FAQPage JSON-LD (src/docs/seo.ts → prerendered HTML + client <head>), so the two can never drift.
 *
 * Answers use a tiny inline link syntax: [Label](/docs/slug). `faqAnswerText()` strips it for schema text.
 * Keep answers honest and short; link only to real pages.
 */
import { SITE_URL_BASE } from './site-url'

export type FaqItem = { q: string; a: string }

export const LANDING_FAQ: FaqItem[] = [
  {
    q: 'What is the best free animated component library for React and Tailwind?',
    a: 'It depends on what you need, but Framekit UI is a strong free option if you want motion-first components you own. It has 300+ open-source (MIT) React 19 + Tailwind CSS v4 components animated with Motion: heroes, buttons, cards, data widgets, website sections and more. Every one works in light and dark mode and respects reduced motion. Start with the [Motion Showcase](/docs/category/motion-showcase) or [Data Widgets](/docs/category/data-widgets).',
  },
  {
    q: 'How do I add a macOS-style dock or command palette to my Next.js site?',
    a: `Run the shadcn CLI in your Next.js project (Tailwind v4 with a components.json): npx shadcn@latest add ${SITE_URL_BASE}/r/glass-app-dock.json for the [Glass App Dock](/docs/glass-app-dock), or …/r/spotlight-command-palette.json for the [Spotlight Command Palette](/docs/spotlight-command-palette). The file lands in components/ui. In the App Router, the components use hooks, so add "use client" at the top of the file or render them from a Client Component.`,
  },
  {
    q: 'Is there a Magic UI or Aceternity alternative that works with shadcn?',
    a: 'Yes. Framekit UI is published as a shadcn registry, so every component installs with the same npx shadcn@latest add command you already use, and the CLI brings its helpers and npm dependencies with it. The components are original designs, not copies. See the [installation guide](/docs/installation) to register the @framekit namespace.',
  },
  {
    q: 'How do I make my landing page feel premium, like Apple or Vercel?',
    a: 'Restraint does most of the work: one accent colour, generous spacing, a tight type scale, hairline borders and soft layered shadows. Then add motion that has a purpose, such as springs instead of linear easing, 30–60 ms staggers and scroll-linked reveals. Ready-made pieces: [Glass Mega Navbar](/docs/glass-mega-navbar), [Blur Cascade Heading](/docs/blur-cascade-heading), [Scroll Product Reveal](/docs/scroll-product-reveal) and [Pricing Plans](/docs/pricing-plans).',
  },
  {
    q: 'How do I make React animations accessible with reduced motion?',
    a: 'Read the prefers-reduced-motion media query and, when it is set, keep the final state but drop loops, parallax and large movement, cross-fading instead. With Motion you can wrap your app in <MotionConfig reducedMotion="user">. Every Framekit component already branches on a usePrefersReducedMotion() hook and supports the keyboard, for example the [Magnetic Button](/docs/magnetic-button) and [Liquid Glass Tab Bar](/docs/liquid-glass-tab-bar).',
  },
]

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/** Split an answer into text and link parts for rendering. */
export function faqAnswerParts(a: string): ({ text: string } | { text: string; href: string })[] {
  const out: ({ text: string } | { text: string; href: string })[] = []
  let last = 0
  for (const m of a.matchAll(LINK)) {
    if (m.index! > last) out.push({ text: a.slice(last, m.index) })
    out.push({ text: m[1], href: m[2] })
    last = m.index! + m[0].length
  }
  if (last < a.length) out.push({ text: a.slice(last) })
  return out
}

/** Plain-text answer (links reduced to their label) — matches the visible copy word for word. */
export function faqAnswerText(a: string) {
  return a.replace(LINK, '$1')
}
