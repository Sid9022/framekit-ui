import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Multi-dot typing indicator with wave + optional agent handoff label. */
export function TypingWaveIndicator({
  label = 'Agent is typing',
  showLabel = true,
  className,
}: {
  label?: string
  showLabel?: boolean
  className?: string
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-3.5 py-2.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-signal-500"
            animate={
              reduced
                ? { opacity: 0.7 }
                : { y: [0, -5, 0], opacity: [0.45, 1, 0.45] }
            }
            transition={
              reduced
                ? undefined
                : { repeat: Infinity, duration: 0.9, delay: i * 0.14, ease: 'easeInOut' }
            }
          />
        ))}
      </div>
      {showLabel && (
        <motion.p
          initial={reduced ? false : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-zinc-500"
        >
          {label}
        </motion.p>
      )}
    </div>
  )
}
