import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Illustrated mini-sky capsule — sun, birds, clouds ↔ stars & moon. */
export function DayNightCapsule({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  id,
  ...rest
}: ToggleBaseProps) {
  const reduced = usePrefersReducedMotion()
  const { checked: night, toggle } = useToggleState({ checked, defaultChecked, onCheckedChange })

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={night}
      aria-label={rest['aria-label'] ?? (night ? 'Night mode' : 'Day mode')}
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
        'relative h-16 w-44 overflow-hidden rounded-full border shadow-[0_10px_28px_rgba(0,0,0,0.12)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50',
        night ? 'border-indigo-950/50' : 'border-sky-100',
        className,
      )}
      style={{
        background: night
          ? 'linear-gradient(180deg,#0b1224 0%,#1e1b4b 50%,#2e1065 100%)'
          : 'linear-gradient(180deg,#38bdf8 0%,#7dd3fc 40%,#bae6fd 100%)',
        transition: reduced ? undefined : 'background 520ms ease',
      }}
      {...rest}
    >
      {/* stars */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: night ? 1 : 0, transition: reduced ? undefined : 'opacity 420ms' }}
      >
        {[
          [22, 14],
          [48, 10],
          [78, 18],
          [110, 12],
          [140, 20],
          [95, 28],
          [60, 22],
        ].map(([x, y], i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: x,
              top: y,
              width: i % 3 === 0 ? 2.5 : 1.5,
              height: i % 3 === 0 ? 2.5 : 1.5,
              boxShadow: '0 0 5px rgba(255,255,255,0.9)',
            }}
          />
        ))}
      </span>

      {/* birds (day) */}
      <span
        aria-hidden
        className="pointer-events-none absolute font-serif text-[11px] leading-none text-white/90"
        style={{
          left: 72,
          top: 14,
          opacity: night ? 0 : 1,
          transition: reduced ? undefined : 'opacity 350ms',
        }}
      >
        ˄˄
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute font-serif text-[10px] leading-none text-white/80"
        style={{
          left: 98,
          top: 20,
          opacity: night ? 0 : 1,
          transition: reduced ? undefined : 'opacity 350ms',
        }}
      >
        ˄˄
      </span>

      {/* sun */}
      <span
        aria-hidden
        className="absolute top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white"
        style={{
          left: night ? 120 : 10,
          opacity: night ? 0 : 1,
          transform: `translateY(-50%) scale(${night ? 0.35 : 1})`,
          boxShadow: '0 0 24px rgba(255,255,255,0.85), 0 0 40px rgba(253,224,71,0.45)',
          transition: reduced ? undefined : 'all 520ms cubic-bezier(.2,.8,.2,1)',
        }}
      />

      {/* moon */}
      <span
        aria-hidden
        className="absolute top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[#f1f5f9]"
        style={{
          left: night ? 118 : -28,
          opacity: night ? 1 : 0,
          boxShadow: '0 0 18px rgba(199,210,254,0.55)',
          transition: reduced ? undefined : 'all 520ms cubic-bezier(.2,.8,.2,1)',
        }}
      >
        <span className="absolute left-1.5 top-2 h-3 w-3 rounded-full bg-slate-300/70" />
        <span className="absolute right-2.5 top-4 h-2 w-2 rounded-full bg-slate-300/60" />
      </span>

      {/* clouds */}
      <span
        aria-hidden
        className="absolute bottom-3 left-[4.5rem] h-3.5 w-12 rounded-full bg-white"
        style={{
          opacity: night ? 0.12 : 1,
          transform: `translateX(${night ? 16 : 0}px)`,
          transition: reduced ? undefined : 'all 520ms ease',
        }}
      />
      <span
        aria-hidden
        className="absolute bottom-4 left-[6.75rem] h-3 w-9 rounded-full bg-white/95"
        style={{ opacity: night ? 0.08 : 0.95, transition: reduced ? undefined : 'opacity 520ms' }}
      />
      <span
        aria-hidden
        className="absolute bottom-2.5 left-[8.5rem] h-2.5 w-7 rounded-full bg-white/90"
        style={{ opacity: night ? 0.06 : 0.9, transition: reduced ? undefined : 'opacity 520ms' }}
      />
    </button>
  )
}
