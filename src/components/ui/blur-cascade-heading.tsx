import * as React from 'react'
import { motion, useInView } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BlurCascadeHeadingProps = {
  eyebrow?: string
  text?: string
  /** Words to tint with the accent gradient. */
  highlight?: string[]
  /** Split mode. */
  by?: 'word' | 'char'
  stagger?: number
  /** Show a replay button. */
  replay?: boolean
  className?: string
}

/**
 * Blur Cascade Heading — a display headline that resolves out of focus:
 * each word (or letter) rises through a mask with a blur-to-sharp and
 * slight tracking settle, highlight words shimmer into a gradient last.
 */
export function BlurCascadeHeading({ eyebrow = 'Keynote', text = 'The most powerful way to build interfaces, ever.', highlight = ['powerful', 'ever.'], by = 'word', stagger = 0.06, replay = true, className }: BlurCascadeHeadingProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = usePrefersReducedMotion()
  const [run, setRun] = React.useState(0)
  const words = text.split(' ')
  let k = 0
  return (
    <div ref={ref} className={cn('relative w-full max-w-[880px] py-10', className)}>
      <motion.p key={`e${run}`} initial={reduced ? false : { opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : undefined} className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{eyebrow}</motion.p>
      <h2 key={run} aria-label={text} className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-zinc-950 sm:text-6xl lg:text-7xl dark:text-white">
        {words.map((w, wi) => {
          const hl = highlight.includes(w)
          const parts = by === 'char' ? w.split('') : [w]
          return (
            <span key={wi} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              {parts.map((p, pi) => {
                const d = (k++) * (by === 'char' ? stagger / 3 : stagger)
                return (
                  <motion.span key={pi} className={cn('inline-block', hl && 'bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-fuchsia-400 dark:to-orange-300')}
                    initial={reduced ? false : { y: '70%', opacity: 0, filter: 'blur(12px)' }}
                    animate={inView ? { y: '0%', opacity: 1, filter: 'blur(0px)' } : undefined}
                    transition={{ type: 'spring', stiffness: 160, damping: 22, delay: hl ? d + 0.15 : d }}>{p}</motion.span>
                )
              })}
              {wi < words.length - 1 && '\u00a0'}
            </span>
          )
        })}
      </h2>
      {replay && <button onClick={() => setRun((r) => r + 1)} className="mt-6 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-zinc-600 ring-1 ring-black/10 transition-colors hover:text-zinc-950 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-zinc-400 dark:ring-white/15 dark:hover:text-white"><RotateCcw className="size-3.5" />Replay</button>}
    </div>
  )
}
