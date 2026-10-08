#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from src/docs/registry.ts: the landing page, every docs page
 * (/docs/<slug>) and every category page (/docs/category/<category>). Runs in `prebuild`.
 *
 *   node scripts/build-sitemap.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL, fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = (process.env.SITE_URL || 'https://framekit-ui.vercel.app').replace(/\/$/, '')

async function loadRegistry() {
  const src = fs.readFileSync(path.join(ROOT, 'src/docs/registry.ts'), 'utf8')
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const tmp = path.join(os.tmpdir(), `framekit-sitemap-${process.pid}.mjs`)
  fs.writeFileSync(tmp, js)
  try {
    return await import(pathToFileURL(tmp).href)
  } finally {
    fs.rmSync(tmp, { force: true })
  }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const { getNavGroups, categorySlug } = await loadRegistry()
const groups = getNavGroups()
const today = new Date().toISOString().slice(0, 10)

const urls = [{ loc: '/', priority: '1.0', changefreq: 'weekly' }]
for (const g of groups) {
  if (g.title !== 'Getting Started') urls.push({ loc: `/docs/category/${categorySlug(g.title)}`, priority: '0.7', changefreq: 'weekly' })
  for (const d of g.items) urls.push({ loc: `/docs/${d.slug}`, priority: g.title === 'Getting Started' ? '0.9' : '0.8', changefreq: 'monthly' })
}
const seen = new Set()
const unique = urls.filter((u) => (seen.has(u.loc) ? false : (seen.add(u.loc), true)))

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map((u) => `  <url><loc>${esc(SITE_URL + u.loc)}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`)
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml: ${unique.length} URLs (${groups.length - 1} categories)`)
