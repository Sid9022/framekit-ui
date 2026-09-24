import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Track fills with a blooming ink blot when turning on. */
export function InkBloomToggle({
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
        'relative inline-flex h-11 w-24 items-center overflow-hidden rounded-full border border-zinc-300 bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900',
        className,
      )}
      {...rest}
    >
      <span
        className="absolute inset-y-0 left-0 bg-zinc-950 dark:bg-signal-300"
        style={{
          width: on ? '100%' : '0%',
          borderRadius: on ? 999 : '0 40% 40% 0 / 0 60% 60% 0',
          transition: reduced
            ? undefined
            : 'width 480ms cubic-bezier(.2,.8,.2,1), border-radius 480ms ease',
        }}
        aria-hidden
      />
      {/* blot lobes */}
      <span
        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-[40%_60%_55%_45%] bg-zinc-950/90 dark:bg-signal-400/90"
        style={{
          opacity: on ? 0 : 0,
          transform: on
            ? 'translate(-10%, -50%) scale(2.4)'
            : 'translate(-120%, -50%) scale(0.4)',
          transition: reduced ? undefined : 'transform 500ms cubic-bezier(.2,.8,.2,1)',
          pointerEvents: 'none',
        }}
        aria-hidden
      />
      <span
        className="relative z-10 ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-zinc-800 shadow dark:text-zinc-900"
        style={{
          transform: `translateX(${on ? '3.35rem' : '0'})`,
          transition: reduced ? undefined : 'transform 420ms cubic-bezier(.2,.8,.2,1)',
        }}
        aria-hidden
      >
        {on ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}
