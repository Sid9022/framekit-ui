import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Classic track switch whose knob is an eyelid that blinks on toggle. */
export function BlinkerSwitch({
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
  const [blink, setBlink] = React.useState(false)

  const fire = () => {
    if (disabled) return
    if (!reduced) {
      setBlink(true)
      window.setTimeout(() => setBlink(false), 160)
    }
    toggle()
  }

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={fire}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          fire()
        }
      }}
      className={cn(
        'relative inline-flex h-10 w-[4.25rem] items-center rounded-full px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50',
        on ? 'bg-zinc-900 dark:bg-signal-300' : 'bg-zinc-200 dark:bg-zinc-700',
        className,
      )}
      {...rest}
    >
      <span
        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md dark:bg-zinc-100"
        style={{
          transform: `translateX(${on ? '1.35rem' : '0'})`,
          transition: reduced ? undefined : 'transform 320ms cubic-bezier(.2,.8,.2,1)',
        }}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <ellipse cx="16" cy="16" rx="11" ry="7" fill="#f8fafc" stroke="#a1a1aa" strokeWidth="1" />
          <circle cx="16" cy="16" r="3.2" fill="#18181b" />
          <circle cx="15" cy="15" r="1" fill="#fff" />
          {/* lid */}
          <path
            d="M5 16 Q16 6 27 16 Q16 8 5 16 Z"
            fill="#d4cbe5"
            style={{
              transformOrigin: '16px 16px',
              transform: blink || !on ? 'scaleY(1)' : 'scaleY(0.12)',
              transition: reduced ? undefined : 'transform 140ms ease',
            }}
          />
        </svg>
      </span>
    </button>
  )
}
