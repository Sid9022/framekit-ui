import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Waterline rises and falls inside a rounded glass pane. */
export function TideglassToggle({
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
        'relative h-24 w-16 overflow-hidden rounded-[1.4rem] border border-zinc-300 bg-[#e8eef5] shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900',
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sky-600 to-sky-300/90"
        style={{
          height: on ? '78%' : '22%',
          transition: reduced ? undefined : 'height 520ms cubic-bezier(.2,.8,.2,1)',
        }}
      >
        <span className="absolute inset-x-0 top-0 h-2 bg-white/35" />
      </span>
      <span
        aria-hidden
        className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-amber-200 shadow"
        style={{
          bottom: on ? '62%' : '18%',
          transition: reduced ? undefined : 'bottom 520ms cubic-bezier(.2,.8,.2,1)',
        }}
      />
      <span className="absolute inset-x-0 top-2 text-center font-mono text-[9px] uppercase tracking-wider text-zinc-500">
        {on ? 'High' : 'Low'}
      </span>
    </button>
  )
}
