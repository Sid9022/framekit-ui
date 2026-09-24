import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Node = { id: number; x: number; y: number }

const BASE: Node[] = [
  { id: 0, x: 22, y: 30 }, { id: 1, x: 22, y: 52 }, { id: 2, x: 22, y: 74 },
  { id: 3, x: 42, y: 52 }, { id: 4, x: 42, y: 30 }, { id: 5, x: 42, y: 74 },
  { id: 6, x: 64, y: 32 }, { id: 7, x: 78, y: 28 }, { id: 8, x: 92, y: 32 },
  { id: 9, x: 64, y: 52 }, { id: 10, x: 92, y: 52 },
  { id: 11, x: 64, y: 72 }, { id: 12, x: 78, y: 76 }, { id: 13, x: 92, y: 72 },
  { id: 14, x: 114, y: 30 }, { id: 15, x: 114, y: 52 }, { id: 16, x: 114, y: 74 },
  { id: 17, x: 134, y: 52 }, { id: 18, x: 134, y: 30 }, { id: 19, x: 134, y: 74 },
]

const LINKS: [number, number][] = [
  [0, 1], [1, 2], [0, 4], [1, 3], [3, 5], [4, 3],
  [6, 7], [7, 8], [6, 9], [8, 10], [9, 11], [10, 13], [11, 12], [12, 13],
  [14, 15], [15, 16], [14, 18], [15, 17], [17, 19], [18, 17],
]

const STARS = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: (i * 37) % 100,
  y: (i * 53) % 100,
  s: 1 + (i % 3),
  o: 0.25 + (i % 5) * 0.1,
}))

/** Tiny 3D astronaut floating among reconnecting star “404” — pointer parallax. */
export function ConstellationLost404({
  className,
  onHome,
}: {
  className?: string
  onHome?: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [drift, setDrift] = React.useState(true)
  const [ptr, setPtr] = React.useState({ x: 0, y: 0 })
  const [blink, setBlink] = React.useState(false)

  React.useEffect(() => {
    if (reduced) {
      setDrift(false)
      return
    }
    const id = window.setInterval(() => setDrift((d) => !d), 3000)
    return () => clearInterval(id)
  }, [reduced])

  React.useEffect(() => {
    if (reduced) return
    const blinkLoop = () => {
      setBlink(true)
      window.setTimeout(() => setBlink(false), 140)
    }
    const id = window.setInterval(blinkLoop, 3200 + Math.random() * 1800)
    return () => clearInterval(id)
  }, [reduced])

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || reduced) return
    const r = el.getBoundingClientRect()
    setPtr({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    })
  }

  const nodes = BASE.map((n) => {
    const scatter = drift && !reduced
    const jx = scatter ? Math.sin(n.id * 1.7) * 16 : 0
    const jy = scatter ? Math.cos(n.id * 2.1) * 14 : 0
    return { ...n, ox: n.x + jx, oy: n.y + jy }
  })

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPtr({ x: 0, y: 0 })}
      className={cn(
        'relative flex min-h-[360px] flex-col items-center justify-between overflow-hidden rounded-2xl border border-indigo-950/60 bg-[#07060f] px-6 pb-7 pt-8 shadow-[0_30px_80px_-40px_rgba(249,115,22,0.35)]',
        className,
      )}
    >
      {/* deep space layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(154,134,184,0.22), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(249,115,22,0.12), transparent 45%), radial-gradient(ellipse at 80% 70%, rgba(99,102,241,0.18), transparent 50%)',
          transform: `translate(${ptr.x * 6}px, ${ptr.y * 4}px)`,
          transition: reduced ? undefined : 'transform 180ms ease-out',
        }}
      />

      {/* starfield */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          transform: `translate(${ptr.x * 12}px, ${ptr.y * 8}px)`,
          transition: reduced ? undefined : 'transform 200ms ease-out',
        }}
      >
        {STARS.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              opacity: s.o,
              boxShadow: s.s > 2 ? '0 0 6px rgba(255,255,255,0.7)' : undefined,
              animation: reduced ? undefined : `fk-star-twinkle ${2.4 + (s.id % 5) * 0.4}s ease-in-out infinite`,
              animationDelay: `${(s.id % 7) * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* constellation 404 */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{
          transform: `translate(${ptr.x * 18}px, ${ptr.y * 10}px)`,
          transition: reduced ? undefined : 'transform 160ms ease-out',
        }}
      >
        <svg viewBox="0 0 156 104" className="mx-auto h-36 w-full drop-shadow-[0_0_24px_rgba(249,115,22,0.25)]">
          <defs>
            <filter id="fk-star-glow">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
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
                stroke="rgba(212,203,229,0.45)"
                strokeWidth={1.1}
                animate={{ x1: na.ox, y1: na.oy, x2: nb.ox, y2: nb.oy, opacity: drift ? 0.18 : 0.65 }}
                transition={{ type: 'spring', stiffness: 55, damping: 14 }}
              />
            )
          })}
          {nodes.map((n) => (
            <motion.circle
              key={n.id}
              r={2.6}
              fill="#f97316"
              filter="url(#fk-star-glow)"
              animate={{ cx: n.ox, cy: n.oy }}
              transition={{ type: 'spring', stiffness: 65, damping: 12 }}
            />
          ))}
        </svg>
      </div>

      {/* 3D astronaut mascot */}
      <div
        className="relative z-20 my-1"
        style={{
          perspective: 600,
          transform: `translate(${ptr.x * 28}px, ${ptr.y * 16}px)`,
          transition: reduced ? undefined : 'transform 140ms ease-out',
        }}
      >
        <motion.div
          className="relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={
            reduced
              ? { rotateY: -8, rotateX: 6 }
              : {
                  y: [0, -10, 0],
                  rotateY: [-12 + ptr.x * 10, -6 + ptr.x * 10, -12 + ptr.x * 10],
                  rotateX: [8 + ptr.y * 6, 4 + ptr.y * 6, 8 + ptr.y * 6],
                }
          }
          transition={reduced ? undefined : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* soft ground shadow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[92%] h-3 w-16 -translate-x-1/2 rounded-full bg-black/50 blur-md"
            style={{
              transform: 'translateX(-50%) translateZ(-20px) rotateX(70deg)',
              opacity: 0.55,
            }}
          />

          {/* body */}
          <div
            className="relative h-[72px] w-[56px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* helmet */}
            <div
              className="absolute left-1/2 top-0 h-11 w-11 -translate-x-1/2 rounded-full"
              style={{
                background: 'linear-gradient(145deg, #e8e4f0 0%, #9a86b8 45%, #4c3d66 100%)',
                boxShadow: 'inset -4px -6px 12px rgba(0,0,0,0.35), inset 3px 3px 8px rgba(255,255,255,0.45), 0 8px 18px rgba(0,0,0,0.35)',
                transform: 'translateZ(10px)',
              }}
            >
              {/* visor */}
              <div
                className="absolute left-1/2 top-[28%] h-[18px] w-[28px] -translate-x-1/2 overflow-hidden rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #1e1b4b 55%, #f97316 120%)',
                  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5)',
                }}
              >
                {/* eyes */}
                <div className="absolute inset-0 flex items-center justify-center gap-2">
                  <span
                    className="rounded-full bg-white"
                    style={{
                      width: 4,
                      height: blink ? 1 : 4,
                      boxShadow: '0 0 4px white',
                      transition: 'height 80ms',
                    }}
                  />
                  <span
                    className="rounded-full bg-white"
                    style={{
                      width: 4,
                      height: blink ? 1 : 4,
                      boxShadow: '0 0 4px white',
                      transition: 'height 80ms',
                    }}
                  />
                </div>
                <div
                  aria-hidden
                  className="absolute -left-1 top-0 h-full w-3 bg-gradient-to-r from-white/40 to-transparent"
                />
              </div>
            </div>

            {/* torso */}
            <div
              className="absolute left-1/2 top-[38px] h-8 w-9 -translate-x-1/2 rounded-xl"
              style={{
                background: 'linear-gradient(180deg, #f4f0fa 0%, #d4cbe5 40%, #7d6899 100%)',
                boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.5), 0 6px 12px rgba(0,0,0,0.3)',
                transform: 'translateZ(6px)',
              }}
            >
              <div className="absolute left-1/2 top-1.5 h-2 w-2.5 -translate-x-1/2 rounded-sm bg-framekit-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            </div>

            {/* arms */}
            <div
              className="absolute left-0 top-[42px] h-2.5 w-3.5 rounded-full bg-signal-300"
              style={{ transform: 'translateZ(4px) rotate(-18deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.25)' }}
            />
            <div
              className="absolute right-0 top-[42px] h-2.5 w-3.5 rounded-full bg-signal-300"
              style={{ transform: 'translateZ(4px) rotate(18deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.25)' }}
            />

            {/* pack */}
            <div
              className="absolute left-1/2 top-[40px] h-7 w-5 -translate-x-1/2 rounded-md"
              style={{
                background: 'linear-gradient(90deg, #3f3f46, #27272a)',
                transform: 'translateZ(-8px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* copy + CTA */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <p className="font-display text-[11px] uppercase tracking-[0.28em] text-signal-300/80">
          Signal lost
        </p>
        <p className="max-w-xs text-sm text-zinc-400">
          This constellation wandered off the map. Your astronaut is still looking for home.
        </p>
        <button
          type="button"
          onClick={onHome}
          className="group relative mt-1 overflow-hidden rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/85 backdrop-blur transition hover:border-framekit-400/50 hover:bg-framekit-500/15 hover:text-white"
        >
          <span className="relative z-10">Take me home</span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-500 group-hover:translate-x-full"
          />
        </button>
      </div>

      <style>{`
        @keyframes fk-star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
      `}</style>
    </div>
  )
}
