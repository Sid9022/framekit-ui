import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RefreshCw } from 'lucide-react'

/** Tech/AI 404 — glowing mesh-grid sphere with bloom, pulse, waveform equator. */
export function MeshOrb404({
  className,
  onReload,
}: {
  className?: string
  onReload?: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const [level, setLevel] = React.useState(0.4)
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 })
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setLevel(0.25 + Math.random() * 0.7)
    }, 160)
    return () => clearInterval(id)
  }, [reduced])

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || reduced) return
    const r = el.getBoundingClientRect()
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    })
  }

  const wavePoints = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 47) * Math.PI * 2
    const amp = 6 + level * 14
    const r = 78 + Math.sin(a * 6 + level * 10) * amp * 0.35
    return `${160 + Math.cos(a) * r},${160 + Math.sin(a) * 18 + Math.sin(a * 3 + level * 8) * amp * 0.15}`
  }).join(' ')

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className={cn(
        'relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-violet-950/60 bg-[#07060f] px-6 py-8 shadow-[0_30px_80px_-36px_rgba(168,85,247,0.45)]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(99,102,241,0.22), transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(236,72,153,0.12), transparent 45%), radial-gradient(ellipse at 30% 40%, rgba(249,115,22,0.1), transparent 40%)',
        }}
      />

      <div
        className="relative mb-6 h-[220px] w-[220px]"
        style={{
          perspective: 800,
          transform: `rotateY(${tilt.x * 12}deg) rotateX(${-tilt.y * 10}deg)`,
          transition: reduced ? undefined : 'transform 160ms ease-out',
        }}
      >
        {/* bloom */}
        <motion.div
          aria-hidden
          className="absolute inset-[-20%] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.45) 0%, rgba(236,72,153,0.2) 35%, transparent 65%)',
            filter: 'blur(18px)',
          }}
          animate={reduced ? undefined : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.06 + level * 0.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* sphere body */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.35), transparent 28%), radial-gradient(circle at 50% 50%, #4c1d95 0%, #1e1b4b 45%, #0c0a1a 100%)',
            boxShadow:
              'inset -20px -30px 50px rgba(0,0,0,0.55), inset 12px 14px 30px rgba(167,139,250,0.25), 0 0 60px rgba(139,92,246,0.35)',
          }}
          animate={reduced ? undefined : { scale: [1, 1 + level * 0.04, 1] }}
          transition={{ duration: 0.35 }}
        />

        {/* rotating SVG mesh */}
        <motion.svg
          viewBox="0 0 320 320"
          className="absolute inset-0 h-full w-full"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          <defs>
            <radialGradient id="fk-mesh-fade" cx="50%" cy="50%" r="50%">
              <stop offset="55%" stopColor="white" stopOpacity="0.55" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <clipPath id="fk-mesh-clip">
              <circle cx="160" cy="160" r="150" />
            </clipPath>
          </defs>
          <g clipPath="url(#fk-mesh-clip)" opacity="0.7" stroke="url(#fk-mesh-fade)" fill="none" strokeWidth="0.8">
            {Array.from({ length: 10 }, (_, i) => {
              const y = 20 + i * 28
              const bulge = Math.sin((i / 9) * Math.PI) * 40
              return (
                <ellipse key={`h${i}`} cx="160" cy={y + 20} rx={140 - Math.abs(5 - i) * 10} ry={10 + bulge * 0.08} stroke="rgba(196,181,253,0.45)" />
              )
            })}
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI
              return (
                <ellipse
                  key={`v${i}`}
                  cx="160"
                  cy="160"
                  rx={20 + Math.sin(a) * 120}
                  ry="148"
                  transform={`rotate(${(i * 180) / 12} 160 160)`}
                  stroke="rgba(244,114,182,0.35)"
                />
              )
            })}
          </g>
        </motion.svg>

        {/* equatorial waveform */}
        <svg viewBox="0 0 320 320" className="pointer-events-none absolute inset-0 h-full w-full">
          <polyline
            points={wavePoints}
            fill="none"
            stroke="rgba(251,146,60,0.85)"
            strokeWidth="2"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.7))' }}
          />
        </svg>

        {/* conic highlight */}
        <motion.div
          aria-hidden
          className="absolute inset-[8%] rounded-full opacity-40 mix-blend-screen"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(167,139,250,0.5), transparent 40%, rgba(236,72,153,0.4), transparent 70%, rgba(249,115,22,0.35), transparent)',
          }}
          animate={reduced ? undefined : { rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">404 Not Found</h1>
        <p className="text-sm text-zinc-400">Something went wrong</p>
        <button
          type="button"
          onClick={onReload ?? (() => window.location.reload())}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-5 py-2.5 text-sm font-medium text-violet-100 backdrop-blur transition hover:bg-violet-500/25"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reload
        </button>
      </div>
    </div>
  )
}
