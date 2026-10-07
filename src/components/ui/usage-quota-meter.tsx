import * as React from 'react'
import { animate, motion, useInView } from 'motion/react'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type UsageSegment = { label: string; value: number }
export type UsageResource = { id: string; label: string; unit: string; limit: number; segments: UsageSegment[]; decimals?: number }

export type UsageQuotaMeterProps = {
  /** Metered resources. Segments stack inside each bar. */
  resources?: UsageResource[]
  /** Billing period label. */
  period?: string
  /** Fraction (0–1) at which a bar turns amber. */
  warnAt?: number
  /** Show a skeleton that mirrors the final layout. */
  loading?: boolean
  /** Called by the upgrade button. */
  onUpgrade?: () => void
  /** Heading level for the card title. */
  titleAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

export const DEFAULT_USAGE: UsageResource[] = [
  { id: 'bw', label: 'Fast data transfer', unit: 'GB', limit: 100, decimals: 1, segments: [{ label: 'Static assets', value: 41.2 }, { label: 'Functions', value: 18.6 }, { label: 'Images', value: 6.3 }] },
  { id: 'fn', label: 'Function invocations', unit: 'M', limit: 1, decimals: 2, segments: [{ label: 'API routes', value: 0.61 }, { label: 'Cron', value: 0.23 }] },
  { id: 'build', label: 'Build minutes', unit: 'min', limit: 6000, segments: [{ label: 'Production', value: 3120 }, { label: 'Preview', value: 2950 }, { label: 'Retries', value: 410 }] },
  { id: 'store', label: 'Blob storage', unit: 'GB', limit: 5, decimals: 2, segments: [{ label: 'Uploads', value: 0.92 }] },
]

const SEG = ['bg-signal-600 dark:bg-signal-400', 'bg-signal-400 dark:bg-signal-300/80', 'bg-signal-300 dark:bg-signal-200/60']

function Count({ to, decimals = 0, run, reduced }: { to: number; decimals?: number; run: boolean; reduced: boolean }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const f = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    if (reduced || !run) { el.textContent = f(run || reduced ? to : 0); return }
    const c = animate(0, to, { duration: 1.1, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { el.textContent = f(v) } })
    return () => c.stop()
  }, [to, decimals, run, reduced])
  return <span ref={ref} className="tabular-nums" />
}

/**
 * Usage Quota Meter — a billing-period usage card in the calm register of a
 * cloud dashboard: hairline tracks fill with stacked segments on a house
 * ease-out, figures count up in tabular numerals, a limit tick sits at 100%,
 * and bars shift to amber near the limit and rose when exceeded — always with
 * a text label, never colour alone. Hover or focus a row for its breakdown.
 */
export function UsageQuotaMeter({
  resources = DEFAULT_USAGE,
  period = 'Oct 1 – Oct 31',
  warnAt = 0.8,
  loading = false,
  onUpgrade,
  titleAs: Title = 'h3',
  className,
}: UsageQuotaMeterProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const [focus, setFocus] = React.useState<string | null>(null)
  const over = resources.filter((r) => r.segments.reduce((a, s) => a + s.value, 0) > r.limit).length

  return (
    <section
      ref={ref}
      aria-busy={loading || undefined}
      className={cn(
        'w-full max-w-xl rounded-[20px] bg-white p-5 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] sm:p-6',
        'dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Title className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Usage</Title>
          <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-400">Hobby plan · <span className="tabular-nums">{period}</span></p>
        </div>
        <motion.button
          type="button"
          onClick={onUpgrade}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          className="inline-flex min-h-9 items-center gap-1 rounded-[10px] bg-zinc-950 px-3 text-[13px] font-medium text-white outline-none transition-colors duration-150 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 pointer-coarse:min-h-11 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-900"
        >
          Upgrade <ArrowUpRight aria-hidden className="size-3.5" />
        </motion.button>
      </div>
      {over > 0 && !loading && (
        <p role="alert" className="mt-4 flex items-center gap-2 rounded-[10px] bg-rose-50 px-3 py-2 text-[13px] text-rose-800 ring-1 ring-rose-600/15 dark:bg-rose-950/50 dark:text-rose-100 dark:ring-rose-400/20">
          <AlertTriangle aria-hidden className="size-4 shrink-0" /> {over} resource{over > 1 ? 's' : ''} over the included limit. Upgrade to avoid throttling.
        </p>
      )}
      <ul className="mt-5 space-y-1">
        {resources.map((r, ri) => {
          const used = r.segments.reduce((a, s) => a + s.value, 0)
          const frac = used / r.limit
          const state = frac > 1 ? 'over' : frac >= warnAt ? 'warn' : 'ok'
          const scale = Math.max(1, frac)
          const active = focus === r.id
          return (
            <li key={r.id}>
              <div
                tabIndex={loading ? -1 : 0}
                onMouseEnter={() => setFocus(r.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(r.id)}
                onBlur={() => setFocus(null)}
                aria-label={`${r.label}: ${used.toLocaleString(undefined, { maximumFractionDigits: r.decimals ?? 0 })} of ${r.limit.toLocaleString()} ${r.unit}, ${Math.round(frac * 100)} percent${state === 'over' ? ', over limit' : state === 'warn' ? ', nearing limit' : ''}`}
                className="-mx-2 rounded-[14px] px-2 py-2.5 outline-none transition-colors duration-150 hover:bg-zinc-900/[0.03] focus-visible:ring-2 focus-visible:ring-signal-600 dark:hover:bg-white/[0.04] dark:focus-visible:ring-signal-300"
              >
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  {loading ? <span className="h-4 w-36 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none dark:bg-zinc-800" /> : <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">{r.label}</span>}
                  {loading ? <span className="h-4 w-20 animate-pulse rounded bg-zinc-200 motion-reduce:animate-none dark:bg-zinc-800" /> : (
                    <span className="shrink-0 text-[13px] text-zinc-600 dark:text-zinc-400" aria-hidden>
                      <span className={cn('font-medium', state === 'over' ? 'text-rose-700 dark:text-rose-300' : state === 'warn' ? 'text-amber-800 dark:text-amber-300' : 'text-zinc-900 dark:text-zinc-100')}>
                        <Count to={used} decimals={r.decimals} run={inView} reduced={reduced} />
                      </span>
                      {' / '}<span className="tabular-nums">{r.limit.toLocaleString()}</span>{'\u00a0'}{r.unit}
                    </span>
                  )}
                </div>
                <div aria-hidden className="relative mt-2 h-2 overflow-hidden rounded-full bg-zinc-900/[0.06] dark:bg-white/[0.08]">
                  {!loading && (
                    <motion.div
                      className="absolute inset-0 flex origin-left gap-px"
                      initial={reduced ? false : { scaleX: 0 }}
                      animate={{ scaleX: inView || reduced ? 1 : 0 }}
                      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: ri * 0.05 }}
                    >
                      {r.segments.map((s, si) => (
                        <span
                          key={s.label}
                          className={cn('h-full first:rounded-l-full last:rounded-r-full', state === 'over' ? 'bg-rose-500' : state === 'warn' ? 'bg-amber-500' : SEG[si % SEG.length])}
                          style={{ width: `${(s.value / r.limit / scale) * 100}%`, opacity: state === 'ok' ? 1 : 1 - si * 0.22 }}
                        />
                      ))}
                    </motion.div>
                  )}
                  {scale > 1 && <span className="absolute inset-y-0 w-0.5 bg-white dark:bg-zinc-900" style={{ left: `${100 / scale}%` }} />}
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: active && !loading ? 'auto' : 0, opacity: active && !loading ? 1 : 0 }}
                  transition={reduced ? { duration: 0.12 } : { type: 'spring', stiffness: 420, damping: 38 }}
                  className="overflow-hidden"
                  aria-hidden
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {r.segments.map((s, si) => (
                      <span key={s.label} className="inline-flex items-center gap-1.5">
                        <span className={cn('size-2 rounded-[3px]', state === 'over' ? 'bg-rose-500' : state === 'warn' ? 'bg-amber-500' : SEG[si % SEG.length])} style={{ opacity: state === 'ok' ? 1 : 1 - si * 0.22 }} />
                        {s.label} <span className="tabular-nums text-zinc-900 dark:text-zinc-100">{s.value.toLocaleString()}</span>
                      </span>
                    ))}
                    {state !== 'ok' && <span className={cn('font-medium', state === 'over' ? 'text-rose-700 dark:text-rose-300' : 'text-amber-800 dark:text-amber-300')}>{state === 'over' ? 'Over limit' : 'Nearing limit'}</span>}
                  </div>
                </motion.div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
