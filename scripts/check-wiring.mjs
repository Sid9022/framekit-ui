#!/usr/bin/env node
/**
 * Verifies that every component is fully wired into the docs site and the shadcn registry.
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
const hasKey = (code, slug) => new RegExp(`(^|[\\s{,])(['"]?)${esc(slug)}\\2\\s*:`, 'm').test(code)

const DOCS = await loadDocs()
const registrySrc = read('src/docs/registry.ts')
const sources = read('src/docs/sources.ts')
const demos = read('src/docs/demos.tsx')
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
  if (!sources.includes(`components/ui/${d.slug}.tsx?raw'`) || !hasKey(sources, d.slug))
    errors.push(`${d.slug}: no ?raw import + map entry in src/docs/sources.ts (Code tab will be empty)`)
  if (!hasKey(demos, d.slug)) errors.push(`${d.slug}: no demo entry in src/docs/demos.tsx (preview will be empty)`)

  const code = read(rel)
  if (/from\s+['"](three|@react-three\/[\w-]+)['"]/.test(code)) errors.push(`${d.slug}: three.js is not allowed — use CSS 3D, SVG or canvas 2D`)
  if (/from\s+['"]framer-motion['"]/.test(code)) errors.push(`${d.slug}: import from "motion/react", not "framer-motion"`)
  const animates = /from\s+['"]motion\/react['"]|requestAnimationFrame|\banimate-[a-z]/.test(code)
  const handlesReduced = /usePrefersReducedMotion|useReducedMotion|motion-reduce:|prefers-reduced-motion/.test(code)
  if (animates && !handlesReduced) warnings.push(`${d.slug}: animates but has no reduced-motion path`)
}

const registered = new Set(components.map((d) => d.slug))
for (const f of fs.readdirSync(path.join(ROOT, 'src/components/ui'))) {
  const slug = f.replace(/\.tsx$/, '')
  if (f.endsWith('.tsx') && !registered.has(slug)) errors.push(`src/components/ui/${f} has no DOCS entry in src/docs/registry.ts`)
}

for (const w of warnings) console.warn(`warn  ${w}`)
for (const e of errors) console.error(`error ${e}`)
console.log(`\n${components.length} components checked — ${errors.length} error(s), ${warnings.length} warning(s)`)
process.exit(errors.length ? 1 : 0)
