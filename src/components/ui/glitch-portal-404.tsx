import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** 3D faceted buddy stuck in a chromatic portal — RGB split, scanlines, rim glow. */
export function GlitchPortal404({
  className,
  onHome,
}: {
  className?: string
  onHome?: () => void
}) {
  const reduced = usePrefersReducedMotion()
  const [kick, setKick] = React.useState(0)
  const [blink, setBlink] = React.useState(false)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setKick((k) => k + 1), 1400)
    return () => clearInterval(id)
  }, [reduced])

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      setBlink(true)
      window.setTimeout(() => setBlink(false), 100)
    }, 2600)
    return () => clearInterval(id)
  }, [reduced])

  const jitter = reduced ? 0 : kick % 2 === 0 ? 4 : -3
  const slice = reduced ? 0 : (kick % 3) - 1

  return (
    <div
      className={cn(
        'relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#050508]',
        className,
      )}
    >
      {/* void + nebula */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(34,211,238,0.12), transparent 45%), radial-gradient(ellipse at 70% 20%, rgba(244,63,94,0.1), transparent 40%), radial-gradient(ellipse at 25% 75%, rgba(154,134,184,0.14), transparent 45%)',
        }}
      />

      {/* portal rings */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 90 + i * 36,
              height: 90 + i * 36,
              border: `${1.5 - i * 0.2}px solid`,
              borderColor:
                i % 2 === 0
                  ? 'rgba(34,211,238,0.45)'
                  : 'rgba(244,63,94,0.35)',
              boxShadow:
                i === 0
                  ? '0 0 40px rgba(34,211,238,0.35), inset 0 0 30px rgba(249,115,22,0.15)'
                  : undefined,
            }}
            animate={
              reduced
                ? { opacity: 0.35 }
                : {
                    scale: [0.92, 1.05, 0.92],
                    opacity: [0.55 - i * 0.08, 0.25, 0.55 - i * 0.08],
                    rotate: i % 2 === 0 ? [0, 20, 0] : [0, -15, 0],
                  }
            }
            transition={{ duration: 3.2 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* portal core */}
        <div
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(34,211,238,0.25) 30%, rgba(249,115,22,0.15) 55%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />
      </div>

      {/* glitch buddy — low poly / faceted */}
      <div
        className="relative z-20 mb-2"
        style={{ perspective: 700, marginTop: 8 }}
      >
        <motion.div
          style={{ transformStyle: 'preserve-3d' }}
          animate={
            reduced
              ? { rotateY: 10 }
              : {
                  y: [0, -8, 0],
                  rotateY: [12, -10, 12],
                  rotateX: [6, 10, 6],
                }
          }
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* shadow in portal */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[88%] h-4 w-20 -translate-x-1/2 rounded-full bg-cyan-400/30 blur-md"
          />

          {/* RGB ghost copies */}
          {!reduced && (
            <>
              <div
                aria-hidden
                className="absolute inset-0 opacity-50"
                style={{
                  transform: `translate(${jitter}px, ${slice}px) translateZ(-4px)`,
                  filter: 'hue-rotate(160deg) saturate(2)',
                  mixBlendMode: 'screen',
                }}
              >
                <FacetBuddy blink={false} ghost />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 opacity-45"
                style={{
                  transform: `translate(${-jitter}px, ${-slice}px) translateZ(-2px)`,
                  filter: 'hue-rotate(-40deg) saturate(2)',
                  mixBlendMode: 'screen',
                }}
              >
                <FacetBuddy blink={false} ghost />
              </div>
            </>
          )}

          <div style={{ transform: 'translateZ(12px)' }}>
            <FacetBuddy blink={blink} />
          </div>

          {/* legs stuck in portal — clipped */}
          <div
            className="relative mx-auto -mt-1 h-8 w-16 overflow-hidden"
            style={{ transform: 'translateZ(4px)' }}
          >
            <div className="absolute left-2 top-0 h-10 w-4 rotate-[-8deg] rounded-b-md bg-gradient-to-b from-signal-400 to-signal-700" />
            <div className="absolute right-2 top-0 h-10 w-4 rotate-[8deg] rounded-b-md bg-gradient-to-b from-signal-300 to-signal-600" />
            <div
              className="absolute inset-x-0 bottom-0 h-4"
              style={{
                background: 'linear-gradient(to bottom, transparent, #050508)',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* glitch 404 type */}
      <div className="relative z-20 mt-2">
        <span
          aria-hidden
          className="absolute inset-0 select-none text-7xl font-black tracking-tighter text-cyan-400/80"
          style={{
            transform: `translate(${jitter}px, -1px)`,
            mixBlendMode: 'screen',
            clipPath: kick % 2 === 0 ? 'inset(0 0 55% 0)' : 'inset(40% 0 0 0)',
          }}
        >
          404
        </span>
        <span
          aria-hidden
          className="absolute inset-0 select-none text-7xl font-black tracking-tighter text-rose-500/75"
          style={{
            transform: `translate(${-jitter}px, 1px)`,
            mixBlendMode: 'screen',
            clipPath: kick % 2 === 0 ? 'inset(45% 0 0 0)' : 'inset(0 0 40% 0)',
          }}
        >
          404
        </span>
        <p className="relative text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]">
          404
        </p>
      </div>

      <p className="relative z-20 mt-3 max-w-xs text-center text-sm text-zinc-400">
        Portal signal scrambled — buddy is stuck halfway between frames.
      </p>
      <button
        type="button"
        onClick={onHome}
        className="group relative z-20 mt-4 overflow-hidden rounded-full border border-cyan-400/40 bg-cyan-400/5 px-6 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-framekit-400/60 hover:bg-framekit-500/15 hover:text-white"
      >
        <span className="relative z-10">Take me home</span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-cyan-400/20 to-transparent transition duration-300 group-hover:translate-y-0"
        />
      </button>

      {/* scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.14]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-30 h-12 bg-gradient-to-b from-transparent via-cyan-300/15 to-transparent"
          style={{ animation: 'fk-glitch-scan 2.6s linear infinite' }}
        />
      )}
      <style>{`@keyframes fk-glitch-scan{0%{top:-12%}100%{top:112%}}`}</style>
    </div>
  )
}

function FacetBuddy({ blink, ghost }: { blink: boolean; ghost?: boolean }) {
  return (
    <div
      className="relative mx-auto h-[78px] w-[64px]"
      style={{ transformStyle: 'preserve-3d', opacity: ghost ? 0.85 : 1 }}
    >
      {/* head — faceted diamond-ish */}
      <div
        className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2"
        style={{
          background: 'linear-gradient(145deg, #f0ebf8 0%, #9a86b8 40%, #4c3d66 100%)',
          clipPath: 'polygon(50% 0%, 95% 28%, 80% 95%, 20% 95%, 5% 28%)',
          boxShadow: ghost ? undefined : '0 8px 20px rgba(0,0,0,0.45)',
          transform: 'translateZ(10px)',
        }}
      >
        {/* eyes */}
        <div className="absolute left-1/2 top-[38%] flex -translate-x-1/2 gap-2.5">
          <span
            className="block rounded-[1px] bg-cyan-300"
            style={{
              width: 5,
              height: blink ? 1 : 5,
              boxShadow: '0 0 6px rgba(34,211,238,0.9)',
              transition: 'height 60ms',
            }}
          />
          <span
            className="block rounded-[1px] bg-rose-400"
            style={{
              width: 5,
              height: blink ? 1 : 5,
              boxShadow: '0 0 6px rgba(244,63,94,0.9)',
              transition: 'height 60ms',
            }}
          />
        </div>
        {/* facet highlight */}
        <div
          aria-hidden
          className="absolute left-[18%] top-[12%] h-4 w-2 bg-white/40"
          style={{ clipPath: 'polygon(0 0, 100% 20%, 40% 100%, 0 70%)' }}
        />
      </div>

      {/* torso facets */}
      <div
        className="absolute left-1/2 top-[42px] h-9 w-11 -translate-x-1/2"
        style={{
          background: 'linear-gradient(180deg, #d4cbe5 0%, #7d6899 50%, #3b2f4d 100%)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          transform: 'translateZ(6px)',
          boxShadow: ghost ? undefined : '0 6px 14px rgba(0,0,0,0.35)',
        }}
      >
        <div className="absolute left-1/2 top-2 h-2 w-3 -translate-x-1/2 bg-framekit-500/90 shadow-[0_0_10px_rgba(249,115,22,0.7)]"
          style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
        />
      </div>

      {/* arms */}
      <div
        className="absolute left-[-2px] top-[48px] h-2.5 w-5 bg-signal-400"
        style={{
          clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 10% 100%)',
          transform: 'translateZ(4px) rotate(-20deg)',
        }}
      />
      <div
        className="absolute right-[-2px] top-[48px] h-2.5 w-5 bg-signal-300"
        style={{
          clipPath: 'polygon(0 0%, 100% 40%, 90% 100%, 0% 100%)',
          transform: 'translateZ(4px) rotate(20deg)',
        }}
      />
    </div>
  )
}
