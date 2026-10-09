/**
 * Raw source strings for the docs Code tab, loaded on demand per component (`?raw` via import.meta.glob), so a
 * docs page only downloads its own file's source. The shared lib helpers shown on the Installation page are
 * small and imported eagerly.
 */
import cnSrc from '../lib/cn.ts?raw'
import reducedMotionSrc from '../lib/use-reduced-motion.ts?raw'
import resolvedThemeSrc from '../lib/use-resolved-theme.ts?raw'
import toggleLibSrc from '../lib/toggle.ts?raw'

const componentSources = import.meta.glob<string>('../components/ui/*.tsx', { query: '?raw', import: 'default' })

/** Shared helpers (eager): cn, use-reduced-motion, use-resolved-theme, toggle. */
export const libSources: Record<string, string> = {
  cn: cnSrc,
  'use-reduced-motion': reducedMotionSrc,
  'use-resolved-theme': resolvedThemeSrc,
  toggle: toggleLibSrc,
}

export function hasSource(slug: string) {
  return `../components/ui/${slug}.tsx` in componentSources
}

/** Resolves to the component file's source, or `undefined` if there's no such file. */
export function loadSource(slug: string): Promise<string | undefined> {
  if (slug in libSources) return Promise.resolve(libSources[slug])
  const load = componentSources[`../components/ui/${slug}.tsx`]
  return load ? load() : Promise.resolve(undefined)
}
