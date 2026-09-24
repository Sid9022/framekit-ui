import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Chromatic glitch + portal ripple + scanlines. */
export function GlitchPortal404({
  className,
  onHome,
}: {
  className?: string
  onHome?: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const [kick, setKick] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setKick((k) => k + 1), 1600)
    return () => clearInterval(id)
  }, [reduced])

  const jitter = reduced ? 0 : (kick % 2 === 0 ? 3 : -2)

  return (
    <div
      className={cn(
        'relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-black',
        className,
      )}
    >
      {/* portal ripple */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full border border-signal-400/40"
          style={{ width: 80, height: 80 }}
          animate={
            reduced
              ? { opacity: 0.2 }
              : { scale: [0.4, 2.8], opacity: [0.55, 0] }
          }
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
        />
      ))}

      <div className="relative">
        <span
          aria-hidden
          className="absolute inset-0 select-none text-7xl font-black tracking-tighter text-cyan-400/70"
          style={{ transform: `translate(${jitter}px, -1px)`, mixBlendMode: 'screen' }}
        >
          404
        </span>
        <span
          aria-hidden
          className="absolute inset-0 select-none text-7xl font-black tracking-tighter text-rose-500/70"
          style={{ transform: `translate(${-jitter}px, 1px)`, mixBlendMode: 'screen' }}
        >
          404
        </span>
        <p className="relative text-7xl font-black tracking-tighter text-white">404</p>
      </div>

      <p className="relative z-10 mt-3 text-sm text-zinc-400">Portal signal scrambled.</p>
      <button
        type="button"
        onClick={onHome}
        className="relative z-10 mt-4 rounded-full border border-framekit-500/50 px-5 py-2 text-sm text-framekit-300 transition hover:bg-framekit-500/10"
      >
        Re-enter
      </button>

      {/* scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.06) 2px, rgba(255,255,255,0.06) 4px)',
        }}
      />
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"
          style={{ animation: 'glitch-scan 2.8s linear infinite' }}
        />
      )}
      <style>{`@keyframes glitch-scan{0%{top:-10%}100%{top:110%}}`}</style>
    </div>
  )
}
