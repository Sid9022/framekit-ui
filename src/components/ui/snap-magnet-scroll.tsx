import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Section = { id: string; title: string; body: string; accent: string }

const DEFAULTS: Section[] = [
  { id: 'a', title: 'Snap in', body: 'Sections lock with magnetic settle.', accent: '#f97316' },
  { id: 'b', title: 'Hold center', body: 'Active indicator tracks the settle.', accent: '#9a86b8' },
  { id: 'c', title: 'Release', body: 'Flick and the magnet catches you.', accent: '#fdba74' },
]

/** Snap sections + magnetic settle + active indicator. */
export function SnapMagnetScroll({
  className,
  sections = DEFAULTS,
}: {
  className?: string
  sections?: Section[]
}) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const h = el.clientHeight
    const idx = Math.round(el.scrollTop / h)
    setActive(Math.max(0, Math.min(sections.length - 1, idx)))
  }

  React.useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let timer = 0
    const settle = () => {
      const h = el.clientHeight
      const target = Math.round(el.scrollTop / h) * h
      el.scrollTo({ top: target, behavior: 'smooth' })
    }
    const onScrollEnd = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, 80)
    }
    el.addEventListener('scroll', onScrollEnd)
    return () => {
      el.removeEventListener('scroll', onScrollEnd)
      window.clearTimeout(timer)
    }
  }, [reduced])

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div
        ref={ref}
        onScroll={onScroll}
        className="framekit-scroll h-[300px] snap-y snap-mandatory overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800"
      >
        {sections.map((s) => (
          <section
            key={s.id}
            className="flex h-[300px] snap-center flex-col justify-center px-8"
            style={{
              background: `radial-gradient(ellipse at 30% 40%, ${s.accent}22, transparent 55%), #0c0c0c`,
            }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Magnet section</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{s.title}</h3>
            <p className="mt-2 max-w-xs text-sm text-zinc-400">{s.body}</p>
          </section>
        ))}
      </div>
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to ${s.title}`}
            onClick={() => {
              const el = ref.current
              if (!el) return
              el.scrollTo({ top: i * el.clientHeight, behavior: 'smooth' })
            }}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              i === active ? 'h-6 bg-framekit-500' : 'bg-zinc-600',
            )}
          />
        ))}
      </div>
    </div>
  )
}
