import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const RING_MASK: React.CSSProperties = {
  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
  mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
}

/** Animated light beam that travels around a rounded hairline border. */
export function BorderBeam({
  children,
  className,
  duration = 6,
  colorFrom = '#f97316',
  colorTo = '#fdba74',
  size = 70,
  borderWidth = 1,
  glow = true,
}: {
  children: React.ReactNode
  className?: string
  duration?: number
  /** Tail colour of the beam. */
  colorFrom?: string
  /** Head colour of the beam. */
  colorTo?: string
  /** Beam length in degrees of the sweep (20–180). */
  size?: number
  /** Border thickness in px. */
  borderWidth?: number
  /** Soft bloom under the beam. */
  glow?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  const len = Math.max(20, Math.min(180, size))
  const gradient = `conic-gradient(from var(--fk-beam-a, 200deg), transparent 0deg, transparent ${360 - len}deg, ${colorFrom} ${360 - len * 0.55}deg, ${colorTo} 356deg, transparent 360deg)`
  const ring = (extra?: string) => (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        !reduced && 'animate-[fk-beam-spin_var(--bd)_linear_infinite]',
        extra,
      )}
      style={{ padding: borderWidth, background: gradient, ['--bd' as string]: `${duration}s`, ...RING_MASK }}
    />
  )
  return (
    <div
      className={cn(
        'relative isolate rounded-2xl bg-white ring-1 ring-zinc-950/[0.08] shadow-[0_1px_2px_rgba(15,15,20,0.04),0_8px_24px_-12px_rgba(15,15,20,0.14)] dark:bg-zinc-950 dark:ring-white/10',
        className,
      )}
    >
      <style>{`@property --fk-beam-a{syntax:'<angle>';inherits:false;initial-value:200deg}@keyframes fk-beam-spin{to{--fk-beam-a:560deg}}`}</style>
      {glow && <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 blur-md dark:opacity-80">{ring()}</div>}
      {ring()}
      <div className="relative z-10 rounded-[inherit]">{children}</div>
    </div>
  )
}
