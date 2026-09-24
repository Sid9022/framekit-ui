import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Translucent glass sphere on a dark track — light/dark theme object. */
export function GlassOrbSwitch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  id,
  ...rest
}: ToggleBaseProps) {
  const reduced = usePrefersReducedMotion()
  const { checked: light, toggle } = useToggleState({ checked, defaultChecked, onCheckedChange })

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={rest['aria-label'] ?? (light ? 'Light mode' : 'Dark mode')}
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
        'relative inline-flex h-14 w-40 items-center rounded-full border border-zinc-700/90 bg-[#2a2a2e] px-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      <span className="pointer-events-none absolute left-5 text-[11px] font-medium tracking-wide text-zinc-300">
        Dark
      </span>
      <span className="pointer-events-none absolute right-5 text-[11px] font-medium tracking-wide text-zinc-500">
        Light
      </span>
      <span
        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full"
        style={{
          marginLeft: light ? 'calc(100% - 3rem)' : '0.1rem',
          transition: reduced ? undefined : 'margin-left 460ms cubic-bezier(.2,.8,.2,1)',
          background:
            'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.92), rgba(230,230,240,0.45) 38%, rgba(140,140,160,0.28) 68%, rgba(255,255,255,0.18))',
          boxShadow:
            'inset 0 1px 2px rgba(255,255,255,0.85), inset 0 -6px 12px rgba(0,0,0,0.28), 0 8px 18px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.4)',
        }}
        aria-hidden
      >
        <span className="absolute left-2 top-2 h-2.5 w-3.5 rounded-full bg-white/75 blur-[0.5px]" />
        {light ? (
          <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-white drop-shadow">
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line
                key={a}
                x1="12"
                y1="2.5"
                x2="12"
                y2="5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                transform={`rotate(${a} 12 12)`}
              />
            ))}
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-white drop-shadow">
            <path
              fill="currentColor"
              d="M14.5 3.5a8.5 8.5 0 1 0 6 14.2 7 7 0 1 1-6-14.2z"
            />
          </svg>
        )}
      </span>
    </button>
  )
}
