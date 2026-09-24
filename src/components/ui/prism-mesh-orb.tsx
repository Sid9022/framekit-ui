import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Mode = 'idle' | 'listen' | 'speak'

/** Iridescent mesh sphere — idle/listen/speak with pointer tilt + equatorial voice wave. */
export function PrismMeshOrb({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [mode, setMode] = React.useState<Mode>('idle')
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 })
  const [level, setLevel] = React.useState(0.3)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (reduced || mode !== 'speak') return
    const id = window.setInterval(() => setLevel(0.35 + Math.random() * 0.65), 140)
    return () => clearInterval(id)
  }, [mode, reduced])

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || reduced) return
    const r = el.getBoundingClientRect()
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    })
  }

  const modes: Mode[] = ['idle', 'listen', 'speak']

  return (
    <div className={cn('flex w-full max-w-sm flex-col items-center gap-5', className)}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative flex h-[220px] w-[220px] items-center justify-center"
        style={{ perspective: 700 }}
      >
        <motion.div
          className="relative h-36 w-36"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${tilt.x * 18}deg) rotateX(${-tilt.y * 14}deg)`,
            transition: reduced ? undefined : 'transform 120ms ease-out',
          }}
          animate={
            reduced
              ? undefined
              : mode === 'speak'
                ? { scale: [1, 1.06 + level * 0.06, 1] }
                : mode === 'listen'
                  ? { scale: [1, 1.04, 1] }
                  : { scale: [1, 1.015, 1] }
          }
          transition={{ duration: mode === 'speak' ? 0.35 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="absolute inset-[-30%] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(167,139,250,0.45), rgba(236,72,153,0.2), transparent 70%)',
              filter: 'blur(16px)',
              opacity: mode === 'speak' ? 0.95 : 0.55,
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.5), transparent 30%), conic-gradient(from 40deg, #67e8f9, #a78bfa, #f472b6, #fb923c, #67e8f9)',
              boxShadow: 'inset -16px -20px 40px rgba(0,0,0,0.45), 0 0 40px rgba(167,139,250,0.4)',
            }}
          />
          <motion.div
            className="absolute inset-[6%] rounded-full opacity-60 mix-blend-overlay"
            style={{
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.12) 6px, rgba(255,255,255,0.12) 7px), repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.1) 6px, rgba(255,255,255,0.1) 7px)',
            }}
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: mode === 'listen' ? 10 : 22, repeat: Infinity, ease: 'linear' }}
          />
          {mode === 'speak' && (
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
              <polyline
                fill="none"
                stroke="rgba(251,146,60,0.9)"
                strokeWidth="1.4"
                points={Array.from({ length: 40 }, (_, i) => {
                  const a = (i / 39) * Math.PI * 2
                  const amp = 3 + level * 8
                  const r = 42 + Math.sin(a * 5 + level * 12) * amp
                  return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * 8}`
                }).join(' ')}
              />
            </svg>
          )}
        </motion.div>
      </div>
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
              mode === m
                ? 'bg-signal-500/30 text-signal-100 ring-1 ring-signal-400/50'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10',
            )}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}
