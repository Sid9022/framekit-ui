#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from src/docs/seo.ts → sitemapRoutes(): the landing page, every docs page
 * (/docs/<slug>) and every category page (/docs/category/<category>). Runs in `prebuild`.
 * The same route list drives scripts/prerender.mjs (postbuild).
 *
 *   node scripts/build-sitemap.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, loadTs } from './lib/load-ts.mjs'

const SITE_URL = (process.env.SITE_URL || 'https://framekit-ui.vercel.app').replace(/\/$/, '')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const { sitemapRoutes } = await loadTs('src/docs/seo.ts')
const routes = sitemapRoutes()
const today = new Date().toISOString().slice(0, 10)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((u) => `  <url><loc>${esc(SITE_URL + u.path)}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`)
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(ROOT, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml: ${routes.length} URLs (${routes.filter((r) => r.path.startsWith('/docs/category/')).length} categories)`)
