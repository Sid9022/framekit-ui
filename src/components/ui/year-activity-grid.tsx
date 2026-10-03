import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useInViewOnce } from '@/lib/portfolio-art'

export type ActivityDay = { date: string; count: number }
export type ActivityTone = 'signal' | 'mint' | 'ember' | 'ink'

export type YearActivityGridProps = {
  /** One entry per day (ISO yyyy-mm-dd). Omit to render a deterministic generated year. */
  data?: ActivityDay[]
  /** Last day shown (defaults to today). */
  endDate?: string | Date
  /** Number of week columns (12–53). */
  weeks?: number
  /** Seed for the generated demo data. */
  seed?: number
  tone?: ActivityTone
  title?: string
  /** Noun used in the summary, e.g. "commits". */
  unit?: string
  onSelect?: (day: ActivityDay) => void
  className?: string
}

const RAMP: Record<ActivityTone, string[]> = {
  signal: ['bg-zinc-200 dark:bg-zinc-800', 'bg-signal-200 dark:bg-signal-900', 'bg-signal-400 dark:bg-signal-700', 'bg-signal-600 dark:bg-signal-400', 'bg-signal-800 dark:bg-signal-200'],
  mint: ['bg-zinc-200 dark:bg-zinc-800', 'bg-emerald-200 dark:bg-emerald-950', 'bg-emerald-400 dark:bg-emerald-800', 'bg-emerald-600 dark:bg-emerald-500', 'bg-emerald-800 dark:bg-emerald-300'],
  ember: ['bg-zinc-200 dark:bg-zinc-800', 'bg-orange-200 dark:bg-orange-950', 'bg-orange-400 dark:bg-orange-800', 'bg-orange-600 dark:bg-orange-500', 'bg-orange-800 dark:bg-orange-300'],
  ink: ['bg-zinc-200 dark:bg-zinc-800', 'bg-zinc-300 dark:bg-zinc-700', 'bg-zinc-500 dark:bg-zinc-500', 'bg-zinc-700 dark:bg-zinc-300', 'bg-zinc-950 dark:bg-zinc-50'],
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const CELL = 12
const GAP = 3

function rng(seed: number) {
  let a = (seed * 2654435761) >>> 0 || 1
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const iso = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
const parse = (s: string) => new Date(s + 'T00:00:00Z')

function generate(start: Date, total: number, seed: number): ActivityDay[] {
  const r = rng(seed)
  const out: ActivityDay[] = []
  let burst = 0
  for (let i = 0; i < total; i++) {
    const d = new Date(start.getTime() + i * 86400000)
    const dow = d.getUTCDay()
    const season = 0.55 + 0.45 * Math.sin(i / 23 + seed)
    if (burst <= 0 && r() < 0.035) burst = 3 + Math.floor(r() * 6)
    let c = 0
    const base = dow === 0 || dow === 6 ? 0.28 : 0.7
    if (r() < base * season + (burst > 0 ? 0.35 : 0)) c = Math.round(1 + r() * r() * 9 * (burst > 0 ? 2.2 : 1))
    if (i >= total - 6) c = Math.max(c, 1 + Math.floor(r() * 4))
    burst--
    out.push({ date: iso(d), count: c })
  }
  return out
}

type Cell = { day: ActivityDay; level: number; w: number; d: number } | null

const Square = React.memo(function Square({ cell, tone, seen, reduced, tabbable, dim, onEnter, onFocus, onClick, setRef }: {
  cell: NonNullable<Cell>; tone: ActivityTone; seen: boolean; reduced: boolean; tabbable: boolean; dim: boolean
  onEnter: (c: NonNullable<Cell>) => void; onFocus: (c: NonNullable<Cell>) => void; onClick: (c: NonNullable<Cell>) => void
  setRef: (el: HTMLButtonElement | null, w: number, d: number) => void
}) {
  const { day, level, w, d } = cell
  const dt = parse(day.date)
  return (
    <button
      ref={(el) => setRef(el, w, d)}
      type="button"
      role="gridcell"
      tabIndex={tabbable ? 0 : -1}
      aria-label={`${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${DAYS[dt.getUTCDay()]} ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`}
      onPointerEnter={() => onEnter(cell)}
      onFocus={() => onFocus(cell)}
      onClick={() => onClick(cell)}
      style={{ width: CELL, height: CELL, transitionDelay: reduced || seen === false ? '0ms' : `${w * 9 + d * 14}ms` }}
      className={cn(
        'relative block shrink-0 rounded-[3px] outline-none transition-[transform,opacity,box-shadow] duration-500 ease-out focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
        RAMP[tone][level],
        seen || reduced ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
        dim ? 'opacity-100 ring-1 ring-inset ring-zinc-950/10 dark:ring-white/15' : '',
      )}
    />
  )
})

/**
 * Year Activity Grid — a contribution calendar with a diagonal bloom-in, a crosshair that lights the hovered
 * weekday row and week column, a floating readout, streak stats and full arrow-key navigation (roving grid).
 */
export function YearActivityGrid({ data, endDate, weeks = 53, seed = 7, tone = 'signal', title = 'Shipping rhythm', unit = 'contributions', onSelect, className }: YearActivityGridProps) {
  const reduced = usePrefersReducedMotion()
  const [rootRef, seen] = useInViewOnce<HTMLDivElement>()
  const W = Math.max(12, Math.min(53, weeks))

  const model = React.useMemo(() => {
    const end = endDate ? (typeof endDate === 'string' ? parse(endDate.slice(0, 10)) : new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()))) : (() => { const n = new Date(); return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())) })()
    const lastWeekStart = new Date(end.getTime() - end.getUTCDay() * 86400000)
    const start = new Date(lastWeekStart.getTime() - (W - 1) * 7 * 86400000)
    const total = Math.round((end.getTime() - start.getTime()) / 86400000) + 1
    const src = data ?? generate(start, total, seed)
    const map = new Map(src.map((x) => [x.date, x.count]))
    const max = Math.max(1, ...src.map((x) => x.count))
    const cols: Cell[][] = []
    const list: ActivityDay[] = []
    for (let w = 0; w < W; w++) {
      const col: Cell[] = []
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start.getTime() + (w * 7 + d) * 86400000)
        if (dt > end) { col.push(null); continue }
        const count = map.get(iso(dt)) ?? 0
        const level = count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((count / max) * 4)))
        const day = { date: iso(dt), count }
        col.push({ day, level, w, d })
        list.push(day)
      }
      cols.push(col)
    }
    const total$ = list.reduce((s, x) => s + x.count, 0)
    let best = list[0], run = 0, longest = 0
    for (const x of list) { if (x.count > best.count) best = x; run = x.count > 0 ? run + 1 : 0; longest = Math.max(longest, run) }
    let current = 0
    for (let i = list.length - 1; i >= 0; i--) { if (list[i].count > 0) current++; else if (i === list.length - 1) continue; else break }
    const labels: { w: number; text: string }[] = []
    let prev = -1
    cols.forEach((col, w) => { const first = col.find(Boolean); if (!first) return; const m = parse(first.day.date).getUTCMonth(); if (m !== prev && (labels.length === 0 || w - labels[labels.length - 1].w >= 3)) { labels.push({ w, text: MONTHS[m] }); prev = m } })
    return { cols, total: total$, best, longest, current, labels, first: list[0].date, last: list[list.length - 1].date }
  }, [data, endDate, W, seed])

  const lastCell = React.useMemo(() => { const c = model.cols[W - 1]; for (let d = 6; d >= 0; d--) if (c[d]) return c[d]!; return model.cols[W - 2].find(Boolean)! }, [model, W])
  const [roving, setRoving] = React.useState<{ w: number; d: number }>({ w: lastCell.w, d: lastCell.d })
  const [hover, setHover] = React.useState<NonNullable<Cell> | null>(null)
  const [announce, setAnnounce] = React.useState('')
  const refs = React.useRef(new Map<string, HTMLButtonElement>())
  const scroller = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => { const s = scroller.current; if (s) s.scrollLeft = s.scrollWidth }, [W])

  const setRef = React.useCallback((el: HTMLButtonElement | null, w: number, d: number) => { if (el) refs.current.set(`${w}:${d}`, el); else refs.current.delete(`${w}:${d}`) }, [])
  const label = (c: NonNullable<Cell>) => { const dt = parse(c.day.date); return `${c.day.count} ${unit} · ${DAYS[dt.getUTCDay()]} ${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]} ${dt.getUTCFullYear()}` }
  const onEnter = React.useCallback((c: NonNullable<Cell>) => setHover(c), [])
  const onFocus = React.useCallback((c: NonNullable<Cell>) => { setRoving({ w: c.w, d: c.d }); setHover(c); setAnnounce(label(c)) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const onClick = React.useCallback((c: NonNullable<Cell>) => { setRoving({ w: c.w, d: c.d }); setAnnounce(label(c)); onSelect?.(c.day) }, [onSelect]) // eslint-disable-line react-hooks/exhaustive-deps

  const onKeyDown = (e: React.KeyboardEvent) => {
    let { w, d } = roving
    if (e.key === 'ArrowRight') w++
    else if (e.key === 'ArrowLeft') w--
    else if (e.key === 'ArrowDown') d++
    else if (e.key === 'ArrowUp') d--
    else if (e.key === 'Home') w = 0
    else if (e.key === 'End') w = W - 1
    else return
    e.preventDefault()
    w = Math.max(0, Math.min(W - 1, w)); d = Math.max(0, Math.min(6, d))
    let tries = 0
    while (!model.cols[w][d] && tries++ < 7) d--
    if (model.cols[w][d]) refs.current.get(`${w}:${d}`)?.focus()
  }

  const active = hover
  const stat = 'flex flex-col gap-0.5'
  return (
    <div ref={rootRef} className={cn('w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-5 text-zinc-950 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_12px_40px_-24px_rgb(0_0_0/0.25)] sm:p-6 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50', className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">[ {title} ]</p>
          <p className="mt-1.5 font-display text-4xl leading-none tracking-tight sm:text-5xl"><span className="tabular-nums">{model.total.toLocaleString('en-US')}</span> <span className="text-2xl text-zinc-600 sm:text-3xl dark:text-zinc-400">{unit}</span></p>
        </div>
        <dl className="flex gap-6 text-sm">
          <div className={stat}><dt className="text-xs text-zinc-600 dark:text-zinc-400">Longest streak</dt><dd className="font-semibold tabular-nums">{model.longest} days</dd></div>
          <div className={stat}><dt className="text-xs text-zinc-600 dark:text-zinc-400">Current</dt><dd className="font-semibold tabular-nums">{model.current} days</dd></div>
          <div className={cn(stat, 'hidden sm:flex')}><dt className="text-xs text-zinc-600 dark:text-zinc-400">Best day</dt><dd className="font-semibold tabular-nums">{model.best.count}</dd></div>
        </dl>
      </div>

      <div ref={scroller} className="framekit-scroll mt-5 overflow-x-auto pb-2">
        <div className="relative w-max pr-1 pt-6" onPointerLeave={() => setHover(null)}>
          <div aria-hidden className="absolute left-7 top-0 h-5 text-[11px] text-zinc-600 dark:text-zinc-400">
            {model.labels.map((l) => <span key={l.w} className="absolute" style={{ left: l.w * (CELL + GAP) }}>{l.text}</span>)}
          </div>
          <div className="flex gap-2">
            <div aria-hidden className="flex w-5 flex-col text-[10px] text-zinc-600 dark:text-zinc-400" style={{ gap: GAP }}>
              {DAYS.map((d, i) => <span key={d} style={{ height: CELL, lineHeight: `${CELL}px` }} className={i % 2 === 1 ? '' : 'invisible'}>{d.slice(0, 1) + (i % 2 === 1 ? d.slice(1, 3).toLowerCase() : '')}</span>)}
            </div>
            <div role="grid" aria-label={`${title}: ${model.total} ${unit} from ${model.first} to ${model.last}. Use arrow keys to move between days.`} onKeyDown={onKeyDown} className="relative flex" style={{ gap: GAP }}>
              {model.cols.map((col, w) => (
                <div role="row" key={w} className="flex flex-col" style={{ gap: GAP }}>
                  {col.map((c, d) => c
                    ? <Square key={d} cell={c} tone={tone} seen={seen} reduced={reduced} tabbable={roving.w === w && roving.d === d} dim={!!active && (active.w === w || active.d === d)} onEnter={onEnter} onFocus={onFocus} onClick={onClick} setRef={setRef} />
                    : <span key={d} role="presentation" style={{ width: CELL, height: CELL }} />)}
                </div>
              ))}
              {active && (
                <div aria-hidden className="pointer-events-none absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-zinc-50 dark:text-zinc-950" style={{ left: active.w * (CELL + GAP) + CELL / 2, top: active.d * (CELL + GAP) - 36 }}>
                  {label(active)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="min-h-5 text-sm text-zinc-700 dark:text-zinc-300">{announce || 'Hover or focus a day for details.'}</p>
        <div aria-hidden className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
          Less
          {RAMP[tone].map((c, i) => <span key={i} className={cn('h-3 w-3 rounded-[3px]', c)} />)}
          More
        </div>
      </div>
    </div>
  )
}
