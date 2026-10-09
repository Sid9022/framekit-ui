import type * as React from 'react'
import { MercuryVeinShimmer } from '@/components/ui/mercury-vein-shimmer'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 p-6 dark:bg-zinc-950/80">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Stage · Mercury</p>
      <MercuryVeinShimmer className="w-full" />
    </div>
  )

export default demo
