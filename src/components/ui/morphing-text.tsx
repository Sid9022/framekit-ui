import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Cycles through phrases with an overlapping blur-morph crossfade. */
export function MorphingText({
  phrases,
  className,
  interval = 2200,
  align = 'start',
  animateWidth = false,
  pauseOnHover = true,
}: {
  phrases: string[]
  className?: string
  interval?: number
  /** Alignment inside the reserved width (`start` suits inline sentences). */
  align?: 'start' | 'center'
  /** Spring the width to each phrase instead of reserving the longest one. */
  animateWidth?: boolean
  /** Hold the current phrase while hovered. */
  pauseOnHover?: boolean
}) {
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    if (reduced || paused || phrases.length < 2) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % phrases.length), interval)
    return () => clearInterval(id)
  }, [phrases, interval, reduced, paused])

  const longest = phrases.reduce((a, b) => (a.length >= b.length ? a : b), '')
  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <motion.span
      layout={animateWidth && !reduced ? 'size' : false}
      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
      className={cn(
        'relative inline-grid items-baseline whitespace-nowrap align-baseline',
        align === 'center' ? 'justify-items-center' : 'justify-items-start',
        className,
      )}
    >
      <span className="sr-only">{phrases[0]}</span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={phrases[index]}
          aria-hidden
          initial={reduced ? false : { opacity: 0, filter: 'blur(10px)', scale: 0.92, y: '0.18em' }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, filter: 'blur(10px)', scale: 1.06, y: '-0.18em' }}
          transition={{ duration: 0.6, ease }}
          className="col-start-1 row-start-1 origin-[50%_70%] will-change-[filter,transform]"
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
      {!animateWidth && (
        <span className="invisible col-start-1 row-start-1" aria-hidden>
          {longest}
        </span>
      )}
    </motion.span>
  )
}
