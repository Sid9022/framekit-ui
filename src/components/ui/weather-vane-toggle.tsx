import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Miniature vane pivots; background grain shifts with wind state. */
export function WeatherVaneToggle({
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
        'relative flex h-20 w-28 flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50 dark:border-zinc-700',
        className,
      )}
      style={{
        background: on
          ? 'repeating-linear-gradient(90deg, #e7e5e4 0 1px, #f5f5f4 1px 7px)'
          : 'repeating-linear-gradient(90deg, #f4f4f5 0 1px, #fafafa 1px 14px)',
        transition: reduced ? undefined : 'background 400ms ease',
      }}
      {...rest}
    >
      <span aria-hidden className="mb-1 h-8 w-0.5 rounded bg-zinc-400" />
      <span
        aria-hidden
        className="absolute top-5 text-lg"
        style={{
          transform: `rotate(${on ? 48 : -28}deg)`,
          transition: reduced ? undefined : 'transform 480ms cubic-bezier(.34,1.4,.64,1)',
        }}
      >
        ➤
      </span>
      <span className="mt-6 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">
        {on ? 'Breezy' : 'Still'}
      </span>
    </button>
  )
}
