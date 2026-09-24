import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Small face dial that springs between two moods for on/off. */
export function MoodDialToggle({
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
        'relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900',
        className,
      )}
      {...rest}
    >
      <svg
        viewBox="0 0 64 64"
        className="h-14 w-14"
        style={{
          transform: `rotate(${on ? 18 : -18}deg)`,
          transition: reduced ? undefined : 'transform 500ms cubic-bezier(.34,1.56,.64,1)',
        }}
        aria-hidden
      >
        <circle cx="32" cy="32" r="28" fill="#faf8f5" className="dark:fill-zinc-800" />
        <circle cx="22" cy="28" r="3" fill="#18181b" />
        <circle cx="42" cy="28" r="3" fill="#18181b" />
        {/* mouth morph via two paths opacity */}
        <path
          d="M22 40 Q32 48 42 40"
          fill="none"
          stroke="#18181b"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ opacity: on ? 1 : 0, transition: reduced ? undefined : 'opacity 250ms' }}
        />
        <path
          d="M22 44 Q32 36 42 44"
          fill="none"
          stroke="#18181b"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ opacity: on ? 0 : 1, transition: reduced ? undefined : 'opacity 250ms' }}
        />
        <circle cx="32" cy="32" r="28" fill="none" stroke="#d4cbe5" strokeWidth="3" strokeDasharray="12 40" />
      </svg>
    </button>
  )
}
