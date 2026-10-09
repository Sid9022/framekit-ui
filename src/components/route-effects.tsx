import * as React from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { SITE_URL, routeSeo } from '@/docs/seo'

/* ── Scroll restoration ───────────────────────────────────────────────────
 * PUSH / REPLACE → jump to `#anchor` if present, else top.
 * POP (Back / Forward) → restore the position saved for that history entry.
 * Docs pages load lazily, so both retry for a short while until the target
 * element exists / the page is tall enough. `behavior: 'instant'` overrides the
 * global CSS `scroll-behavior: smooth` so route changes never animate the scroll. */
const STORE_KEY = 'framekit-scroll'

function readStore(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}
function writeStore(store: Record<string, number>) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    /* storage blocked – restoration just falls back to top */
  }
}

function scrollToHash(hash: string) {
  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    /* keep raw id */
  }
  const el = id ? document.getElementById(id) : null
  if (!el) return false
  el.scrollIntoView({ block: 'start' })
  return true
}

export function ScrollManager() {
  const location = useLocation()
  const navType = useNavigationType()
  const positions = React.useRef<Record<string, number>>(readStore())
  const currentKey = React.useRef(location.key)
  const isFirst = React.useRef(true)

  // Record the scroll position of whichever history entry is showing (synchronously, so the value
  // is already saved when a navigation commits), and persist it for reloads / bfcache.
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const save = () => {
      // The router pushes the new history entry before React commits the new page, so a scroll event fired
      // in between (e.g. the page shrinking to a skeleton) must not overwrite the entry we're leaving.
      const entryKey = (window.history.state as { key?: string } | null)?.key ?? 'default'
      if (entryKey !== currentKey.current) return
      positions.current[currentKey.current] = window.scrollY
    }
    const persist = () => writeStore(positions.current)
    window.addEventListener('scroll', save, { passive: true })
    window.addEventListener('pagehide', persist)
    return () => {
      persist()
      window.removeEventListener('scroll', save)
      window.removeEventListener('pagehide', persist)
    }
  }, [])

  React.useLayoutEffect(() => {
    currentKey.current = location.key
    // The first render is also a POP: only restore there when the browser itself reloaded / went back to this document.
    const first = isFirst.current
    isFirst.current = false
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const restorable = !first || navEntry?.type === 'reload' || navEntry?.type === 'back_forward'
    const saved = navType === 'POP' && restorable ? positions.current[location.key] : undefined
    let tries = 0
    let raf = 0
    const tick = () => {
      tries += 1
      if (saved !== undefined) {
        const max = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo({ top: Math.min(saved, Math.max(0, max)), left: 0, behavior: 'instant' })
        if (max >= saved || tries > 90) return
      } else if (location.hash) {
        if (scrollToHash(location.hash) || tries > 90) return
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        return
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [location.key, location.pathname, location.hash, navType])

  return null
}

/* ── Per-route <head>: title, description, canonical, og:url / og:title ── */
function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

/** Replace the route's JSON-LD blocks (the prerendered HTML ships the same ones for the first page). */
function syncJsonLd(blocks: object[]) {
  document.head.querySelectorAll('script[data-route-ld]').forEach((el) => el.remove())
  for (const b of blocks) {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-route-ld', '')
    el.textContent = JSON.stringify(b)
    document.head.appendChild(el)
  }
}

export function RouteHead() {
  const { pathname } = useLocation()
  React.useEffect(() => {
    const m = routeSeo(pathname)
    const url = `${SITE_URL}${m.path === '/' ? '/' : m.path}`
    document.title = m.title
    upsertMeta('name', 'description', m.description)
    upsertMeta('property', 'og:title', m.title)
    upsertMeta('property', 'og:description', m.description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:title', m.title)
    upsertMeta('name', 'twitter:description', m.description)
    upsertLink('canonical', url)
    upsertMeta('name', 'robots', m.found ? 'index, follow, max-image-preview:large' : 'noindex, follow')
    syncJsonLd(m.jsonLd)
  }, [pathname])
  return null
}
