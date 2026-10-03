import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type RoleMorphRole = { label: string; /** CSS color for the underline & glow. */ color?: string }

export type RoleMorphHeroProps = {
  greeting?: string
  roles?: (string | RoleMorphRole)[]
  description?: string
  ctaLabel?: string
  onCta?: () => void
  /** ms each role rests. */
  interval?: number
  className?: string
}

const COLORS = ['#f97316', '#7d6899', '#0e9f8e', '#e11d74', '#4f46e5']
const DEFAULT_ROLES = ['designer', 'storyteller', 'prototyper', 'tinkerer', 'problem-solver']

/**
 * Role Morph Hero — “I’m a ____.” with the blank cycling through your roles. Letters of the outgoing role drop away
 * with a blur while the next role’s letters spring up in a stagger, the highlighter bar springs to the new width and a
 * colour wash behind the headline shifts per role. Pause, or jump to a role with the dots.
 */
export function RoleMorphHero({ greeting = 'Hi, I’m Sam Okoye —', roles = DEFAULT_ROLES, description = 'Based in Lisbon, working worldwide. I help young companies turn rough ideas into products people love to open.', ctaLabel = 'Start a project', onCta, interval = 2600, className }: RoleMorphHeroProps) {
  const reduced = usePrefersReducedMotion()
  const list: Required<RoleMorphRole>[] = roles.map((r, i) => (typeof r === 'string' ? { label: r, color: COLORS[i % COLORS.length] } : { label: r.label, color: r.color ?? COLORS[i % COLORS.length] }))
  const [i, setI] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [hold, setHold] = React.useState(false)
  const [widths, setWidths] = React.useState<number[]>([])
  const measure = React.useRef<HTMLSpanElement>(null)
  const role = list[i % list.length]
  const run = !paused && !hold && !reduced
  React.useEffect(() => {
    if (!run) return
    const t = window.setTimeout(() => setI((x) => (x + 1) % list.length), interval)
    return () => window.clearTimeout(t)
  }, [run, i, interval, list.length])
  const labelsKey = list.map((r) => r.label).join('|')
  React.useLayoutEffect(() => {
    const m = () => setWidths(Array.from(measure.current?.children ?? []).map((c) => c.getBoundingClientRect().width))
    m()
    document.fonts?.ready.then(m)
  }, [labelsKey])
  const w = widths[i % list.length] ?? 0

  return (
    <section
      aria-label="Introduction"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      className={cn('relative isolate flex min-h-[560px] w-full max-w-4xl flex-col justify-center overflow-hidden rounded-3xl bg-stone-50 p-6 ring-1 ring-black/5 sm:p-12 dark:bg-zinc-950 dark:ring-white/10', className)}
    >
      <motion.div aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[420px] w-[420px] rounded-full blur-3xl" animate={{ backgroundColor: role.color }} style={{ opacity: 0.28 }} transition={{ duration: 0.9 }} />
      <motion.div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-[320px] w-[320px] rounded-full blur-3xl" animate={{ backgroundColor: role.color }} style={{ opacity: 0.14 }} transition={{ duration: 1.2 }} />

      <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">{greeting}</p>
      <h2 className="mt-3 font-display text-[clamp(46px,9vw,104px)] leading-[1.02] tracking-[-0.025em] text-zinc-950 dark:text-zinc-50">
        <span className="sr-only">I’m a {list.map((r) => r.label).join(', ')}.</span>
        <span aria-hidden className="flex flex-wrap items-baseline gap-x-[0.28em]">
          <span>a</span>
          <motion.span className="relative inline-block" animate={{ width: w }} initial={false} transition={{ type: 'spring', stiffness: 220, damping: 26 }} style={{ height: '1.08em' }}>
            <motion.span className="absolute inset-x-[-0.06em] bottom-[0.06em] h-[0.2em] rounded-full opacity-60" animate={{ backgroundColor: role.color }} transition={{ duration: 0.6 }} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={role.label} className="absolute left-0 top-0 inline-flex whitespace-nowrap" exit={{ transition: { staggerChildren: 0.015 } }}>
                {Array.from(role.label).map((c, k) => (
                  <motion.span
                    key={k}
                    className="inline-block"
                    initial={reduced ? { opacity: 0 } : { y: '70%', opacity: 0, filter: 'blur(8px)', rotate: 6 }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)', rotate: 0 }}
                    exit={reduced ? { opacity: 0 } : { y: '-60%', opacity: 0, filter: 'blur(8px)', rotate: -6, transition: { duration: 0.28, delay: k * 0.012 } }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.14 + k * 0.03 }}
                  >{c}</motion.span>
                ))}
              </motion.span>
            </AnimatePresence>
          </motion.span>
          <span>.</span>
          <span ref={measure} className="invisible absolute left-0 top-0 -z-10 flex flex-col items-start whitespace-nowrap">{list.map((r) => <span key={r.label} className="inline-block w-fit">{r.label}</span>)}</span>
        </span>
      </h2>
      <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{description}</p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="button" onClick={onCta} className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition-transform hover:bg-zinc-800 active:scale-95 motion-reduce:active:scale-100 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">{ctaLabel}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden /></button>
        <div className="flex items-center" role="group" aria-label="Choose role">
          {list.map((r, k) => (
            <button key={r.label} type="button" aria-label={`Show role: ${r.label}`} aria-current={k === i} onClick={() => setI(k)} className="grid h-11 w-6 place-items-center">
              <motion.span className="block h-2 rounded-full" animate={{ width: k === i ? 22 : 8, backgroundColor: k === i ? r.color : '#a1a1aa' }} transition={{ type: 'spring', stiffness: 420, damping: 28 }} />
            </button>
          ))}
          {!reduced && (
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Resume role rotation' : 'Pause role rotation'} className="ml-1 grid h-11 w-11 place-items-center rounded-full text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800">{paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}</button>
          )}
        </div>
      </div>
    </section>
  )
}
