import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Tiny illustrated card that flips between two states. */
export function FrameflipToggle({
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
        'relative h-[4.5rem] w-16 [perspective:600px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      <span
        className="relative block h-full w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: on ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: reduced ? undefined : 'transform 560ms cubic-bezier(.2,.8,.2,1)',
        }}
        aria-hidden
      >
        <span
          className="absolute inset-0 flex flex-col items-center justify-center rounded-md border border-zinc-200 bg-[#f7f5f0] shadow-md"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-lg">☀️</span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-500">Day</span>
        </span>
        <span
          className="absolute inset-0 flex flex-col items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 shadow-md"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-lg">🌙</span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-signal-300">Night</span>
        </span>
      </span>
    </button>
  )
}
