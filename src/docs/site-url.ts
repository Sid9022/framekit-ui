/**
 * The ONE place the public site URL lives. Everything else derives from it:
 * src/docs/seo.ts (canonical, og:url, og:image, JSON-LD), install commands (src/components/docs/install-block.tsx),
 * guides, the landing install pill, and the build scripts (sitemap, robots, llms.txt, registry, OG cards, prerender),
 * which load this file via scripts/lib/site-url.mjs.
 *
 * Side-effect free and import-free so Node build scripts can transpile it on its own.
 */
export const SITE_HOST = 'www.framekitui.live'
export const SITE_URL_BASE = `https://${SITE_HOST}`
export const REGISTRY_BASE = `${SITE_URL_BASE}/r`

/**
 * Former production host. vercel.json 308-redirects it to SITE_URL_BASE (except /r/* and the search-engine
 * verification files), and the registry JSON stays served there so old `npx shadcn add https://framekit-ui.vercel.app/r/…`
 * commands and existing components.json configs keep working. Don't use it for new links.
 */
export const LEGACY_HOST = 'framekit-ui.vercel.app'
