import type * as React from 'react'
import { EdgeFlareShimmer } from '@/components/ui/edge-flare-shimmer'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-zinc-950/80 dark:ring-0 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Stage · Edge flare</p>
      <EdgeFlareShimmer className="w-full" />
    </div>
  )

export default demo
