/**
 * Route-level SEO: titles, descriptions, canonical paths and JSON-LD for every page.
 *
 * Pure data (no DOM, no React) so the SAME builders run in two places:
 *  - the browser, via <RouteHead> (src/components/route-effects.tsx), on client-side navigation;
 *  - Node at build time, via scripts/prerender.mjs, which writes dist/<path>/index.html for crawlers
 *    that don't run JavaScript (and scripts/build-sitemap.mjs / build-llms.mjs for the route list).
 * Keep imports relative and side-effect free so the build scripts can transpile this file on its own.
 */
import { DOCS, categorySlug, getCategoryBySlug, getDoc, getNavGroups, type DocCategory, type DocEntry } from './registry'
import { SITE } from '../config/site'
import { SITE_URL_BASE } from './site-url'
import { LANDING_FAQ, faqAnswerText } from './faq'
import { GUIDE_LINKS } from './guide-links'
import type * as GuidesModule from './guides'
type Guide = GuidesModule.Guide
/**
 * The guide text is large, so seo.ts never imports ./guides at runtime (it would land in the main bundle via
 * RouteHead). Callers that need guide metadata pass the module in: RouteHead lazy-imports it on /guides routes and
 * the build scripts pass their loaded copy.
 */
export type GuideSource = Pick<typeof GuidesModule, 'GUIDES' | 'GUIDES_DESC' | 'GUIDES_TITLE' | 'getGuide' | 'inlineText'>

export const SITE_URL = SITE_URL_BASE
export const OG_IMAGE = `${SITE_URL}/og.png`
export const REPO_URL = SITE.github
export const LICENSE_URL = 'https://opensource.org/licenses/MIT'

export const HOME_TITLE = `${SITE.name}: Animated React + Tailwind Component Library`
export const HOME_HEADLINE = 'One library. Every interface, alive.'
export const HOME_DESC =
  'Open-source animated React + Tailwind components with premium motion. Light and dark, accessible, and installable with one shadcn CLI command.'

/**
 * Per-route 1200×630 Open Graph image, generated at build time by scripts/build-og.mjs into dist/og/.
 * The landing page keeps the hand-made /og.png.
 */
export function ogImagePath(pathname: string) {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/') return '/og.png'
  const parts = p.split('/').filter(Boolean)
  if (parts[0] === 'docs' && parts[1] === 'category' && parts[2]) return `/og/category/${parts[2]}.png`
  if (parts[0] === 'docs' && parts[1]) return `/og/docs/${parts[1]}.png`
  if (parts[0] === 'guides' && parts[1]) return `/og/guides/${parts[1]}.png`
  if (parts[0] === 'guides') return '/og/guides.png'
  return '/og.png'
}

export const installCommand = (slug: string) => `npx shadcn@latest add ${SITE_URL}/r/${slug}.json`

/** Keyword title for each category page + the descriptor used in component titles. */
export const CATEGORY_SEO: Record<DocCategory, { title: string; noun: string; blurb: string }> = {
  'Getting Started': { title: 'Getting Started with Framekit UI', noun: 'Framekit UI guide', blurb: 'Install, theme and use Framekit UI components.' },
  Hero: { title: 'Animated React Hero Sections', noun: 'animated React hero section', blurb: 'Landing-page hero sections with motion-rich headlines, scenes and CTAs.' },
  Portfolio: { title: 'Animated React Portfolio Components', noun: 'animated React portfolio component', blurb: 'Portfolio sections, project cards and personal-site pieces with premium motion.' },
  'Animated Backgrounds': { title: 'Animated React Backgrounds', noun: 'animated React background', blurb: 'Canvas, SVG and CSS backdrops that react to the pointer, in light and dark.' },
  Buttons: { title: 'Animated React Buttons', noun: 'animated React button', blurb: 'Buttons with springs, morphs, particles and stateful feedback.' },
  Toggles: { title: 'Animated React Toggle Switches', noun: 'animated React toggle switch', blurb: 'Accessible switches and toggles with playful, spring-driven motion.' },
  'Text Animations': { title: 'React Text Animations', noun: 'React text animation', blurb: 'Headline and text effects: reveals, scrambles, rotations and cascades.' },
  Shimmer: { title: 'React Shimmer Effects', noun: 'React shimmer effect', blurb: 'Shimmer and sheen effects for text, borders and surfaces.' },
  Loading: { title: 'React Loading Animations', noun: 'React loading animation', blurb: 'Loaders and spinners that make waiting feel considered.' },
  '404 Animation': { title: 'Animated React 404 Pages', noun: 'animated React 404 page', blurb: 'Full-scene not-found pages with character and motion.' },
  Toast: { title: 'Animated React Toast Notifications', noun: 'animated React toast', blurb: 'Toasts that stack, swipe and spring.' },
  'Vertical Scroll': { title: 'React Vertical Scroll Animations', noun: 'React vertical scroll component', blurb: 'Reels and scroll-driven vertical layouts.' },
  Cards: { title: 'Animated React Card Components', noun: 'animated React card', blurb: 'Cards with tilt, glow, glass and spring interactions.' },
  Navigation: { title: 'Animated React Navigation Components', noun: 'animated React navigation component', blurb: 'Navbars, tabs, docks and menus with fluid motion.' },
  Sidebars: { title: 'Animated React Sidebars', noun: 'animated React sidebar', blurb: 'Collapsible app sidebars and navigation rails.' },
  'WhatsApp / Messaging': { title: 'React Chat & Messaging UI Components', noun: 'React chat UI component', blurb: 'Chat bubbles, typing indicators and messaging interfaces.' },
  Notifications: { title: 'Animated React Notification Components', noun: 'animated React notification', blurb: 'Notification stacks, badges and live feeds.' },
  Widgets: { title: 'Animated React Widgets', noun: 'animated React widget', blurb: 'Small, self-contained interactive widgets.' },
  'Voice Agent': { title: 'React Voice Agent & AI Assistant UI', noun: 'React voice agent UI', blurb: 'Voice orbs, waveforms and AI assistant interfaces.' },
  Cursors: { title: 'Custom Animated React Cursors', noun: 'animated React cursor', blurb: 'Custom cursors and pointer followers.' },
  'Search / Inputs': { title: 'Animated React Search Inputs', noun: 'animated React search input', blurb: 'Search fields and inputs with motion and feedback.' },
  'Inputs / Forms': { title: 'Animated React Form Inputs', noun: 'animated React form input', blurb: 'Form controls with considered states and motion.' },
  'Product UI': { title: 'Premium React Product UI Components', noun: 'React product UI component', blurb: 'Apple- and Vercel-style product UI: sheets, pickers, tables and status.' },
  'Website Sections': { title: 'React + Tailwind Website Sections', noun: 'React website section', blurb: 'Navbars, pricing, FAQ, testimonials, CTAs and footers for marketing sites.' },
  'Motion Showcase': { title: 'React Motion & Scroll Animation Components', noun: 'React motion component', blurb: 'Scroll-scrubbed reveals, shared-element transitions and spring physics.' },
  'Data Widgets': { title: 'Animated React Data Widgets', noun: 'animated React data widget', blurb: 'Dashboard cards and charts: candlesticks, donuts, heatmaps and KPIs.' },
  Core: { title: 'React + Tailwind Core UI Components', noun: 'React UI primitive', blurb: 'Everyday primitives: button, badge, card, input, dialog and more.' },
}

const GUIDE_DESCRIPTOR: Record<string, string> = {
  introduction: 'open-source animated React components',
  installation: 'add components with the shadcn CLI',
  theming: 'dark mode and Tailwind tokens',
}

/** Collapse whitespace and trim to ~max chars on a word boundary. */
export function clip(text: string, max = 158) {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const at = cut.lastIndexOf(' ')
  return `${cut.slice(0, at > max * 0.6 ? at : cut.length).replace(/[\s,;:—–-]+$/, '')}…`
}

/** Sharper title descriptors for components people search for by job, not by category. */
const TITLE_DESCRIPTOR: Record<string, string> = {
  'pricing-plans': 'animated React pricing table',
  'glass-app-dock': 'macOS-style React dock',
  'spotlight-command-palette': 'React ⌘K command palette',
  'activity-rings': 'Apple Watch-style React progress rings',
  'faq-accordion': 'animated React FAQ accordion',
  'glass-mega-navbar': 'React glass mega-menu navbar',
  'perspective-tunnel-carousel': '3D React card carousel',
  'date-range-picker': 'React date range picker',
  'detent-sheet': 'iOS-style React bottom sheet',
  'liquid-glass-tab-bar': 'iOS liquid glass React tab bar',
}

export function docTitle(doc: DocEntry) {
  const descriptor =
    doc.category === 'Getting Started' ? GUIDE_DESCRIPTOR[doc.slug] ?? 'Framekit UI guide' : TITLE_DESCRIPTOR[doc.slug] ?? CATEGORY_SEO[doc.category].noun
  return `${doc.title}: ${descriptor} | ${SITE.name}`
}

/** ~150-char meta description built from the registry description. */
export function docDescription(doc: DocEntry) {
  const base = doc.description.replace(/\s+/g, ' ').trim().replace(/[.…]?$/, '.')
  if (base.length >= 120) return clip(base, 158)
  const lead = doc.category === 'Getting Started' ? ' Free, open-source React + Tailwind components' : ' Free, open-source React + Tailwind component'
  // Add selling points one by one while the description stays within 158 chars.
  const extras = [' with premium motion', ', light and dark themes', ', keyboard support', ' and a one-command shadcn install']
  let out = base + lead
  for (const e of extras) if ((out + e + '.').length <= 158) out += e
  out += '.'
  return out.length <= 158 ? out : clip(base, 158)
}

export function categoryTitle(cat: DocCategory) {
  return `${CATEGORY_SEO[cat].title} | ${SITE.name}`
}

export function categoryDescription(cat: DocCategory, count: number) {
  const kw = CATEGORY_SEO[cat].title.toLowerCase().replace(/\breact\b/g, 'React').replace(/\btailwind\b/g, 'Tailwind').replace(/\bui\b/g, 'UI').replace(/\bai\b/g, 'AI')
  return clip(`${count} free ${kw}. ${CATEGORY_SEO[cat].blurb} Open source, light and dark, accessible, installable with shadcn.`, 158)
}

/** Every indexable path, in sitemap order (landing → category → its docs). */
export function sitemapRoutes(): { path: string; priority: string; changefreq: string }[] {
  const urls = [{ path: '/', priority: '1.0', changefreq: 'weekly' }]
  urls.push({ path: '/guides', priority: '0.8', changefreq: 'monthly' })
  for (const g of GUIDE_LINKS) urls.push({ path: `/guides/${g.slug}`, priority: '0.9', changefreq: 'monthly' })
  for (const g of getNavGroups()) {
    if (g.title !== 'Getting Started') urls.push({ path: `/docs/category/${categorySlug(g.title)}`, priority: '0.7', changefreq: 'weekly' })
    for (const d of g.items) urls.push({ path: `/docs/${d.slug}`, priority: g.title === 'Getting Started' ? '0.9' : '0.8', changefreq: 'monthly' })
  }
  const seen = new Set<string>()
  return urls.filter((u) => (seen.has(u.path) ? false : (seen.add(u.path), true)))
}

/** Same-category neighbours around a doc (wraps), for "related components" links. */
export function relatedDocs(doc: DocEntry, n = 6): DocEntry[] {
  const items = DOCS.filter((d) => d.category === doc.category)
  const i = items.findIndex((d) => d.slug === doc.slug)
  const out: DocEntry[] = []
  for (let k = 1; out.length < Math.min(n, items.length - 1); k++) {
    const after = items[(i + k) % items.length]
    if (after && after.slug !== doc.slug && !out.includes(after)) out.push(after)
    if (out.length >= n) break
    const before = items[(i - k + items.length * 4) % items.length]
    if (before && before.slug !== doc.slug && !out.includes(before)) out.push(before)
    if (k > items.length) break
  }
  return out
}

/* ── JSON-LD ─────────────────────────────────────────────────────────── */
type Ld = Record<string, unknown>
const abs = (p: string) => `${SITE_URL}${p === '/' ? '/' : p}`
const ORG_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

function breadcrumb(items: { name: string; path: string }[]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  }
}

function homeLd(): Ld[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE.name,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      sameAs: [REPO_URL],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE.name,
      url: `${SITE_URL}/`,
      description: HOME_DESC,
      inLanguage: 'en',
      publisher: { '@id': ORG_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: LANDING_FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: faqAnswerText(f.a) },
      })),
    },
  ]
}

export type RouteSeo = {
  title: string
  description: string
  /** Canonical path ('/' or '/docs/…'). */
  path: string
  found: boolean
  jsonLd: Ld[]
  /** Absolute og:image / twitter:image URL. */
  image: string
  /** og:type */
  ogType: 'website' | 'article'
}

function guideLd(g: Guide, { GUIDES_TITLE, inlineText }: GuideSource): Ld[] {
  const path = `/guides/${g.slug}`
  const image = abs(ogImagePath(path))
  const ld: Ld[] = [
    breadcrumb([{ name: SITE.name, path: '/' }, { name: GUIDES_TITLE, path: '/guides' }, { name: g.navTitle, path }]),
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      '@id': `${abs(path)}#article`,
      headline: g.title,
      description: g.description,
      abstract: inlineText(g.summary),
      url: abs(path),
      mainEntityOfPage: abs(path),
      image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
      datePublished: g.datePublished,
      dateModified: g.dateModified,
      inLanguage: 'en',
      proficiencyLevel: 'Beginner',
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      isPartOf: { '@id': WEBSITE_ID },
      articleSection: g.sections.map((x) => x.title),
      about: g.related.map((slug) => {
        const d = getDoc(slug)
        return { '@type': 'SoftwareSourceCode', name: d?.title ?? slug, url: abs(`/docs/${slug}`) }
      }),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: g.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: inlineText(f.a) } })),
    },
  ]
  if (g.howTo)
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: g.howTo.name,
      description: g.description,
      totalTime: g.howTo.totalTime,
      image,
      tool: [{ '@type': 'HowToTool', name: 'shadcn CLI' }],
      step: g.howTo.steps.map((st, i) => ({ '@type': 'HowToStep', position: i + 1, name: st.name, text: st.text, url: `${abs(path)}#install-by-url` })),
    })
  return ld
}

export function routeSeo(pathname: string, guides?: GuideSource): RouteSeo {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  const media = (path: string, ogType: 'website' | 'article' = 'website') => ({ image: abs(ogImagePath(path)), ogType })
  if (parts.length === 0) return { title: HOME_TITLE, description: HOME_DESC, path: '/', found: true, jsonLd: homeLd(), ...media('/') }

  if (parts[0] === 'guides' && parts.length === 1 && guides) {
    const { GUIDES, GUIDES_DESC, GUIDES_TITLE } = guides
    const path = '/guides'
    return {
      title: `${GUIDES_TITLE}: React Motion, shadcn & Accessibility | ${SITE.name}`,
      description: GUIDES_DESC,
      path,
      found: true,
      ...media(path),
      jsonLd: [
        breadcrumb([{ name: SITE.name, path: '/' }, { name: GUIDES_TITLE, path }]),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${SITE.name} ${GUIDES_TITLE}`,
          description: GUIDES_DESC,
          url: abs(path),
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: GUIDES.length,
            itemListElement: GUIDES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.title, url: abs(`/guides/${g.slug}`) })),
          },
        },
      ],
    }
  }
  if (parts[0] === 'guides' && parts.length === 2 && guides) {
    const g = guides.getGuide(parts[1])
    if (g) {
      const path = `/guides/${g.slug}`
      return { title: `${g.seoTitle} | ${SITE.name}`, description: clip(g.description, 160), path, found: true, jsonLd: guideLd(g, guides), ...media(path, 'article') }
    }
  }

  if (parts[0] === 'docs' && parts[1] === 'category' && parts[2] && parts.length === 3) {
    const cat = getCategoryBySlug(parts[2])
    if (cat && cat !== 'Getting Started') {
      const items = DOCS.filter((d) => d.category === cat)
      const path = `/docs/category/${parts[2]}`
      return {
        title: categoryTitle(cat),
        description: categoryDescription(cat, items.length),
        path,
        found: true,
        ...media(path),
        jsonLd: [
          breadcrumb([{ name: SITE.name, path: '/' }, { name: 'Docs', path: '/docs/introduction' }, { name: cat, path }]),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: CATEGORY_SEO[cat].title,
            url: abs(path),
            isPartOf: { '@id': WEBSITE_ID },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: items.length,
              itemListElement: items.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.title, url: abs(`/docs/${d.slug}`) })),
            },
          },
        ],
      }
    }
  } else if (parts[0] === 'docs' && parts[1] && parts.length === 2) {
    const doc = getDoc(parts[1])
    if (doc) {
      const path = `/docs/${doc.slug}`
      const isGuide = doc.category === 'Getting Started'
      const crumbs = isGuide
        ? [{ name: SITE.name, path: '/' }, { name: 'Docs', path: '/docs/introduction' }, { name: doc.title, path }]
        : [
            { name: SITE.name, path: '/' },
            { name: doc.category, path: `/docs/category/${categorySlug(doc.category)}` },
            { name: doc.title, path },
          ]
      const ld: Ld[] = [breadcrumb(crumbs)]
      if (!isGuide)
        ld.push({
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: doc.title,
          description: doc.description,
          url: abs(path),
          codeRepository: REPO_URL,
          programmingLanguage: ['TypeScript', 'React'],
          runtimePlatform: 'React 19 + Tailwind CSS v4',
          license: LICENSE_URL,
          isAccessibleForFree: true,
          keywords: [CATEGORY_SEO[doc.category].noun, 'shadcn registry', 'Tailwind CSS', 'Motion'].join(', '),
          image: abs(ogImagePath(path)),
          author: { '@id': ORG_ID },
          isPartOf: { '@id': WEBSITE_ID },
        })
      return { title: docTitle(doc), description: docDescription(doc), path, found: true, jsonLd: ld, ...media(path) }
    }
  } else if (parts[0] === 'docs' && parts.length === 1) {
    const intro = getDoc('introduction')!
    return { title: docTitle(intro), description: docDescription(intro), path: '/docs/introduction', found: true, jsonLd: [], ...media('/docs/introduction') }
  }
  return { title: `Page not found | ${SITE.name}`, description: HOME_DESC, path: pathname, found: false, jsonLd: [], ...media('/') }
}
