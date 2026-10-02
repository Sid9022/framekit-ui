import * as React from 'react'
import { animate, motion, useMotionValue } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type PolarSeries = { id: string; label: string; values: number[]; unit?: string }

export type PolarBloomChartProps = {
  series?: PolarSeries[]
  labels?: string[]
  title?: string
  /** Starting hue of the petal gradient. */
  hue?: number
  size?: number
  /** Async loader; when given, the chart shows a loading bud and a retry on failure. */
  load?: () => Promise<PolarSeries[]>
  onPetalSelect?: (label: string, value: number) => void
  className?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DEFAULT_POLAR_SERIES: PolarSeries[] = [
  { id: 'visitors', label: 'Visitors', unit: 'k', values: [42, 38, 55, 61, 74, 88, 96, 91, 70, 64, 52, 47] },
  { id: 'signups', label: 'Sign-ups', unit: 'k', values: [12, 14, 19, 26, 22, 31, 44, 40, 28, 35, 30, 24] },
  { id: 'revenue', label: 'Revenue', unit: 'k$', values: [30, 34, 33, 45, 52, 49, 60, 72, 81, 77, 90, 98] },
]

function petalPath(cx: number, cy: number, r0: number, r: number, a0: number, a1: number) {
  const p = (rad: number, a: number) => [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]
  const [x0, y0] = p(r0, a0)
  const [x1, y1] = p(r, a0)
  const [x2, y2] = p(r, a1)
  const [x3, y3] = p(r0, a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  // soft petal: arc outer edge with a slight bulge
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} L${x1.toFixed(2)} ${y1.toFixed(2)} A${r.toFixed(2)} ${r.toFixed(2)} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L${x3.toFixed(2)} ${y3.toFixed(2)} A${r0} ${r0} 0 ${large} 0 ${x0.toFixed(2)} ${y0.toFixed(2)}Z`
}

function Petal({ uid, i, n, value, max, size, hue, active, dim, reduced, bloom, onEnter, onLeave, onSelect, label, unit }: {
  uid: string; i: number; n: number; value: number; max: number; size: number; hue: number; active: boolean; dim: boolean; reduced: boolean; bloom: boolean
  onEnter: () => void; onLeave: () => void; onSelect: () => void; label: string; unit: string
}) {
  const c = size / 2
  const inner = size * 0.1
  const outer = size * 0.44
  const target = bloom ? inner + (outer - inner) * (value / max) : inner + 1
  const r = useMotionValue(inner + 1)
  const [d, setD] = React.useState('')
  const gap = 0.035
  const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + gap
  const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - gap
  const mid = (a0 + a1) / 2
  React.useEffect(() => {
    const upd = (v: number) => setD(petalPath(c, c, inner, v, a0, a1))
    upd(r.get())
    const unsub = r.on('change', upd)
    const ctrl = reduced ? (r.set(target), undefined) : animate(r, target, { type: 'spring', stiffness: 120, damping: 14, mass: 0.8, delay: bloom ? i * 0.045 : 0 })
    return () => {
      unsub()
      ctrl?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduced, size])
  const h = hue + (i / n) * 140
  const gid = `pb-${uid}-${i}`
  return (
    <>
    <defs>
      <radialGradient id={gid} gradientUnits="userSpaceOnUse" cx={c} cy={c} r={outer}>
        <stop offset="0.2" stopColor={`hsl(${h} 70% 42%)`} />
        <stop offset="1" stopColor={`hsl(${h} 90% 70%)`} />
      </radialGradient>
    </defs>
    <motion.path
      d={d}
      role="listitem"
      tabIndex={-1}
      aria-label={`${label}: ${value}${unit}`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onClick={onSelect}
      fill={`url(#${gid})`}
      stroke="currentColor"
      strokeOpacity={0.12}
      className="cursor-pointer outline-none text-white dark:text-black"
      animate={{
        x: active ? Math.cos(mid) * 8 : 0,
        y: active ? Math.sin(mid) * 8 : 0,
        opacity: dim ? 0.28 : 1,
        filter: active ? `drop-shadow(0 6px 14px hsl(${h} 80% 55% / 0.55))` : 'drop-shadow(0 0 0 rgba(0,0,0,0))',
      }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    />
    </>
  )
}

/**
 * Polar Bloom Chart — a Nightingale rose that blooms. Petals unfurl from the
 * bud one after another, re-grow with springs when you switch datasets,
 * and the hovered (or arrow-key focused) petal lifts out of the flower with
 * a coloured glow while the centre counts up its value.
 */
export function PolarBloomChart({
  series: seriesProp = DEFAULT_POLAR_SERIES,
  labels = MONTHS,
  title = 'Seasonality',
  hue = 190,
  size = 300,
  load,
  onPetalSelect,
  className,
}: PolarBloomChartProps) {
  const reduced = usePrefersReducedMotion()
  const [series, setSeries] = React.useState<PolarSeries[]>(load ? [] : seriesProp)
  const [loadState, setLoadState] = React.useState<'idle' | 'loading' | 'error'>(load ? 'loading' : 'idle')
  const [si, setSi] = React.useState(0)
  const [active, setActive] = React.useState<number | null>(null)
  const [bloom, setBloom] = React.useState(false)
  const [announce, setAnnounce] = React.useState('')
  const rootRef = React.useRef<HTMLDivElement>(null)
  const id = React.useId()

  const doLoad = React.useCallback(async () => {
    if (!load) return
    setLoadState('loading')
    setBloom(false)
    try {
      const s = await load()
      setSeries(s)
      setLoadState('idle')
    } catch {
      setLoadState('error')
    }
  }, [load])
  React.useEffect(() => {
    if (load) void doLoad()
  }, [load, doLoad])
  React.useEffect(() => {
    if (!load) setSeries(seriesProp)
  }, [seriesProp, load])

  // bloom when scrolled into view
  React.useEffect(() => {
    const el = rootRef.current
    if (!el || loadState !== 'idle') return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setBloom(true), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [loadState])

  const cur = series[si] ?? series[0]
  const values = cur?.values ?? []
  const max = Math.max(1, ...series.flatMap((s) => s.values))
  const total = values.reduce((a, b) => a + b, 0)
  const shownValue = active != null ? values[active] ?? 0 : total

  const count = useMotionValue(0)
  const [num, setNum] = React.useState(0)
  React.useEffect(() => count.on('change', (v) => setNum(Math.round(v))), [count])
  React.useEffect(() => {
    if (reduced || !bloom) {
      count.set(bloom ? shownValue : 0)
      return
    }
    const c = animate(count, shownValue, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [shownValue, reduced, bloom, count])

  const replay = () => {
    setBloom(false)
    setActive(null)
    window.setTimeout(() => setBloom(true), reduced ? 0 : 450)
  }

  const onKey = (e: React.KeyboardEvent) => {
    const n = values.length
    if (!n) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const i = active == null ? 0 : (active + 1) % n
      setActive(i)
      setAnnounce(`${labels[i]}: ${values[i]}${cur?.unit ?? ''}`)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const i = active == null ? n - 1 : (active - 1 + n) % n
      setActive(i)
      setAnnounce(`${labels[i]}: ${values[i]}${cur?.unit ?? ''}`)
    } else if (e.key === 'Escape') setActive(null)
    else if ((e.key === 'Enter' || e.key === ' ') && active != null) {
      e.preventDefault()
      onPetalSelect?.(labels[active], values[active])
    }
  }

  const c = size / 2
  return (
    <div
      ref={rootRef}
      className={cn(
        'flex w-full max-w-[420px] flex-col items-center gap-4 rounded-[28px] p-6',
        'bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_50px_-30px_rgb(24_24_27/0.35)]',
        'dark:bg-zinc-950 dark:ring-white/[0.08] dark:shadow-none',
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Last 12 months</div>
        </div>
        <button type="button" onClick={replay} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 outline-none ring-1 ring-black/10 transition hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-sky-500 dark:ring-white/10 dark:hover:text-zinc-200">
          Replay bloom
        </button>
      </div>

      <div
        className="relative outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-sky-500"
        style={{ width: size, height: size, maxWidth: '100%' }}
        tabIndex={0}
        role="group"
        aria-label={`${title}: ${cur?.label ?? ''} by month. Use arrow keys to inspect petals.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full overflow-visible">
          {/* rings */}
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <circle key={k} cx={c} cy={c} r={size * 0.1 + (size * 0.34) * k} fill="none" className="stroke-black/[0.06] dark:stroke-white/[0.07]" strokeDasharray={k === 1 ? undefined : '2 4'} />
          ))}
          {labels.map((l, i) => {
            const a = ((i + 0.5) / labels.length) * Math.PI * 2 - Math.PI / 2
            const rr = size * 0.49
            return (
              <text
                key={l}
                x={c + Math.cos(a) * rr}
                y={c + Math.sin(a) * rr}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn('select-none fill-zinc-400 text-[9px] font-medium uppercase tracking-wider transition-colors dark:fill-zinc-500', active === i && 'fill-zinc-900 dark:fill-white')}
              >
                {l}
              </text>
            )
          })}
          {loadState === 'idle' &&
            values.map((v, i) => (
              <Petal
                key={i}
                uid={id.replace(/[^a-zA-Z0-9]/g, '')}
                i={i}
                n={values.length}
                value={v}
                max={max}
                size={size}
                hue={hue}
                active={active === i}
                dim={active != null && active !== i}
                reduced={reduced}
                bloom={bloom}
                label={labels[i] ?? String(i)}
                unit={cur?.unit ?? ''}
                onEnter={() => setActive(i)}
                onLeave={() => setActive(null)}
                onSelect={() => onPetalSelect?.(labels[i], v)}
              />
            ))}
          {/* bud */}
          <circle cx={c} cy={c} r={size * 0.1 - 2} className="fill-white stroke-black/[0.06] dark:fill-zinc-950 dark:stroke-white/10" />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {loadState === 'loading' ? (
            <motion.span
              className="h-6 w-6 rounded-full border-2 border-sky-400/30 border-t-sky-500"
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
          ) : loadState === 'error' ? null : (
            <>
              <span className="text-[17px] font-semibold tabular-nums leading-none text-zinc-900 dark:text-white">
                {num}
                <span className="text-[10px] font-medium text-zinc-400">{cur?.unit}</span>
              </span>
              <span className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-zinc-400">{active != null ? labels[active] : 'Total'}</span>
            </>
          )}
        </div>
        {loadState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-xs text-rose-600 dark:text-rose-400">Couldn’t load the data.</p>
            <button type="button" onClick={doLoad} className="rounded-full bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-white dark:text-zinc-900">
              Retry
            </button>
          </div>
        )}
      </div>

      {series.length > 1 && (
        <div role="radiogroup" aria-label="Dataset" className="flex gap-1 rounded-full bg-zinc-100 p-1 dark:bg-white/[0.05]">
          {series.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={si === i}
              onClick={() => {
                setSi(i)
                setAnnounce(`${s.label} selected`)
              }}
              className={cn('relative rounded-full px-3 py-1.5 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-sky-500', si === i ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200')}
            >
              {si === i && <motion.span layoutId={id + 'ds'} className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/10" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{loadState === 'error' ? 'Data failed to load. Retry available.' : announce}</p>
    </div>
  )
}
