import * as React from 'react'
import { animate, useInView } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Shared helpers for Framekit Data Widgets: rolling numerals, delta chips, sr-only tables, live ticks. */

export function formatNumber(v: number, opts: { decimals?: number; prefix?: string; suffix?: string; locale?: string } = {}) {
  const { decimals = 0, prefix = '', suffix = '', locale = 'en-US' } = opts
  return `${prefix}${v.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`
}

export type RollNumberProps = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  locale?: string
  /** Seconds for the roll. */
  duration?: number
  className?: string
}

/** Counts from the previous value (0 on first view) to `value` with an ease-out; static under reduced motion. */
export function RollNumber({ value, decimals = 0, prefix, suffix, locale, duration = 1.1, className }: RollNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = usePrefersReducedMotion()
  const from = React.useRef(0)
  const fmt = React.useCallback((v: number) => formatNumber(v, { decimals, prefix, suffix, locale }), [decimals, prefix, suffix, locale])
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) { el.textContent = fmt(value); from.current = value; return }
    if (!inView) { el.textContent = fmt(from.current); return }
    const c = animate(from.current, value, {
      duration, ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { el.textContent = fmt(v) },
      onComplete: () => { from.current = value },
    })
    return () => { c.stop(); from.current = value }
  }, [value, inView, reduced, fmt, duration])
  return (
    <span className={cn('tabular-nums', className)}>
      <span ref={ref} aria-hidden="true">{fmt(0)}</span>
      <span className="sr-only">{fmt(value)}</span>
    </span>
  )
}

export function DeltaChip({ value, suffix = '%', className, tone = 'auto' }: { value: number; suffix?: string; className?: string; tone?: 'auto' | 'neon' }) {
  const up = value >= 0
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-[13px] font-medium tabular-nums', tone === 'neon' ? (up ? 'text-[#4dff9a]' : 'text-[#ff6b7d]') : up ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400', className)}>
      <span aria-hidden="true">{up ? '↑' : '↓'}</span>
      <span className="sr-only">{up ? 'up' : 'down'} </span>
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  )
}

/** Visually hidden data table so screen readers get the numbers behind a chart. */
export function SrDataTable({ caption, columns, rows }: { caption: string; columns: string[]; rows: (string | number)[][] }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead><tr>{columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>)}</tbody>
    </table>
  )
}

/** Calls `fn` every `ms` while visible and `enabled`; never under reduced motion. */
export function useLiveTick(ref: React.RefObject<Element | null>, fn: () => void, ms: number, enabled = true) {
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { margin: '0px' })
  const cb = React.useRef(fn)
  cb.current = fn
  React.useEffect(() => {
    if (!enabled || reduced || !inView || ms <= 0) return
    const id = window.setInterval(() => { if (!document.hidden) cb.current() }, ms)
    return () => window.clearInterval(id)
  }, [enabled, reduced, inView, ms])
}

/** Deterministic pseudo-random for stable demo data. */
export function seeded(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 ring-offset-white dark:ring-signal-300 dark:ring-offset-zinc-950'

/**
 * Roving “active data point” for a chart: arrow keys / Home / End move it, pointer x snaps to the nearest index.
 * Spread `bind` on the focusable chart element (role="group" or "img" + tabIndex=0).
 */
export function useChartCursor(count: number, opts: { initial?: number | null; keepOnLeave?: boolean } = {}) {
  const { initial = null, keepOnLeave = false } = opts
  const [active, setActive] = React.useState<number | null>(initial)
  const clamp = (i: number) => Math.max(0, Math.min(count - 1, i))
  const bind = {
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      const k = e.key
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'].includes(k)) return
      e.preventDefault()
      if (k === 'Escape') return setActive(keepOnLeave ? initial : null)
      setActive((a) => {
        const cur = a ?? (k === 'ArrowLeft' ? count : -1)
        if (k === 'Home') return 0
        if (k === 'End') return count - 1
        return clamp(cur + (k === 'ArrowRight' ? 1 : -1))
      })
    },
    onPointerMove: (e: React.PointerEvent<Element>) => {
      const r = (e.currentTarget as Element).getBoundingClientRect()
      const t = (e.clientX - r.left) / Math.max(1, r.width)
      setActive(clamp(Math.round(t * (count - 1))))
    },
    onPointerLeave: () => { if (!keepOnLeave) setActive(null); else setActive(initial) },
    onBlur: () => { if (!keepOnLeave) setActive(null) },
  }
  return { active, setActive, bind }
}

export type GlowStatShellProps = {
  title?: string
  value: number
  prefix?: string
  decimals?: number
  delta?: number
  subLabel?: string
  subValue?: string
  chart: React.ReactNode
  /** Which side the chart sits on (≥ sm). */
  chartSide?: 'left' | 'right'
  className?: string
}

/** The ink “Sales Report” shell shared by the glow-chart cards. Stays dark in both themes (ownBackground). */
export function GlowStatShell({ title = 'Sales Report', value, prefix = '$', decimals = 0, delta, subLabel = 'Avg. score', subValue, chart, chartSide = 'right', className }: GlowStatShellProps) {
  return (
    <div
      className={cn(
        'relative isolate flex w-full max-w-[460px] flex-col gap-4 overflow-hidden rounded-[22px] bg-[#050505] p-5 text-white [color-scheme:dark] sm:flex-row sm:items-center sm:gap-6 sm:p-6',
        'shadow-[0_1px_2px_rgb(0_0_0/0.3),0_24px_48px_-24px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.07)] ring-1 ring-white/[0.08]',
        chartSide === 'left' && 'sm:flex-row-reverse',
        className,
      )}
    >
      <div className="pointer-events-none absolute -inset-px -z-10 bg-[radial-gradient(120%_80%_at_100%_0%,rgb(77_255_154/0.07),transparent_60%)]" aria-hidden="true" />
      <div className="min-w-0 shrink-0">
        <p className="text-[15px] font-medium text-white/85">{title}</p>
        <p className="mt-1.5 flex items-baseline gap-2.5">
          <RollNumber value={value} prefix={prefix} decimals={decimals} className="font-mono text-[34px] font-medium leading-none tracking-[-0.04em]" />
          {delta !== undefined && <DeltaChip value={delta} tone="neon" />}
        </p>
        {subValue && <p className="mt-2 text-[13px] text-zinc-400">{subLabel} <span className="tabular-nums">{subValue}</span></p>}
      </div>
      <div className="min-w-0 flex-1">{chart}</div>
    </div>
  )
}
