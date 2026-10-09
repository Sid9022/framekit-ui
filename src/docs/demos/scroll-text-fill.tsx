import type * as React from 'react'
import { ScrollTextFill } from '@/components/ui/scroll-text-fill'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function ScrollTextFillDemo() {
  return (
    <PfScrollFrame label="Scroll text fill preview (scrollable)" height={480}>
      {(ref) => (
        <div className="mx-auto max-w-3xl">
          <p className="pb-48 pt-24 text-center text-sm text-zinc-700 dark:text-zinc-300">Scroll ↓ — the words light up as you read.</p>
          <ScrollTextFill scrollContainer={ref} />
          <div className="h-72" aria-hidden />
        </div>
      )}
    </PfScrollFrame>
  )
}

const demo: React.ReactNode = <ScrollTextFillDemo />

export default demo
