import * as React from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SplitFlapStat = { value: string; label: string }

export type SplitFlapHeroProps = {
  /** Words cycled on the split-flap board (upper-cased, max ~12 chars). */
  words?: string[]
  /** Static headline line above the board. */
  prefix?: string
  description?: string
  eyebrow?: string
  ctaLabel?: string
  onCta?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  /** Small flap counters under the CTAs. */
  stats?: SplitFlapStat[]
  /** ms each word rests on the board. */
  interval?: number
  /** Start cycling automatically (a pause button is always rendered). */
  autoPlay?: boolean
  onWordChange?: (word: string, index: number) => void
  className?: string
}

const CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-·%'
const FLIP_MS = 70

export const DEFAULT_SPLIT_FLAP_WORDS = ['FEEL ALIVE', 'MOVE FAST', 'SPARK JOY', 'SHIP DAILY', 'LAND SOFT']
const DEFAULT_STATS: SplitFlapStat[] = [
  { value: '64', label: 'Gates open' },
  { value: '120', label: 'Frames / sec' },
  { value: '0', label: 'Delays today' },
]

const pad = (w: string, n: number) => {
  const s = w.toUpperCase().slice(0, n)
  const left = Math.floor((n - s.length) / 2)
  return (' '.repeat(left) + s).padEnd(n, ' ')
}

function useInView(ref: React.RefObject<Element | null>) {
  const [v, setV] = React.useState(true)
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return v
}

/** One flap cell. Every change of `char` plays a top-leaf fall + bottom-leaf land. */
function FlapCell({ char, size, reduced, tone }: { char: string; size: 'lg' | 'sm'; reduced: boolean; tone: 'board' | 'stat' }) {
  const [state, setState] = React.useState({ prev: char, cur: char, n: 0 })
  React.useEffect(() => {
    setState((s) => (s.cur === char ? s : { prev: s.cur, cur: char, n: s.n + 1 }))
  }, [char])
  const { prev, cur, n } = state
  const dims =
    size === 'lg'
      ? 'h-[calc(var(--cell)*1.5)] w-[var(--cell)] text-[calc(var(--cell)*1.08)] rounded-[6px]'
      : 'h-9 w-6 text-[22px] rounded-[4px]'
  const face =
    tone === 'board'
      ? 'bg-[linear-gradient(#26262a,#1b1b1e)] text-[#f4efe6] dark:bg-[linear-gradient(#232326,#18181a)]'
      : 'bg-[linear-gradient(#2a2a2e,#1e1e21)] text-amber-300'
  const half = (c: string, part: 'top' | 'bottom', className?: string) => (
    <div
      className={cn('absolute inset-x-0 h-1/2 overflow-hidden', part === 'top' ? 'top-0 rounded-t-[inherit]' : 'bottom-0 rounded-b-[inherit]', face, className)}
    >
      <span
        className={cn('absolute inset-x-0 flex h-[200%] items-center justify-center font-mono font-semibold leading-none', part === 'top' ? 'top-0' : '-top-full')}
      >
        {c === ' ' ? '\u00a0' : c}
      </span>
      {part === 'top' ? (
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] to-transparent" />
      ) : (
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      )}
    </div>
  )
  return (
    <div
      className={cn(
        'relative shrink-0 [perspective:340px] shadow-[0_1px_0_rgb(255_255_255/0.06)_inset,0_2px_3px_rgb(0_0_0/0.35),0_10px_18px_-10px_rgb(0_0_0/0.6)]',
        dims,
      )}
    >
      {/* static: next top, current bottom */}
      {half(cur, 'top')}
      {half(reduced ? cur : prev, 'bottom')}
      {!reduced && n > 0 && (
        <>
          <motion.div
            key={'t' + n}
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] [backface-visibility:hidden] [transform-origin:50%_100%]"
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            transition={{ duration: FLIP_MS / 1000, ease: 'easeIn' }}
          >
            {half(prev, 'top', 'h-full rounded-t-[inherit]')}
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-t-[inherit] bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ duration: FLIP_MS / 1000 }}
            />
          </motion.div>
          <motion.div
            key={'b' + n}
            className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[inherit] [backface-visibility:hidden] [transform-origin:50%_0%]"
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: FLIP_MS / 1000, ease: [0.3, 1.5, 0.6, 1], delay: FLIP_MS / 1000 }}
          >
            {half(cur, 'bottom', 'h-full rounded-b-[inherit]')}
          </motion.div>
        </>
      )}
      {/* hinge */}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-px bg-black/70" />
      <span className="pointer-events-none absolute -left-[2px] top-1/2 z-10 h-[18%] w-[3px] -translate-y-1/2 rounded-full bg-zinc-500/80" />
      <span className="pointer-events-none absolute -right-[2px] top-1/2 z-10 h-[18%] w-[3px] -translate-y-1/2 rounded-full bg-zinc-500/80" />
    </div>
  )
}

/** Drives a row of cells toward `text`, flipping each through a few characters first. */
function useFlapRow(text: string, active: boolean, reduced: boolean, startDelay = 0) {
  const [chars, setChars] = React.useState<string[]>(() => text.split('').map(() => ' '))
  const target = React.useRef(text)
  React.useEffect(() => {
    target.current = text
    if (reduced || !active) {
      setChars(text.split(''))
      return
    }
    const timers: number[] = []
    text.split('').forEach((goal, i) => {
      const steps = 3 + ((i * 7) % 5) + Math.floor(Math.random() * 3)
      let k = 0
      const tick = () => {
        k++
        const done = k >= steps
        setChars((cs) => {
          const next = cs.slice()
          while (next.length < text.length) next.push(' ')
          const ci = CHARSET.indexOf(next[i] ?? ' ')
          next[i] = done ? goal : CHARSET[(ci + 1 + Math.floor(Math.random() * 4)) % CHARSET.length]
          return next
        })
        if (!done) timers.push(window.setTimeout(tick, FLIP_MS * 2 + 6))
      }
      timers.push(window.setTimeout(tick, startDelay + i * 46))
    })
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduced])
  return chars
}

function FlapRow({ text, size, reduced, tone, delay, active }: { text: string; size: 'lg' | 'sm'; reduced: boolean; tone: 'board' | 'stat'; delay?: number; active: boolean }) {
  const chars = useFlapRow(text, active, reduced, delay)
  return (
    <div className={cn('flex', size === 'lg' ? 'gap-[5px]' : 'gap-[3px]')} aria-hidden>
      {text.split('').map((_, i) => (
        <FlapCell key={i} char={chars[i] ?? ' '} size={size} reduced={reduced} tone={tone} />
      ))}
    </div>
  )
}

/**
 * Split-Flap Hero — a landing hero whose key phrase lives on a mechanical
 * departure board: every character clacks through the alphabet on real 3D
 * leaves before landing, with stat counters flipping underneath.
 */
export function SplitFlapHero({
  words = DEFAULT_SPLIT_FLAP_WORDS,
  prefix = 'Interfaces that',
  description = 'A departure board for your next launch. Every letter flips on a hinged leaf, lands with a tiny bounce, and moves on when you are ready.',
  eyebrow = 'Now boarding · Gate 04',
  ctaLabel = 'Get your ticket',
  onCta,
  secondaryLabel = 'View timetable',
  onSecondary,
  stats = DEFAULT_STATS,
  interval = 3400,
  autoPlay = true,
  onWordChange,
  className,
}: SplitFlapHeroProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = React.useRef<HTMLElement>(null)
  const inView = useInView(rootRef)
  const [playing, setPlaying] = React.useState(autoPlay)
  const [index, setIndex] = React.useState(0)
  const len = Math.max(4, Math.min(12, ...words.map((w) => w.length)))
  const boardLen = Math.min(12, Math.max(len, ...words.map((w) => w.length)))
  const word = words[index % words.length] ?? ''

  React.useEffect(() => {
    if (!playing || !inView || words.length < 2) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => clearTimeout(t)
  }, [playing, inView, index, interval, words.length])

  const firstRun = React.useRef(true)
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    onWordChange?.(word, index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const go = (d: number) => setIndex((i) => (i + d + words.length) % words.length)

  return (
    <section
      ref={rootRef}
      className={cn(
        'relative isolate w-full overflow-hidden rounded-[28px] px-6 py-14 sm:px-10 sm:py-16',
        'bg-[#f3eee4] text-zinc-900 ring-1 ring-black/[0.06]',
        'dark:bg-[#0d0d0f] dark:text-zinc-50 dark:ring-white/[0.06]',
        className,
      )}
      aria-roledescription="hero"
    >
      {/* backdrop: warm vignette + fine rules */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_42%,rgb(255_255_255/0.85),transparent_70%)] dark:bg-[radial-gradient(70%_55%_at_50%_45%,rgb(251_191_36/0.10),transparent_70%)]" />
        <div className="absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(0deg,rgb(0_0_0/0.035)_0_1px,transparent_1px_8px)] dark:[background-image:repeating-linear-gradient(0deg,rgb(255_255_255/0.025)_0_1px,transparent_1px_8px)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/[0.04] to-transparent dark:from-black/60" />
      </div>

      <div
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center [container-type:inline-size]"
        style={{ ['--cell' as string]: `min(50px, calc((100cqw - 28px - ${(boardLen - 1) * 5}px) / ${boardLen}))` }}
      >
        <motion.span
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600 ring-1 ring-black/[0.06] backdrop-blur dark:bg-white/[0.04] dark:text-zinc-400 dark:ring-white/10"
        >
          <span className="relative flex h-1.5 w-1.5">
            {!reduced && <span className="absolute inset-0 animate-ping rounded-full bg-amber-500/70" />}
            <span className="relative h-1.5 w-1.5 rounded-full bg-amber-500" />
          </span>
          {eyebrow}
        </motion.span>

        <h1 className="mt-6 font-display text-[clamp(30px,5vw,52px)] leading-[1.02] tracking-tight">
          <motion.span
            className="block"
            initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            {prefix}
          </motion.span>
          <span className="sr-only">{word}</span>
        </h1>

        {/* the board */}
        <div className="relative mt-6">
          <div
            aria-hidden
            className="absolute -inset-3 -z-10 rounded-[14px] bg-[linear-gradient(#1a1a1d,#101012)] shadow-[0_1px_0_rgb(255_255_255/0.08)_inset,0_30px_60px_-30px_rgb(0_0_0/0.55),0_12px_24px_-12px_rgb(0_0_0/0.35)] ring-1 ring-black/60"
          />
          <div aria-hidden className="absolute -inset-3 -z-10 rounded-[14px] [background:radial-gradient(60%_120%_at_50%_120%,rgb(251_191_36/0.18),transparent_60%)]" />
          <FlapRow text={pad(word, boardLen)} size="lg" reduced={reduced} tone="board" active={inView} />
          <div aria-hidden className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 gap-1.5">
            {words.map((_, i) => (
              <span key={i} className={cn('h-1 rounded-full transition-all duration-300', i === index ? 'w-5 bg-amber-500' : 'w-1.5 bg-zinc-400/50 dark:bg-zinc-600')} />
            ))}
          </div>
        </div>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-14 max-w-xl text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          {description}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={onCta}
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-zinc-900 pl-5 pr-4 text-sm font-medium text-white shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_10px_24px_-10px_rgb(0_0_0/0.5)] outline-none transition active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3eee4] dark:bg-amber-400 dark:text-zinc-950 dark:focus-visible:ring-offset-[#0d0d0f]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          {secondaryLabel && (
            <button
              type="button"
              onClick={onSecondary}
              className="inline-flex h-11 items-center rounded-full px-5 text-sm font-medium text-zinc-700 ring-1 ring-black/10 outline-none transition hover:bg-black/[0.04] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-zinc-300 dark:ring-white/15 dark:hover:bg-white/[0.05]"
            >
              {secondaryLabel}
            </button>
          )}
        </motion.div>

        {stats.length > 0 && (
          <dl className="mt-10 flex flex-wrap items-start justify-center gap-x-8 gap-y-5">
            {stats.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <dt className="sr-only">{s.label}</dt>
                <dd className="sr-only">{s.value}</dd>
                <FlapRow text={s.value.padStart(3, ' ')} size="sm" reduced={reduced} tone="stat" delay={500 + i * 180} active={inView} />
                <span aria-hidden className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{s.label}</span>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* board controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1" role="group" aria-label="Board controls">
        <button type="button" onClick={() => go(-1)} aria-label="Previous word" className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 dark:text-zinc-400 outline-none transition hover:bg-black/5 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-white/5 dark:hover:text-zinc-200">
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause board' : 'Play board'}
          aria-pressed={!playing}
          className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 dark:text-zinc-400 outline-none transition hover:bg-black/5 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-white/5 dark:hover:text-zinc-200"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next word" className="grid h-8 w-8 place-items-center rounded-full text-zinc-500 dark:text-zinc-400 outline-none transition hover:bg-black/5 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-white/5 dark:hover:text-zinc-200">
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{playing ? '' : `Board paused on ${word}`}</p>
    </section>
  )
}
