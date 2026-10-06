import * as React from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SparkleTextProps = {
  text?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  /** Sparkle colours (cycled). The text gradient uses theme-tuned ink → lilac → amber stops that pass AA. */
  colors?: string[]
  /** Max sparkles alive at once. Clamped 1–20. */
  count?: number
  /** ms of sparkling after entering view or hover, then it rests. 0 = never rests. */
  restAfter?: number
  /** Fill the text with a soft ink-to-accent gradient. */
  gradient?: boolean
  className?: string
}

type Spark = { id: number; x: number; y: number; s: number; c: string; r: number }

function Star({ s, c, r }: { s: number; c: string; r: number }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} style={{ rotate: `${r}deg` }}>
      <path d="M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0Z" fill={c} />
    </svg>
  )
}

/**
 * Sparkle Text — a word that catches the light. Four-point stars bloom and fade around the text on their own
 * staggered clocks while the letters carry a soft two-tone gradient. It sparkles when it scrolls into view or when
 * hovered, then rests so it never nags. Reduced motion shows three still stars.
 */
export function SparkleText({
  text = 'Delightful',
  as = 'span',
  colors = ['#8b74b5', '#f97316', '#c4b5fd'],
  count = 10,
  restAfter = 6000,
  gradient = true,
  className,
}: SparkleTextProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const [sparks, setSparks] = React.useState<Spark[]>([])
  const [active, setActive] = React.useState(false)
  const idRef = React.useRef(0)
  const max = Math.min(20, Math.max(1, count))
  const Tag = as as 'span'

  const colorsRef = React.useRef(colors)
  colorsRef.current = colors
  const make = React.useCallback((): Spark => {
    idRef.current += 1
    const c = colorsRef.current
    return { id: idRef.current, x: Math.random() * 100, y: Math.random() * 100, s: 14 + Math.random() * 14, c: c[idRef.current % c.length], r: Math.random() * 90 }
  }, [])

  React.useEffect(() => {
    if (inView) setActive(true)
  }, [inView])

  React.useEffect(() => {
    if (!active || reduced || !inView) return
    const iv = window.setInterval(() => setSparks((s) => [...s.slice(-(max - 1)), make()]), 1500 / max + 90)
    const rest = restAfter > 0 ? window.setTimeout(() => setActive(false), restAfter) : 0
    return () => {
      window.clearInterval(iv)
      window.clearTimeout(rest)
    }
  }, [active, reduced, inView, max, make, restAfter])

  React.useEffect(() => {
    if (!active) {
      const t = window.setTimeout(() => setSparks([]), 900)
      return () => window.clearTimeout(t)
    }
  }, [active])

  const still: Spark[] = [
    { id: -1, x: 4, y: 12, s: 14, c: colors[0], r: 10 },
    { id: -2, x: 96, y: 30, s: 18, c: colors[1 % colors.length], r: 40 },
    { id: -3, x: 62, y: 96, s: 11, c: colors[2 % colors.length], r: 0 },
  ]
  const list = reduced ? still : sparks

  return (
    <Tag
      ref={ref as React.RefObject<HTMLSpanElement>}
      onPointerEnter={() => setActive(true)}
      className={cn('relative inline-block text-5xl font-semibold tracking-[-0.035em] sm:text-7xl', className)}
    >
      <span aria-hidden className="pointer-events-none absolute -inset-x-[0.2em] -inset-y-[0.15em]">
        <AnimatePresence>
          {list.map((p) => (
            <motion.span
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              initial={reduced ? false : { scale: 0, opacity: 0, rotate: -40 }}
              animate={reduced ? { scale: 1, opacity: 0.9 } : { scale: [0, 1, 0], opacity: [0, 1, 0], rotate: 50 }}
              transition={reduced ? { duration: 0 } : { duration: 1.5, ease: 'easeInOut', times: [0, 0.45, 1] }}
            >
              <Star s={p.s} c={p.c} r={p.r} />
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
      <span
        className={cn(
          'relative',
          gradient
            ? 'bg-[linear-gradient(100deg,var(--sk-ink)_15%,var(--sk-a)_60%,var(--sk-b)_100%)] bg-clip-text text-transparent [--sk-a:#64527a] [--sk-b:#c2410c] [--sk-ink:#18181b] dark:[--sk-a:#d4cbe5] dark:[--sk-b:#fdba74] dark:[--sk-ink:#fafafa]'
            : 'text-zinc-950 dark:text-white',
        )}
      >
        {text}
      </span>
    </Tag>
  )
}
