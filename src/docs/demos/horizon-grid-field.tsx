import type * as React from 'react'
import { HorizonGridField } from '@/components/ui/horizon-grid-field'

function HorizonGridDemo() {
  return (
    <HorizonGridField className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">Now in beta</p>
      <h3 className="mx-auto mt-3 max-w-md text-balance text-4xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-5xl dark:text-white">The road to launch, already paved</h3>
      <p className="mx-auto mt-3 max-w-sm text-pretty text-sm text-zinc-700 dark:text-zinc-300">Preview, review and ship from one calm workspace.</p>
    </HorizonGridField>
  )
}

const demo: React.ReactNode = <HorizonGridDemo />

export default demo
