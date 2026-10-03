import * as React from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SkillMeter = { label: string; value: number; note?: string }

export type SkillMetersProps = {
  skills?: SkillMeter[]
  /** Show a replay button. */
  replayable?: boolean
  className?: string
}

const DEFAULT_SKILLS: SkillMeter[] = [
  { label: 'Interface design', value: 96, note: '9 yrs' },
  { label: 'Motion & prototyping', value: 91, note: '7 yrs' },
  { label: 'Front-end (React)', value: 88, note: '8 yrs' },
  { label: 'Research & testing', value: 79, note: '6 yrs' },
]

const R = 44
const C = 2 * Math.PI * R

function Meter({ s, i, run, reduced, runKey }: { s: SkillMeter; i: number; run: boolean; reduced: boolean; runKey: number }) {
  const id = React.useId().replace(/:/g, '')
  const v = useMotionValue(0)
  const dash = useTransform(v, (x) => `${(x / 100) * C} ${C}`)
  const angle = useTransform(v, (x) => (x / 100) * 360)
  const text = useTransform(v, (x) => String(Math.round(x)))
  React.useEffect(() => {
    if (!run) return
    if (reduced) { v.set(s.value); return }
    v.set(0)
    const c = animate(v, s.value, { duration: 1.6, delay: 0.12 + i * 0.14, ease: [0.16, 1, 0.3, 1] })
    return () => c.stop()
  }, [run, runKey, reduced, s.value, i, v])
  return (
    <li><div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900" role="meter" aria-label={s.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.value} aria-valuetext={`${s.value} out of 100`}>
      <div className="relative h-28 w-28" aria-hidden>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9a86b8" /><stop offset="1" stopColor="#f97316" /></linearGradient>
            <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" /></filter>
          </defs>
          <circle cx="50" cy="50" r={R} fill="none" strokeWidth="7" className="stroke-zinc-200 dark:stroke-zinc-800" />
          {Array.from({ length: 40 }, (_, k) => { const a = (k / 40) * Math.PI * 2; return <line key={k} x1={50 + Math.cos(a) * 36} y1={50 + Math.sin(a) * 36} x2={50 + Math.cos(a) * 38} y2={50 + Math.sin(a) * 38} strokeWidth="0.8" className="stroke-zinc-300 dark:stroke-zinc-700" /> })}
          <motion.circle cx="50" cy="50" r={R} fill="none" strokeWidth="7" strokeLinecap="round" stroke={`url(#${id})`} opacity="0.5" filter={`url(#${id}b)`} style={{ strokeDasharray: dash }} />
          <motion.circle cx="50" cy="50" r={R} fill="none" strokeWidth="7" strokeLinecap="round" stroke={`url(#${id})`} style={{ strokeDasharray: dash }} />
        </svg>
        <motion.span className="absolute inset-0" style={{ rotate: angle }}>
          <span className="absolute left-1/2 top-[6%] h-2 w-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_2px_rgb(249_115_22/0.7)]" />
        </motion.span>
        <span className="absolute inset-0 grid place-items-center font-display text-4xl tabular-nums text-zinc-950 dark:text-zinc-50"><motion.span>{text}</motion.span></span>
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.label}</p>
        {s.note && <p className="text-xs text-zinc-600 dark:text-zinc-400">{s.note}</p>}
      </div>
    </div></li>
  )
}

/**
 * Skill Meters — radial gauges that sweep to their value when scrolled into view: a glowing gradient arc, a comet
 * dot riding the tip and a live count-up in the centre. Staggered, replayable, exposed as ARIA meters.
 */
export function SkillMeters({ skills = DEFAULT_SKILLS, replayable = true, className }: SkillMetersProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const run = useInView(ref, { once: true, amount: 0.3 })
  const [runKey, setRunKey] = React.useState(0)
  return (
    <div ref={ref} className={cn('w-full max-w-3xl', className)}>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Skill levels">
        {skills.map((s, i) => <Meter key={s.label} s={s} i={i} run={run} reduced={reduced} runKey={runKey} />)}
      </ul>
      {replayable && (
        <button type="button" onClick={() => setRunKey((k) => k + 1)} className="mx-auto mt-3 flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
          <RotateCcw className="h-4 w-4" aria-hidden />Replay
        </button>
      )}
    </div>
  )
}
