import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type DateRange = { from: Date | null; to: Date | null }

export type DateRangePickerProps = {
  /** Controlled range. */
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange) => void
  /** Reference "today" (defaults to now). */
  today?: Date
  /** Disable dates after today. */
  disableFuture?: boolean
  /** Show preset chips. */
  presets?: boolean
  /** BCP 47 locale for labels. */
  locale?: string
  className?: string
}

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const add = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const same = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime()
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300'

/**
 * Date Range Picker — a calendar that previews the range as you hover, with a
 * continuous tinted band between endpoint pills, month pages that slide in
 * the direction you move, and preset chips that animate the selection into
 * place. Full grid keyboard support (arrows, Home/End, PageUp/PageDown,
 * Enter), locale-aware labels and a live summary of the chosen nights.
 */
export function DateRangePicker({ value, defaultValue, onValueChange, today: todayProp, disableFuture = true, presets = true, locale, className }: DateRangePickerProps) {
  const reduced = usePrefersReducedMotion()
  const today = React.useMemo(() => day(todayProp ?? new Date()), [todayProp])
  const [inner, setInner] = React.useState<DateRange>(defaultValue ?? { from: add(today, -9), to: add(today, -3) })
  const range = value ?? inner
  const [month, setMonth] = React.useState(() => new Date((range.to ?? today).getFullYear(), (range.to ?? today).getMonth(), 1))
  const [dir, setDir] = React.useState(0)
  const [hover, setHover] = React.useState<Date | null>(null)
  const [focusDate, setFocusDate] = React.useState<Date>(range.to ?? today)
  const gridRef = React.useRef<HTMLDivElement>(null)
  const kbd = React.useRef(false)

  const set = (r: DateRange) => { if (value === undefined) setInner(r); onValueChange?.(r) }
  const disabled = (d: Date) => disableFuture && d > today
  const pick = (d: Date) => {
    if (disabled(d)) return
    if (!range.from || range.to) set({ from: d, to: null })
    else if (d < range.from) set({ from: d, to: range.from })
    else set({ from: range.from, to: d })
  }
  const shiftMonth = (n: number) => { setDir(n); setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1)) }

  React.useEffect(() => {
    if (!kbd.current) return
    if (focusDate.getMonth() !== month.getMonth() || focusDate.getFullYear() !== month.getFullYear()) {
      const n = focusDate > month ? 1 : -1
      setDir(n); setMonth(new Date(focusDate.getFullYear(), focusDate.getMonth(), 1))
    }
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLElement>(`[data-date="${focusDate.getTime()}"]`)?.focus())
  }, [focusDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const fmtMonth = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
  const fmtDay = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const fmtShort = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' })
  const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(2024, 0, 7 + i)))
  const weekdaysLong = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(new Date(2024, 0, 7 + i)))

  const start = add(month, -month.getDay())
  const cells = Array.from({ length: 42 }, (_, i) => add(start, i))
  const weeks = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7))
  const focusInView = focusDate.getMonth() === month.getMonth() && focusDate.getFullYear() === month.getFullYear()
  const end = range.to ?? (range.from && hover && hover > range.from ? hover : null)
  const inRange = (d: Date) => !!range.from && !!end && d >= range.from && d <= end
  const nights = range.from && range.to ? Math.round((range.to.getTime() - range.from.getTime()) / 864e5) + 1 : 0

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    let n: Date | null = null
    if (e.key in map) n = add(focusDate, map[e.key])
    else if (e.key === 'Home') n = add(focusDate, -focusDate.getDay())
    else if (e.key === 'End') n = add(focusDate, 6 - focusDate.getDay())
    else if (e.key === 'PageUp') n = new Date(focusDate.getFullYear(), focusDate.getMonth() - 1, focusDate.getDate())
    else if (e.key === 'PageDown') n = new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, focusDate.getDate())
    if (n) { e.preventDefault(); kbd.current = true; setFocusDate(n); setHover(n) }
  }

  const PRESETS = [
    { label: 'Last 7 days', r: { from: add(today, -6), to: today } },
    { label: 'Last 14 days', r: { from: add(today, -13), to: today } },
    { label: 'Last 30 days', r: { from: add(today, -29), to: today } },
    { label: 'This month', r: { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today } },
  ]

  return (
    <div className={cn('w-full max-w-[22rem] rounded-[20px] bg-white p-4 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]', className)}>
      {presets && (
        <div role="group" aria-label="Presets" className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {PRESETS.map((p) => {
            const active = same(range.from, p.r.from) && same(range.to, p.r.to)
            return (
              <button key={p.label} type="button" aria-pressed={active} onClick={() => { set(p.r); setDir(0); setMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setFocusDate(today) }}
                className={cn('h-8 shrink-0 rounded-full px-3 text-[13px] font-medium transition-colors duration-150 pointer-coarse:h-11', active ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-700 ring-1 ring-black/[0.08] hover:text-zinc-950 hover:ring-black/[0.16] dark:text-zinc-300 dark:ring-white/[0.1] dark:hover:text-white', FOCUS)}>
                {p.label}
              </button>
            )
          })}
        </div>
      )}
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className={cn('grid size-9 place-items-center rounded-full text-zinc-700 transition-colors duration-150 hover:bg-zinc-900/[0.05] active:scale-[0.94] pointer-coarse:size-11 dark:text-zinc-300 dark:hover:bg-white/[0.08]', FOCUS)}><ChevronLeft aria-hidden className="size-4" /></button>
        <p aria-live="polite" className="text-sm font-semibold text-zinc-950 tabular-nums dark:text-white">{fmtMonth.format(month)}</p>
        <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className={cn('grid size-9 place-items-center rounded-full text-zinc-700 transition-colors duration-150 hover:bg-zinc-900/[0.05] active:scale-[0.94] pointer-coarse:size-11 dark:text-zinc-300 dark:hover:bg-white/[0.08]', FOCUS)}><ChevronRight aria-hidden className="size-4" /></button>
      </div>
      <div className="relative mt-2 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={month.getTime()}
            ref={gridRef}
            role="grid"
            aria-label={fmtMonth.format(month)}
            onKeyDown={onKey}
            onFocus={(e) => { const t = (e.target as HTMLElement).dataset.date; if (t && !same(new Date(Number(t)), focusDate)) setFocusDate(new Date(Number(t))) }}
            onMouseLeave={() => setHover(null)}
            custom={dir}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -48 }}
            transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 34 }}
          >
            <div role="row" className="grid grid-cols-7">
              {weekdays.map((w, i) => <div key={i} role="columnheader" aria-label={weekdaysLong[i]} className="grid h-8 place-items-center text-xs font-medium text-zinc-600 dark:text-zinc-400">{w}</div>)}
            </div>
            {weeks.map((wk, wi) => (
              <div key={wi} role="row" className="grid grid-cols-7">
                {wk.map((d) => {
                  const out = d.getMonth() !== month.getMonth()
                  const isFrom = same(d, range.from), isTo = same(d, end)
                  const mid = inRange(d)
                  const dis = disabled(d)
                  const edge = isFrom || isTo
                  const isToday = same(d, today)
                  return (
                    <div key={d.getTime()} role="gridcell" aria-selected={mid || edge} className="relative h-10 py-0.5">
                      {mid && !(isFrom && isTo) && !(isTo && !isFrom && d.getDay() === 0) && !(isFrom && !isTo && d.getDay() === 6) && (
                        <span aria-hidden className={cn('absolute inset-y-0.5 bg-signal-100 dark:bg-signal-300/[0.14]', isFrom ? 'left-1/2 right-0' : isTo ? 'left-0 right-1/2' : 'inset-x-0', d.getDay() === 0 && !isFrom && 'rounded-l-full', d.getDay() === 6 && !isTo && 'rounded-r-full')} />
                      )}
                      <button
                        type="button"
                        data-date={d.getTime()}
                        tabIndex={(focusInView ? same(d, focusDate) : same(d, month)) ? 0 : -1}
                        disabled={dis}
                        aria-label={`${fmtDay.format(d)}${isToday ? ', today' : ''}${isFrom ? ', range start' : ''}${isTo && range.to ? ', range end' : ''}`}
                        onClick={() => { kbd.current = false; setFocusDate(d); pick(d) }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(d) } }}
                        onMouseEnter={() => setHover(d)}
                        onFocus={() => setHover(d)}
                        className={cn(
                          'relative z-10 mx-auto grid size-9 place-items-center rounded-full text-sm tabular-nums transition-colors duration-150',
                          edge ? 'bg-signal-600 font-semibold text-white dark:bg-signal-300 dark:text-zinc-950' : mid ? 'text-signal-800 dark:text-signal-100' : out ? 'text-zinc-500 hover:bg-zinc-900/[0.06] dark:text-zinc-400 dark:hover:bg-white/[0.08]' : 'text-zinc-900 hover:bg-zinc-900/[0.06] dark:text-zinc-100 dark:hover:bg-white/[0.08]',
                          dis && 'cursor-not-allowed text-zinc-400 hover:bg-transparent dark:text-zinc-600 dark:hover:bg-transparent',
                          FOCUS,
                        )}
                      >
                        {d.getDate()}
                        {isToday && !edge && <span aria-hidden className="absolute bottom-1 size-1 rounded-full bg-signal-600 dark:bg-signal-300" />}
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-3 text-[13px] dark:border-white/[0.08]">
        <span className="text-zinc-600 dark:text-zinc-400" role="status" aria-live="polite">
          {range.from && range.to ? <><span className="font-medium text-zinc-950 tabular-nums dark:text-white">{fmtShort.format(range.from)} – {fmtShort.format(range.to)}</span> · <span className="tabular-nums">{nights}</span>&nbsp;days</> : range.from ? 'Pick an end date' : 'Pick a start date'}
        </span>
        <button type="button" onClick={() => set({ from: null, to: null })} disabled={!range.from} className={cn('min-h-8 rounded-[10px] px-2.5 font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-900/[0.05] hover:text-zinc-950 disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white', FOCUS)}>Clear</button>
      </div>
    </div>
  )
}
