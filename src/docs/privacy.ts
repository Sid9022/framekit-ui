/**
 * /privacy: the privacy policy, written as data so the page (pages/PrivacyPage.tsx), the prerendered HTML
 * (scripts/prerender.mjs) and the meta description (seo.ts) share one source. Pure data: no DOM / React imports.
 * Every claim is checked against the code: storage keys in hooks/use-theme.ts, components/docs/preview-theme-toggle.tsx,
 * components/docs/install-block.tsx, components/command-palette.tsx and components/route-effects.tsx; analytics in
 * components/route-analytics.tsx (+ track('copy') in the code / install blocks); fonts in index.html.
 * Inline markup is the same as guides.ts: `code`, **bold**, [label](href).
 */
import { SITE } from '../config/site'

export const PRIVACY_UPDATED = '2026-10-10'
export const PRIVACY_TITLE = 'Privacy policy'
export const PRIVACY_DESC =
  'How Framekit UI handles your data: cookieless, anonymous Vercel Web Analytics, no ads, no personal data, and only local settings saved in your browser.'
export const PRIVACY_SUMMARY = `${SITE.name} collects no personal data. There are no accounts, no forms, no ads and no tracking cookies. We count anonymous, aggregated page views with Vercel Web Analytics, and the site remembers a few display settings in your own browser.`

export type PrivacySection = { id: string; title: string; paras?: string[]; items?: string[] }

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'analytics',
    title: 'What we measure',
    paras: [
      'We use **Vercel Web Analytics** to see which pages are popular. It is cookieless and records anonymous, aggregated data: the page path, the referring site, and the approximate country, browser, operating system and device type. It does not identify you, build a profile, or follow you across other websites.',
      'We also count an anonymous event when someone copies an install command or code snippet (which component, and which package manager). That tells us which components are useful. Nothing in it identifies you.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    paras: [
      'The site sets **no cookies**, so there is no cookie banner. To remember your preferences, it saves a few small values in your browser’s storage. They never leave your device, and clearing your site data removes them:',
    ],
    items: [
      '`framekit-theme`: light or dark site theme.',
      '`framekit-preview-theme`: the light/dark toggle on component previews.',
      '`framekit-package-manager`: npm, pnpm, yarn or bun in install commands.',
      '`framekit-recent-searches`: your recent ⌘K searches.',
      '`framekit-scroll` (session storage, cleared when the tab closes): scroll positions for the Back button.',
    ],
  },
  {
    id: 'what-we-dont-do',
    title: 'What we don’t do',
    items: [
      'No accounts, sign-ups, newsletters or contact forms, so we never ask for your name or email.',
      'No advertising, ad networks or retargeting pixels.',
      'We don’t sell, rent or share data with anyone.',
    ],
  },
  {
    id: 'third-parties',
    title: 'Hosting and third parties',
    paras: [
      'The site is hosted on **Vercel**, which processes standard request logs (such as IP address and user agent) to deliver and protect the site. Fonts load from **Google Fonts**, and one demo image comes from **Unsplash**, so your browser contacts their servers when those load.',
      `Links to [GitHub](${SITE.github}), [LinkedIn](${SITE.creator.linkedin}) and [X](${SITE.creator.x}) open third-party sites with their own privacy policies. Installing a component with the shadcn CLI downloads a JSON file from this site; nothing else is sent.`,
    ],
  },
  {
    id: 'contact',
    title: 'Changes and contact',
    paras: [
      'If this policy changes, we’ll update it here and change the date at the top.',
      `Questions? Message ${SITE.creator.name} on [X](${SITE.creator.x}) or [LinkedIn](${SITE.creator.linkedin}).`,
    ],
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
