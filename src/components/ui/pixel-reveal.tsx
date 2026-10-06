import * as React from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Pattern = 'random' | 'diagonal' | 'center'

/** Image (or generated art) reveals through a cascading pixel-grid dissolve when scrolled into view. */
export function PixelReveal({
  src,
  alt = '',
  className,
  cols = 12,
  rows = 8,
  pattern = 'random',
  duration = 900,
  showReplay = false,
  children,
}: {
  src?: string
  alt?: string
  className?: string
  cols?: number
  rows?: number
  /** Order the cells dissolve in. */
  pattern?: Pattern
  /** Total cascade length in ms. */
  duration?: number
  /** Render a small replay button in the corner. */
  showReplay?: boolean
  /** Optional overlay content (e.g. a caption) shown above the art. */
  children?: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = React.useState(false)
  const [run, setRun] = React.useState(0)
  const reduced = usePrefersReducedMotion()

  const cells = React.useMemo(() => {
    const out: { i: number; delay: number }[] = []
    const maxD = Math.hypot(cols / 2, rows / 2)
    for (let i = 0; i < cols * rows; i++) {
      const c = i % cols
      const r = Math.floor(i / cols)
      let t: number
      if (pattern === 'diagonal') t = (c + r) / (cols + rows - 2) + Math.random() * 0.08
      else if (pattern === 'center') t = Math.hypot(c - (cols - 1) / 2, r - (rows - 1) / 2) / maxD + Math.random() * 0.08
      else t = Math.random()
      out.push({ i, delay: reduced ? 0 : Math.min(1, t) * duration })
    }
    return out
    // `run` reshuffles the random pattern on replay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, rows, reduced, pattern, duration, run])

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.setTimeout(() => setRevealed(true), 120)
          obs.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [run])

  const replay = () => {
    setRevealed(false)
    setRun((n) => n + 1)
  }

  return (
    <div
      ref={ref}
      className={cn(
        'relative isolate overflow-hidden rounded-[20px] ring-1 ring-zinc-950/[0.08] shadow-[0_1px_2px_rgba(15,15,20,0.05),0_16px_40px_-20px_rgba(15,15,20,0.35)] dark:ring-white/10',
        className,
      )}
      style={{ aspectRatio: '3/2' }}
    >
      {src ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 70% at 22% 28%, #fdba74 0%, transparent 60%), radial-gradient(55% 60% at 80% 30%, #c084fc 0%, transparent 62%), radial-gradient(70% 70% at 60% 95%, #4f46e5 0%, transparent 65%), linear-gradient(135deg, #f97316, #db2777 48%, #4338ca)',
          }}
        />
      )}
      {children && <div className="absolute inset-0 z-10">{children}</div>}
      <div
        aria-hidden
        className="absolute inset-0 z-20 grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {cells.map((c) => (
          <span
            key={`${run}-${c.i}`}
            className={cn(
              'bg-zinc-100 dark:bg-zinc-900',
              reduced
                ? 'transition-opacity duration-300'
                : 'transition-[opacity,transform] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            )}
            style={{
              opacity: revealed ? 0 : 1,
              transform: revealed && !reduced ? 'scale(0.6)' : 'scale(1.02)',
              transitionDelay: `${c.delay}ms`,
            }}
          />
        ))}
      </div>
      {showReplay && (
        <button
          type="button"
          onClick={replay}
          aria-label="Replay reveal"
          className="absolute right-2 bottom-2 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/25 backdrop-blur-md transition-[transform,background-color] hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95"
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
