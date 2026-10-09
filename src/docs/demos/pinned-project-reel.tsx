import type * as React from 'react'
import { PinnedProjectReel } from '@/components/ui/pinned-project-reel'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function PinnedReelDemo() {
  return (
    <PfScrollFrame label="Pinned project reel preview (scrollable)" height={520}>
      {(ref) => (
        <div className="-mx-4 -my-4 sm:-mx-8 sm:-my-8">
          <p className="px-6 py-10 text-center text-sm text-zinc-700 dark:text-zinc-300">Scroll down — the reel pins and slides sideways ↓</p>
          <PinnedProjectReel scrollContainer={ref} height={440} titleAs="h2" />
          <p className="px-6 py-16 text-center text-sm text-zinc-700 dark:text-zinc-300">…and releases the page again.</p>
        </div>
      )}
    </PfScrollFrame>
  )
}

const demo: React.ReactNode = <PinnedReelDemo />

export default demo
