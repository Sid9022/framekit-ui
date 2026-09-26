import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const STARS = Array.from({ length: 56 }, (_, i) => ({
  id: i,
  x: (i * 47) % 100,
  y: (i * 59) % 100,
  s: 1 + (i % 3),
  o: 0.18 + (i % 6) * 0.1,
}))

const BG_PLANETS = [
  { x: 12, y: 18, r: 10, c: '#4a1f1a' },
  { x: 88, y: 22, r: 7, c: '#3a1814' },
  { x: 78, y: 78, r: 14, c: '#2e1410' },
  { x: 8, y: 70, r: 6, c: '#3f1c16' },
]

/** Mars-as-0 404 — astronaut perched on planet, tethered rocket, dual ghost CTAs. */
export function MarsTether404({
  className,
  onHome,
  onBack,
}: {
  className?: string
  onHome?: () => void
  onBack?: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [ptr, setPtr] = React.useState({ x: 0, y: 0 })
  const [wave, setWave] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    let raf = 0
    let t0 = performance.now()
    const tick = (now: number) => {
      setWave(((now - t0) / 1000) % 100)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
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

  const tetherD = (() => {
    const ax = 210
    const ay = 95
    const rx = 290 + Math.sin(wave * 1.2) * 4
    const ry = 28 + Math.cos(wave * 0.9) * 3
    const c1x = 230 + Math.sin(wave * 1.4) * 10
    const c1y = 60 + Math.cos(wave) * 8
    const c2x = 270 + Math.cos(wave * 1.1) * 8
    const c2y = 40 + Math.sin(wave * 0.8) * 6
    return `M ${ax} ${ay} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${rx} ${ry}`
  })()

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPtr({ x: 0, y: 0 })}
      className={cn(
        'relative flex min-h-[400px] flex-col items-center justify-end overflow-hidden rounded-2xl border border-zinc-900 bg-[#06070c] px-5 pb-8 pt-6 shadow-[0_30px_80px_-40px_rgba(180,60,40,0.45)]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(80,30,20,0.25), transparent 55%)',
          transform: `translate(${ptr.x * 4}px, ${ptr.y * 3}px)`,
          transition: reduced ? undefined : 'transform 180ms ease-out',
        }}
      />

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
              animation: reduced ? undefined : `fk-mt-twinkle ${2 + (s.id % 4) * 0.4}s ease-in-out infinite`,
              animationDelay: `${(s.id % 6) * 0.2}s`,
            }}
          />
        ))}
      </div>

      {BG_PLANETS.map((p, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.r * 2,
            height: p.r * 2,
            background: `radial-gradient(circle at 35% 30%, ${p.c}, #120808)`,
            boxShadow: 'inset -3px -4px 8px rgba(0,0,0,0.5)',
            transform: `translate(${ptr.x * (4 + i)}px, ${ptr.y * (3 + i)}px)`,
          }}
          animate={reduced ? undefined : { y: [0, i % 2 ? 6 : -5, 0] }}
          transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* 4 · Mars · 4 */}
      <div
        className="relative z-10 mb-2 flex items-end justify-center gap-1"
        style={{
          transform: `translate(${ptr.x * 10}px, ${ptr.y * 6}px)`,
          transition: reduced ? undefined : 'transform 150ms ease-out',
        }}
      >
        <span className="select-none font-display text-[110px] font-bold leading-none text-zinc-600/90 md:text-[128px]">4</span>

        <div className="relative mb-3 h-[120px] w-[120px] md:h-[132px] md:w-[132px]">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 32% 28%, #c45a3a 0%, #8b2e1c 40%, #4a1510 78%, #2a0c08 100%)',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.55), inset -12px -16px 28px rgba(0,0,0,0.45), inset 6px 8px 16px rgba(255,140,100,0.15)',
            }}
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          >
            {[[22, 30, 14], [55, 48, 10], [38, 62, 8], [68, 28, 12], [45, 22, 6], [20, 55, 9]].map(
              ([l, t, s], i) => (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${l}%`,
                    top: `${t}%`,
                    width: s,
                    height: s,
                    background: 'rgba(40,12,8,0.55)',
                    boxShadow: 'inset 1px 1px 2px rgba(255,180,140,0.12)',
                  }}
                />
              ),
            )}
          </motion.div>

          {/* astronaut */}
          <motion.div
            className="absolute left-1/2 top-[-28px] z-20 -translate-x-1/2"
            animate={reduced ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="44" height="52" viewBox="0 0 44 52" className="drop-shadow-[0_8px_14px_rgba(0,0,0,0.5)]">
              <circle cx="22" cy="14" r="11" fill="#f4f6fa" />
              <ellipse cx="22" cy="14" rx="7" ry="5.5" fill="#1e3a5f" />
              <circle cx="19.5" cy="14" r="1.6" fill="#fff" />
              <circle cx="24.5" cy="14" r="1.6" fill="#fff" />
              <rect x="14" y="24" width="16" height="18" rx="6" fill="#e85d2a" />
              <rect x="18" y="28" width="8" height="6" rx="2" fill="#2a3548" />
              <rect x="6" y="26" width="10" height="5" rx="2.5" fill="#d44e22" transform="rotate(-20 11 28)" />
              <rect x="28" y="26" width="10" height="5" rx="2.5" fill="#d44e22" transform="rotate(20 33 28)" />
              <rect x="16" y="40" width="5" height="10" rx="2" fill="#c44820" />
              <rect x="23" y="40" width="5" height="10" rx="2" fill="#c44820" />
            </svg>
          </motion.div>

          {/* tether + rocket overlay in parent SVG */}
          <svg
            className="pointer-events-none absolute -right-24 -top-16 h-40 w-48 overflow-visible"
            viewBox="180 0 160 140"
          >
            <path
              d={tetherD}
              fill="none"
              stroke="rgba(226,232,240,0.75)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <g transform={`translate(${290 + Math.sin(wave * 1.2) * 4}, ${28 + Math.cos(wave * 0.9) * 3}) rotate(${12 + Math.sin(wave) * 4})`}>
              <path d="M0 0 L8 -4 L18 0 L8 4 Z" fill="#c8d0dc" />
              <rect x="8" y="-3" width="10" height="6" rx="1" fill="#2a2f3a" />
              <motion.path
                d="M18 -2 L26 0 L18 2"
                fill="#f97316"
                style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }}
                animate={
                  reduced
                    ? undefined
                    : {
                        scaleX: [1, 1.5, 0.75, 1],
                        scaleY: [1, 1.25, 0.75, 1],
                        opacity: [0.85, 1, 0.7, 0.9],
                      }
                }
                transition={{ duration: 0.35, repeat: Infinity }}
              />
            </g>
          </svg>
        </div>

        <span className="select-none font-display text-[110px] font-bold leading-none text-zinc-600/90 md:text-[128px]">4</span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <h2 className="text-3xl font-bold tracking-wide text-white md:text-4xl">OOPS!</h2>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-400">Page not found</p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onHome}
            className="rounded-full border border-white/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 transition hover:border-white/70 hover:bg-white/5"
          >
            Go Home
          </button>
          <button
            type="button"
            onClick={onBack ?? onHome}
            className="rounded-full border border-white/35 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 transition hover:border-white/70 hover:bg-white/5"
          >
            Go Back
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fk-mt-twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
