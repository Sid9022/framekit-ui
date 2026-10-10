import * as React from 'react'
import { SITE } from '@/config/site'
import baked from '@/generated/github-stars.json'

/**
 * Live GitHub star count for the "Star on GitHub" pills (components/github-stars.tsx).
 *
 * Source, in order:
 *   1. localStorage `framekit-gh-stars` ({ stars, at }), fresh for 1 hour, so a visitor makes at most one
 *      api.github.com request an hour (the unauthenticated limit is 60/h per IP).
 *   2. The value baked at build time by scripts/build-gh-stars.mjs (src/generated/github-stars.json).
 *   3. null: the pills read "Star" instead of a number. They never show "undefined" or a loading 0, and a
 *      repo with no stars yet also reads "Star".
 * Failed requests back off for 10 minutes. All callers share one store, so a page makes one request at most.
 */

const KEY = 'framekit-gh-stars'
const TTL = 60 * 60 * 1000
const RETRY = 10 * 60 * 1000
const REPO = new URL(SITE.github).pathname.replace(/^\/|\/$/g, '')
const API = `https://api.github.com/repos/${REPO}`

type Cache = { stars: number | null; at: number; failed?: boolean }

function readCache(): Cache | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null') as Cache | null
    return c && typeof c.at === 'number' ? c : null
  } catch {
    return null
  }
}
function writeCache(c: Cache) {
  try { localStorage.setItem(KEY, JSON.stringify(c)) } catch { /* private mode / quota */ }
}

const bakedStars = typeof baked.stars === 'number' ? baked.stars : null
let current: number | null = null
let started = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function init() {
  if (started || typeof window === 'undefined') return
  started = true
  const c = readCache()
  current = typeof c?.stars === 'number' ? c.stars : bakedStars
  const fresh = c && Date.now() - c.at < (c.failed ? RETRY : TTL)
  if (fresh) return
  fetch(API)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((d: { stargazers_count?: unknown }) => {
      if (typeof d.stargazers_count !== 'number') throw new Error('no count')
      current = d.stargazers_count
      writeCache({ stars: current, at: Date.now() })
      emit()
    })
    .catch(() => writeCache({ stars: current, at: Date.now(), failed: true }))
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

/** The repo's star count, or null when unknown. */
export function useGithubStars(): number | null {
  init()
  return React.useSyncExternalStore(subscribe, () => current, () => bakedStars)
}

/** 999 · 1.2k · 12k · 1.2M (one decimal under 10 units, none above). */
export function formatStars(n: number): string {
  const f = (v: number, u: string) => `${v < 10 ? Math.floor(v * 10) / 10 : Math.floor(v)}${u}`.replace('.0', '')
  if (n < 1000) return String(n)
  if (n < 1_000_000) return f(n / 1000, 'k')
  return f(n / 1_000_000, 'M')
}

export function starsLabel(n: number | null) {
  const count = n ? `${n.toLocaleString('en-US')} ${n === 1 ? 'star' : 'stars'}, ` : ''
  return `Star ${SITE.name} on GitHub (${count}opens in a new tab)`
}

