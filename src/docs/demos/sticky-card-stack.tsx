import type * as React from 'react'
import { StickyCardStack } from '@/components/ui/sticky-card-stack'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function StickyStackDemo() {
  return (
    <PfScrollFrame label="Sticky card stack preview (scrollable)" height={560}>
      {(ref) => (
        <div className="mx-auto max-w-3xl">
          <p className="pb-6 text-center text-sm text-zinc-700 dark:text-zinc-300">Scroll — each card pins and the one below slides over it ↓</p>
          <StickyCardStack scrollContainer={ref} cardHeight={340} titleAs="h2" />
          <p className="pb-8 pt-4 text-center text-sm text-zinc-700 dark:text-zinc-300">That&rsquo;s the stack.</p>
        </div>
      )}
    </PfScrollFrame>
  )
}

const demo: React.ReactNode = <StickyStackDemo />

export default demo
