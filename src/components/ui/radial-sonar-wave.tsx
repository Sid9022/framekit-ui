import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Mic } from 'lucide-react'

/** Circular sonar / polar waveform around a center mic glyph; pulse rings on peaks. */
export function RadialSonarWave({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const bars = 48
  const [levels, setLevels] = React.useState(() => Array.from({ length: bars }, () => 0.2))
  const [peak, setPeak] = React.useState(false)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      const next = Array.from({ length: bars }, (_, i) => {
        const base = 0.15 + Math.abs(Math.sin(Date.now() / 280 + i * 0.35)) * 0.55
        return Math.min(1, base + Math.random() * 0.3)
      })
      setLevels(next)
      const avg = next.reduce((a, b) => a + b, 0) / next.length
      setPeak(avg > 0.62)
    }, 90)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div className={cn('relative flex h-[240px] w-full max-w-sm items-center justify-center', className)}>
      {!reduced && peak && (
        <>
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute rounded-full border border-signal-400/40"
              style={{ width: 160, height: 160 }}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.1, delay: i * 0.25 }}
            />
          ))}
        </>
      )}
      <svg viewBox="0 0 200 200" className="h-52 w-52">
        <circle cx="100" cy="100" r="36" fill="rgba(154,134,184,0.12)" stroke="rgba(185,170,208,0.35)" strokeWidth="1" />
        {levels.map((lv, i) => {
          const a = (i / bars) * Math.PI * 2 - Math.PI / 2
          const inner = 44
          const outer = inner + 12 + lv * 42
          const x1 = 100 + Math.cos(a) * inner
          const y1 = 100 + Math.sin(a) * inner
          const x2 = 100 + Math.cos(a) * outer
          const y2 = 100 + Math.sin(a) * outer
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={lv > 0.7 ? '#fb923c' : '#b9aad0'}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity={0.55 + lv * 0.45}
            />
          )
        })}
      </svg>
      <div className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-signal-500/25 text-signal-800 dark:text-signal-100 shadow-[0_0_28px_rgba(154,134,184,0.45)]">
        <Mic className="h-5 w-5" />
      </div>
    </div>
  )
}
