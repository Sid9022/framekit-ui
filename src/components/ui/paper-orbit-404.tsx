import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const STARS = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  x: (i * 41) % 100,
  y: (i * 67) % 100,
  s: 1 + (i % 3),
  o: 0.2 + (i % 5) * 0.12,
}))

/** Layered paper-cut space 404 — orbital rings, cratered moons, astronaut, terracotta CTA. */
export function PaperOrbit404({
  className,
  onHome,
}: {
  className?: string
  onHome?: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [ptr, setPtr] = React.useState({ x: 0, y: 0 })
  const [blink, setBlink] = React.useState(false)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setBlink(true)
      window.setTimeout(() => setBlink(false), 120)
    }, 2800 + Math.random() * 1600)
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

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPtr({ x: 0, y: 0 })}
      className={cn(
        'relative flex min-h-[400px] flex-col items-center justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0a1220] px-5 pb-7 pt-6 shadow-[0_30px_80px_-40px_rgba(196,92,62,0.4)]',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(30,58,95,0.55), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(15,30,50,0.8), transparent 50%)',
          transform: `translate(${ptr.x * 5}px, ${ptr.y * 3}px)`,
          transition: reduced ? undefined : 'transform 180ms ease-out',
        }}
      />

      {/* concentric orbital rings (left) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2"
        style={{
          transform: `translate(${ptr.x * 10}px, calc(-50% + ${ptr.y * 6}px))`,
          transition: reduced ? undefined : 'transform 200ms ease-out',
        }}
      >
        {[1, 0.82, 0.64, 0.46, 0.3].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-slate-600/40"
            style={{
              transform: `scale(${scale})`,
              boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.5), 0 8px 24px rgba(0,0,0,0.35)',
              background: i === 4 ? 'radial-gradient(circle, #0f1a2e 40%, transparent 70%)' : undefined,
            }}
            animate={reduced ? undefined : { rotate: i % 2 === 0 ? 360 : -360 }}
            transition={reduced ? undefined : { duration: 40 + i * 12, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* stars */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          transform: `translate(${ptr.x * 14}px, ${ptr.y * 9}px)`,
          transition: reduced ? undefined : 'transform 220ms ease-out',
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
              animation: reduced ? undefined : `fk-po-twinkle ${2.2 + (s.id % 5) * 0.35}s ease-in-out infinite`,
              animationDelay: `${(s.id % 7) * 0.18}s`,
            }}
          />
        ))}
      </div>

      {/* top cratered moon */}
      <div
        aria-hidden
        className="absolute -right-6 -top-8 h-36 w-36 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #2a4060, #152238 70%, #0a1524)',
          boxShadow: '0 18px 40px rgba(0,0,0,0.55), inset -8px -12px 20px rgba(0,0,0,0.4)',
          transform: `translate(${ptr.x * -8}px, ${ptr.y * -5}px)`,
          transition: reduced ? undefined : 'transform 180ms ease-out',
        }}
      >
        {[[28, 32, 14], [55, 48, 10], [40, 62, 8], [68, 28, 7]].map(([l, t, s], i) => (
          <span
            key={i}
            className="absolute rounded-full bg-slate-900/50"
            style={{ left: `${l}%`, top: `${t}%`, width: s, height: s, boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>

      {/* bottom cratered moon */}
      <div
        aria-hidden
        className="absolute -bottom-10 -right-4 h-40 w-40 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 35%, #243a58, #101c30 70%, #080f1a)',
          boxShadow: '0 20px 44px rgba(0,0,0,0.55), inset -10px -14px 22px rgba(0,0,0,0.45)',
          transform: `translate(${ptr.x * -10}px, ${ptr.y * -6}px)`,
          transition: reduced ? undefined : 'transform 200ms ease-out',
        }}
      >
        {[[22, 40, 16], [50, 55, 12], [65, 30, 9]].map(([l, t, s], i) => (
          <span key={i} className="absolute rounded-full bg-slate-950/55" style={{ left: `${l}%`, top: `${t}%`, width: s, height: s }} />
        ))}
      </div>

      {/* ringed planet bottom-left */}
      <div
        aria-hidden
        className="absolute bottom-16 left-8"
        style={{
          transform: `translate(${ptr.x * 12}px, ${ptr.y * 8}px)`,
          transition: reduced ? undefined : 'transform 160ms ease-out',
        }}
      >
        <div className="relative h-10 w-10">
          <div
            className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #e07a55, #c45c3e 60%, #8b3a28)',
              boxShadow: '0 8px 18px rgba(0,0,0,0.4)',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-2 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c45c3e]/70"
            style={{ transform: 'translate(-50%, -50%) rotate(-18deg)', boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
          />
        </div>
      </div>

      {/* floating rockets / satellite */}
      <motion.div
        aria-hidden
        className="absolute left-10 top-14"
        animate={reduced ? undefined : { y: [0, -8, 0], x: [0, 3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transform: `translate(${ptr.x * 16}px, ${ptr.y * 10}px)` }}
      >
        <svg width="28" height="40" viewBox="0 0 28 40" className="drop-shadow-[0_8px_12px_rgba(0,0,0,0.45)]">
          <path d="M14 2 L22 22 L14 18 L6 22 Z" fill="#9aa3b5" />
          <path d="M14 18 L18 34 L14 30 L10 34 Z" fill="#c45c3e" />
          <circle cx="14" cy="12" r="3" fill="#5b7ea6" />
        </svg>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute right-24 top-24"
        animate={reduced ? undefined : { x: [0, 10, 0], y: [0, -4, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="56" height="24" viewBox="0 0 56 24" className="drop-shadow-[0_10px_14px_rgba(0,0,0,0.5)]">
          <ellipse cx="28" cy="12" rx="22" ry="8" fill="#8b95a8" />
          <rect x="8" y="8" width="14" height="8" rx="2" fill="#6b7488" />
          <circle cx="40" cy="12" r="4" fill="#4a6d92" />
          <path d="M50 12 L56 8 L56 16 Z" fill="#c45c3e" />
        </svg>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute left-1/2 top-8"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{ marginLeft: 40 }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" className="drop-shadow-[0_6px_10px_rgba(0,0,0,0.4)]">
          <rect x="8" y="8" width="6" height="6" rx="1" fill="#a0aaba" />
          <rect x="1" y="10" width="20" height="2" rx="1" fill="#7a8498" />
          <rect x="10" y="1" width="2" height="20" rx="1" fill="#7a8498" />
        </svg>
      </motion.div>

      {/* paper clouds */}
      {[
        { left: '18%', top: '38%', w: 72 },
        { left: '62%', top: '55%', w: 90 },
        { left: '40%', top: '72%', w: 60 },
      ].map((c, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute h-3 rounded-full bg-slate-600/50"
          style={{
            left: c.left,
            top: c.top,
            width: c.w,
            boxShadow: '0 6px 12px rgba(0,0,0,0.35)',
            transform: `translate(${ptr.x * (8 + i * 3)}px, ${ptr.y * (5 + i * 2)}px)`,
            transition: reduced ? undefined : 'transform 190ms ease-out',
          }}
        />
      ))}

      {/* astronaut + cup */}
      <div
        className="absolute left-[18%] top-[42%] z-20"
        style={{
          transform: `translate(${ptr.x * 22}px, ${ptr.y * 14}px)`,
          transition: reduced ? undefined : 'transform 140ms ease-out',
        }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -9, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <svg width="64" height="78" viewBox="0 0 64 78" className="drop-shadow-[0_14px_20px_rgba(0,0,0,0.5)]">
            <ellipse cx="32" cy="72" rx="16" ry="3" fill="rgba(0,0,0,0.35)" />
            <rect x="22" y="34" width="20" height="24" rx="8" fill="#e8eef6" />
            <circle cx="32" cy="24" r="14" fill="#f0f4fa" />
            <ellipse cx="32" cy="24" rx="9" ry="7" fill="#1a2740" />
            <circle cx="28" cy="24" r={blink ? 0.6 : 2.2} fill="#fff" />
            <circle cx="36" cy="24" r={blink ? 0.6 : 2.2} fill="#fff" />
            <rect x="14" y="38" width="10" height="6" rx="3" fill="#d4dde8" transform="rotate(-25 19 41)" />
            <rect x="40" y="36" width="12" height="6" rx="3" fill="#d4dde8" transform="rotate(35 46 39)" />
            <path d="M48 34 L56 28 L54 36 L58 38 L50 40 Z" fill="#e8eef6" />
            <rect x="26" y="56" width="6" height="12" rx="3" fill="#d4dde8" />
            <rect x="34" y="56" width="6" height="12" rx="3" fill="#d4dde8" />
            <rect x="40" y="40" width="8" height="12" rx="2" fill="#3a4558" />
          </svg>
          <motion.div
            className="absolute -right-3 top-8"
            animate={reduced ? undefined : { y: [0, -6, 0], rotate: [8, -6, 8] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="18" height="22" viewBox="0 0 18 22">
              <rect x="4" y="6" width="10" height="12" rx="2" fill="#c45c3e" />
              <rect x="6" y="2" width="2" height="6" rx="1" fill="#8b95a8" />
              <ellipse cx="9" cy="10" rx="3" ry="2" fill="#e07a55" opacity="0.5" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* copy */}
      <div
        className="relative z-10 mt-10 flex flex-col items-center gap-2 text-center"
        style={{
          transform: `translate(${ptr.x * 6}px, ${ptr.y * 4}px)`,
          transition: reduced ? undefined : 'transform 160ms ease-out',
        }}
      >
        <h1 className="font-display text-7xl font-bold tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] md:text-8xl">
          404
        </h1>
        <p className="text-sm text-slate-300/90">It looks like you&apos;re lost...</p>
        <button
          type="button"
          onClick={onHome}
          className="mt-4 rounded-full px-7 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_28px_-8px_rgba(196,92,62,0.75)] transition hover:brightness-110"
          style={{ background: 'linear-gradient(180deg, #e07a55, #c45c3e)' }}
        >
          Go Back Home
        </button>
      </div>

      <div className="relative z-10 h-4" />

      <style>{`
        @keyframes fk-po-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.95; }
        }
      `}</style>
    </div>
  )
}
