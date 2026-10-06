import { cn } from '@/lib/cn'

type Tone = 'accent' | 'success' | 'warning' | 'danger' | 'neutral'

const FILL: Record<Tone, string> = {
  accent: 'bg-framekit-500 dark:bg-framekit-400',
  success: 'bg-emerald-500 dark:bg-emerald-400',
  warning: 'bg-amber-500 dark:bg-amber-400',
  danger: 'bg-rose-500 dark:bg-rose-400',
  neutral: 'bg-zinc-900 dark:bg-zinc-100',
}

const SIZE = { sm: 'h-1', md: 'h-2', lg: 'h-3' } as const

export function Progress({
  value,
  className,
  'aria-label': ariaLabel = 'Progress',
  tone = 'accent',
  size = 'md',
  indeterminate = false,
  label,
  showValue = false,
}: {
  value: number
  className?: string
  'aria-label'?: string
  /** Fill colour. Use semantic tones for status (success / warning / danger). */
  tone?: Tone
  /** Track height. */
  size?: keyof typeof SIZE
  /** Unknown duration: a travelling sheen instead of a width. */
  indeterminate?: boolean
  /** Optional visible label rendered above the track (also names the bar). */
  label?: string
  /** Show the percentage (tabular figures) next to the label. */
  showValue?: boolean
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const bar = (
    <div
      role="progressbar"
      aria-label={label ?? ariaLabel}
      aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-busy={indeterminate || undefined}
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-zinc-950/[0.07] shadow-[inset_0_1px_1px_rgba(0,0,0,0.06)] dark:bg-white/10 dark:shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]',
        SIZE[size],
        !label && !showValue && className,
      )}
    >
      {indeterminate ? (
        <div
          className={cn(
            'absolute inset-y-0 w-2/5 rounded-full motion-safe:animate-[fk-progress-indeterminate_1.4s_cubic-bezier(0.65,0,0.35,1)_infinite] motion-reduce:left-0 motion-reduce:w-full motion-reduce:opacity-40',
            FILL[tone],
          )}
        />
      ) : (
        <div
          className={cn(
            'h-full w-full origin-left rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
            FILL[tone],
          )}
          style={{ transform: `scaleX(${clamped / 100})` }}
        >
          <div className="h-1/2 rounded-full bg-gradient-to-b from-white/35 to-transparent" />
        </div>
      )}
      {indeterminate && (
        <style>{`@keyframes fk-progress-indeterminate{0%{left:-40%}100%{left:100%}}`}</style>
      )}
    </div>
  )
  if (!label && !showValue) return bar
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-[13px]">
        {label && <span className="font-medium text-zinc-800 dark:text-zinc-200">{label}</span>}
        {showValue && !indeterminate && (
          <span aria-hidden className="ml-auto tabular-nums text-zinc-500 dark:text-zinc-400">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
      {bar}
    </div>
  )
}
