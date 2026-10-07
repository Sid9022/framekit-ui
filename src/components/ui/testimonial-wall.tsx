import * as React from 'react'
import { motion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type Testimonial = { quote: string; name: string; role: string; hue?: number }

export type TestimonialWallProps = {
  items?: Testimonial[]
  /** Number of columns on desktop (1 on phones, 2 on tablets). */
  columns?: 2 | 3
  /** Seconds for one full loop of a column. */
  duration?: number
  /** Wall height in px. */
  height?: number
  className?: string
}

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { quote: 'We moved our entire marketing site in a weekend. Builds went from nine minutes to forty seconds.', name: 'Ana Lima', role: 'Staff engineer, Lumen', hue: 280 },
  { quote: 'The preview links changed how design reviews work here. Nobody asks for screenshots anymore.', name: 'Kai Ortega', role: 'Design lead, Fieldnote', hue: 20 },
  { quote: 'Honestly the calmest dashboard I’ve used. Everything is where my hand expects it.', name: 'Mei Tanaka', role: 'Founder, Orbit', hue: 200 },
  { quote: 'Our p95 dropped by half after switching regions with one setting.', name: 'Sam Patel', role: 'CTO, Ledgerly', hue: 150 },
  { quote: 'Support replied in eleven minutes on a Sunday. That’s the whole review.', name: 'Jo Becker', role: 'Indie developer', hue: 330 },
  { quote: 'The analytics are privacy-first and still answer every question our PMs have.', name: 'Ravi Nair', role: 'Head of product, Tandem', hue: 90 },
  { quote: 'Onboarding new engineers takes an afternoon now, not a sprint.', name: 'Lena Fischer', role: 'Eng manager, Northwind', hue: 240 },
  { quote: 'It feels like the tool was designed by people who actually ship.', name: 'Tomás Ruiz', role: 'Frontend lead, Parcel', hue: 45 },
  { quote: 'Rollbacks are a single click. I sleep better.', name: 'Ines Costa', role: 'SRE, Halcyon', hue: 0 },
]

function Card({ t }: { t: Testimonial }) {
  const initials = t.name.split(' ').map((p) => p[0]).join('')
  return (
    <figure className="rounded-[20px] border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
      <blockquote className="text-pretty text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">“{t.quote}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span aria-hidden className="grid size-9 place-items-center rounded-full text-xs font-semibold text-white" style={{ background: `linear-gradient(135deg, oklch(0.62 0.15 ${t.hue ?? 260}), oklch(0.45 0.13 ${(t.hue ?? 260) + 40}))` }}>{initials}</span>
        <span><span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.name}</span><span className="block text-[13px] text-zinc-600 dark:text-zinc-400">{t.role}</span></span>
      </figcaption>
    </figure>
  )
}

/**
 * Testimonial Wall — a masonry wall of quote cards whose columns drift in
 * opposite directions at different speeds, faded at the edges. Hovering a
 * column slows it; a pause button stops all motion (and reduced motion shows a
 * static, scrollable wall).
 */
export function TestimonialWall({ items = DEFAULT_TESTIMONIALS, columns = 3, duration = 40, height = 560, className }: TestimonialWallProps) {
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = React.useState(false)
  const cols = Array.from({ length: columns }, (_, c) => items.filter((_, i) => i % columns === c))
  const still = reduced || paused
  return (
    <section aria-label="Customer testimonials" className={cn('relative w-full', className)}>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]" style={{ height }}>
        <div className={cn('grid gap-4 sm:grid-cols-2', columns === 3 && 'lg:grid-cols-3', still && 'h-full overflow-y-auto')}>
          {cols.map((col, c) => (
            <div key={c} className={cn('group relative', c === 1 && 'hidden sm:block', c === 2 && 'hidden lg:block')}>
              {still ? (
                <div className="grid gap-4 py-8">{col.map((t, i) => <Card key={i} t={t} />)}</div>
              ) : (
                <motion.div
                  className="grid gap-4"
                  animate={{ y: c % 2 ? ['-50%', '0%'] : ['0%', '-50%'] }}
                  transition={{ duration: duration * (1 + c * 0.18), repeat: Infinity, ease: 'linear' }}
                >
                  {[...col, ...col].map((t, i) => <div key={i} aria-hidden={i >= col.length || undefined}><Card t={t} /></div>)}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
      {!reduced && (
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Play testimonials' : 'Pause testimonials'}
          className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full border border-black/[0.08] bg-white/90 text-zinc-800 shadow-sm backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-200">
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      )}
    </section>
  )
}
