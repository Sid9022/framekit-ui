#!/usr/bin/env node
/**
 * Build step (after vite build): a branded 1200×630 Open Graph PNG for every docs page, category page and guide
 * → dist/og/{docs,category,guides}/<slug>.png (+ dist/og/guides.png). seo.ts → ogImagePath() points og:image /
 * twitter:image at them; the landing page keeps the hand-made public/og.png.
 *
 * Pure Node (satori → SVG, @resvg/resvg-js → PNG) with bundled @fontsource fonts, so it runs on Vercel's build
 * image without Chromium. Each card is cached by a content hash (template + fonts + text) in
 * node_modules/.cache/framekit-og — Vercel restores node_modules between builds, so only new or edited pages are
 * re-rendered. Cold renders are spread over worker threads.
 *
 *   node scripts/build-og.mjs            (runs in `npm run build`)
 *   OG_ONLY=docs/glass-app-dock node scripts/build-og.mjs   (render one card, for template work)
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { Worker } from 'node:worker_threads'
import { ROOT, loadTs } from './lib/load-ts.mjs'

const t0 = performance.now()
const seo = await loadTs('src/docs/seo.ts')
const { DOCS, getNavGroups, categorySlug } = await loadTs('src/docs/registry.ts')
const guides = await loadTs('src/docs/guides.ts')

const DIST = path.join(ROOT, process.env.OG_OUT || 'dist')
const CACHE = path.join(ROOT, 'node_modules/.cache/framekit-og')
fs.mkdirSync(CACHE, { recursive: true })

/* ── card specs ──────────────────────────────────────────────────────── */
const firstSentence = (s) => {
  const flat = s.replace(/\s+/g, ' ').trim()
  return seo.clip(flat.match(/^(.+?[.!?])(\s|$)/)?.[1] ?? flat, 118)
}
const specs = []
const cats = getNavGroups().filter((g) => g.title !== 'Getting Started')
for (const d of DOCS) {
  const guide = d.category === 'Getting Started'
  specs.push({
    out: `og/docs/${d.slug}.png`,
    card: {
      theme: guide ? 'paper' : 'ink',
      kicker: guide ? 'Docs · Getting started' : d.category,
      title: d.title,
      description: firstSentence(d.description),
      command: seo.installCommand(guide ? '<slug>' : d.slug),
      footer: guide ? 'Open-source animated React components' : `${seo.CATEGORY_SEO[d.category].noun.replace(/^\w/, (c) => c.toUpperCase())} · MIT`,
    },
  })
}
for (const g of cats) {
  const names = g.items.slice(0, 3).map((d) => d.title)
  specs.push({
    out: `og/category/${categorySlug(g.title)}.png`,
    card: {
      theme: 'ink',
      kicker: `Category · ${g.items.length} component${g.items.length === 1 ? '' : 's'}`,
      title: seo.CATEGORY_SEO[g.title].title,
      description: `${seo.CATEGORY_SEO[g.title].blurb} Includes ${names.join(', ')}${g.items.length > 3 ? ' and more' : ''}.`,
      footer: 'React 19 · Tailwind CSS v4 · Motion',
      badge: 'Category',
    },
  })
}
for (const g of guides.GUIDES) {
  specs.push({
    out: `og/guides/${g.slug}.png`,
    card: {
      theme: 'paper',
      kicker: g.eyebrow,
      title: g.title,
      description: seo.clip(g.description, 130),
      command: g.howTo ? seo.installCommand('<slug>') : undefined,
      footer: `Guide · ${guides.readingMinutes(g)} min read`,
      badge: 'Guide',
    },
  })
}
specs.push({
  out: 'og/guides.png',
  card: { theme: 'paper', kicker: 'Guides', title: 'Guides for premium, accessible motion', description: seo.clip(guides.GUIDES_DESC, 130), footer: `${guides.GUIDES.length} in-depth guides`, badge: 'Guides' },
})

/* ── cache key: template + renderer + fonts + text ───────────────────── */
const OG_DIR = path.join(ROOT, 'scripts/og')
const fontFiles = (await import('./og/fonts.mjs')).FONT_FILES
const base = crypto.createHash('sha1')
for (const f of ['template.mjs', 'render-worker.mjs', 'fonts.mjs', 'keyframe-app-icon.svg']) base.update(fs.readFileSync(path.join(OG_DIR, f)))
for (const f of fontFiles) base.update(`${f.file}:${fs.statSync(f.file).size}`)
for (const p of ['satori', '@resvg/resvg-js']) base.update(JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', p, 'package.json'), 'utf8')).version)
const baseHash = base.digest('hex')
const keyOf = (s) => crypto.createHash('sha1').update(baseHash).update(JSON.stringify(s.card)).digest('hex').slice(0, 20)

const only = process.env.OG_ONLY
const todo = []
let hits = 0
for (const s of only ? specs.filter((x) => x.out.includes(only)) : specs) {
  s.cache = path.join(CACHE, `${keyOf(s)}.png`)
  if (fs.existsSync(s.cache)) hits++
  else todo.push(s)
}

/* ── render misses on a worker pool ──────────────────────────────────── */
if (todo.length) {
  const n = Math.max(1, Math.min(todo.length, (os.availableParallelism?.() ?? os.cpus().length) - 0, 8))
  const queue = [...todo]
  await Promise.all(
    Array.from({ length: n }, () =>
      new Promise((resolve, reject) => {
        const w = new Worker(new URL('./og/render-worker.mjs', import.meta.url))
        const next = () => {
          const s = queue.shift()
          if (!s) return w.terminate().then(resolve)
          w.postMessage({ card: s.card, file: s.cache })
        }
        w.on('message', (m) => (m.error ? reject(new Error(`og: ${m.error}`)) : next()))
        w.on('error', reject)
        next()
      }),
    ),
  )
}

/* ── copy into dist ──────────────────────────────────────────────────── */
let bytes = 0
for (const s of only ? specs.filter((x) => x.out.includes(only)) : specs) {
  const dest = path.join(DIST, s.out)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(s.cache, dest)
  bytes += fs.statSync(dest).size
}
const total = only ? specs.filter((x) => x.out.includes(only)).length : specs.length
console.log(
  `og: ${total} images (${todo.length} rendered, ${hits} cached) → dist/og (${(bytes / 1024 / 1024).toFixed(1)} MB) in ${((performance.now() - t0) / 1000).toFixed(1)}s`,
)
