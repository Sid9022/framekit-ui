import type * as React from 'react'
import { ListBloomShimmer } from '@/components/ui/list-bloom-shimmer'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#121018] dark:ring-0 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Loading · List bloom</p>
      <ListBloomShimmer className="w-full" />
    </div>
  )

export default demo
