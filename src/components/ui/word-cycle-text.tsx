import * as React from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type WordCycleTextProps = {
  prefix?: string
  words?: string[]
  suffix?: string
  /** ms each word stays. Clamped 1200–10000. */
  interval?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
  /** Pause while the pointer is over the line. */
  pauseOnHover?: boolean
  /** Show a small Pause / Play control under the line (WCAG 2.2.2). */
  showControls?: boolean
  onWordChange?: (word: string, index: number) => void
  className?: string
}

/**
 * Word Cycle Text — a headline whose key word keeps changing its mind. Each new word rises letter by letter out of a
 * soft blur inside a tinted capsule, the capsule resizes on a spring, and the rest of the line glides to make room.
 * Screen readers get the whole sentence once; reduced motion swaps words with a plain cross-fade.
 */
export function WordCycleText({
  prefix = 'Interfaces that feel',
  words = ['inevitable', 'calm', 'alive', 'yours'],
  suffix = '',
  interval = 2600,
  as = 'h2',
  pauseOnHover = true,
  showControls = true,
  onWordChange,
  className,
}: WordCycleTextProps) {
  const reduced = usePrefersReducedMotion()
  const [i, setI] = React.useState(0)
  const [playing, setPlaying] = React.useState(true)
  const [hover, setHover] = React.useState(false)
  const cb = React.useRef(onWordChange)
  cb.current = onWordChange
  const gap = Math.min(10000, Math.max(1200, interval))
  const Tag = as
  const run = playing && !(pauseOnHover && hover) && words.length > 1

  React.useEffect(() => {
    if (!run) return
    const t = window.setTimeout(() => {
      const n = (i + 1) % words.length
      setI(n)
      cb.current?.(words[n], n)
    }, gap)
    return () => window.clearTimeout(t)
  }, [run, i, gap, words])

  const word = words[i % words.length] ?? ''
  const spring = { type: 'spring' as const, stiffness: 420, damping: 32 }

  return (
    <div
      className={cn('flex flex-col items-center gap-4', className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Tag className="text-balance text-center text-[2rem] font-semibold leading-[1.15] tracking-[-0.03em] text-zinc-950 sm:text-5xl dark:text-white">
        <span className="sr-only">{`${prefix} ${words.join(', ')}${suffix ? ` ${suffix}` : ''}`}</span>
        <span aria-hidden>
          <LayoutGroup>
            <motion.span layout={!reduced} transition={spring} className="inline-block">{prefix}</motion.span>{' '}
            <motion.span
              layout={!reduced}
              transition={spring}
              className="relative inline-flex overflow-hidden whitespace-nowrap rounded-[0.32em] bg-signal-100 px-[0.22em] pb-[0.04em] align-bottom text-signal-800 ring-1 ring-inset ring-signal-300/50 dark:bg-signal-900/45 dark:text-signal-100 dark:ring-signal-400/25"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={word} className="inline-block">
                  {reduced ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="inline-block">
                      {word}
                    </motion.span>
                  ) : (
                    Array.from(word).map((ch, k) => (
                      <motion.span
                        key={k}
                        className="inline-block"
                        initial={{ y: '0.7em', opacity: 0, filter: 'blur(8px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)', transition: { ...spring, delay: k * 0.03 } }}
                        exit={{ y: '-0.5em', opacity: 0, filter: 'blur(6px)', transition: { duration: 0.18, delay: k * 0.012 } }}
                      >
                        {ch === ' ' ? '\u00A0' : ch}
                      </motion.span>
                    ))
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.span>
            {suffix && (
              <>
                {' '}
                <motion.span layout={!reduced} transition={spring} className="inline-block">{suffix}</motion.span>
              </>
            )}
          </LayoutGroup>
        </span>
      </Tag>
      {showControls && words.length > 1 && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-zinc-600 transition-[background-color,color] duration-150 hover:bg-black/[0.04] hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-signal-300"
        >
          {playing ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
          <span className="sr-only">{playing ? 'Pause word rotation, word' : 'Resume word rotation, word'}</span>
          <span className="tabular-nums">{(i % words.length) + 1} / {words.length}</span>
        </button>
      )}
    </div>
  )
}
