import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Four petals fold inward to complete a luminous circuit when on. */
export function PetalCircuitToggle({
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
        'relative flex h-20 w-20 items-center justify-center rounded-full border border-zinc-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950',
        className,
      )}
      {...rest}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          aria-hidden
          className="absolute h-7 w-5 rounded-full bg-signal-300/90"
          style={{
            transform: `rotate(${i * 90}deg) translateY(${on ? -10 : -22}px) scaleY(${on ? 0.85 : 1})`,
            transition: reduced ? undefined : `transform 420ms cubic-bezier(.2,.8,.2,1) ${i * 40}ms`,
            boxShadow: on ? '0 0 12px rgba(212,203,229,0.8)' : undefined,
          }}
        />
      ))}
      <span
        aria-hidden
        className="relative z-10 h-4 w-4 rounded-full"
        style={{
          background: on ? '#a78bfa' : '#d4d4d8',
          boxShadow: on ? '0 0 16px #c4b5fd' : undefined,
          transition: reduced ? undefined : 'background 300ms ease',
        }}
      />
    </button>
  )
}
