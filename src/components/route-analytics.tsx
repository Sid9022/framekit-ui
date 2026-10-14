import { useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'

/**
 * Vercel Web Analytics: reports each clean path (`/docs/<slug>`) under the route
 * `/docs/[slug]` so every doc page shows up separately.
 */
/** The /_vercel/insights script only exists on Vercel; skip it on localhost previews (avoids a 404). */
const LOCAL = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)

export function RouteAnalytics() {
  const { pathname } = useLocation()
  if (LOCAL) return null
  const route = pathname.startsWith('/docs/') ? '/docs/[slug]' : pathname
  return <Analytics route={route} path={pathname} />
}
