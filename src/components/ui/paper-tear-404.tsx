import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const SCRAPS = [
  { x: -92, y: -48, r: -22, w: 34, h: 22, z: 40 },
  { x: 78, y: -62, r: 16, w: 28, h: 18, z: 55 },
  { x: -108, y: 52, r: 28, w: 22, h: 26, z: 30 },
  { x: 98, y: 58, r: -12, w: 30, h: 16, z: 45 },
  { x: 12, y: -88, r: 34, w: 20, h: 20, z: 60 },
  { x: -40, y: 86, r: -6, w: 26, h: 14, z: 25 },
  { x: 55, y: 90, r: 20, w: 18, h: 22, z: 35 },
]

/** 3D folded paper character peeking through a torn hole; scraps with perspective. */
export function PaperTear404({
  className,
  onHome,
}: {
  className?: string
  onHome?: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const [blink, setBlink] = React.useState(false)
  const [look, setLook] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setBlink(true)
      window.setTimeout(() => setBlink(false), 120)
    }, 2800)
    return () => clearInterval(id)
  }, [reduced])

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setLook({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 4,
      })
    }, 2200)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div
      className={cn(
        'relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-amber-900/10 bg-[#e8e2d4] dark:border-zinc-800 dark:bg-[#1a1714]',
        className,
      )}
    >
      {/* paper grain / corkboard feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.45\'/%3E%3C/svg%3E")',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14),transparent_58%)]"
      />

      {/* floating scraps with 3D tilt */}
      {SCRAPS.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-[2px] border border-black/5 bg-[#f7f1e4] shadow-md dark:border-white/5 dark:bg-zinc-700"
          style={{
            width: s.w,
            height: s.h,
            left: `calc(50% + ${s.x}px)`,
            top: `calc(50% + ${s.y}px)`,
            transformStyle: 'preserve-3d',
            zIndex: 1,
            backgroundImage:
              'linear-gradient(135deg, rgba(255,255,255,0.55), transparent 40%), repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(0,0,0,0.03) 6px, rgba(0,0,0,0.03) 7px)',
          }}
          animate={
            reduced
              ? { rotate: s.r, rotateX: 18, rotateY: -12 }
              : {
                  y: [0, -10 - (i % 3) * 3, 0],
                  x: [0, i % 2 === 0 ? 7 : -7, 0],
                  rotate: [s.r, s.r + 10, s.r],
                  rotateX: [18, 28, 18],
                  rotateY: [-14, -6, -14],
                  z: [s.z, s.z + 20, s.z],
                }
          }
          transition={{ duration: 3.2 + i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* torn page with hole */}
      <motion.div
        className="relative z-10 w-[min(100%,320px)] overflow-hidden bg-[#faf6ec] shadow-[0_28px_60px_-28px_rgba(0,0,0,0.45)] dark:bg-[#2a2620]"
        style={{
          clipPath:
            'polygon(0% 5%, 7% 0%, 16% 6%, 27% 1%, 38% 7%, 50% 0%, 62% 6%, 74% 1%, 86% 7%, 100% 2%, 100% 95%, 92% 100%, 80% 94%, 68% 100%, 56% 93%, 44% 100%, 32% 94%, 20% 100%, 8% 95%, 0% 100%)',
          transformStyle: 'preserve-3d',
          perspective: 800,
        }}
        initial={reduced ? false : { y: 28, opacity: 0, rotateX: 12, rotateZ: -2 }}
        animate={{ y: 0, opacity: 1, rotateX: 0, rotateZ: 0 }}
        transition={{ type: 'spring', stiffness: 110, damping: 14 }}
      >
        {/* page lift / fold edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-1 top-6 h-24 w-10 origin-left rounded-sm bg-[#f0e8d4] shadow-lg dark:bg-[#353028]"
          style={{
            transform: 'rotateY(-28deg) translateZ(4px)',
            backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.08), transparent)',
          }}
        />

        <div className="relative px-8 pb-8 pt-10 text-center">
          {/* torn hole */}
          <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full drop-shadow-lg">
              <defs>
                <filter id="fk-tear-shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.25" />
                </filter>
              </defs>
              <path
                d="M18 48 C22 22, 48 12, 62 20 C78 8, 98 22, 102 42 C112 52, 108 78, 92 88 C78 104, 48 102, 34 90 C16 84, 12 62, 18 48 Z"
                fill="#1c1917"
                filter="url(#fk-tear-shadow)"
                className="dark:fill-[#0c0b0a]"
              />
              <path
                d="M22 50 C26 28, 50 18, 62 26 C76 16, 94 28, 96 44 C104 54, 100 74, 88 82 C76 96, 50 94, 38 84 C22 78, 18 62, 22 50 Z"
                fill="url(#fk-hole-grad)"
                opacity="0.35"
              />
              <defs>
                <radialGradient id="fk-hole-grad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>

            {/* paper figure peeking through */}
            <div
              className="relative z-10"
              style={{ perspective: 500, marginTop: 8 }}
            >
              <motion.div
                style={{ transformStyle: 'preserve-3d' }}
                animate={
                  reduced
                    ? {}
                    : {
                        y: [4, -2, 4],
                        rotateY: [-8, 8, -8],
                      }
                }
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* origami-ish head */}
                <div
                  className="relative mx-auto h-14 w-12"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* face panel */}
                  <div
                    className="absolute inset-0 rounded-t-[40%] rounded-b-[20%]"
                    style={{
                      background: 'linear-gradient(160deg, #fffdf7 0%, #f0e6d2 55%, #d6c4a4 100%)',
                      boxShadow: 'inset -3px -4px 8px rgba(0,0,0,0.12), 2px 4px 10px rgba(0,0,0,0.2)',
                      transform: 'translateZ(8px)',
                      clipPath: 'polygon(10% 8%, 90% 8%, 100% 45%, 78% 100%, 22% 100%, 0% 45%)',
                    }}
                  >
                    {/* eyes */}
                    <div
                      className="absolute left-[28%] top-[38%] flex gap-[10px]"
                      style={{ transform: `translate(${look.x}px, ${look.y}px)` }}
                    >
                      <span
                        className="block rounded-full bg-zinc-900"
                        style={{ width: 5, height: blink ? 1.5 : 5, transition: 'height 70ms' }}
                      />
                      <span
                        className="block rounded-full bg-zinc-900"
                        style={{ width: 5, height: blink ? 1.5 : 5, transition: 'height 70ms' }}
                      />
                    </div>
                    {/* blush */}
                    <span className="absolute left-[18%] top-[52%] h-1.5 w-2 rounded-full bg-framekit-400/50" />
                    <span className="absolute right-[18%] top-[52%] h-1.5 w-2 rounded-full bg-framekit-400/50" />
                    {/* smile */}
                    <span
                      className="absolute bottom-[22%] left-1/2 h-2 w-3 -translate-x-1/2 rounded-b-full border-b-2 border-zinc-700/70"
                    />
                  </div>
                  {/* fold crease */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-1 h-10 w-px -translate-x-1/2 bg-amber-900/15"
                    style={{ transform: 'translateZ(9px)' }}
                  />
                </div>

                {/* little arms holding tear edge */}
                <div className="relative mx-auto -mt-1 flex w-16 justify-between px-0.5">
                  <span
                    className="h-2 w-4 rounded-full bg-[#efe6d2] shadow"
                    style={{ transform: 'rotate(-25deg) translateZ(6px)' }}
                  />
                  <span
                    className="h-2 w-4 rounded-full bg-[#efe6d2] shadow"
                    style={{ transform: 'rotate(25deg) translateZ(6px)' }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          <p className="font-display text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            404
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Page torn from the archive — this paper buddy saw it go.
          </p>
          <button
            type="button"
            onClick={onHome}
            className="group mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl dark:bg-framekit-500 dark:text-zinc-950"
          >
            Take me home
            <span
              aria-hidden
              className="inline-block transition group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
