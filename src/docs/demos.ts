/**
 * Live previews for the docs, one module per component: `src/docs/demos/<slug>.tsx` default-exports the
 * preview node. Vite turns every file into its own chunk, so a docs page downloads only its own demo (and the
 * component it renders) instead of the whole library. Helpers used by several demos live in `demos/_shared/`.
 *
 * Adding a component? Create `src/docs/demos/<slug>.tsx`:
 *
 *   import type * as React from 'react'
 *   import { MyThing } from '@/components/ui/my-thing'
 *   const demo: React.ReactNode = <MyThing />
 *   export default demo
 */
import type * as React from 'react'

type DemoModule = { default: React.ReactNode }

const modules = import.meta.glob<DemoModule>(['./demos/*.tsx'])

const key = (slug: string) => `./demos/${slug}.tsx`

export function hasDemo(slug: string) {
  return key(slug) in modules
}

/** Resolves to the preview node for `slug`, or `undefined` when there is no demo file. */
export function loadDemo(slug: string): Promise<React.ReactNode | undefined> {
  const load = modules[key(slug)]
  return load ? load().then((m) => m.default) : Promise.resolve(undefined)
}

/** Warm the chunk (e.g. on link hover) without rendering it. */
export function preloadDemo(slug: string) {
  void modules[key(slug)]?.()
}
