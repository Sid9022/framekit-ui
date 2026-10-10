#!/usr/bin/env node
/**
 * Build step (after vite build): prerender every route to static HTML for crawlers that don't run JavaScript
 * (GPTBot, PerplexityBot, ClaudeBot…) and for fast, correct link previews.
 *
 * Pure Node, no browser: for each path in sitemapRoutes() (the same list as public/sitemap.xml) it takes the
 * built dist/index.html and writes dist/<path>/index.html with
 *   - a per-route <head>: title, description, canonical, robots, OG/Twitter, JSON-LD (all from src/docs/seo.ts,
 *     the same builders <RouteHead> uses in the browser), and
 *   - a static "SEO shell" inside #root: breadcrumbs, H1, intro, install command, usage, props table,
 *     related components, category links, FAQ (home).
 * The client still boots with createRoot(), which replaces #root's children on its first commit — no hydration,
 * so no hydration mismatches. With JS on, the shell is visually hidden until the app mounts (it reappears after
 * a few seconds only if the bundle failed), so real users see exactly what they saw before.
 * Also writes dist/404.html (noindex) which Vercel serves with a 404 status for unknown paths.
 *
 *   node scripts/prerender.mjs        (runs as the last step of `npm run build`)
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, loadTs } from './lib/load-ts.mjs'

const t0 = performance.now()
const DIST = path.join(ROOT, 'dist')
const seo = await loadTs('src/docs/seo.ts')
const { DOCS, getDoc, getNavGroups, categorySlug, getCategoryBySlug, getPrevNext, componentDocs } = await loadTs('src/docs/registry.ts')
const { SITE } = await loadTs('src/config/site.ts')
const { LANDING_FAQ, faqAnswerParts } = await loadTs('src/docs/faq.ts')
const guides = await loadTs('src/docs/guides.ts')
const privacy = await loadTs('src/docs/privacy.ts')

const U = seo.SITE_URL
const groups = getNavGroups()
const cats = groups.filter((g) => g.title !== 'Getting Started')
// Idempotent: if dist/index.html was already prerendered, strip our marked regions to get the SPA template back.
const template = fs
  .readFileSync(path.join(DIST, 'index.html'), 'utf8')
  .replace(/\n?\s*<!--seo-head-->[\s\S]*?<!--\/seo-head-->/, '')
  .replace(/<div id="root"><!--seo-shell-->[\s\S]*?<!--\/seo-shell--><\/div>/, '<div id="root"></div>')
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: dist/index.html has no empty <div id="root"></div>')

/* ── helpers ─────────────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ld = (o) => `<script type="application/ld+json" data-route-ld>${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`
const a = (href, text, attrs = '') => `<a href="${esc(href)}"${attrs}>${esc(text)}</a>`
const catHref = (title) => `/docs/category/${categorySlug(title)}`
const code = (s) => `<pre><code>${esc(s)}</code></pre>`

function exportName(slug) {
  const file = path.join(ROOT, 'src/components/ui', `${slug}.tsx`)
  const src = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  const pascal = slug.replace(/(^|-)([a-z0-9])/g, (_, __, ch) => ch.toUpperCase())
  if (new RegExp(`export\\s+(?:function|const)\\s+${pascal}\\b`).test(src)) return pascal
  return src.match(/export\s+function\s+([A-Z][a-z]\w*)/)?.[1] ?? src.match(/export\s+const\s+([A-Z][a-z]\w*)/)?.[1] ?? pascal
}

function crumbs(items) {
  return `<nav aria-label="Breadcrumb"><ol class="seo-crumbs">${items
    .map((it, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li>${a(it.path, it.name)}</li>`))
    .join('')}</ol></nav>`
}

const header = `<header class="seo-header"><nav aria-label="Site">${a('/', SITE.name, ' class="seo-brand"')}<ul>
<li>${a('/docs/introduction', 'Docs')}</li><li>${a('/docs/installation', 'Install')}</li><li>${a('/guides', 'Guides')}</li><li>${a(catHref('Motion Showcase'), 'Motion')}</li><li>${a(catHref('Data Widgets'), 'Widgets')}</li><li>${a(SITE.github, 'GitHub')}</li></ul></nav></header>`

const footer = `<footer class="seo-footer"><nav aria-label="Guides"><h2>Guides</h2><ul>${guides.GUIDES.map((g) => `<li>${a(`/guides/${g.slug}`, g.navTitle)}</li>`).join('')}</ul></nav><nav aria-label="Component categories"><h2>Component categories</h2><ul>${cats
  .map((g) => `<li>${a(catHref(g.title), `${g.title} (${g.items.length})`)}</li>`)
  .join('')}</ul></nav><p>Built by ${a(SITE.creator.linkedin, SITE.creator.name)} · ${a(SITE.creator.linkedin, 'LinkedIn')} · ${a(SITE.creator.x, 'X')} · ${a(SITE.github, 'GitHub')}</p><p>${esc(SITE.name)} is open source under the ${esc(SITE.license)} licence · ${a(SITE.licenseUrl, 'License (MIT)')} · ${a('/privacy', 'Privacy')} · ${a('/llms.txt', 'llms.txt')} · ${a('/sitemap.xml', 'Sitemap')}</p></footer>`

function propsTable(props) {
  if (!props?.length) return ''
  return `<section aria-labelledby="props-h"><h2 id="props-h">Props</h2><table><caption>Component props</caption><thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead><tbody>${props
    .map((p) => `<tr><th scope="row"><code>${esc(p.name)}</code></th><td><code>${esc(p.type)}</code></td><td>${p.default ? `<code>${esc(p.default)}</code>` : '—'}</td><td>${esc(p.description)}</td></tr>`)
    .join('')}</tbody></table></section>`
}

function docList(items) {
  return `<ul class="seo-cards">${items.map((d) => `<li>${a(`/docs/${d.slug}`, d.title)}<p>${esc(seo.clip(d.description, 200))}</p></li>`).join('')}</ul>`
}

/* ── guides (static summaries of the Getting Started pages) ──────────── */
const GUIDES = {
  introduction: () => `<p><strong>${esc(SITE.name)}</strong> is an open-source library of ${componentDocs.length} animated React components styled with Tailwind CSS and Motion. Every component is original code you own: there is no npm package to lock you in.</p>
<p>Add a component with the shadcn CLI or copy the file by hand. Either way the source lives in your repo and you can customise it freely.</p>
<ul><li>Core primitives for everyday UI</li><li>Animated signature components for landing pages and delight</li><li>Works on light and dark pages: <code>dark:</code> variants scoped to the nearest <code>.dark</code> / <code>.light</code> wrapper</li><li>Respects <code>prefers-reduced-motion</code></li></ul>
<p>${a('/docs/installation', 'Read the install guide')} or browse a category:</p>${'<ul>' + cats.map((g) => `<li>${a(catHref(g.title), g.title)}: ${esc(seo.CATEGORY_SEO[g.title].blurb)}</li>`).join('') + '</ul>'}`,
  installation: () => `<p>${esc(SITE.name)} ships as a <strong>shadcn registry</strong>: the shadcn CLI copies a component's source (plus the shared helpers, theme tokens and npm dependencies it needs) straight into your project.</p>
<h2>Option A: shadcn CLI (recommended)</h2><ol>
<li><p><strong>Prerequisites.</strong> A React project on Tailwind CSS v4 (Vite, Next.js, React Router…) with a <code>components.json</code> and an <code>@/*</code> path alias. If you don't have one yet, run:</p>${code('npx shadcn@latest init')}</li>
<li><p><strong>Add a component.</strong> Every component page has its exact command. For example:</p>${code(seo.installCommand('loop-flight-send-button'))}<p>The CLI writes <code>components/ui/loop-flight-send-button.tsx</code>, adds the helpers it imports (<code>lib/cn.ts</code>, <code>lib/use-reduced-motion.ts</code>…), installs npm dependencies such as <code>motion</code> and <code>lucide-react</code>, and merges the Framekit colour tokens into your CSS when a component uses them.</p></li>
<li><p><strong>Register the <code>@framekit</code> namespace (optional)</strong> in <code>components.json</code>, then install by name:</p>${code(`{\n  "registries": {\n    "@framekit": "${U}/r/{name}.json"\n  }\n}`)}${code('npx shadcn@latest add @framekit/ghost-gobbler-skull @framekit/magnetic-button')}<p>The full index lives at ${a('/r/registry.json', '/r/registry.json')}.</p></li></ol>
<p>Step-by-step version with requirements, Next.js notes and troubleshooting: ${a('/guides/install-animated-react-components-shadcn', 'How to install animated React components with the shadcn CLI')}.</p>
<h2>Option B: manual copy-paste</h2><ol><li>Install peer dependencies: ${code('npm install motion clsx tailwind-merge lucide-react')}</li><li>Add the <code>cn</code> helper to <code>lib/cn.ts</code> and the shared hooks a component imports.</li><li>Enable class-based dark mode and the Framekit tokens in your global CSS (see ${a('/docs/theming', 'Theming')}).</li><li>Open any component page, switch to the Code tab, and paste into <code>components/ui/</code>.</li></ol>`,
  theming: () => `<p>Every component is drop-in on both light and dark pages. Colours come from Tailwind <code>dark:</code> variants, and the variant is <strong>class-based</strong>: a <code>dark</code> class on any ancestor switches components inside it to their dark look, and no class means light. Wrap a section in <code>class="light"</code> to force light inside a dark page.</p>
${code('@import "tailwindcss";\n\n/* dark: follows the nearest .dark / .light ancestor */\n@custom-variant dark (&:where(.dark, .dark *):not(:where(.light, .light *):not(:where(.light .dark, .light .dark *))));')}
<p>Canvas-drawn scenes read the same rule through <code>useResolvedTheme</code> and accept <code>theme="auto" | "light" | "dark"</code>. Brand tokens live under <code>signal-*</code> (lilac) and <code>framekit-*</code> (orange), plus a <code>font-display</code> serif; the shadcn CLI adds them via the <code>framekit-theme</code> registry item.</p>`,
}

/* ── long-form guides (/guides/<slug>): the FULL article, from src/docs/guides.ts ── */
const inline = (t) =>
  guides
    .inlineParts(t)
    .map((p) => (p.kind === 'code' ? `<code>${esc(p.text)}</code>` : p.kind === 'strong' ? `<strong>${esc(p.text)}</strong>` : p.kind === 'link' ? a(p.href, p.text) : esc(p.text)))
    .join('')
const codeBlock = (c) => `${c.label ? `<p class="seo-code-label">${esc(c.label)}</p>` : ''}<pre><code class="language-${esc(c.lang)}">${esc(c.code)}</code></pre>`

function guideBlock(b) {
  switch (b.type) {
    case 'p':
      return `<p>${inline(b.text)}</p>`
    case 'note':
      return `<p class="seo-note"><strong>${b.tone === 'warn' ? 'Heads-up' : 'Note'}:</strong> ${inline(b.text)}</p>`
    case 'list':
      return `<${b.ordered ? 'ol' : 'ul'}>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${b.ordered ? 'ol' : 'ul'}>`
    case 'steps':
      return `<ol>${b.items.map((st) => `<li><p><strong>${esc(st.title)}.</strong> ${inline(st.text)}</p>${st.code ? codeBlock(st.code) : ''}</li>`).join('')}</ol>`
    case 'code':
      return codeBlock(b)
    case 'command':
    case 'install':
      return `<pre><code class="language-bash">${esc(guides.commandText(b))}</code></pre>`
    case 'table':
      return `<table><caption>${esc(b.caption)}</caption><thead><tr>${b.head.map((h) => `<th scope="col">${inline(h)}</th>`).join('')}</tr></thead><tbody>${b.rows
        .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`)).join('')}</tr>`)
        .join('')}</tbody></table>`
    case 'examples': {
      const docs = b.slugs.map((x) => getDoc(x)).filter(Boolean)
      return `<p>${esc(b.title ?? 'Framekit examples')}: ${docs.map((d) => a(`/docs/${d.slug}`, d.title)).join(', ')}.</p>`
    }
  }
  return ''
}

function guideBody(g) {
  const others = guides.GUIDES.filter((x) => x.slug !== g.slug)
  const toc = `<nav aria-label="On this page"><ul>${g.sections.map((x) => `<li>${a(`#${x.id}`, x.title)}</li>`).join('')}<li>${a('#faq', 'FAQ')}</li></ul></nav>`
  return `<article>${crumbs([{ name: SITE.name, path: '/' }, { name: 'Docs', path: '/docs/introduction' }, { name: guides.GUIDES_TITLE, path: '/guides' }, { name: g.navTitle }])}
<h1>${esc(g.title)}</h1><p class="seo-lede">${inline(g.summary)}</p>
<p>Updated <time datetime="${g.dateModified}">${g.dateModified}</time> · ${guides.readingMinutes(g)} min read</p>${toc}
${g.sections
  .map((x) => `<section id="${esc(x.id)}" aria-labelledby="${esc(x.id)}-h"><h2 id="${esc(x.id)}-h">${esc(x.title)}</h2><p>${inline(x.answer)}</p>${x.blocks.map(guideBlock).join('')}</section>`)
  .join('\n')}
<section id="faq" aria-labelledby="faq-h"><h2 id="faq-h">FAQ</h2>${g.faq.map((f) => `<div><h3>${esc(f.q)}</h3><p>${inline(f.a)}</p></div>`).join('')}</section>
<section aria-labelledby="rel-h"><h2 id="rel-h">Components in this guide</h2>${docList(g.related.map((x) => getDoc(x)).filter(Boolean))}</section>
<nav aria-label="More guides"><ul>${others.map((o) => `<li>${a(`/guides/${o.slug}`, o.navTitle)}</li>`).join('')}</ul></nav></article>`
}

function guidesIndexBody() {
  return `<article>${crumbs([{ name: SITE.name, path: '/' }, { name: 'Docs', path: '/docs/introduction' }, { name: guides.GUIDES_TITLE }])}<h1>${esc(guides.GUIDES_TITLE)}</h1><p class="seo-lede">${esc(guides.GUIDES_DESC)}</p>
<ul class="seo-cards">${guides.GUIDES.map((g) => `<li>${a(`/guides/${g.slug}`, g.title)}<p>${esc(g.description)}</p></li>`).join('')}</ul>
<nav aria-label="Getting started"><h2>Getting started</h2><ul><li>${a('/docs/introduction', 'Introduction')}</li><li>${a('/docs/installation', 'Installation')}</li><li>${a('/docs/theming', 'Theming')}</li></ul></nav></article>`
}

/* ── page bodies ─────────────────────────────────────────────────────── */
function docBody(doc) {
  const isGuide = doc.category === 'Getting Started'
  const trail = isGuide
    ? [{ name: SITE.name, path: '/' }, { name: 'Docs', path: '/docs/introduction' }, { name: doc.title }]
    : [{ name: SITE.name, path: '/' }, { name: doc.category, path: catHref(doc.category) }, { name: doc.title }]
  const { prev, next } = getPrevNext(doc.slug)
  const pn = `<nav aria-label="Previous and next" class="seo-pn">${prev ? `<p>Previous: ${a(`/docs/${prev.slug}`, prev.title, ' rel="prev"')}</p>` : ''}${next ? `<p>Next: ${a(`/docs/${next.slug}`, next.title, ' rel="next"')}</p>` : ''}</nav>`
  const head = `${crumbs(trail)}<h1>${esc(doc.title)}</h1><p class="seo-lede">${esc(doc.description)}</p>`
  if (isGuide) return `<article>${head}${GUIDES[doc.slug]?.() ?? ''}${pn}</article>`
  const items = DOCS.filter((d) => d.category === doc.category)
  return `<article>${head}
${doc.gesture ? `<p><strong>Try it:</strong> ${esc(doc.gesture)}</p>` : ''}
${doc.ownBackground ? `<p><strong>Brings its own background.</strong> ${esc(doc.backgroundNote ?? 'Paints its own backdrop; override it with className.')}</p>` : ''}
<section aria-labelledby="install-h"><h2 id="install-h">Installation</h2><p>Install with the shadcn CLI:</p>${code(seo.installCommand(doc.slug))}<p>Or, with the <code>@framekit</code> namespace registered: <code>npx shadcn@latest add @framekit/${esc(doc.slug)}</code>. You can also copy the source into <code>components/ui/${esc(doc.slug)}.tsx</code> (${a(`${SITE.github}/blob/master/src/components/ui/${doc.slug}.tsx`, 'view on GitHub')}).</p></section>
<section aria-labelledby="usage-h"><h2 id="usage-h">Usage</h2>${code(`import { ${exportName(doc.slug)} } from '@/components/ui/${doc.slug}'`)}</section>
${propsTable(doc.props)}
${doc.dependencies?.length ? `<section aria-labelledby="deps-h"><h2 id="deps-h">Dependencies</h2><ul>${doc.dependencies.map((d) => `<li><code>${esc(d)}</code></li>`).join('')}</ul></section>` : ''}
<section aria-labelledby="related-h"><h2 id="related-h">Related ${esc(doc.category)} components</h2>${docList(seo.relatedDocs(doc, 6))}<p>${a(catHref(doc.category), `See all ${items.length} ${doc.category} components`)}</p></section>
${pn}</article>`
}

function categoryBody(cat) {
  const items = DOCS.filter((d) => d.category === cat)
  return `<article>${crumbs([{ name: SITE.name, path: '/' }, { name: 'Docs', path: '/docs/introduction' }, { name: cat }])}
<h1>${esc(cat)}</h1><p class="seo-lede">${esc(seo.CATEGORY_SEO[cat].blurb)} ${items.length} component${items.length === 1 ? '' : 's'}: pick one to see it live, then copy it into your project or install it with the shadcn CLI.</p>
${docList(items)}
<nav aria-label="Other categories"><h2>Other categories</h2><ul>${cats.filter((g) => g.title !== cat).map((g) => `<li>${a(catHref(g.title), `${g.title} (${g.items.length})`)}</li>`).join('')}</ul></nav></article>`
}

const FEATURED = ['perspective-tunnel-carousel', 'glass-app-dock', 'spotlight-command-palette', 'pricing-plans', 'scroll-product-reveal', 'glow-candle-card', 'activity-rings', 'liquid-glass-tab-bar', 'blur-cascade-heading', 'glass-mega-navbar']
  .map((s) => getDoc(s))
  .filter(Boolean)

function homeBody() {
  const faq = LANDING_FAQ.map(
    (f) => `<div><h3>${esc(f.q)}</h3><p>${faqAnswerParts(f.a).map((p) => ('href' in p ? a(p.href, p.text) : esc(p.text))).join('')}</p></div>`,
  ).join('')
  return `<article><h1>${esc(seo.HOME_HEADLINE)}</h1>
<p class="seo-lede">${esc(seo.HOME_DESC)} ${componentDocs.length} components across ${cats.length} categories, free under the ${esc(SITE.license)} licence.</p>
<p>Install any component with one command:</p>${code(seo.installCommand('<slug>'))}
<p>${a('/docs/introduction', 'Browse components')} · ${a('/docs/installation', 'Installation guide')} · ${a(SITE.github, 'GitHub')}</p>
<section aria-labelledby="featured-h"><h2 id="featured-h">Featured components</h2>${docList(FEATURED)}</section>
<section aria-labelledby="cats-h"><h2 id="cats-h">Browse by category</h2><ul class="seo-cards">${cats
    .map((g) => `<li>${a(catHref(g.title), `${g.title} (${g.items.length})`)}<p>${esc(seo.CATEGORY_SEO[g.title].blurb)}</p></li>`)
    .join('')}</ul></section>
<section aria-labelledby="faq-title"><h2 id="faq-title">Frequently asked questions</h2>${faq}</section></article>`
}

/* ── /privacy ─────────────────────────────────────────────────────────── */
function privacyInline(t) {
  return privacy.privacyInline(t).map((p) => (p.kind === 'link' ? a(p.href, p.text) : p.kind === 'code' ? `<code>${esc(p.text)}</code>` : p.kind === 'strong' ? `<strong>${esc(p.text)}</strong>` : esc(p.text))).join('')
}
function privacyBody() {
  return `<article>${crumbs([{ name: SITE.name, path: '/' }, { name: 'Privacy' }])}<h1>${esc(privacy.PRIVACY_TITLE)}</h1>
<p>Last updated <time datetime="${privacy.PRIVACY_UPDATED}">${privacy.PRIVACY_UPDATED}</time></p><p class="seo-lede">${esc(privacy.PRIVACY_SUMMARY)}</p>
${privacy.PRIVACY_SECTIONS.map((x) => `<section id="${x.id}"><h2>${esc(x.title)}</h2>${(x.paras ?? []).map((p) => `<p>${privacyInline(p)}</p>`).join('')}${x.items ? `<ul>${x.items.map((i) => `<li>${privacyInline(i)}</li>`).join('')}</ul>` : ''}${x.table ? `<table><caption>${esc(x.table.caption)}</caption><thead><tr>${x.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${x.table.rows.map(([k, v]) => `<tr><th scope="row"><code>${esc(k)}</code></th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>` : ''}</section>`).join('')}</article>`
}

/* ── head + document ─────────────────────────────────────────────────── */
// Drop the template's route-specific tags; we re-emit them per page.
const base = template
  .replace(/\s*<title>[\s\S]*?<\/title>/, '')
  .replace(/\s*<meta\s+name="description"[^>]*>/g, '')
  .replace(/\s*<meta\s+name="robots"[^>]*>/g, '')
  .replace(/\s*<meta\s+property="og:(title|description|url|type|image)"[^>]*>/g, '')
  .replace(/\s*<meta\s+name="twitter:(title|description|image)"[^>]*>/g, '')
  .replace(/\s*<link\s+rel="canonical"[^>]*>/g, '')

const SHELL_CSS = `<style id="seo-shell-css">#seo-shell{max-width:56rem;margin:0 auto;padding:1.5rem;font:16px/1.6 Geist,ui-sans-serif,system-ui,sans-serif;color:#18181b}html.dark #seo-shell{color:#e4e4e7}#seo-shell a{color:inherit;text-decoration:underline;text-underline-offset:2px}#seo-shell p{margin:.5rem 0}#seo-shell h2{font-size:1.375rem;font-weight:600;margin:2.25rem 0 .5rem}#seo-shell h3{font-size:1.05rem;font-weight:600;margin:1.25rem 0 .25rem}#seo-shell ul{list-style:disc}#seo-shell ol{list-style:decimal}#seo-shell li{margin:.25rem 0}#seo-shell caption{text-align:left;font-size:.8rem;opacity:.7}#seo-shell .seo-brand{font-weight:700;text-decoration:none}#seo-shell .seo-footer{margin-top:3rem;font-size:.875rem}#seo-shell h1{font-size:2.25rem;line-height:1.1;margin:1rem 0 .5rem}#seo-shell pre{overflow-x:auto;padding:.75rem 1rem;border-radius:.75rem;background:rgb(127 127 127/.12);font-size:.85rem}#seo-shell table{width:100%;border-collapse:collapse;font-size:.875rem}#seo-shell th,#seo-shell td{text-align:left;vertical-align:top;padding:.4rem .5rem;border-top:1px solid rgb(127 127 127/.25)}#seo-shell ul,#seo-shell ol{padding-left:1.25rem}#seo-shell .seo-crumbs{display:flex;flex-wrap:wrap;gap:.5rem;list-style:none;padding:0;font-size:.875rem}#seo-shell .seo-crumbs li+li:before{content:"›";margin-right:.5rem}#seo-shell .seo-header ul,#seo-shell .seo-footer ul,#seo-shell .seo-crumbs{list-style:none}#seo-shell .seo-header ul,#seo-shell .seo-footer ul{display:flex;flex-wrap:wrap;gap:.25rem 1rem;list-style:none;padding:0}#seo-shell .seo-note{padding:.5rem .75rem;border-left:3px solid #7d6899}#seo-shell .seo-code-label{font-size:.8rem;opacity:.7;margin-bottom:-.25rem}html[data-js] #seo-shell{visibility:hidden;animation:fk-seo-show 0s 8s forwards}@keyframes fk-seo-show{to{visibility:visible}}</style>`

function render(meta, body, { noindex = false } = {}) {
  const url = meta.found ? `${U}${meta.path === '/' ? '/' : meta.path}` : `${U}/`
  const headTags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    meta.found ? `<link rel="canonical" href="${esc(url)}" />` : '',
    `<meta property="og:type" content="${meta.ogType}" />`,
    `<meta property="og:image" content="${esc(meta.image)}" />`,
    `<meta property="og:image:alt" content="${esc(meta.title)}" />`,
    `<meta name="twitter:image" content="${esc(meta.image)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    ...meta.jsonLd.map(ld),
    SHELL_CSS,
  ]
    .filter(Boolean)
    .map((l) => `    ${l}`)
    .join('\n')
  return base
    .replace(/(<meta\s+name="viewport"[^>]*>)/, `$1\n    <!--seo-head-->\n${headTags}\n    <!--/seo-head-->`)
    .replace('<div id="root"></div>', `<div id="root"><!--seo-shell--><div id="seo-shell">${header}<main>${body}</main>${footer}</div><!--/seo-shell--></div>`)
}

function write(rel, html) {
  const file = path.join(DIST, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
}

/* ── emit ────────────────────────────────────────────────────────────── */
const routes = seo.sitemapRoutes()
let bytes = 0
for (const { path: p } of routes) {
  const meta = seo.routeSeo(p, guides)
  if (!meta.found) throw new Error(`prerender: route ${p} has no SEO metadata`)
  const parts = p.split('/').filter(Boolean)
  let body
  if (parts.length === 0) body = homeBody()
  else if (parts[0] === 'privacy') body = privacyBody()
  else if (parts[0] === 'guides') body = parts[1] ? guideBody(guides.getGuide(parts[1])) : guidesIndexBody()
  else if (parts[1] === 'category') body = categoryBody(getCategoryBySlug(parts[2]))
  else body = docBody(getDoc(parts[1]))
  const html = render(meta, body)
  bytes += html.length
  write(p === '/' ? 'index.html' : `${p.slice(1)}/index.html`, html)
}

// 404: Vercel serves dist/404.html with a real 404 status for any path with no file. The SPA still boots on it,
// so client-side "not found" UI (unknown /docs/<slug>) keeps working.
const nf = seo.routeSeo('/__not-found__', guides)
write(
  '404.html',
  render(
    nf,
    `<article><h1>Page not found</h1><p class="seo-lede">This page doesn't exist. The component may have been renamed, or the link is mistyped.</p><p>${a('/', 'Go to the home page')} · ${a('/docs/introduction', 'Browse the docs')}</p></article>`,
    { noindex: true },
  ),
)

console.log(`prerender: ${routes.length} routes + 404.html → dist (${(bytes / 1024 / 1024).toFixed(1)} MB HTML) in ${((performance.now() - t0) / 1000).toFixed(2)}s`)
