import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  angle: (i / 36) * Math.PI * 2,
  radius: 58 + (i % 5) * 6,
  size: 2 + (i % 3),
  speed: 0.4 + (i % 7) * 0.08,
}))

/** Core ball + orbiting particle halo that densifies with energy level. */
export function ParticleHaloOrb({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [energy, setEnergy] = React.useState(0.45)
  const [auto, setAuto] = React.useState(true)
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setTick((t) => t + 1), 40)
    return () => clearInterval(id)
  }, [reduced])

  React.useEffect(() => {
    if (!auto || reduced) return
    const id = window.setInterval(() => setEnergy(0.2 + Math.random() * 0.8), 500)
    return () => clearInterval(id)
  }, [auto, reduced])

  const visible = Math.round(12 + energy * 24)

  return (
    <div className={cn('flex w-full max-w-sm flex-col items-center gap-4', className)}>
      <div className="relative h-[220px] w-[220px]">
        <div
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #e9d5ff, #7c3aed 50%, #1e1b4b)',
            boxShadow: `0 0 ${30 + energy * 40}px rgba(139,92,246,${0.35 + energy * 0.4})`,
          }}
        />
        {PARTICLES.slice(0, visible).map((p) => {
          const a = p.angle + tick * 0.02 * p.speed * (0.6 + energy)
          const r = p.radius * (0.85 + energy * 0.35)
          const x = 110 + Math.cos(a) * r
          const y = 110 + Math.sin(a) * r * 0.72
          return (
            <span
              key={p.id}
              className="absolute rounded-full bg-signal-500 dark:bg-signal-200"
              style={{
                left: x,
                top: y,
                width: p.size,
                height: p.size,
                opacity: 0.4 + energy * 0.5,
                boxShadow: '0 0 6px rgba(196,181,253,0.8)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )
        })}
      </div>
      <div className="flex w-full max-w-[220px] flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Energy</span>
          <button
            type="button"
            onClick={() => setAuto((a) => !a)}
            className="rounded-full bg-zinc-900/[0.04] dark:bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/[0.06] dark:hover:bg-white/10"
          >
            {auto ? 'Auto' : 'Manual'}
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={energy}
          onChange={(e) => {
            setAuto(false)
            setEnergy(Number(e.target.value))
          }}
          className="w-full accent-signal-600 dark:accent-signal-400"
        />
      </div>
    </div>
  )
}
