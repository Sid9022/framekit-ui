import type * as React from 'react'
import { GlyphAuroraShimmer } from '@/components/ui/glyph-aurora-shimmer'

const demo: React.ReactNode = (
    <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-zinc-950/80 dark:ring-0 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Stage · Aurora</p>
      <GlyphAuroraShimmer />
    </div>
  )

export default demo
