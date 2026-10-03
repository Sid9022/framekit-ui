import * as React from 'react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SkillsMarqueeProps = {
  /** Top row (scrolls left). */
  topRow?: string[]
  /** Bottom row (scrolls right). */
  bottomRow?: string[]
  /** Seconds for one loop. */
  duration?: number
  /** Show the visible pause / play control (recommended for WCAG 2.2.2). */
  showControl?: boolean
  className?: string
}

const TOP = ['Design systems', 'Prototyping', 'Motion design', 'Art direction', 'UX research', 'Typography', 'Brand identity', 'Accessibility']
const BOTTOM = ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Node', 'Figma', 'WebGL-free 3D', 'Framer Motion', 'Testing']

const CSS = `
@keyframes fk-skm-l{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
@keyframes fk-skm-r{from{transform:translate3d(-50%,0,0)}to{transform:translate3d(0,0,0)}}
.fk-skm-track{animation-timing-function:linear;animation-iteration-count:infinite;will-change:transform}
.fk-skm-wrap[data-paused="true"] .fk-skm-track,.fk-skm-wrap:hover .fk-skm-track,.fk-skm-wrap:focus-within .fk-skm-track{animation-play-state:paused}
`

function Row({ items, dir, duration, tone }: { items: string[]; dir: 'l' | 'r'; duration: number; tone: 'solid' | 'outline' }) {
  const pill = (s: string, k: string, hidden: boolean) => (
    <li key={k} aria-hidden={hidden || undefined} className={cn('group/pill mx-1.5 shrink-0 rounded-full px-5 py-2.5 text-base font-medium transition-[transform,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 sm:text-lg', tone === 'solid' ? 'bg-zinc-950 text-white hover:bg-signal-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-signal-200' : 'bg-white/60 text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-framekit-100 hover:ring-framekit-600 dark:bg-zinc-900/60 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-framekit-950 dark:hover:ring-framekit-400')}>
      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-framekit-500 align-middle transition-transform duration-300 group-hover/pill:scale-150" aria-hidden />{s}
    </li>
  )
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <ul className="fk-skm-track flex w-max" style={{ animationName: `fk-skm-${dir}`, animationDuration: `${duration}s` }}>
        {items.map((s) => pill(s, 'a' + s, false))}
        {items.map((s) => pill(s, 'b' + s, true))}
      </ul>
    </div>
  )
}

/**
 * Skills Marquee — two counter-rotating rails of skill pills. Hover or keyboard focus pauses, a visible Pause button
 * covers touch and WCAG 2.2.2, and with reduced motion the rails become a calm wrapped list.
 */
export function SkillsMarquee({ topRow = TOP, bottomRow = BOTTOM, duration = 38, showControl = true, className }: SkillsMarqueeProps) {
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = React.useState(false)
  if (reduced) {
    return (
      <ul className={cn('flex w-full max-w-3xl flex-wrap justify-center gap-2', className)} aria-label="Skills">
        {[...topRow, ...bottomRow].map((s) => <li key={s} className="rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-zinc-900 ring-1 ring-inset ring-zinc-300 dark:bg-zinc-900/60 dark:text-zinc-100 dark:ring-zinc-700">{s}</li>)}
      </ul>
    )
  }
  return (
    <section aria-label="Skills" className={cn('fk-skm-wrap relative w-full max-w-4xl space-y-3', className)} data-paused={paused}>
      <style>{CSS}</style>
      <Row items={topRow} dir="l" duration={duration} tone="solid" />
      <Row items={bottomRow} dir="r" duration={duration * 1.15} tone="outline" />
      {showControl && (
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Play skills marquee' : 'Pause skills marquee'} className="mx-auto flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
          {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}{paused ? 'Play' : 'Pause'}
        </button>
      )}
    </section>
  )
}
