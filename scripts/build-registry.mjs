#!/usr/bin/env node
/**
 * Generates ./registry.json (shadcn registry schema) from src/docs/registry.ts (DOCS)
 * and the component/lib sources, so the CLI registry never drifts from the docs.
 *
 *   node scripts/build-registry.mjs          # writes registry.json
 *   npx shadcn build -o public/r             # emits public/r/<name>.json + registry.json
 *
 * Both run automatically via `npm run build` (prebuild).
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL, fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const HOMEPAGE = 'https://framekit-ui.vercel.app'
// REGISTRY_BASE_URL lets you test against a local server before deploying.
const BASE = (process.env.REGISTRY_BASE_URL || HOMEPAGE).replace(/\/$/, '')
const R = (name) => `${BASE}/r/${name}.json`
const UI_DIR = 'src/components/ui'
const LIB_DIR = 'src/lib'

// ── load DOCS from the TS registry (transpile → temp ESM → import) ──────────
async function loadDocs() {
  const src = fs.readFileSync(path.join(ROOT, 'src/docs/registry.ts'), 'utf8')
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const tmp = path.join(os.tmpdir(), `framekit-docs-${process.pid}.mjs`)
  fs.writeFileSync(tmp, js)
  try {
    return (await import(pathToFileURL(tmp).href)).DOCS
  } finally {
    fs.rmSync(tmp, { force: true })
  }
}

const slugify = (s) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function importsOf(code) {
  const out = new Set()
  const re = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g
  for (const m of code.matchAll(re)) out.add(m[1] || m[2] || m[3])
  return [...out]
}

/** Bare npm package name from an import specifier. */
function pkgName(spec) {
  if (spec.startsWith('.') || spec.startsWith('@/')) return null
  const parts = spec.split('/')
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

// Provided by every React project — never list as deps.
const IMPLICIT = new Set(['react', 'react-dom'])

// ── global CSS the components rely on (mirrors src/index.css) ──────────────
function readThemeTokens() {
  const css = fs.readFileSync(path.join(ROOT, 'src/index.css'), 'utf8')
  const block = css.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
  const theme = {}
  for (const m of block.matchAll(/--((?:color-(?:framekit|signal)-\d+)|font-display)\s*:\s*([^;]+);/g)) {
    theme[m[1]] = m[2].trim()
  }
  return theme
}
const THEME_USE = /\b(?:framekit|signal)-\d{2,3}\b|\bfont-display\b|\bframekit-scroll\b/

async function main() {
  const DOCS = await loadDocs()
  const components = DOCS.filter((d) => d.category !== 'Getting Started')

  // lib helpers = every src/lib file imported by at least one component
  const libFiles = fs.readdirSync(path.join(ROOT, LIB_DIR)).filter((f) => /\.tsx?$/.test(f))
  const libNames = new Set(libFiles.map((f) => f.replace(/\.tsx?$/, '')))
  const libMeta = {
    cn: { title: 'cn()', description: 'Merge Tailwind class names safely (clsx + tailwind-merge).' },
    'use-reduced-motion': { title: 'usePrefersReducedMotion', description: 'Hook that tracks the prefers-reduced-motion media query.' },
    'use-resolved-theme': { title: 'useResolvedTheme', description: 'Resolves light/dark for canvas components from the nearest .dark / .light ancestor.' },
    toggle: { title: 'useToggleState', description: 'Controlled/uncontrolled boolean state shared by the Framekit toggles.' },
  }

  const used = new Set()
  const uiItems = []
  const missing = []
  const slugs = new Set(components.map((d) => d.slug))

  for (const d of components) {
    const rel = `${UI_DIR}/${d.slug}.tsx`
    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) {
      missing.push(d.slug)
      continue
    }
    const code = fs.readFileSync(abs, 'utf8')
    const deps = new Set()
    const reg = new Set()
    for (const spec of importsOf(code)) {
      const pkg = pkgName(spec)
      if (pkg) {
        if (!IMPLICIT.has(pkg)) deps.add(pkg)
        continue
      }
      let m
      if ((m = spec.match(/^@\/lib\/([\w-]+)$/)) && libNames.has(m[1])) {
        reg.add(R(m[1]))
        used.add(m[1])
      } else if ((m = spec.match(/^@\/components\/ui\/([\w-]+)$/)) && slugs.has(m[1])) {
        reg.add(R(m[1]))
      } else if (spec.startsWith('@/') || spec.startsWith('.')) {
        throw new Error(`${rel}: unsupported local import "${spec}"`)
      }
    }
    if (THEME_USE.test(code)) reg.add(R('framekit-theme'))

    uiItems.push({
      name: d.slug,
      type: 'registry:ui',
      title: d.title,
      description: d.description,
      ...(deps.size ? { dependencies: [...deps].sort() } : {}),
      ...(reg.size ? { registryDependencies: [...reg].sort() } : {}),
      files: [{ path: rel, type: 'registry:ui' }],
      categories: [slugify(d.category)],
      docs: `Docs & live preview: ${HOMEPAGE}/#/docs/${d.slug}`,
    })
  }
  if (missing.length) throw new Error(`DOCS entries without a component file: ${missing.join(', ')}`)

  const libItems = libFiles
    .map((f) => f.replace(/\.tsx?$/, ''))
    .filter((n) => used.has(n))
    .sort()
    .map((name) => {
      const file = libFiles.find((f) => f.replace(/\.tsx?$/, '') === name)
      const code = fs.readFileSync(path.join(ROOT, LIB_DIR, file), 'utf8')
      const deps = importsOf(code).map(pkgName).filter((p) => p && !IMPLICIT.has(p))
      return {
        name,
        type: 'registry:lib',
        title: libMeta[name]?.title ?? name,
        description: libMeta[name]?.description ?? `Framekit shared helper (${name}).`,
        ...(deps.length ? { dependencies: [...new Set(deps)].sort() } : {}),
        files: [{ path: `${LIB_DIR}/${file}`, type: 'registry:lib', target: `@lib/${file}` }],
        categories: ['lib'],
      }
    })

  const themeItem = {
    name: 'framekit-theme',
    type: 'registry:theme',
    title: 'Framekit theme tokens',
    description:
      'Framekit brand tokens used by the components: signal-* (lilac) and framekit-* (orange) color scales, the display font token and the framekit-scroll scrollbar style.',
    // Palette tokens go to :root (light) and are mapped by the CLI to
    // `--color-<name>: var(--<name>)` in `@theme inline`, so bg-signal-300 etc. work.
    cssVars: (() => {
      const t = readThemeTokens()
      const colors = Object.fromEntries(
        Object.entries(t).filter(([k]) => k.startsWith('color-')).map(([k, v]) => [k.slice(6), v]),
      )
      return { theme: { 'font-display': t['font-display'] }, light: colors }
    })(),
    css: {
      '@layer components': {
        '.framekit-scroll::-webkit-scrollbar': { width: '8px', height: '8px' },
        '.framekit-scroll::-webkit-scrollbar-thumb': { background: '#a1a1aa', 'border-radius': '999px' },
        '.dark .framekit-scroll::-webkit-scrollbar-thumb': { background: '#3f3f46' },
      },
    },
    categories: ['theme'],
  }

  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'framekit',
    homepage: HOMEPAGE,
    items: [...libItems, themeItem, ...uiItems],
  }
  fs.writeFileSync(path.join(ROOT, 'registry.json'), JSON.stringify(registry, null, 2) + '\n')
  console.log(
    `registry.json: ${registry.items.length} items (${libItems.length} lib, 1 theme, ${uiItems.length} ui)`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
