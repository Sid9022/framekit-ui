import * as React from 'react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Seamless horizontal marquee with soft edge fades; pauses on hover, focus or via its control. */
export function InfiniteMarquee({
  children,
  className,
  speed = 28,
  reverse = false,
  fade = true,
  pauseOnHover = true,
  gap = 32,
  showControls = false,
  label = 'Scrolling list',
}: {
  children: React.ReactNode
  className?: string
  speed?: number
  reverse?: boolean
  /** Fade both edges with a mask (no background colour needed). */
  fade?: boolean
  /** Pause while the pointer is over the marquee or focus is inside it. */
  pauseOnHover?: boolean
  /** Space between items in px. */
  gap?: number
  /** Render a visible pause / play button (recommended for long-running motion). */
  showControls?: boolean
  /** Accessible name for the region. */
  label?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = React.useState(false)
  const moving = !reduced && !paused
  return (
    <div className={cn('relative', className)}>
      <div
        role="region"
        aria-label={label}
        className={cn(
          'group/mq relative overflow-hidden',
          fade && !reduced && '[mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]',
        )}
      >
        <div
          className={cn(
            'flex w-max',
            reduced ? 'w-full flex-wrap justify-center' : reverse ? 'animate-[marquee-reverse_var(--dur)_linear_infinite]' : 'animate-[marquee_var(--dur)_linear_infinite]',
            !moving && '[animation-play-state:paused]',
            pauseOnHover && 'group-hover/mq:[animation-play-state:paused] group-focus-within/mq:[animation-play-state:paused]',
          )}
          style={{ ['--dur' as string]: `${speed}s`, ['--mq-half-gap' as string]: `${gap / 2}px`, gap: reduced ? gap / 2 : gap }}
        >
          <div className={cn('flex shrink-0 items-center', reduced && 'flex-wrap justify-center')} style={{ gap: reduced ? gap / 2 : gap }}>
            {children}
          </div>
          {!reduced && (
            <div className="flex shrink-0 items-center" style={{ gap }} aria-hidden inert>
              {children}
            </div>
          )}
        </div>
      </div>
      {showControls && !reduced && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[13px] font-medium text-zinc-600 ring-1 ring-zinc-950/[0.08] transition-colors hover:bg-zinc-950/[0.04] hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 active:scale-[0.97] dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-signal-300"
          >
            {paused ? <Play aria-hidden className="h-3.5 w-3.5" /> : <Pause aria-hidden className="h-3.5 w-3.5" />}
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
      )}
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(calc(-50% - var(--mq-half-gap, 0px))); } }
        @keyframes marquee-reverse { from { transform: translateX(calc(-50% - var(--mq-half-gap, 0px))); } to { transform: translateX(0); } }
      `}</style>
    </div>
  )
}
