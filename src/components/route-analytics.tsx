import { useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'

/**
 * Vercel Web Analytics for the hash-routed site: reports `/#/docs/<slug>` as
 * path `/docs/<slug>` (route `/docs/[slug]`) so every doc page shows up separately.
 */
export function RouteAnalytics() {
  const { pathname } = useLocation()
  const route = pathname.startsWith('/docs/') ? '/docs/[slug]' : pathname
  return <Analytics route={route} path={pathname} />
}
