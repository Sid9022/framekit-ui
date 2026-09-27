import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type PluckedStringTab = { id: string; label: string; content?: React.ReactNode }

export type PluckedStringTabsProps = {
  items?: PluckedStringTab[]
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  /** Strum the string when the pointer sweeps across it. */
  strum?: boolean
  className?: string
}

export const DEFAULT_STRING_TABS: PluckedStringTab[] = [
  { id: 'overview', label: 'Overview', content: 'A quick look at this week: 12 releases shipped, 3 in review, and a calm on-call rotation.' },
  { id: 'activity', label: 'Activity', content: 'Mara merged “Faster cold starts”. Ilya opened 2 issues. The nightly build finished in 4m 12s.' },
  { id: 'team', label: 'Team', content: 'Six people across three time zones. Tuesday standups are async; Friday demos are live.' },
  { id: 'billing', label: 'Billing', content: 'Next invoice on Nov 1 for 8 seats. Usage is 64% of the included build minutes.' },
  { id: 'settings', label: 'Settings', content: 'Notifications, access tokens and the danger zone live here. Nothing has changed in 30 days.' },
]

const N = 72

/**
 * Plucked String Tabs — tabs hang from a taut string. Choosing a tab plucks
 * the string at that point; the vibration travels along it as a real damped
 * wave, every tab bobs with the string above it, and a glowing bead slides
 * to mark the active tab. Sweep the pointer across the string to strum it.
 */
export function PluckedStringTabs({
  items = DEFAULT_STRING_TABS,
  value: valueProp,
  defaultValue,
  onValueChange,
  strum = true,
  className,
}: PluckedStringTabsProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultValue ?? items[0]?.id)
  const value = valueProp ?? inner
  const activeIndex = Math.max(0, items.findIndex((t) => t.id === value))
  const [dir, setDir] = React.useState(1)
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const pathRef = React.useRef<SVGPathElement>(null)
  const glowRef = React.useRef<SVGPathElement>(null)
  const beadRef = React.useRef<HTMLSpanElement>(null)
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const hangRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  const sim = React.useRef({ y: new Float32Array(N), v: new Float32Array(N), bead: -1, beadV: 0, W: 600, lastPx: -1, lastPy: -1 })
  const wake = React.useRef<() => void>(() => {})
  const centers = React.useRef<number[]>([])
  const id = React.useId()

  const measure = React.useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const wr = wrap.getBoundingClientRect()
    sim.current.W = wr.width
    centers.current = tabRefs.current.map((el) => {
      if (!el) return 0
      const r = el.getBoundingClientRect()
      return r.left - wr.left + r.width / 2
    })
    if (sim.current.bead < 0) sim.current.bead = centers.current[activeIndex] ?? 0
  }, [activeIndex])

  const pluck = (x: number, amt: number) => {
    const s = sim.current
    const i0 = (x / s.W) * (N - 1)
    for (let i = 1; i < N - 1; i++) {
      // triangular pluck shape
      const d = Math.abs(i - i0) / (N * 0.28)
      s.y[i] += amt * Math.max(0, 1 - d)
    }
    wake.current()
  }

  React.useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapRef.current) ro.observe(wrapRef.current)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [measure])

  React.useEffect(() => {
    const s = sim.current
    const draw = () => {
      const W = s.W
      let d = `M 0 ${14 + s.y[0]}`
      for (let i = 1; i < N; i++) d += ` L ${((i / (N - 1)) * W).toFixed(1)} ${(14 + s.y[i]).toFixed(2)}`
      pathRef.current?.setAttribute('d', d)
      glowRef.current?.setAttribute('d', d)
      const sample = (x: number) => {
        const f = Math.max(0, Math.min(N - 1, (x / W) * (N - 1)))
        const i = Math.floor(f)
        const t = f - i
        return s.y[i] * (1 - t) + (s.y[Math.min(N - 1, i + 1)] ?? 0) * t
      }
      centers.current.forEach((cx, k) => {
        const el = hangRefs.current[k]
        if (!el) return
        const dy = sample(cx)
        const slope = sample(cx + 6) - sample(cx - 6)
        el.style.transform = `translateY(${dy.toFixed(2)}px) rotate(${(slope * 1.4).toFixed(2)}deg)`
      })
      if (beadRef.current) beadRef.current.style.transform = `translate(${(s.bead - 7).toFixed(1)}px, ${(7 + sample(s.bead)).toFixed(2)}px)`
    }
    if (reduced) {
      s.y.fill(0)
      s.v.fill(0)
      s.bead = centers.current[activeIndex] ?? s.bead
      draw()
      wake.current = draw
      return
    }
    let raf = 0
    let last = 0
    const loop = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60)
      last = now
      const sub = 6
      const h = dt / sub
      const c2 = 5200 // wave speed² in index units
      let energy = 0
      for (let k = 0; k < sub; k++) {
        for (let i = 1; i < N - 1; i++) {
          const acc = c2 * (s.y[i - 1] + s.y[i + 1] - 2 * s.y[i]) * (N / 72) - 3.2 * s.v[i]
          s.v[i] += acc * h
        }
        for (let i = 1; i < N - 1; i++) s.y[i] += s.v[i] * h
      }
      // bead spring toward active tab, dragging the string as it travels
      const target = centers.current[activeRef.current] ?? s.bead
      const f = 220 * (target - s.bead) - 22 * s.beadV
      s.beadV += f * dt
      s.bead += s.beadV * dt
      if (Math.abs(s.beadV) > 30) {
        const bi = Math.round((s.bead / s.W) * (N - 1))
        if (bi > 0 && bi < N - 1) s.v[bi] += Math.min(60, Math.abs(s.beadV) * 0.05)
      }
      for (let i = 0; i < N; i++) energy += Math.abs(s.y[i]) + Math.abs(s.v[i]) * 0.02
      energy += Math.abs(target - s.bead) + Math.abs(s.beadV) * 0.1
      draw()
      if (energy < 0.6) {
        s.y.fill(0)
        s.v.fill(0)
        s.bead = target
        s.beadV = 0
        draw()
        raf = 0
        return
      }
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (raf || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    wake.current = start
    draw()
    start()
    return () => {
      cancelAnimationFrame(raf)
      wake.current = () => {}
    }
  }, [reduced])

  const activeRef = React.useRef(activeIndex)
  activeRef.current = activeIndex
  React.useEffect(() => {
    if (reduced) {
      sim.current.bead = centers.current[activeIndex] ?? sim.current.bead
    }
    wake.current()
  }, [activeIndex, reduced])

  const select = (i: number, pluckIt = true) => {
    const t = items[i]
    if (!t) return
    setDir(i >= activeIndex ? 1 : -1)
    if (valueProp === undefined) setInner(t.id)
    onValueChange?.(t.id)
    if (pluckIt && !reduced) pluck(centers.current[i] ?? 0, 15)
  }

  const onKey = (e: React.KeyboardEvent) => {
    let i = activeIndex
    if (e.key === 'ArrowRight') i = (activeIndex + 1) % items.length
    else if (e.key === 'ArrowLeft') i = (activeIndex - 1 + items.length) % items.length
    else if (e.key === 'Home') i = 0
    else if (e.key === 'End') i = items.length - 1
    else return
    e.preventDefault()
    select(i)
    tabRefs.current[i]?.focus()
  }

  const onStrum = (e: React.PointerEvent) => {
    if (!strum || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const s = sim.current
    if (s.lastPy >= 0) {
      // crossed the string line (y≈14) between two samples?
      if ((s.lastPy - 14) * (y - 14) < 0) pluck(x, Math.max(-7, Math.min(7, (y - s.lastPy) * 0.6)))
    }
    s.lastPx = x
    s.lastPy = y
  }

  const active = items[activeIndex]
  return (
    <div className={cn('w-full max-w-2xl', className)}>
      <div className="-mx-2 overflow-x-auto px-2 pt-1 [scrollbar-width:none]">
      <div
        ref={wrapRef}
        className="relative min-w-max pb-2 pt-0"
        onPointerMove={onStrum}
        onPointerLeave={() => (sim.current.lastPy = -1)}
      >
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[40px] w-full overflow-visible">
          <path ref={glowRef} fill="none" strokeWidth={6} className="stroke-amber-400/25 blur-[3px] dark:stroke-amber-300/25" />
          <path ref={pathRef} fill="none" strokeWidth={1.4} strokeLinecap="round" className="stroke-zinc-500 dark:stroke-zinc-400" />
        </svg>
        <span aria-hidden className="absolute left-0 top-[9px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-zinc-400 ring-2 ring-white dark:bg-zinc-600 dark:ring-zinc-950" />
        <span aria-hidden className="absolute right-0 top-[9px] h-2.5 w-2.5 translate-x-1/2 rounded-full bg-zinc-400 ring-2 ring-white dark:bg-zinc-600 dark:ring-zinc-950" />
        <span
          ref={beadRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 h-3.5 w-3.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff7d6,#f59e0b_55%,#b45309)] shadow-[0_0_14px_3px_rgb(245_158_11/0.55)]"
        />
        <div role="tablist" aria-label="Sections" onKeyDown={onKey} className="relative flex justify-between gap-1 px-1 pt-[14px] sm:justify-around sm:px-0">
          {items.map((t, i) => {
            const on = i === activeIndex
            return (
              <span
                key={t.id}
                ref={(el) => {
                  hangRefs.current[i] = el
                }}
                className="flex origin-top flex-col items-center will-change-transform"
              >
                <span aria-hidden className={cn('h-4 w-px transition-colors', on ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700')} />
                <button
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={`${id}-tab-${t.id}`}
                  aria-selected={on}
                  aria-controls={`${id}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onPointerEnter={() => !reduced && pluck(centers.current[i] ?? 0, 3.5)}
                  className={cn(
                    'relative whitespace-nowrap rounded-[10px] px-2.5 py-2 text-[12px] font-medium sm:px-3.5 sm:text-[13px] outline-none transition-[color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-amber-500',
                    on
                      ? 'bg-white text-zinc-900 shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_18px_-8px_rgb(245_158_11/0.55)] ring-1 ring-amber-500/40 dark:bg-zinc-900 dark:text-white dark:ring-amber-400/40'
                      : 'bg-white/60 text-zinc-500 ring-1 ring-black/[0.06] hover:text-zinc-800 dark:bg-white/[0.03] dark:text-zinc-400 dark:ring-white/[0.07] dark:hover:text-zinc-100',
                  )}
                >
                  <span aria-hidden className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900" />
                  {t.label}
                </button>
              </span>
            )
          })}
        </div>
      </div>
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active?.id}`}
        tabIndex={0}
        className="relative mt-5 min-h-[92px] overflow-hidden rounded-2xl bg-white p-5 text-sm leading-relaxed text-zinc-600 outline-none ring-1 ring-black/[0.06] focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-zinc-900/60 dark:text-zinc-300 dark:ring-white/[0.07]"
      >
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={active?.id}
            custom={dir}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir * 28, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -28, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="mb-1 font-medium text-zinc-900 dark:text-zinc-50">{active?.label}</div>
            {active?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
