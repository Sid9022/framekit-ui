import type * as React from 'react'
import { BorderBeam } from '@/components/ui/border-beam'

const demo: React.ReactNode = (
    <BorderBeam className="w-full max-w-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 text-[13px] font-medium text-framekit-700 dark:text-framekit-300">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inset-0 rounded-full bg-framekit-500 motion-safe:animate-ping" />
            <span className="relative h-2 w-2 rounded-full bg-framekit-500" />
          </span>
          Live
        </div>
        <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.012em]">Launch week, day 3</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Streaming now — new primitives for motion and layout.</p>
      </div>
    </BorderBeam>
  )

export default demo
