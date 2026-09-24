import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Ink drops merge into a looping puddle. */
export function InkDripLoader({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={cn('relative flex h-32 w-40 items-end justify-center overflow-hidden', className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute top-2 h-3 w-3 rounded-full bg-zinc-900 dark:bg-signal-300"
          style={{ left: `${28 + i * 22}%` }}
          animate={
            reduced
              ? { y: 70, scale: 1 }
              : {
                  y: [0, 78, 78],
                  scale: [1, 1, 0.2],
                  opacity: [1, 1, 0],
                }
          }
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeIn',
            times: [0, 0.7, 1],
          }}
        />
      ))}
      <motion.div
        className="absolute bottom-3 h-5 w-24 rounded-[50%] bg-zinc-900/90 dark:bg-signal-400/80"
        animate={
          reduced
            ? {}
            : {
                scaleX: [0.85, 1.15, 0.9, 1.05, 0.85],
                scaleY: [1, 0.75, 1.1, 0.85, 1],
              }
        }
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(0.3px)' }}
      />
      <motion.div
        className="absolute bottom-4 h-2 w-16 rounded-full bg-zinc-700/40 dark:bg-signal-200/30"
        animate={reduced ? {} : { scaleX: [0.7, 1.2, 0.8, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </div>
  )
}
