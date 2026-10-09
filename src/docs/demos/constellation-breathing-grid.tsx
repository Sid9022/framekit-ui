import type * as React from 'react'
import { ConstellationBreathingGrid } from '@/components/ui/constellation-breathing-grid'

const demo: React.ReactNode = (
    <ConstellationBreathingGrid className="flex h-56 w-full max-w-xl items-center justify-center">
      <p className="rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-white/70">constellation</p>
    </ConstellationBreathingGrid>
  )

export default demo
