#!/usr/bin/env node
/**
 * Verifies that every component is fully wired into the docs site and the shadcn registry.
 * Demos are one file per component (src/docs/demos/<slug>.tsx, default export = preview node); raw sources are
 * picked up automatically by the import.meta.glob in src/docs/sources.ts.
 * `npm run build` only fails when a DOCS entry has no component file; a missing demo or
 * `?raw` source silently renders "No live preview" / "Source unavailable". This catches that.
 *
 *   npm run check:wiring
 *
 * Errors (exit 1): duplicate slugs, missing file / source / demo, category missing from
 * NAV_ORDER, component file not registered, banned imports (three, framer-motion).
 * Warnings: animated component with no reduced-motion handling.
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL, fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

async function loadDocs() {
  const js = ts.transpileModule(read('src/docs/registry.ts'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const tmp = path.join(os.tmpdir(), `framekit-wiring-${process.pid}.mjs`)
  fs.writeFileSync(tmp, js)
  try {
    return (await import(pathToFileURL(tmp).href)).DOCS
  } finally {
    fs.rmSync(tmp, { force: true })
  }
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const DOCS = await loadDocs()
const registrySrc = read('src/docs/registry.ts')
const sources = read('src/docs/sources.ts')
const sourcesGlob = /import\.meta\.glob<string>\(\s*'\.\.\/components\/ui\/\*\.tsx',\s*\{\s*query:\s*'\?raw'/.test(sources)
const DEMO_DIR = 'src/docs/demos'
const navBlock = registrySrc.match(/const NAV_ORDER[^=]*=\s*\[([\s\S]*?)\]/)?.[1] ?? ''
const NAV = new Set([...navBlock.matchAll(/'([^']+)'/g)].map((m) => m[1]))

const errors = []
const warnings = []
const seen = new Set()
const components = DOCS.filter((d) => d.category !== 'Getting Started')

for (const d of DOCS) {
  if (seen.has(d.slug)) errors.push(`duplicate slug "${d.slug}" in src/docs/registry.ts`)
  seen.add(d.slug)
  if (!NAV.has(d.category)) errors.push(`${d.slug}: category "${d.category}" is not in NAV_ORDER (it will not appear in the sidebar)`)
}

for (const d of components) {
  const rel = `src/components/ui/${d.slug}.tsx`
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(d.slug)) errors.push(`${d.slug}: slug must be kebab-case`)
  if (!fs.existsSync(path.join(ROOT, rel))) {
    errors.push(`${d.slug}: missing ${rel}`)
    continue
  }
  if (!sourcesGlob) errors.push(`${d.slug}: src/docs/sources.ts no longer globs ../components/ui/*.tsx?raw (Code tab will be empty)`)
  const demoRel = `${DEMO_DIR}/${d.slug}.tsx`
  if (!fs.existsSync(path.join(ROOT, demoRel))) errors.push(`${d.slug}: missing ${demoRel} (preview will be empty)`)
  else if (!/export\s+default\b/.test(read(demoRel))) errors.push(`${demoRel}: needs a default export (the preview node)`)

  const code = read(rel)
  if (/from\s+['"](three|@react-three\/[\w-]+)['"]/.test(code)) errors.push(`${d.slug}: three.js is not allowed — use CSS 3D, SVG or canvas 2D`)
  if (/from\s+['"]framer-motion['"]/.test(code)) errors.push(`${d.slug}: import from "motion/react", not "framer-motion"`)
  const animates = /from\s+['"]motion\/react['"]|requestAnimationFrame|\banimate-[a-z]/.test(code)
  const handlesReduced = /usePrefersReducedMotion|useReducedMotion|motion-reduce:|prefers-reduced-motion/.test(code)
  if (animates && !handlesReduced) warnings.push(`${d.slug}: animates but has no reduced-motion path`)
}

const registered = new Set(components.map((d) => d.slug))
for (const f of fs.readdirSync(path.join(ROOT, DEMO_DIR))) {
  const slug = f.replace(/\.tsx$/, '')
  if (f.endsWith('.tsx') && !registered.has(slug)) errors.push(`${DEMO_DIR}/${f} has no matching DOCS entry (orphan demo)`)
}
for (const f of fs.readdirSync(path.join(ROOT, 'src/components/ui'))) {
  const slug = f.replace(/\.tsx$/, '')
  if (f.endsWith('.tsx') && !registered.has(slug)) errors.push(`src/components/ui/${f} has no DOCS entry in src/docs/registry.ts`)
}

// Clean URLs: internal links must not use legacy hash routes (`#/docs/...`).
const walk = (dir) => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(`${dir}/${e.name}`) : /\.(tsx?|mjs)$/.test(e.name) ? [`${dir}/${e.name}`] : [])
for (const rel of walk('src').filter((f) => f !== 'src/main.tsx')) { // main.tsx holds the legacy redirect
  if (/['"`(]\/?#\/docs\//.test(read(rel)) || /vercel\.app\/#\//.test(read(rel)))
    errors.push(`${rel}: uses a legacy hash route (#/docs/…) — link to the clean path /docs/… with <Link to>`)
}

// Guides: the light nav index (guide-links.ts) must mirror GUIDES (guides.ts), and every linked doc must exist.
{
  const { loadTs } = await import('./lib/load-ts.mjs')
  const { GUIDES } = await loadTs('src/docs/guides.ts')
  const { GUIDE_LINKS } = await loadTs('src/docs/guide-links.ts')
  const a = GUIDES.map((g) => `${g.slug}|${g.navTitle}`).join(',')
  const b = GUIDE_LINKS.map((g) => `${g.slug}|${g.navTitle}`).join(',')
  if (a !== b) errors.push('src/docs/guide-links.ts is out of sync with GUIDES in src/docs/guides.ts (slug + navTitle, same order)')
  const slugs = new Set(DOCS.map((d) => d.slug))
  for (const g of GUIDES) {
    const text = JSON.stringify(g)
    const linked = [...text.matchAll(/\/docs\/([a-z0-9-]+)/g)].map((m) => m[1]).filter((s) => s !== 'category')
    for (const s of [...linked, ...g.related, ...g.sections.flatMap((x) => x.blocks.flatMap((b) => (b.type === 'examples' ? b.slugs : [])))])
      if (!slugs.has(s)) errors.push(`guide ${g.slug}: links to unknown doc "${s}"`)
  }
}

for (const w of warnings) console.warn(`warn  ${w}`)
for (const e of errors) console.error(`error ${e}`)
console.log(`\n${components.length} components checked — ${errors.length} error(s), ${warnings.length} warning(s)`)
process.exit(errors.length ? 1 : 0)
