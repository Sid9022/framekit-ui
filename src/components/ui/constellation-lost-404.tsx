import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Node = { id: number; x: number; y: number; ox: number; oy: number }

const BASE: Omit<Node, 'ox' | 'oy'>[] = [
  // "4"
  { id: 0, x: 18, y: 28 }, { id: 1, x: 18, y: 50 }, { id: 2, x: 18, y: 72 },
  { id: 3, x: 38, y: 50 }, { id: 4, x: 38, y: 28 }, { id: 5, x: 38, y: 72 },
  // "0"
  { id: 6, x: 58, y: 30 }, { id: 7, x: 72, y: 28 }, { id: 8, x: 86, y: 30 },
  { id: 9, x: 58, y: 50 }, { id: 10, x: 86, y: 50 },
  { id: 11, x: 58, y: 70 }, { id: 12, x: 72, y: 72 }, { id: 13, x: 86, y: 70 },
  // "4"
  { id: 14, x: 106, y: 28 }, { id: 15, x: 106, y: 50 }, { id: 16, x: 106, y: 72 },
  { id: 17, x: 126, y: 50 }, { id: 18, x: 126, y: 28 }, { id: 19, x: 126, y: 72 },
]

const LINKS: [number, number][] = [
  [0, 1], [1, 2], [0, 4], [1, 3], [3, 5], [4, 3],
  [6, 7], [7, 8], [6, 9], [8, 10], [9, 11], [10, 13], [11, 12], [12, 13],
  [14, 15], [15, 16], [14, 18], [15, 17], [17, 19], [18, 17],
]

/** “404” as nodes/links that drift apart then reconnect + ghost Go home. */
export function ConstellationLost404({
  className,
  onHome,
}: {
  className?: string
  onHome?: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const [drift, setDrift] = React.useState(true)

  React.useEffect(() => {
    if (reduced) {
      setDrift(false)
      return
    }
    const id = window.setInterval(() => setDrift((d) => !d), 2800)
    return () => clearInterval(id)
  }, [reduced])

  const nodes = BASE.map((n) => {
    const scatter = drift && !reduced
    const jx = scatter ? Math.sin(n.id * 1.7) * 14 : 0
    const jy = scatter ? Math.cos(n.id * 2.1) * 12 : 0
    return { ...n, ox: n.x + jx, oy: n.y + jy }
  })

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border border-zinc-800 bg-[#0c0c10] px-6 py-10',
        className,
      )}
    >
      <svg viewBox="0 0 150 100" className="h-36 w-full max-w-md">
        {LINKS.map(([a, b], i) => {
          const na = nodes[a]
          const nb = nodes[b]
          return (
            <motion.line
              key={i}
              x1={na.ox}
              y1={na.oy}
              x2={nb.ox}
              y2={nb.oy}
              stroke="rgba(212,203,229,0.35)"
              strokeWidth={1}
              animate={{ x1: na.ox, y1: na.oy, x2: nb.ox, y2: nb.oy, opacity: drift ? 0.15 : 0.55 }}
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            />
          )
        })}
        {nodes.map((n) => (
          <motion.circle
            key={n.id}
            r={2.4}
            fill="#f97316"
            animate={{ cx: n.ox, cy: n.oy }}
            transition={{ type: 'spring', stiffness: 70, damping: 12 }}
            style={{ filter: 'drop-shadow(0 0 4px rgba(249,115,22,0.7))' }}
          />
        ))}
      </svg>
      <p className="text-sm text-zinc-400">This constellation wandered off the map.</p>
      <button
        type="button"
        onClick={onHome}
        className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white/70 backdrop-blur transition hover:bg-white/10 hover:text-white"
      >
        Go home
      </button>
    </div>
  )
}
