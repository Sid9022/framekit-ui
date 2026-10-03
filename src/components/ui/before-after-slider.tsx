import * as React from 'react'
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import { ChevronsLeftRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BeforeAfterSliderProps = {
  /** Custom “before” layer (image, node…). Defaults to a rough wireframe screen. */
  before?: React.ReactNode
  /** Custom “after” layer. Defaults to the polished screen. */
  after?: React.ReactNode
  beforeLabel?: string
  afterLabel?: string
  /** Uncontrolled start position, 0–100. */
  defaultValue?: number
  value?: number
  onValueChange?: (v: number) => void
  /** Sweep the handle once when scrolled into view. */
  intro?: boolean
  /** CSS aspect-ratio of the stage. */
  aspect?: string
  'aria-label'?: string
  className?: string
}

function MockScreen({ polished }: { polished: boolean }) {
  return polished ? (
    <div className="absolute inset-0 overflow-hidden bg-[#f6f3ff] p-[5%] text-[#1e1b4b]" aria-hidden>
      <div className="flex items-center justify-between text-[10px] font-semibold sm:text-xs"><span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[linear-gradient(135deg,#7c3aed,#fb923c)]" />Lumen</span><span className="flex gap-3 opacity-70"><span>Results</span><span>Care team</span><span>Plan</span></span></div>
      <div className="mt-[5%] grid grid-cols-5 gap-[3%]">
        <div className="col-span-3">
          <p className="font-display text-[clamp(18px,4.4vw,38px)] leading-[1.02]">Your results,<br />in plain words.</p>
          <p className="mt-2 max-w-[28ch] text-[9px] leading-snug opacity-70 sm:text-xs">Everything looks steady. One thing to do this week.</p>
          <span className="mt-3 inline-block rounded-full bg-[#1e1b4b] px-3 py-1 text-[9px] font-medium text-white sm:text-xs">Book follow-up</span>
        </div>
        <div className="col-span-2 space-y-[6%]">
          {[['Cholesterol', 'On track', '#34d399'], ['Vitamin D', 'A little low', '#fb923c'], ['A1C', 'On track', '#34d399']].map(([a, b, c]) => (
            <div key={a} className="rounded-xl bg-white p-[6%] shadow-[0_6px_18px_-8px_rgb(76_29_149/0.35)]"><p className="text-[9px] font-semibold sm:text-xs">{a}</p><p className="mt-0.5 flex items-center gap-1 text-[8px] opacity-70 sm:text-[11px]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{b}</p></div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="absolute inset-0 overflow-hidden bg-[#e5e5e5] p-[4%] font-[Times_New_Roman,serif] text-[#222] grayscale" aria-hidden>
      <div className="flex gap-2 border-b border-[#999] pb-1 text-[9px] sm:text-xs"><b>HOME</b> | LABS | MESSAGES | BILLING | SETTINGS | HELP | LOGOUT</div>
      <p className="mt-2 text-[10px] font-bold underline sm:text-sm">Lab Results — Panel 4 of 12</p>
      <div className="mt-1 grid grid-cols-4 gap-px border border-[#888] bg-[#888] text-[7px] sm:text-[10px]">
        {['TEST', 'VALUE', 'REF', 'FLAG', 'CHOL-T', '212', '<200', 'H', 'LDL-C', '131', '<100', 'H', 'HDL-C', '48', '>40', '-', '25-OH D', '24', '30-100', 'L', 'HBA1C', '5.4', '<5.7', '-', 'TRIG', '161', '<150', 'H'].map((c, i) => <span key={i} className="bg-[#f5f5f5] px-1 py-0.5">{c}</span>)}
      </div>
      <p className="mt-2 text-[8px] text-[#a00] sm:text-[11px]">* Values outside range are flagged. Consult physician.</p>
      <div className="mt-1 flex gap-1"><span className="border border-[#666] bg-[#ccc] px-2 text-[8px] sm:text-[11px]">Print</span><span className="border border-[#666] bg-[#ccc] px-2 text-[8px] sm:text-[11px]">Download PDF</span></div>
    </div>
  )
}

/**
 * Before / After Slider — drag, tap-to-jump or use the arrow keys (Shift = ±10, Home/End = edges) to wipe between two
 * states. The knob stretches while held, the reveal edge carries a soft glow, and the handle sweeps once on first view.
 */
export function BeforeAfterSlider({ before, after, beforeLabel = 'Before', afterLabel = 'After', defaultValue = 50, value, onValueChange, intro = true, aspect = '16 / 10', 'aria-label': label = 'Before and after comparison', className }: BeforeAfterSliderProps) {
  const reduced = usePrefersReducedMotion()
  const box = React.useRef<HTMLDivElement>(null)
  const p = useMotionValue(value ?? defaultValue)
  const [now, setNow] = React.useState(Math.round(value ?? defaultValue))
  const [drag, setDrag] = React.useState(false)
  const inView = useInView(box, { once: true, amount: 0.6 })
  const clip = useTransform(p, (v) => `inset(0 ${100 - v}% 0 0)`)
  const left = useTransform(p, (v) => `${v}%`)
  useMotionValueEvent(p, 'change', (v) => { const r = Math.round(v); setNow((o) => (o === r ? o : r)) })
  const ctl = React.useRef<ReturnType<typeof animate> | null>(null)
  const tgt = React.useRef(value ?? defaultValue)
  const emit = React.useRef(onValueChange)
  emit.current = onValueChange
  const go = React.useCallback((v: number, spring = true) => {
    ctl.current?.stop()
    const t = Math.max(0, Math.min(100, v))
    tgt.current = t
    if (spring && !reduced) ctl.current = animate(p, t, { type: 'spring', stiffness: 220, damping: 26 })
    else p.set(t)
    emit.current?.(Math.round(t))
  }, [p, reduced])

  React.useEffect(() => { if (value !== undefined) go(value) }, [value, go])
  React.useEffect(() => {
    if (!intro || reduced || !inView || value !== undefined) return
    const c = animate(p, [defaultValue, 18, 84, defaultValue], { duration: 2.2, ease: [0.65, 0, 0.35, 1], times: [0, 0.35, 0.75, 1] })
    return () => c.stop()
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps

  const fromEvent = (e: React.PointerEvent) => {
    const b = box.current?.getBoundingClientRect()
    if (b) go(((e.clientX - b.left) / b.width) * 100, false)
  }
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2
    const cur = tgt.current
    const map: Record<string, number> = { ArrowLeft: cur - step, ArrowDown: cur - step, ArrowRight: cur + step, ArrowUp: cur + step, Home: 0, End: 100, PageDown: cur - 10, PageUp: cur + 10 }
    if (e.key in map) { e.preventDefault(); go(map[e.key]) }
  }

  return (
    <div
      ref={box}
      style={{ aspectRatio: aspect, touchAction: 'pan-y' }}
      className={cn('relative w-full max-w-2xl cursor-ew-resize select-none overflow-hidden rounded-2xl shadow-[0_2px_4px_rgb(0_0_0/0.08),0_24px_48px_-16px_rgb(0_0_0/0.3)] ring-1 ring-black/10 dark:ring-white/15', className)}
      onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setDrag(true); ctl.current?.stop(); go(((e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.getBoundingClientRect().width) * 100) }}
      onPointerMove={(e) => { if (drag) fromEvent(e) }}
      onPointerUp={() => setDrag(false)}
      onPointerCancel={() => setDrag(false)}
    >
      <div className="absolute inset-0">{after ?? <MockScreen polished />}</div>
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>{before ?? <MockScreen polished={false} />}</motion.div>
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-zinc-900 backdrop-blur">{afterLabel}</span>
      <motion.div className="pointer-events-none absolute inset-y-0 w-0" style={{ left }}>
        <span className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_14px_3px_rgb(255_255_255/0.55),0_0_0_1px_rgb(0_0_0/0.15)]" />
      </motion.div>
      <motion.div className="absolute top-1/2 h-0 w-0" style={{ left }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={now}
          aria-valuetext={`${now}% ${beforeLabel.toLowerCase()}, ${100 - now}% ${afterLabel.toLowerCase()}`}
          onKeyDown={onKey}
          className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-zinc-900 shadow-[0_6px_20px_rgb(0_0_0/0.35)] outline-offset-4 transition-[width,height] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: drag ? 56 : 48, height: drag ? 56 : 48, touchAction: 'none' }}
        >
          <ChevronsLeftRight className="h-5 w-5" aria-hidden />
        </div>
      </motion.div>
    </div>
  )
}
