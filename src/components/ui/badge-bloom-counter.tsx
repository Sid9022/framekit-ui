import * as React from 'react'
import { motion, useAnimation } from 'motion/react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Numeric badge that blooms/scales when count changes. */
export function BadgeBloomCounter({
  initial = 3,
  className,
}: {
  initial?: number
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = React.useState(initial)
  const controls = useAnimation()

  React.useEffect(() => {
    if (reduced) return
    controls.start({
      scale: [1, 1.35, 1],
      transition: { duration: 0.35, ease: 'easeOut' },
    })
  }, [count, controls, reduced])

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
        <span className="text-zinc-500">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
        </span>
        <motion.span
          animate={controls}
          className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-signal-500 px-1.5 text-xs font-bold text-white"
          style={{ boxShadow: '0 0 18px rgba(154,134,184,0.75)' }}
        >
          {count}
        </motion.span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setCount((c) => Math.max(0, c - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700"
          aria-label="Decrement"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-signal-500 text-white"
          aria-label="Increment"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
