import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Cycles through phrases with a morphing crossfade. */
export function MorphingText({
  phrases,
  className,
  interval = 2200,
}: {
  phrases: string[]
  className?: string
  interval?: number
}) {
  const [index, setIndex] = React.useState(0)
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    if (reduced || phrases.length < 2) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval)
    return () => clearInterval(id)
  }, [phrases, interval, reduced])

  return (
    <span className={cn('relative inline-grid place-items-center overflow-hidden', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          initial={reduced ? false : { y: 18, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={reduced ? undefined : { y: -18, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.35 }}
          className="col-start-1 row-start-1"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
      {/* reserve width */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {phrases.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
    </span>
  )
}
