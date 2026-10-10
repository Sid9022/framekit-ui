/**
 * /privacy: the privacy policy, written as data so the page (pages/PrivacyPage.tsx), the prerendered HTML
 * (scripts/prerender.mjs) and the meta description (seo.ts) share one source. Pure data: no DOM / React imports.
 * Every claim is checked against the code: storage keys in hooks/use-theme.ts, components/docs/preview-theme-toggle.tsx,
 * components/docs/install-block.tsx, components/command-palette.tsx and components/route-effects.tsx; analytics in
 * components/route-analytics.tsx (+ track('copy') in the code / install blocks); fonts in index.html; the Unsplash
 * image in docs/demos/image-lens.tsx. Inline markup is the same as guides.ts: `code`, **bold**, [label](href).
 */
import { SITE } from '../config/site'

export const PRIVACY_UPDATED = '2026-10-10'
export const PRIVACY_TITLE = 'Privacy policy'
export const PRIVACY_DESC =
  'Framekit UI collects no personal data. Page views are counted with cookieless Vercel Web Analytics, and a few display settings stay in your browser.'
export const PRIVACY_SUMMARY = `${SITE.name} has no accounts, forms, ads or cookies. We count anonymous page views, and your browser remembers a few display settings. That’s all.`

export type PrivacySection = {
  id: string
  title: string
  paras?: string[]
  items?: string[]
  /** Two-column table: [key, what it stores]. */
  table?: { caption: string; head: [string, string]; rows: [string, string][] }
}

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'analytics',
    title: 'Analytics',
    paras: [
      'We use Vercel Web Analytics to see which pages get read. It’s cookieless and aggregated: the page, the referrer, and your approximate country, browser, OS and device. It can’t identify you or follow you elsewhere.',
      'We also count copies of install commands and snippets, by component and package manager. None of it is sold or shared.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and storage',
    paras: ['No cookies. These keys keep your settings between visits and never leave your device.'],
    table: {
      caption: 'Keys stored in your browser',
      head: ['Key', 'Stores'],
      rows: [
        ['framekit-theme', 'Light or dark site theme'],
        ['framekit-preview-theme', 'Light or dark for component previews'],
        ['framekit-package-manager', 'npm, pnpm, yarn or bun in commands'],
        ['framekit-recent-searches', 'Your recent ⌘K searches'],
        ['framekit-scroll', 'Scroll positions for Back. Session storage, cleared when the tab closes'],
      ],
    },
  },
  {
    id: 'third-parties',
    title: 'Third parties',
    paras: [
      'Vercel hosts the site and keeps standard request logs (IP address, user agent) to serve and protect it. Fonts come from Google Fonts and one demo image from Unsplash, so your browser contacts them too.',
      `Links to [GitHub](${SITE.github}), [LinkedIn](${SITE.creator.linkedin}) and [X](${SITE.creator.x}) have their own policies. The shadcn CLI only downloads JSON from this site.`,
    ],
  },
  {
    id: 'contact',
    title: 'Changes and questions',
    paras: [`If this page changes, so does the date at the top. Questions go to ${SITE.creator.name} on [X](${SITE.creator.x}) or [LinkedIn](${SITE.creator.linkedin}).`],
  },
]

/* Same tiny inline markup as guides.ts (kept local so /privacy doesn't pull the large guides module). */
export type PrivacyInline = { kind: 'text' | 'code' | 'strong'; text: string } | { kind: 'link'; text: string; href: string }
const INLINE = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g
export function privacyInline(s: string): PrivacyInline[] {
  const out: PrivacyInline[] = []
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
