import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Compact OFF/ON pill with a glowing star badge and cool halo. */
export function CosmicSparkleToggle({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  id,
  ...rest
}: ToggleBaseProps) {
  const reduced = usePrefersReducedMotion()
  const { checked: on, toggle } = useToggleState({ checked, defaultChecked, onCheckedChange })

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => !disabled && toggle()}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
      className={cn(
        'relative inline-flex h-11 items-center gap-2 rounded-full border px-1.5 pr-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50',
        on
          ? 'border-indigo-400/40 bg-indigo-950 text-indigo-100 shadow-[0_0_24px_rgba(129,140,248,0.35)]'
          : 'border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900',
        className,
      )}
      {...rest}
    >
      <span
        className="relative flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          background: on
            ? 'radial-gradient(circle at 40% 35%, #e0e7ff, #818cf8 55%, #312e81)'
            : '#e4e4e7',
          boxShadow: on ? '0 0 16px rgba(165,180,252,0.7)' : undefined,
          transition: reduced ? undefined : 'background 300ms ease, box-shadow 300ms ease',
        }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className={cn('h-4 w-4', on ? 'text-white' : 'text-zinc-500')}>
          <path
            fill="currentColor"
            d="M12 2.5l1.6 5.2L19 9.2l-4.2 3.4 1.4 5.4L12 15.5 7.8 18l1.4-5.4L5 9.2l5.4-1.5L12 2.5z"
          />
        </svg>
        {on && !reduced && (
          <span className="absolute inset-0 animate-ping rounded-full bg-indigo-300/30" />
        )}
      </span>
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">
        {on ? 'On' : 'Off'}
      </span>
    </button>
  )
}
