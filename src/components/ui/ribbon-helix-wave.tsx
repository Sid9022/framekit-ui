import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Premium dual ribbon helix / sine wave visualizer reacting to amplitude. */
export function RibbonHelixWave({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [level, setLevel] = React.useState(0.5)
  const [phase, setPhase] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setLevel(0.25 + Math.random() * 0.7)
      setPhase((p) => p + 0.28)
    }, 80)
    return () => clearInterval(id)
  }, [reduced])

  const w = 320
  const h = 120
  const mid = h / 2
  const buildRibbon = (offset: number, ampMul: number) => {
    const pts: string[] = []
    for (let i = 0; i <= 64; i++) {
      const x = (i / 64) * w
      const t = (i / 64) * Math.PI * 4 + phase + offset
      const amp = (8 + level * 28) * ampMul
      const y = mid + Math.sin(t) * amp + Math.sin(t * 0.5 + offset) * amp * 0.35
      pts.push(`${x},${y}`)
    }
    return pts.join(' ')
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0910] p-4',
        className,
      )}
      onPointerMove={(e) => {
        if (reduced) return
        const r = e.currentTarget.getBoundingClientRect()
        setLevel(0.15 + ((e.clientX - r.left) / r.width) * 0.85)
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Ribbon helix</p>
        <span className="rounded-full bg-signal-500/20 px-2.5 py-0.5 font-mono text-[10px] text-signal-700 dark:text-signal-200">
          {(level * 100).toFixed(0)}% amp
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full overflow-visible">
        <defs>
          <linearGradient id="fk-rib-a" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <linearGradient id="fk-rib-b" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <filter id="fk-rib-glow">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polyline
          points={buildRibbon(0, 1)}
          fill="none"
          stroke="url(#fk-rib-a)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#fk-rib-glow)"
          opacity="0.95"
        />
        <polyline
          points={buildRibbon(Math.PI * 0.7, 0.72)}
          fill="none"
          stroke="url(#fk-rib-b)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
        {/* depth ghost */}
        <polyline
          points={buildRibbon(Math.PI * 1.3, 0.45)}
          fill="none"
          stroke="rgba(167,139,250,0.35)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">Move pointer to drive amplitude</p>
    </div>
  )
}
