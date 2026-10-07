import * as React from 'react'
import { motion, useSpring, useTransform } from 'motion/react'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RollNumber, SrDataTable, useChartCursor, seeded, focusRing } from '@/lib/widget-kit'

export type BudgetPoint = { label: string; value: number }

export type BudgetAreaCardProps = {
  label?: string
  total?: number
  change?: number
  currency?: string
  points?: BudgetPoint[]
  /** Point highlighted at rest. */
  defaultActive?: number
  /** Show the soft-3D banknote stack. */
  showIllustration?: boolean
  className?: string
}

export const DEFAULT_BUDGET: BudgetPoint[] = [
  { label: 'Sun', value: 180 }, { label: 'Mon', value: 420 }, { label: 'Tue', value: 430 }, { label: 'Wed', value: 750 },
  { label: 'Thu', value: 750 }, { label: 'Fri', value: 560 }, { label: 'Sat', value: 1080 },
]

/** Soft-3D banknotes built from layered divs (no image assets). */
function NoteStack() {
  const note = (i: number) => (
    <div
      key={i}
      className="absolute h-[74px] w-[132px] rounded-[14px] bg-gradient-to-br from-white to-zinc-100 shadow-[0_1px_1px_rgb(0_0_0/0.04),0_10px_18px_-8px_rgb(24_24_60/0.28),inset_0_1px_0_white,inset_0_-2px_4px_rgb(0_0_0/0.05)] ring-1 ring-black/[0.04] dark:from-zinc-200 dark:to-zinc-300"
      style={{ transform: `translate(${i * 18}px, ${i * 22}px) rotate(${-18 + i * 7}deg)` }}
    >
      <span className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200 shadow-[inset_0_2px_4px_rgb(0_0_0/0.1)] dark:bg-zinc-400/60" />
      <span className="absolute left-3 top-1/2 size-3 -translate-y-1/2 rounded-full bg-zinc-200 shadow-[inset_0_1px_2px_rgb(0_0_0/0.1)] dark:bg-zinc-400/60" />
      <span className="absolute right-3 top-1/2 size-3 -translate-y-1/2 rounded-full bg-zinc-200 shadow-[inset_0_1px_2px_rgb(0_0_0/0.1)] dark:bg-zinc-400/60" />
    </div>
  )
  return <div className="relative h-[140px] w-[180px]" aria-hidden="true">{[0, 1, 2].map(note)}</div>
}

/**
 * Budget Area Card — a soft white squircle with a big rolling total, a delta pill and floating soft-3D notes.
 * An indigo stepped area chart draws itself in, sparkles drift in the fill, and a tooltip bubble springs between
 * points on hover, drag or ← →.
 */
export function BudgetAreaCard({ label = 'Budget', total = 30739, change = 317, currency = '$', points = DEFAULT_BUDGET, defaultActive = 3, showIllustration = true, className }: BudgetAreaCardProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId().replace(/:/g, '')
  const W = 320, H = 150, pad = 8
  const n = points.length
  const max = Math.max(...points.map((p) => p.value)) * 1.08
  const xs = points.map((_, i) => pad + (i / (n - 1)) * (W - pad * 2 - 6))
  const ys = points.map((p) => H - 18 - (p.value / max) * (H - 40))
  const half = (W / n) * 0.22
  let d = `M 0 ${ys[0]}`
  points.forEach((_, i) => {
    const x0 = Math.max(0, xs[i] - half), x1 = i === n - 1 ? xs[i] : xs[i] + half
    d += ` L ${x0} ${ys[i]} L ${x1} ${ys[i]}`
  })
  const area = `${d} L ${xs[n - 1]} ${H} L 0 ${H} Z`
  const { active, bind } = useChartCursor(n, { initial: defaultActive, keepOnLeave: true })
  const ai = active ?? defaultActive
  const sx = useSpring(xs[ai], { stiffness: 380, damping: 32 })
  const sy = useSpring(ys[ai], { stiffness: 380, damping: 32 })
  React.useEffect(() => { if (reduced) { sx.jump(xs[ai]); sy.jump(ys[ai]) } else { sx.set(xs[ai]); sy.set(ys[ai]) } }, [ai, reduced]) // eslint-disable-line react-hooks/exhaustive-deps
  const leftPct = useTransform(sx, (v) => `${(v / W) * 100}%`)
  const topPct = useTransform(sy, (v) => `${(v / H) * 100}%`)
  const sparkles = React.useMemo(() => { const r = seeded(4); return Array.from({ length: 26 }, () => ({ x: r(), y: r() })) }, [])
  const last = { x: xs[n - 1], y: ys[n - 1] }

  return (
    <div className={cn('relative w-full max-w-[420px] rounded-[40px] bg-zinc-200/70 p-3 dark:bg-zinc-800/60', className)}>
      <div className="relative overflow-hidden rounded-[30px] bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_24px_48px_-24px_rgb(24_24_60/0.3)] ring-1 ring-black/[0.04] dark:bg-zinc-900 dark:ring-white/[0.08] sm:p-7">
        {showIllustration && (
          <motion.div className="absolute -right-12 top-0 origin-top-right scale-[0.7] sm:right-0 sm:top-4 sm:scale-100" initial={reduced ? false : { opacity: 0, y: -10, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
            <motion.div animate={reduced ? undefined : { y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><NoteStack /></motion.div>
          </motion.div>
        )}
        <div className="relative">
          <p className="text-[15px] font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-[44px] font-normal leading-none tracking-[-0.04em] text-zinc-950 dark:text-white sm:text-[52px]">
            <RollNumber value={total} prefix={currency} />
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium tabular-nums text-zinc-900 shadow-[inset_0_1px_0_white,0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.06] dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-none dark:ring-white/10">
            {change >= 0 ? '+' : '−'}&nbsp;{currency}{Math.abs(change).toLocaleString('en-US')} <TrendingUp className="size-4" aria-hidden="true" />
          </span>
        </div>

        <div className="relative mt-8">
          <div {...bind} role="group" aria-label={`${label} by day. Use left and right arrows to inspect values.`} className={cn('relative touch-pan-y rounded-xl', focusRing)}>
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4338ca" stopOpacity="0.85" /><stop offset="0.6" stopColor="#6366f1" stopOpacity="0.35" /><stop offset="1" stopColor="#818cf8" stopOpacity="0" /></linearGradient>
                <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="white" stopOpacity="0" /><stop offset="0.12" stopColor="white" stopOpacity="1" /></linearGradient>
                <mask id={`${id}-m`}><rect width={W} height={H} fill={`url(#${id}-fade)`} /></mask>
                <clipPath id={`${id}-clip`}><path d={area} /></clipPath>
                <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 L7 5 L1 9" fill="none" stroke="#3730a3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></marker>
              </defs>
              <g mask={`url(#${id}-m)`}>
                <motion.path d={area} fill={`url(#${id}-fill)`} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
                {xs.slice(1).map((x, i) => <line key={i} x1={x - (W / n) / 2} x2={x - (W / n) / 2} y1={0} y2={H} stroke="white" strokeOpacity="0.18" clipPath={`url(#${id}-clip)`} />)}
                <g clipPath={`url(#${id}-clip)`}>
                  {sparkles.map((s, i) => (
                    <motion.circle key={i} cx={s.x * W} cy={H * 0.35 + s.y * H * 0.6} r={1.1} fill="white" animate={reduced ? undefined : { opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.17 }} />
                  ))}
                </g>
                <motion.path d={d} fill="none" stroke="#3730a3" strokeWidth={2.4} strokeLinejoin="round" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="dark:stroke-indigo-400" />
              </g>
              <motion.line x1={last.x - 2} y1={last.y + 6} x2={last.x + 2} y2={last.y - 10} stroke="#3730a3" strokeWidth={2.4} strokeLinecap="round" markerEnd={`url(#${id}-arrow)`} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="dark:stroke-indigo-400" />
            </svg>
            <motion.div className="pointer-events-none absolute" style={{ left: leftPct, top: topPct }}>
              <span className="absolute -translate-x-1/2 -translate-y-1/2 size-3.5 rounded-full border-[3px] border-indigo-800 bg-white shadow-[0_0_0_6px_rgb(99_102_241/0.18)] dark:border-indigo-300 dark:bg-zinc-900" />
              <span className="absolute bottom-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-3 py-1 text-[15px] font-medium tabular-nums text-white shadow-[0_8px_24px_-6px_rgb(79_70_229/0.7),inset_0_1px_0_rgb(255_255_255/0.25)]" aria-live="polite">
                {currency}{points[ai].value.toLocaleString('en-US')}
                <span className="absolute left-1/2 top-full -mt-1 size-2 -translate-x-1/2 rotate-45 bg-indigo-600" />
              </span>
            </motion.div>
          </div>
          <div className="mt-3 flex justify-between px-1 text-[13px] text-zinc-500 dark:text-zinc-400" aria-hidden="true">
            {points.map((p, i) => <span key={p.label} className={cn('transition-colors duration-150', i === ai && 'font-medium text-zinc-900 dark:text-white')}>{p.label}</span>)}
          </div>
          <SrDataTable caption={`${label} by day`} columns={['Day', 'Amount']} rows={points.map((p) => [p.label, `${currency}${p.value}`])} />
        </div>
      </div>
    </div>
  )
}
