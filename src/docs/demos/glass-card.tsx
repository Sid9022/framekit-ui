import type * as React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Timer as UpTimer, Pause as UpPause, SkipForward as UpSkip } from 'lucide-react'

const demo: React.ReactNode = (
    <div
      className="relative w-full max-w-lg overflow-hidden rounded-[32px] p-6 sm:p-12"
      style={{
        background:
          'radial-gradient(40% 50% at 20% 25%, #fb923c, transparent 70%), radial-gradient(45% 55% at 85% 20%, #e879f9, transparent 70%), radial-gradient(50% 60% at 70% 95%, #6366f1, transparent 70%), linear-gradient(135deg, #f97316, #c026d3 50%, #3730a3)',
      }}
    >
      <div aria-hidden className="absolute top-8 left-10 h-28 w-28 rounded-full bg-amber-200/80 blur-[2px]" />
      <GlassCard className="relative mx-auto max-w-xs">
        <div className="flex items-center gap-2 text-[13px] font-medium text-white/85">
          <UpTimer aria-hidden className="h-4 w-4" /> Focus
        </div>
        <p className="mt-2 text-5xl font-semibold tracking-[-0.03em] tabular-nums text-white">24:59</p>
        <p className="mt-1 text-sm text-white/80">Deep work · session 2 of 4</p>
        <div className="mt-5 flex gap-2">
          <button type="button" aria-label="Pause" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/30 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <UpPause aria-hidden className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Skip" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <UpSkip aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  )

export default demo
