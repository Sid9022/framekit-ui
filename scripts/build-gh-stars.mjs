#!/usr/bin/env node
/**
 * Prebuild: bake the repo's GitHub star count into src/generated/github-stars.json, so the "Star on GitHub" pill
 * has a number on first paint (before the client refresh in hooks/use-github-stars.ts).
 *
 * Never fails the build. If the API is unreachable or rate-limited, the last committed value is kept.
 * Set GITHUB_TOKEN to lift the 60 requests/hour unauthenticated limit on shared CI IPs.
 *
 *   node scripts/build-gh-stars.mjs   (runs in `npm run prebuild`)
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, loadTs } from './lib/load-ts.mjs'

const OUT = path.join(ROOT, 'src/generated/github-stars.json')
const { SITE } = await loadTs('src/config/site.ts')
const repo = new URL(SITE.github).pathname.replace(/^\/|\/$/g, '')

let prev = { stars: null, fetchedAt: null }
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')) } catch { /* first run */ }

try {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'framekit-ui-build' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const { stargazers_count: stars } = await res.json()
  if (typeof stars !== 'number') throw new Error('no stargazers_count')
  if (stars !== prev.stars) {
    fs.writeFileSync(OUT, `${JSON.stringify({ stars, fetchedAt: new Date().toISOString() }, null, 2)}\n`)
  }
  console.log(`gh-stars: ${repo} has ${stars} stars${stars === prev.stars ? ' (unchanged)' : ''}`)
} catch (e) {
  console.warn(`gh-stars: fetch failed (${e.message}); keeping ${prev.stars ?? 'no'} baked value`)
}
