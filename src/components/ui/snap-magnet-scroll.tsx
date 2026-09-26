import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Section = {
  id: string
  kicker: string
  title: string
  body: string
  accent: string
  glow: string
}

const DEFAULTS: Section[] = [
  {
    id: 'a',
    kicker: '01 · Capture',
    title: 'Snap in',
    body: 'Sections lock with a magnetic overshoot — flick, then feel the settle.',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.35)',
  },
  {
    id: 'b',
    kicker: '02 · Hold',
    title: 'Hold center',
    body: 'The glowing rail tracks the active frame. Keyboard ↑↓ works too.',
    accent: '#9a86b8',
    glow: 'rgba(154,134,184,0.4)',
  },
  {
    id: 'c',
    kicker: '03 · Release',
    title: 'Release',
    body: 'Overshoot, spring back, breathe. Cinematic full-bleed panels.',
    accent: '#fdba74',
    glow: 'rgba(253,186,116,0.35)',
  },
  {
    id: 'd',
    kicker: '04 · Echo',
    title: 'Echo',
    body: 'A final beat — peeks of the previous story still in peripheral vision.',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.3)',
  },
]

const STAGE = 380

/** Full-bleed cinematic snap sections with magnetic spring settle + glowing rail. */
export function SnapMagnetScroll({
  className,
  sections = DEFAULTS,
  viewportClassName,
}: {
  className?: string
  sections?: Section[]
  /** Classes merged onto the scrolling viewport (surface, border, radius, height). The reel brings its own dark backdrop. */
  viewportClassName?: string
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)
  const [settling, setSettling] = React.useState(false)
  const anim = React.useRef<number | null>(null)

  const scrollToIndex = React.useCallback(
    (idx: number, spring = true) => {
      const el = ref.current
      if (!el) return
      const clamped = Math.max(0, Math.min(sections.length - 1, idx))
      const target = clamped * STAGE

      if (reduced || !spring) {
        el.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
        setActive(clamped)
        return
      }

      // magnetic overshoot settle via rAF spring
      if (anim.current) cancelAnimationFrame(anim.current)
      setSettling(true)
      const start = el.scrollTop
      const overshoot = target + (target > start ? 18 : -18)
      const t0 = performance.now()

      const step = (now: number) => {
        const t = now - t0
        if (t < 160) {
          // shoot past
          const p = t / 160
          const eased = 1 - Math.pow(1 - p, 3)
          el.scrollTop = start + (overshoot - start) * eased
          anim.current = requestAnimationFrame(step)
        } else if (t < 420) {
          // spring back
          const p = (t - 160) / 260
          const eased = 1 - Math.pow(1 - p, 2.4)
          el.scrollTop = overshoot + (target - overshoot) * eased
          anim.current = requestAnimationFrame(step)
        } else {
          el.scrollTop = target
          setSettling(false)
          setActive(clamped)
          anim.current = null
        }
      }
      anim.current = requestAnimationFrame(step)
    },
    [reduced, sections.length],
  )

  const onScroll = () => {
    if (settling) return
    const el = ref.current
    if (!el) return
    const idx = Math.round(el.scrollTop / STAGE)
    setActive(Math.max(0, Math.min(sections.length - 1, idx)))
  }

  React.useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let timer = 0
    const onScrollEnd = () => {
      if (settling) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        const idx = Math.round(el.scrollTop / STAGE)
        scrollToIndex(idx, true)
      }, 90)
    }
    el.addEventListener('scroll', onScrollEnd, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScrollEnd)
      window.clearTimeout(timer)
      if (anim.current) cancelAnimationFrame(anim.current)
    }
  }, [reduced, scrollToIndex, settling])

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        scrollToIndex(active + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        scrollToIndex(active - 1)
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [active, scrollToIndex])

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div
        ref={ref}
        tabIndex={0}
        onScroll={onScroll}
        className={cn(
          'framekit-scroll h-[380px] snap-y snap-mandatory overflow-y-auto rounded-2xl border border-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-signal-400',
          viewportClassName,
        )}
        aria-label="Magnetic snap sections"
      >
        {sections.map((s, i) => (
          <section
            key={s.id}
            className="relative flex h-[380px] snap-center flex-col justify-end overflow-hidden px-8 pb-12 pt-10"
            style={{
              background: `radial-gradient(ellipse at 30% 25%, ${s.glow}, transparent 55%), linear-gradient(165deg, #0a0a0c 0%, #121016 55%, #0c0c10 100%)`,
            }}
          >
            {/* cinematic grain / light */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage: `linear-gradient(120deg, transparent 40%, ${s.accent}18 70%, transparent 90%)`,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 top-10 h-48 w-48 rounded-full blur-3xl"
              style={{ background: s.glow }}
            />

            <p
              className="relative text-[11px] font-medium uppercase tracking-[0.28em]"
              style={{ color: s.accent }}
            >
              {s.kicker}
            </p>
            <h3 className="relative mt-3 font-display text-4xl font-semibold tracking-tight text-white">
              {s.title}
            </h3>
            <p className="relative mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
              {s.body}
            </p>

            {/* peek of next */}
            {i < sections.length - 1 && (
              <p className="relative mt-8 text-[10px] uppercase tracking-[0.24em] text-white/30">
                swipe · scroll · ↑↓
              </p>
            )}
          </section>
        ))}
      </div>

      {/* glowing active rail */}
      <div className="pointer-events-none absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-0">
        <div className="relative flex flex-col gap-2.5">
          {sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to ${s.title}`}
              onClick={() => scrollToIndex(i)}
              className="pointer-events-auto relative flex h-3 w-3 items-center justify-center"
            >
              <span
                className={cn(
                  'block rounded-full transition-all duration-300',
                  i === active ? 'h-7 w-1.5' : 'h-1.5 w-1.5 bg-zinc-600 hover:bg-zinc-400',
                )}
                style={
                  i === active
                    ? {
                        background: `linear-gradient(180deg, ${s.accent}, ${sections[Math.min(i + 1, sections.length - 1)].accent})`,
                        boxShadow: `0 0 14px ${s.glow}`,
                      }
                    : undefined
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* swipe hint */}
      <div className="mt-2 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        <span className={cn('transition', active === 0 && 'opacity-30')}>↑</span>
        <span>magnet rail</span>
        <span className={cn('transition', active === sections.length - 1 && 'opacity-30')}>↓</span>
      </div>
    </div>
  )
}
