import * as React from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt } from '@/lib/portfolio-art'

export type CaseStudyStep = {
  id: string
  label: string
  title: string
  body: string
  /** Bullet points or key figures. */
  points?: string[]
  seed?: number
  src?: string
}

export type CaseStudyScrollProps = {
  client?: string
  steps?: CaseStudyStep[]
  /** Scroll element when the case study lives inside its own scroller (defaults to the window). */
  scrollContainer?: React.RefObject<HTMLElement | null>
  titleAs?: 'h2' | 'h3'
  className?: string
}

const DEFAULT_STEPS: CaseStudyStep[] = [
  { id: 'problem', label: 'Problem', title: 'Patients were drowning in numbers', body: 'Lab results arrived as dense tables. Support lines were swamped with “is this bad?” calls and 1 in 3 people skipped follow-ups.', points: ['34% skipped follow-up care', '1,900 support calls / month', 'Reading level: grade 13'], seed: 3 },
  { id: 'process', label: 'Process', title: 'Sketch, test, simplify — three loops', body: 'We shadowed twelve patients, prototyped plain-language summaries and tested them in paper, then in a clickable build. Every loop cut a screen.', points: ['12 patient interviews', '3 prototype rounds', '9 screens → 4'], seed: 11 },
  { id: 'result', label: 'Result', title: 'Calmer people, fewer calls', body: 'Results now open with one sentence, a colour-safe status and the single next step. Support volume dropped and follow-ups climbed within a quarter.', points: ['−41% support calls', '+28% follow-ups booked', '4.8★ app rating'], seed: 19 },
]

/**
 * Case Study Scroll — Problem → Process → Result told as a scroll-driven story. A sticky rail fills as you read
 * (spring-smoothed scroll progress) and lights the current chapter; chapters rise in with staggered figures.
 */
export function CaseStudyScroll({ client = 'Lumen Health — patient results', steps = DEFAULT_STEPS, scrollContainer, titleAs = 'h3', className }: CaseStudyScrollProps) {
  const reduced = usePrefersReducedMotion()
  const root = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: root, container: scrollContainer, offset: ['start 0.65', 'end 0.55'] })
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 })
  const [idx, setIdx] = React.useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setIdx(Math.max(0, Math.min(steps.length - 1, Math.floor(v * steps.length * 0.999)))))
  const H = titleAs
  const pct = useTransform(fill, (v) => `${Math.round(v * 100)}%`)

  return (
    <div ref={root} className={cn('grid w-full max-w-4xl gap-8 lg:grid-cols-[190px_1fr] lg:gap-12', className)}>
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-400">Case study</p>
        <p className="mt-1 font-display text-2xl leading-tight text-zinc-950 dark:text-zinc-50">{client}</p>
        <ol className="relative mt-5 flex gap-4 lg:flex-col lg:gap-0" aria-label="Chapters">
          <span aria-hidden className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-zinc-300 lg:block dark:bg-zinc-700">
            <motion.span className="absolute inset-x-0 top-0 h-full origin-top bg-signal-600 dark:bg-signal-300" style={{ scaleY: fill }} />
          </span>
          {steps.map((s, i) => (
            <li key={s.id} className="lg:py-3">
              <a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`cs-${s.id}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }) }} aria-current={idx === i ? 'step' : undefined} className="flex min-h-11 items-center gap-3 text-sm font-medium">
                <span className={cn('relative z-10 grid h-4 w-4 place-items-center rounded-full border-2 bg-white transition-colors duration-300 dark:bg-zinc-950', i <= idx ? 'border-signal-600 dark:border-signal-300' : 'border-zinc-400 dark:border-zinc-600')}>
                  <motion.span className="h-1.5 w-1.5 rounded-full bg-signal-600 dark:bg-signal-300" initial={false} animate={{ scale: i <= idx ? 1 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }} />
                </span>
                <span className={cn('transition-colors duration-300', idx === i ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-400')}>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <motion.p className="mt-3 hidden font-mono text-xs tabular-nums text-zinc-600 lg:block dark:text-zinc-400" aria-hidden>{pct}</motion.p>
      </aside>

      <div className="space-y-20 pb-6">
        {steps.map((s, i) => (
          <motion.section
            key={s.id}
            id={`cs-${s.id}`}
            aria-labelledby={`cs-${s.id}-h`}
            initial={reduced ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25, root: scrollContainer }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="scroll-mt-8"
          >
            <p className="font-mono text-xs tabular-nums text-signal-700 dark:text-signal-300">{String(i + 1).padStart(2, '0')} / {s.label.toUpperCase()}</p>
            <H id={`cs-${s.id}-h`} className="mt-2 font-display text-4xl leading-[1.05] tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">{s.title}</H>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{s.body}</p>
            <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10"><PortfolioArt seed={s.seed ?? i * 7 + 2} src={s.src} alt="" /></div>
            {s.points && (
              <ul className="mt-5 grid gap-2 sm:grid-cols-3">
                {s.points.map((p, k) => (
                  <motion.li
                    key={p}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, root: scrollContainer }}
                    transition={{ delay: 0.15 + k * 0.08, type: 'spring', stiffness: 300, damping: 28 }}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                  >{p}</motion.li>
                ))}
              </ul>
            )}
          </motion.section>
        ))}
      </div>
    </div>
  )
}
