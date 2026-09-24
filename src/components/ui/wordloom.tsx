import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** One word at a time weaves out as threads and resolves the next variant. */
export function Wordloom({
  prefix = 'We design',
  words,
  className,
}: {
  prefix?: string
  words: string[]
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = React.useState(0)
  const word = words[index % words.length]

  const next = () => setIndex((i) => (i + 1) % words.length)

  return (
    <button
      type="button"
      onClick={next}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          next()
        }
      }}
      className={cn('text-left text-3xl font-semibold tracking-tight sm:text-4xl', className)}
      aria-label={`${prefix} ${word}. Activate to cycle.`}
    >
      <span className="text-zinc-500">{prefix} </span>
      <span className="relative inline-grid overflow-hidden align-baseline text-zinc-900 dark:text-zinc-50">
        <AnimatePresence mode="wait">
          <motion.span
            key={word}
            initial={reduced ? false : { y: 18, opacity: 0, filter: 'blur(6px)', scaleX: 1.15 }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)', scaleX: 1 }}
            exit={reduced ? undefined : { y: -16, opacity: 0, filter: 'blur(6px)', scaleX: 1.3 }}
            transition={{ duration: 0.38 }}
            className="col-start-1 row-start-1 text-signal-700 dark:text-signal-300"
          >
            {word}
          </motion.span>
        </AnimatePresence>
        <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
          {words.reduce((a, b) => (a.length >= b.length ? a : b))}
        </span>
      </span>
    </button>
  )
}
