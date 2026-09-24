import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Soft heartbeat pulse when on; flat when off. */
export function PulsebeatSwitch({
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
        'relative inline-flex h-10 w-[4.5rem] items-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50',
        on ? 'bg-rose-500/90' : 'bg-zinc-200 dark:bg-zinc-700',
        className,
      )}
      {...rest}
    >
      <span
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
        style={{
          transform: `translateX(${on ? '1.55rem' : '0'})`,
          transition: reduced ? undefined : 'transform 360ms cubic-bezier(.2,.8,.2,1)',
        }}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-500">
          <path
            fill="currentColor"
            d="M12 21s-6.7-4.35-9.33-8.1C.7 10.1 1.1 6.6 3.6 5.1 5.5 3.95 7.9 4.4 9.4 6c.5.55.9 1.1 1.2 1.55.3-.45.7-1 1.2-1.55 1.5-1.6 3.9-2.05 5.8-.9 2.5 1.5 2.9 5  .93 7.8C18.7 16.65 12 21 12 21z"
          />
        </svg>
        {on && !reduced && (
          <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/40" />
        )}
      </span>
    </button>
  )
}
