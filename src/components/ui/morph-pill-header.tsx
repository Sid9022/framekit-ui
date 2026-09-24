import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Demo stage: scroll collapses a full header into a floating pill. */
export function MorphPillHeader({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const scroller = React.useRef<HTMLDivElement>(null)
  const [compact, setCompact] = React.useState(false)

  return (
    <div className={cn('w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800', className)}>
      <div
        ref={scroller}
        className="relative h-64 overflow-y-auto bg-[#f3f2ef] dark:bg-zinc-900"
        onScroll={(e) => setCompact(e.currentTarget.scrollTop > 48)}
      >
        <div
          className={cn(
            'sticky top-3 z-10 mx-auto flex items-center gap-4 bg-white/90 shadow-lg backdrop-blur dark:bg-zinc-950/90',
            compact ? 'w-[220px] justify-center rounded-full px-4 py-2' : 'mx-3 w-auto justify-between rounded-2xl px-4 py-3',
          )}
          style={{ transition: reduced ? undefined : 'all 380ms cubic-bezier(.2,.8,.2,1)' }}
        >
          <span className="text-sm font-semibold">Framekit</span>
          {!compact && (
            <div className="flex gap-3 text-xs text-zinc-500">
              <span>Work</span>
              <span>Studio</span>
              <span>Contact</span>
            </div>
          )}
          {compact && <span className="h-2 w-2 rounded-full bg-signal-400" />}
        </div>
        <div className="space-y-4 px-4 pb-10 pt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/70 dark:bg-zinc-800/50" />
          ))}
        </div>
      </div>
    </div>
  )
}
