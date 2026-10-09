import type * as React from 'react'
import { TiltCard } from '@/components/ui/tilt-card'

const demo: React.ReactNode = (
    <TiltCard className="w-full max-w-xs">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">Member</p>
        <span className="h-6 w-9 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 ring-1 ring-amber-500/30" aria-hidden />
      </div>
      <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em]">Framekit Pro</h3>
      <p className="mt-1 font-mono text-[13px] tabular-nums text-zinc-500 dark:text-zinc-400">•••• 2048 · 09/29</p>
    </TiltCard>
  )

export default demo
