import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RollNumber, focusRing } from '@/lib/widget-kit'

export type StackWidget = { id: string; label: string; render: () => React.ReactNode; tint: string }

export type SmartWidgetStackProps = {
  widgets?: StackWidget[]
  defaultIndex?: number
  /** Rotate every `autoMs` while idle (0 = off). Pauses on hover/focus and under reduced motion. */
  autoMs?: number
  className?: string
}

function Ring({ v }: { v: number }) {
  const C = 2 * Math.PI * 30
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90" aria-hidden="true">
      <circle cx="38" cy="38" r="30" fill="none" stroke="rgb(255 255 255 / 0.18)" strokeWidth="9" />
      <motion.circle cx="38" cy="38" r="30" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - v) }} transition={{ type: 'spring', stiffness: 60, damping: 16 }} />
    </svg>
  )
}

export const DEFAULT_STACK: StackWidget[] = [
  { id: 'bal', label: 'Balance', tint: 'from-indigo-600 to-violet-700', render: () => (
    <div><p className="text-[13px] font-medium text-white/85">Total balance</p><p className="mt-1 text-[34px] font-semibold tracking-[-0.04em]"><RollNumber value={24830.4} decimals={2} prefix="$" /></p><p className="mt-3 text-[13px] text-white/85">+$1,204 this month</p></div>
  ) },
  { id: 'steps', label: 'Steps', tint: 'from-emerald-600 to-teal-700', render: () => (
    <div className="flex items-center gap-4"><Ring v={0.72} /><div><p className="text-[13px] font-medium text-white/85">Steps today</p><p className="text-[30px] font-semibold tracking-[-0.03em]"><RollNumber value={7214} /></p><p className="text-[13px] text-white/85">of 10,000</p></div></div>
  ) },
  { id: 'spend', label: 'Spend', tint: 'from-orange-600 to-rose-700', render: () => (
    <div><p className="text-[13px] font-medium text-white/85">Spent this week</p><p className="mt-1 text-[30px] font-semibold tracking-[-0.03em]"><RollNumber value={642} prefix="$" /></p>
      <div className="mt-3 flex h-10 items-end gap-1.5" aria-hidden="true">{[40, 70, 35, 90, 55, 80, 30].map((h, i) => <motion.span key={i} className="flex-1 origin-bottom rounded-[4px] bg-white/80" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ height: `${h}%` }} transition={{ type: 'spring', stiffness: 220, damping: 24, delay: i * 0.04 }} />)}</div></div>
  ) },
  { id: 'bill', label: 'Next bill', tint: 'from-zinc-800 to-zinc-950', render: () => (
    <div><p className="text-[13px] font-medium text-white/85">Next bill · in 3 days</p><p className="mt-1 text-[30px] font-semibold tracking-[-0.03em]">Studio rent</p><p className="mt-3 text-[15px] font-medium tabular-nums text-white/90">$1,850.00 · Oct 10</p></div>
  ) },
]

/**
 * Smart Widget Stack — an iOS-style widget stack. The top widget sits at full size with the next ones peeking
 * above it; scroll, swipe vertically, use ↑ ↓ or the side dots to flip through, with a damped spring and
 * content that re-animates on arrival. Optional idle auto-rotation with pause on hover/focus.
 */
export function SmartWidgetStack({ widgets = DEFAULT_STACK, defaultIndex = 0, autoMs = 0, className }: SmartWidgetStackProps) {
  const reduced = usePrefersReducedMotion()
  const [i, setI] = React.useState(defaultIndex)
  const [paused, setPaused] = React.useState(false)
  const n = widgets.length
  const lock = React.useRef(0)
  const go = (d: number) => setI((v) => (v + d + n) % n)
  React.useEffect(() => {
    if (!autoMs || paused || reduced) return
    const t = window.setInterval(() => go(1), autoMs)
    return () => window.clearInterval(t)
  }, [autoMs, paused, reduced]) // eslint-disable-line react-hooks/exhaustive-deps
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 300, damping: 34 }
  return (
    <div className={cn('flex items-center gap-3', className)} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div
        role="region"
        aria-roledescription="widget stack"
        aria-label="Widgets"
        tabIndex={0}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); go(1) } if (e.key === 'ArrowUp') { e.preventDefault(); go(-1) } }}
        onWheel={(e) => { const now = Date.now(); if (Math.abs(e.deltaY) < 12 || now - lock.current < 450) return; lock.current = now; go(e.deltaY > 0 ? 1 : -1) }}
        className={cn('relative h-[196px] w-[min(86vw,340px)] touch-pan-x pt-5', focusRing, 'rounded-[30px]')}
      >
        {widgets.map((w, k) => {
          const o = (k - i + n) % n
          if (o > 2) return null
          return (
            <motion.div
              key={w.id}
              drag={o === 0 && !reduced ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.35}
              onDragEnd={(_, info) => { if (Math.abs(info.offset.y) > 40 || Math.abs(info.velocity.y) > 400) go(info.offset.y < 0 ? 1 : -1) }}
              className={cn('absolute inset-x-0 bottom-0 h-[176px] overflow-hidden rounded-[28px] bg-gradient-to-br p-5 text-white shadow-[0_2px_6px_rgb(0_0_0/0.12),0_24px_40px_-20px_rgb(0_0_0/0.5),inset_0_1px_0_rgb(255_255_255/0.18)]', w.tint, o === 0 && 'cursor-grab active:cursor-grabbing')}
              initial={false}
              animate={{ y: -o * 10, scale: 1 - o * 0.06, zIndex: 10 - o, opacity: o === 0 ? 1 : 0.7 - o * 0.15 }}
              transition={spring}
              style={{ transformOrigin: 'top center' }}
              aria-hidden={o !== 0 || undefined}
            >
              <AnimatePresence mode="wait">{o === 0 && <motion.div key={`${w.id}-${i}`} initial={reduced ? false : { opacity: 0, y: 6, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>{w.render()}</motion.div>}</AnimatePresence>
            </motion.div>
          )
        })}
        <p className="sr-only" aria-live="polite">{widgets[i].label}, {i + 1} of {n}</p>
      </div>
      <div className="flex flex-col gap-1">
        {widgets.map((w, k) => (
          <button key={w.id} type="button" onClick={() => setI(k)} aria-label={`Show ${w.label}`} aria-current={k === i || undefined} className={cn('grid w-6 place-items-center rounded-full py-1', focusRing)}>
            <motion.span className="block w-1.5 rounded-full bg-zinc-900 dark:bg-white" animate={{ height: k === i ? 18 : 6, opacity: k === i ? 1 : 0.3 }} transition={{ type: 'spring', stiffness: 460, damping: 36 }} />
          </button>
        ))}
      </div>
    </div>
  )
}
