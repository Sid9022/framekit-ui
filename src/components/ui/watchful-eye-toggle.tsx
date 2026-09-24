import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Soft illustrated eye — lids open/close for on/off; pupil tracks pointer when open. */
export function WatchfulEyeToggle({
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
  const ref = React.useRef<HTMLButtonElement>(null)
  const [pupil, setPupil] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    if (!on || reduced || disabled) {
      setPupil({ x: 0, y: 0 })
      return
    }
    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 48))
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 36))
      setPupil({ x: dx * 5, y: dy * 3.5 })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [on, reduced, disabled])

  return (
    <button
      ref={ref}
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
        'relative inline-flex h-14 w-20 items-center justify-center rounded-[2rem] border border-zinc-200 bg-[#f4f2ee] shadow-inner transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900', on && 'shadow-[0_0_0_4px_rgba(212,203,229,0.35)]',
        className,
      )}
      {...rest}
    >
      <svg viewBox="0 0 80 56" className="h-12 w-[4.5rem]" aria-hidden>
        {/* sclera */}
        <ellipse cx="40" cy="28" rx="30" ry="18" fill="#fff" className="dark:fill-zinc-100" />
        {/* iris */}
        <g
          style={{
            transform: `translate(${pupil.x}px, ${pupil.y}px)`,
            transition: reduced ? undefined : 'transform 80ms linear',
          }}
        >
          <circle cx="40" cy="28" r="10" fill="#5b4a72" />
          <circle cx="40" cy="28" r="4.5" fill="#1a1520" />
          <circle cx="37" cy="25" r="2" fill="#fff" opacity="0.85" />
        </g>
        {/* lids */}
        <path
          d="M8 28 Q40 6 72 28 Q40 10 8 28 Z"
          fill="#e8e0f0"
          className="dark:fill-zinc-800"
          style={{
            transformOrigin: '40px 28px',
            transform: on ? 'scaleY(0.08)' : 'scaleY(1)',
            transition: reduced ? undefined : 'transform 320ms cubic-bezier(.2,.8,.2,1)',
          }}
        />
        <path
          d="M8 28 Q40 50 72 28 Q40 46 8 28 Z"
          fill="#d4cbe5"
          style={{
            transformOrigin: '40px 28px',
            transform: on ? 'scaleY(0.08)' : 'scaleY(1)',
            transition: reduced ? undefined : 'transform 320ms cubic-bezier(.2,.8,.2,1)',
          }}
        />
        {/* lashes hint */}
        {!on && (
          <path d="M18 18 L16 12 M28 14 L27 8 M40 12 L40 6 M52 14 L53 8 M62 18 L64 12" stroke="#9a86b8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </button>
  )
}
