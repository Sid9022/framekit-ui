import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RollNumber, focusRing } from '@/lib/widget-kit'

export type SpendSlice = { label: string; value: number; color: string }

export type SpendDonutCardProps = {
  title?: string
  slices?: SpendSlice[]
  currency?: string
  size?: number
  className?: string
}

export const DEFAULT_SLICES: SpendSlice[] = [
  { label: 'Housing', value: 1850, color: '#6d5cff' },
  { label: 'Food', value: 640, color: '#22c3a6' },
  { label: 'Transport', value: 320, color: '#ff9f43' },
  { label: 'Fun', value: 410, color: '#ff5c8a' },
  { label: 'Other', value: 260, color: '#9aa4b8' },
]

/**
 * Spend Donut Card — a radial spend breakdown. Arcs sweep in one after another with rounded gaps; hovering or
 * focusing a legend row (or an arc) pops that arc outward and rolls the centre total to the category amount.
 */
export function SpendDonutCard({ title = 'Spending · October', slices = DEFAULT_SLICES, currency = '$', size = 180, className }: SpendDonutCardProps) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState<number | null>(null)
  const total = slices.reduce((a, s) => a + s.value, 0)
  const R = size / 2 - 14, C = 2 * Math.PI * R, gap = 6
  let acc = 0
  const arcs = slices.map((s) => { const len = (s.value / total) * C; const a = { start: acc, len }; acc += len; return a })
  const shown = active === null ? total : slices[active].value
  return (
    <div className={cn('w-full max-w-[440px] rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08] sm:p-6', className)}>
      <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{title}</p>
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={slices.map((s) => `${s.label} ${currency}${s.value}`).join(', ')}>
            <circle cx={size / 2} cy={size / 2} r={R} fill="none" strokeWidth={18} className="stroke-zinc-100 dark:stroke-zinc-800" />
            {slices.map((s, i) => {
              const { start, len } = arcs[i]
              const on = active === i
              return (
                <motion.circle
                  key={s.label}
                  cx={size / 2} cy={size / 2} r={R} fill="none" stroke={s.color} strokeLinecap="round"
                  strokeDasharray={`${Math.max(0.1, len - gap)} ${C}`}
                  initial={reduced ? false : { strokeDashoffset: -start + len, opacity: 0 }}
                  animate={{ strokeDashoffset: -start, opacity: active === null || on ? 1 : 0.35, strokeWidth: on ? 24 : 18 }}
                  transition={{ strokeDashoffset: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : 0.1 + i * 0.12 }, opacity: { duration: 0.2 }, strokeWidth: { type: 'spring', stiffness: 420, damping: 30 } }}
                  onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)}
                />
              )
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center" aria-live="polite">
            <div>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={active ?? 'all'} initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }} transition={{ duration: 0.18 }} className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
                  {active === null ? 'Total' : slices[active].label}
                </motion.p>
              </AnimatePresence>
              <RollNumber value={shown} prefix={currency} duration={0.5} className="text-[26px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white" />
            </div>
          </div>
        </div>
        <ul className="grid w-full gap-1">
          {slices.map((s, i) => (
            <li key={s.label}>
              <button type="button" onPointerEnter={() => setActive(i)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(i)} onBlur={() => setActive(null)} className={cn('flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-white/[0.06]', active === i && 'bg-zinc-100 dark:bg-white/[0.06]', focusRing)}>
                <span className="size-2.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                <span className="flex-1 text-zinc-800 dark:text-zinc-200">{s.label}</span>
                <span className="tabular-nums text-zinc-600 dark:text-zinc-400">{Math.round((s.value / total) * 100)}%</span>
                <span className="w-16 text-right font-medium tabular-nums text-zinc-950 dark:text-white">{currency}{s.value.toLocaleString('en-US')}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
