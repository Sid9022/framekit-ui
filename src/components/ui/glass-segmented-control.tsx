import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SegmentOption = { value: string; label: string; icon?: React.ReactNode; disabled?: boolean }

export type GlassSegmentedControlProps = {
  /** Segments, 2–6 work best. */
  options?: SegmentOption[]
  /** Controlled value. */
  value?: string
  /** Uncontrolled initial value (defaults to the first option). */
  defaultValue?: string
  /** Fires when the selection changes. */
  onValueChange?: (value: string) => void
  /** Accessible name of the radio group. */
  label?: string
  /** 'sm' is 32 px tall (44 px on touch), 'md' is 40 px. */
  size?: 'sm' | 'md'
  /** Stretch segments to fill the container. */
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

export const DEFAULT_SEGMENTS: SegmentOption[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

/**
 * Glass Segmented Control — an iOS-style segmented control whose selected
 * thumb is a lifted glass pill that springs between segments, stretching a
 * touch in the direction of travel. Native radio semantics with arrow keys,
 * Home/End, a press squish, and an opaque fallback under reduced transparency.
 */
export function GlassSegmentedControl({
  options = DEFAULT_SEGMENTS,
  value,
  defaultValue,
  onValueChange,
  label = 'Time range',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
}: GlassSegmentedControlProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const [inner, setInner] = React.useState(defaultValue ?? options[0]?.value)
  const current = value ?? inner
  const [pressed, setPressed] = React.useState<string | null>(null)
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])

  const select = (v: string) => {
    if (v === current) return
    if (value === undefined) setInner(v)
    onValueChange?.(v)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const enabled = options.map((o, i) => ({ o, i })).filter(({ o }) => !o.disabled)
    const pos = enabled.findIndex(({ o }) => o.value === current)
    let next = pos
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (pos + 1) % enabled.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (pos - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = enabled.length - 1
    else return
    e.preventDefault()
    const t = enabled[next]
    select(t.o.value)
    refs.current[t.i]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      onKeyDown={disabled ? undefined : onKeyDown}
      className={cn(
        'relative inline-flex max-w-full select-none items-stretch gap-0.5 rounded-full p-1',
        'bg-zinc-900/[0.06] ring-1 ring-inset ring-black/[0.04] dark:bg-white/[0.07] dark:ring-white/[0.06]',
        'shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)]',
        fullWidth && 'flex w-full',
        disabled && 'opacity-50',
        className,
      )}
    >
      {options.map((o, i) => {
        const selected = o.value === current
        const isDisabled = disabled || o.disabled
        return (
          <button
            key={o.value}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={isDisabled}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(o.value)}
            onPointerDown={() => setPressed(o.value)}
            onPointerUp={() => setPressed(null)}
            onPointerLeave={() => setPressed(null)}
            className={cn(
              'relative z-0 inline-flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium outline-none',
              '[touch-action:manipulation] [-webkit-tap-highlight-color:transparent]',
              'transition-[color] duration-150 ease-out',
              size === 'sm' ? 'h-8 px-3 text-[13px] pointer-coarse:min-h-11' : 'h-10 px-4 text-sm pointer-coarse:min-h-11',
              fullWidth && 'flex-1',
              selected ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              'disabled:cursor-not-allowed disabled:text-zinc-500 dark:disabled:text-zinc-500',
              'focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300',
            )}
          >
            {selected && (
              <motion.span
                aria-hidden
                layoutId={`${id}-thumb`}
                className={cn(
                  'absolute inset-0 -z-10 rounded-full',
                  'bg-white/90 backdrop-blur-md backdrop-saturate-150 dark:bg-zinc-600/70',
                  'shadow-[0_1px_2px_rgb(0_0_0/0.08),0_4px_12px_-4px_rgb(0_0_0/0.18),inset_0_1px_0_rgb(255_255_255/0.9)]',
                  'dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),inset_0_1px_0_rgb(255_255_255/0.14)]',
                  'ring-1 ring-black/[0.04] dark:ring-white/[0.1]',
                  '[@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none dark:[@media(prefers-reduced-transparency:reduce)]:bg-zinc-700',
                )}
                animate={{ scale: !reduced && pressed === o.value ? 0.96 : 1 }}
                transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 460, damping: 36 }}
              >
                <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 dark:opacity-30" />
              </motion.span>
            )}
            {o.icon && <span aria-hidden className="shrink-0 [&>svg]:size-4">{o.icon}</span>}
            <span className="truncate">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
