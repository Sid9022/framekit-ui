import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useToggleState, type ToggleBaseProps } from '@/lib/toggle'

/** Moth circles a lantern, then settles into the glow when on. */
export function MothLanternToggle({
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
  const [angle, setAngle] = React.useState(0)

  React.useEffect(() => {
    if (on || reduced) return
    let raf = 0
    const tick = () => {
      setAngle((a) => a + 0.05)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on, reduced])

  const mx = on ? 0 : Math.cos(angle) * 22
  const my = on ? -2 : Math.sin(angle) * 12

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
        'relative flex h-20 w-28 items-end justify-center rounded-2xl border border-zinc-200 bg-[#14120f] pb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 disabled:opacity-50 dark:border-zinc-700',
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-6 h-10 w-8 -translate-x-1/2 rounded-t-full"
        style={{
          background: on
            ? 'radial-gradient(circle at 50% 40%, #ffe8a3, #f59e0b 55%, transparent 70%)'
            : 'linear-gradient(#3f3f46,#27272a)',
          boxShadow: on ? '0 0 28px rgba(251,191,36,0.55)' : undefined,
          transition: reduced ? undefined : 'background 400ms ease, box-shadow 400ms ease',
        }}
      />
      <span aria-hidden className="absolute bottom-2 left-1/2 h-2 w-10 -translate-x-1/2 rounded bg-zinc-700" />
      <span
        aria-hidden
        className="absolute left-1/2 top-8 text-sm"
        style={{
          transform: `translate(calc(-50% + ${mx}px), ${my}px) rotate(${on ? 0 : angle * 20}deg)`,
          transition: on && !reduced ? 'transform 500ms cubic-bezier(.2,.8,.2,1)' : undefined,
          filter: on ? 'drop-shadow(0 0 4px #fde68a)' : undefined,
        }}
      >
        🦋
      </span>
    </button>
  )
}
