/**
 * Import a small, side-effect-free TypeScript module graph from Node (no bundler):
 * transpiles the entry and every relative / `@/…` .ts import into a temp dir, then imports it.
 * Used by the prebuild/postbuild scripts to read src/docs/registry.ts, seo.ts and faq.ts.
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL, fileURLToPath } from 'node:url'
import ts from 'typescript'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const SRC = path.join(ROOT, 'src')

function resolveSpec(fromFile, spec) {
  let base
  if (spec.startsWith('@/')) base = path.join(SRC, spec.slice(2))
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromFile), spec)
  else return null
  for (const cand of [base, `${base}.ts`, path.join(base, 'index.ts')]) if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand
  throw new Error(`load-ts: cannot resolve "${spec}" from ${path.relative(ROOT, fromFile)} (only .ts modules are supported)`)
}

export async function loadTs(entryRel) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'framekit-ts-'))
  const done = new Map()
  const outFor = (abs) => path.join(tmp, path.relative(SRC, abs).replace(/\.ts$/, '.mjs'))
  const visit = (abs) => {
    if (done.has(abs)) return
    done.set(abs, outFor(abs))
    let code = ts.transpileModule(fs.readFileSync(abs, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText
    code = code.replace(/(from\s+|import\s*\(\s*)(['"])([^'"]+)\2/g, (m, pre, q, spec) => {
      const dep = resolveSpec(abs, spec)
      if (!dep) return m
      visit(dep)
      let rel = path.relative(path.dirname(outFor(abs)), outFor(dep)).split(path.sep).join('/')
      if (!rel.startsWith('.')) rel = `./${rel}`
      return `${pre}${q}${rel}${q}`
    })
    fs.mkdirSync(path.dirname(outFor(abs)), { recursive: true })
    fs.writeFileSync(outFor(abs), code)
  }
  const entry = path.join(ROOT, entryRel)
  visit(entry)
  try {
    return await import(pathToFileURL(outFor(entry)).href)
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}
