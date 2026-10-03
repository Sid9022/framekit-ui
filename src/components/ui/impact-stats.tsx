import * as React from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ImpactStat = { value: number; label: string; prefix?: string; suffix?: string; decimals?: number; detail?: string }

export type ImpactStatsProps = {
  stats?: ImpactStat[]
  className?: string
}

const DEFAULT_STATS: ImpactStat[] = [
  { value: 120, suffix: '+', label: 'Projects shipped', detail: 'across 14 countries' },
  { value: 9, label: 'Years of craft', detail: 'design + engineering' },
  { value: 4.9, decimals: 1, suffix: '/5', label: 'Client rating', detail: 'from 86 reviews' },
  { value: 2.4, decimals: 1, suffix: 'M', prefix: '$', label: 'Revenue unlocked', detail: 'for client launches' },
]

const fmt = (n: number, d: number) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

function Digit({ d, delay, run, reduced }: { d: number; delay: number; run: boolean; reduced: boolean }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-top leading-none" aria-hidden>
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${run ? -d : 0}em` }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 70, damping: 17, mass: 0.9, delay }}
      >
        {Array.from({ length: 10 }, (_, k) => <span key={k} className="block h-[1em] text-center leading-none">{k}</span>)}
      </motion.span>
    </span>
  )
}

function Stat({ s, i, run, reduced }: { s: ImpactStat; i: number; run: boolean; reduced: boolean }) {
  const text = fmt(s.value, s.decimals ?? 0)
  const digits = text.split('')
  return (
    <motion.div
      className="relative flex flex-col gap-1 px-1 py-2 sm:px-5"
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={run ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="flex items-baseline font-display text-6xl leading-none tracking-tight text-zinc-950 sm:text-7xl dark:text-zinc-50">
        <span className="sr-only">{s.prefix}{text}{s.suffix}</span>
        {s.prefix && <span aria-hidden className="mr-0.5 text-[0.6em] text-signal-700 dark:text-signal-300">{s.prefix}</span>}
        <span className="inline-flex items-start" aria-hidden>
          {digits.map((c, k) => (/\d/.test(c) ? <Digit key={k} d={Number(c)} delay={i * 0.1 + (digits.length - k) * 0.07} run={run} reduced={reduced} /> : <span key={k} className="inline-block w-[0.3em] text-center leading-none">{c}</span>))}
        </span>
        {s.suffix && <span aria-hidden className="ml-1 text-[0.5em] text-framekit-700 dark:text-framekit-400">{s.suffix}</span>}
      </p>
      <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.label}</p>
      {s.detail && <p className="text-xs text-zinc-600 dark:text-zinc-400">{s.detail}</p>}
      <motion.span aria-hidden className="mt-2 h-px origin-left bg-gradient-to-r from-signal-500 to-transparent" initial={false} animate={{ scaleX: run ? 1 : 0 }} transition={{ duration: 1.1, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ width: 64 }} />
    </motion.div>
  )
}

/**
 * Impact Stats — odometer counters. Every digit is a reel that spins to its value on its own spring when the row
 * scrolls into view; the right-most digits settle last, like a real mechanical counter.
 */
export function ImpactStats({ stats = DEFAULT_STATS, className }: ImpactStatsProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const run = useInView(ref, { once: true, amount: 0.4 })
  return (
    <div ref={ref} className={cn('grid w-full max-w-4xl grid-cols-2 gap-x-2 gap-y-8 lg:grid-cols-4 lg:divide-x lg:divide-zinc-200 lg:dark:divide-zinc-800', className)} role="list" aria-label="Impact in numbers">
      {stats.map((s, i) => <div role="listitem" key={s.label}><Stat s={s} i={i} run={run} reduced={reduced} /></div>)}
    </div>
  )
}
