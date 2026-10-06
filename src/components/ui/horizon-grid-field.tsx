import * as React from 'react'
import { motion, useInView } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type HorizonGridFieldProps = {
  /** Colour mood. `dusk` = lilac sky + warm horizon, `mono` = neutral graphite / paper. */
  palette?: 'dusk' | 'mono'
  /** Grid cell size in px. Clamped 24–120. */
  cellSize?: number
  /** Floor tilt in degrees (higher = flatter). Clamped 55–82. */
  angle?: number
  /** Seconds for the floor to travel one cell. 0 freezes it. */
  speed?: number
  /** Show the Pause / Play control (recommended; the loop runs longer than 5 s). */
  showControls?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Horizon Grid Field — a quiet perspective floor that glides toward you under a softly lit horizon. Hairline grid
 * lines fade into atmospheric haze, a low glow sits on the vanishing line and, in dark scopes, a few still stars hang
 * above. Pure CSS 3D (no WebGL); pauses offscreen and freezes under reduced motion.
 */
export function HorizonGridField({
  palette = 'dusk',
  cellSize = 56,
  angle = 74,
  speed = 1.6,
  showControls = true,
  children,
  className,
}: HorizonGridFieldProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.1 })
  const [playing, setPlaying] = React.useState(true)
  const cell = Math.min(120, Math.max(24, cellSize))
  const tilt = Math.min(82, Math.max(55, angle))
  const running = !reduced && playing && inView && speed > 0
  const dusk = palette === 'dusk'

  const stars = React.useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({ x: (i * 37.7) % 100, y: (i * 23.3) % 42, s: i % 5 === 0 ? 2 : 1, o: 0.35 + ((i * 13) % 50) / 100 })),
    [],
  )

  return (
    <div
      ref={ref}
      className={cn(
        'relative isolate flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-[28px] ring-1 ring-black/[0.06] dark:ring-white/[0.08]',
        dusk
          ? 'bg-[linear-gradient(to_bottom,#efeaf8_0%,#f6eef0_52%,#fde7d6_60%,#f7f4fb_100%)] dark:bg-[linear-gradient(to_bottom,#07060d_0%,#141026_50%,#3a1d2a_59.5%,#0a0812_100%)]'
          : 'bg-[linear-gradient(to_bottom,#fafafa_0%,#f1f1f2_56%,#e9e9eb_60%,#fafafa_100%)] dark:bg-[linear-gradient(to_bottom,#050505_0%,#0f0f11_56%,#1c1c20_59.5%,#070708_100%)]',
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 hidden h-[58%] dark:block">
          {stars.map((s, i) => (
            <span key={i} className="absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y * 2}%`, width: s.s, height: s.s, opacity: s.o * 0.7 }} />
          ))}
        </div>
        <div
          className={cn(
            'absolute left-1/2 top-[60%] h-40 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-3xl',
            dusk ? 'bg-[#ffb98a]/70 dark:bg-[#ff7a3d]/45' : 'bg-white dark:bg-white/10',
          )}
        />
        <div className={cn('absolute inset-x-0 top-[60%] h-px', dusk ? 'bg-[#f6a77a] dark:bg-[#ff9a62]/80' : 'bg-zinc-300 dark:bg-white/30')} />
        <div
          className="absolute inset-x-0 bottom-0 h-[40%] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_45%)]"
          style={{ perspective: 280, perspectiveOrigin: '50% 0%' }}
        >
          <div className="absolute bottom-0 left-[-150%] right-[-150%] h-[1400%] origin-bottom" style={{ transform: `rotateX(${tilt}deg)`, transformStyle: 'preserve-3d' }}>
            <motion.div
              className={cn(
                'absolute inset-x-0 bottom-0 top-[calc(var(--c)*-1)]',
                dusk
                  ? '[--line:rgb(125_104_153/0.5)] dark:[--line:rgb(201_180_255/0.42)]'
                  : '[--line:rgb(0_0_0/0.18)] dark:[--line:rgb(255_255_255/0.22)]',
              )}
              style={{
                ['--c' as string]: `${cell}px`,
                backgroundImage: 'linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)',
                backgroundSize: `${cell}px ${cell}px`,
                backgroundPosition: 'center bottom',
              }}
              animate={running ? { y: [0, cell] } : { y: 0 }}
              transition={running ? { duration: speed, ease: 'linear', repeat: Infinity } : { duration: 0 }}
            />
          </div>
        </div>
        <div className={cn('absolute inset-x-0 bottom-0 h-24', dusk ? 'bg-gradient-to-t from-[#f7f4fb] dark:from-[#0a0812]' : 'bg-gradient-to-t from-[#fafafa] dark:from-[#070708]')} />
      </div>

      <div className="relative z-10 w-full px-6 pb-[18%] pt-12 text-center">{children}</div>

      {showControls && !reduced && speed > 0 && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause background motion' : 'Play background motion'}
          className="absolute bottom-3 right-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/60 text-zinc-800 ring-1 ring-black/[0.06] backdrop-blur-xl transition-[background-color,transform] duration-150 hover:bg-white/85 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-white/15 dark:focus-visible:ring-signal-300"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
        </button>
      )}
    </div>
  )
}
