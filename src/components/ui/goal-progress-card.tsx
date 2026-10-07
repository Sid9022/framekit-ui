import * as React from 'react'
import { motion, animate, useMotionValue, useTransform } from 'motion/react'
import { Plus, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RollNumber, focusRing } from '@/lib/widget-kit'

export type GoalProgressCardProps = {
  title?: string
  saved?: number
  goal?: number
  step?: number
  currency?: string
  milestones?: number[]
  emoji?: string
  onChange?: (saved: number) => void
  className?: string
}

/**
 * Goal Progress Card — a savings goal with a liquid progress bar. Topping up springs the fill forward with a
 * moving sheen, milestone ticks light up as they’re passed, and reaching the goal morphs the button into a check.
 */
export function GoalProgressCard({ title = 'Trip to Kyoto', saved: initial = 2150, goal = 4000, step = 250, currency = '$', milestones = [0.25, 0.5, 0.75], emoji = '🗻', onChange, className }: GoalProgressCardProps) {
  const reduced = usePrefersReducedMotion()
  const [saved, setSaved] = React.useState(initial)
  const p = useMotionValue(0)
  const pct = Math.min(1, saved / goal)
  React.useEffect(() => {
    if (reduced) { p.set(pct); return }
    const c = animate(p, pct, { type: 'spring', stiffness: 90, damping: 20 })
    return () => c.stop()
  }, [pct, reduced, p])
  const width = useTransform(p, (v) => `${v * 100}%`)
  const done = saved >= goal
  return (
    <div className={cn('w-full max-w-[400px] rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08] sm:p-6', className)}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-[14px] bg-gradient-to-br from-sky-100 to-indigo-100 text-xl shadow-[inset_0_1px_0_white] dark:from-sky-500/20 dark:to-indigo-500/20 dark:shadow-none" aria-hidden="true">{emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-zinc-950 dark:text-white">{title}</p>
          <p className="text-[13px] tabular-nums text-zinc-600 dark:text-zinc-400">{Math.round(pct * 100)}% of {currency}{goal.toLocaleString('en-US')}</p>
        </div>
      </div>
      <p className="mt-5 text-[34px] font-semibold leading-none tracking-[-0.04em] text-zinc-950 dark:text-white"><RollNumber value={saved} prefix={currency} duration={0.6} /></p>
      <div className="relative mt-4 h-3.5 rounded-full bg-zinc-100 dark:bg-white/[0.07]" role="progressbar" aria-label={`${title} progress`} aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(saved, goal)} aria-valuetext={`${currency}${saved} of ${currency}${goal}`}>
        <motion.div className="absolute inset-y-0 left-0 overflow-hidden rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 shadow-[0_0_16px_rgb(79_70_229/0.45),inset_0_1px_0_rgb(255_255_255/0.35)]" style={{ width }}>
          {!reduced && <motion.span className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/45 to-transparent" animate={{ x: ['-4rem', '28rem'] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }} aria-hidden="true" />}
        </motion.div>
        {milestones.map((m) => (
          <span key={m} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${m * 100}%` }} aria-hidden="true">
            <motion.span className="block size-1.5 rounded-full" animate={{ backgroundColor: pct >= m ? 'rgb(255 255 255)' : 'rgb(161 161 170)', scale: pct >= m ? 1.3 : 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-[13px] tabular-nums text-zinc-600 dark:text-zinc-400">{done ? 'Goal reached 🎉' : `${currency}${(goal - saved).toLocaleString('en-US')} to go`}</p>
        <motion.button
          type="button"
          layout={!reduced}
          whileTap={{ scale: 0.96 }}
          disabled={done}
          onClick={() => { const v = Math.min(goal, saved + step); setSaved(v); onChange?.(v) }}
          className={cn('inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]', done ? 'bg-emerald-600 text-white' : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950', focusRing)}
          transition={{ type: 'spring', stiffness: 460, damping: 32 }}
        >
          {done ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {done ? 'Done' : `Add ${currency}${step}`}
        </motion.button>
      </div>
    </div>
  )
}
