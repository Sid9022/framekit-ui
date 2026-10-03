import * as React from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type TimelineEntry = {
  period: string
  role: string
  org: string
  summary: string
  tags?: string[]
}

export type CareerTimelineProps = {
  entries?: TimelineEntry[]
  scrollContainer?: React.RefObject<HTMLElement | null>
  titleAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

const DEFAULT_ENTRIES: TimelineEntry[] = [
  { period: '2025 — now', role: 'Principal Product Designer', org: 'Northwind Labs', summary: 'Lead a nine-person design group and the shared motion language across web and mobile.', tags: ['Leadership', 'Design systems'] },
  { period: '2022 — 2025', role: 'Senior Design Engineer', org: 'Halcyon Studio', summary: 'Shipped interactive launches for 14 brands; cut average page weight 48% while adding richer motion.', tags: ['React', 'Motion', 'Performance'] },
  { period: '2019 — 2022', role: 'Product Designer', org: 'Brightside', summary: 'Owned onboarding for a 2M-user fintech app. Lifted activation from 41% to 63%.', tags: ['Research', 'Prototyping'] },
  { period: '2016 — 2019', role: 'Interaction Designer', org: 'Fieldwork Agency', summary: 'Built the first interactive prototypes for an award-winning museum guide.', tags: ['Interaction', 'Installations'] },
  { period: '2014 — 2016', role: 'B.Des, Visual Communication', org: 'Aldwych College', summary: 'Graduated with distinction; thesis on kinetic typography and reading comfort.', tags: ['Typography'] },
]

/**
 * Career Timeline — a vertical line that draws itself as you scroll, with a glowing head. Each milestone's node pops
 * with a spring as the head passes it and its card slides in from alternating sides.
 */
export function CareerTimeline({ entries = DEFAULT_ENTRIES, scrollContainer, titleAs = 'h3', className }: CareerTimelineProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, container: scrollContainer, offset: ['start 0.7', 'end 0.55'] })
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.5 })
  const head = useTransform(draw, (v) => `${v * 100}%`)
  const Title = titleAs

  return (
    <div ref={ref} className={cn('relative w-full max-w-3xl py-2', className)}>
      <div aria-hidden className="absolute bottom-3 left-[15px] top-3 w-px bg-zinc-300 md:left-1/2 dark:bg-zinc-700">
        <motion.div className="absolute inset-0 origin-top bg-gradient-to-b from-signal-500 via-signal-600 to-framekit-600 dark:from-signal-300 dark:via-signal-400 dark:to-framekit-400" style={{ scaleY: reduced ? 1 : draw }} />
        {!reduced && (
          <motion.span className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-framekit-500 shadow-[0_0_0_4px_rgb(249_115_22/0.18),0_0_18px_4px_rgb(249_115_22/0.5)]" style={{ top: head }} />
        )}
      </div>
      <ol className="space-y-10">
        {entries.map((e, i) => {
          const right = i % 2 === 1
          return (
            <li key={e.role + e.period} className="relative grid grid-cols-[32px_1fr] gap-4 md:grid-cols-2 md:gap-14">
              <motion.span
                aria-hidden
                className="absolute left-[15px] top-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-signal-600 bg-white md:left-1/2 dark:border-signal-300 dark:bg-zinc-950"
                initial={reduced ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 1, root: scrollContainer, margin: '0px 0px -30% 0px' }}
                transition={{ type: 'spring', stiffness: 520, damping: 18 }}
              />
              <motion.div
                className={cn('col-start-2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900', right ? 'md:col-start-2' : 'md:col-start-1 md:text-right')}
                initial={reduced ? false : { opacity: 0, x: right ? 36 : -36, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.3, root: scrollContainer }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-xs tabular-nums text-signal-700 dark:text-signal-300">{e.period}</p>
                <Title className="mt-1 font-display text-2xl leading-tight text-zinc-950 dark:text-zinc-50">{e.role}</Title>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{e.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{e.summary}</p>
                {e.tags && (
                  <ul className={cn('mt-3 flex flex-wrap gap-1.5', !right && 'md:justify-end')}>
                    {e.tags.map((t) => <li key={t} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">{t}</li>)}
                  </ul>
                )}
              </motion.div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
