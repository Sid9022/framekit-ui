import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Layers, Orbit, PenTool, Rocket } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ServiceItem = { id: string; title: string; summary: string; deliverables: string[]; price?: string; icon?: React.ReactNode }

export type ServicesCardsProps = {
  services?: ServiceItem[]
  defaultActive?: string
  titleAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

const ic = 'h-5 w-5'
const SERVICES: ServiceItem[] = [
  { id: 'product', title: 'Product design', summary: 'From fuzzy brief to a shippable, tested interface.', deliverables: ['Discovery & flows', 'Interactive prototype', 'Design system kit', 'Usability round'], price: 'From $8k', icon: <Layers className={ic} /> },
  { id: 'build', title: 'Front-end build', summary: 'Pixel-true React, fast and accessible by default.', deliverables: ['React + Tailwind build', 'WCAG 2.2 AA pass', 'Lighthouse 95+', 'CMS wiring'], price: 'From $10k', icon: <Rocket className={ic} /> },
  { id: 'motion', title: 'Motion & craft', summary: 'Interaction details that make a site feel alive.', deliverables: ['Motion language', 'Hero & page transitions', 'Micro-interactions', 'Reduced-motion fallbacks'], price: 'From $4k', icon: <Orbit className={ic} /> },
  { id: 'brand', title: 'Brand identity', summary: 'A mark, a voice and a kit your team can use.', deliverables: ['Logo & type system', 'Colour & tone', 'Guidelines site', 'Social templates'], price: 'From $6k', icon: <PenTool className={ic} /> },
]

/**
 * Services Cards — four offers in one row. Hover or focus a card and it swells while the others yield; a cursor-lit
 * border follows the pointer, the icon tile tilts and the deliverables stagger in with check marks that tick on.
 * Cards are real buttons (aria-expanded) so keyboard and touch get the same reveal.
 */
export function ServicesCards({ services = SERVICES, defaultActive, titleAs = 'h3', className }: ServicesCardsProps) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState(defaultActive ?? services[0]?.id)
  const Title = titleAs
  const move = (e: React.PointerEvent<HTMLElement>) => {
    const b = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--cx', `${e.clientX - b.left}px`)
    e.currentTarget.style.setProperty('--cy', `${e.clientY - b.top}px`)
  }
  return (
    <ul className={cn('flex w-full max-w-4xl flex-col gap-3 lg:flex-row', className)}>
      {services.map((s, i) => {
        const on = s.id === active
        return (
          <motion.li
            key={s.id}
            layout={!reduced}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(s.id)}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="min-w-0"
            style={{ flex: on ? 2.2 : 1 }}
          >
            <article onPointerMove={move} className={cn('group/card relative h-full overflow-hidden rounded-3xl border p-5 transition-colors duration-500', on ? 'border-zinc-950 bg-zinc-950 text-zinc-50 dark:border-signal-300 dark:bg-signal-900/70' : 'border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50')} style={{ ['--cx' as string]: '50%', ['--cy' as string]: '0%' }}>
              <span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" style={{ background: 'radial-gradient(260px circle at var(--cx) var(--cy), rgb(255 255 255 / 0.13), transparent 70%)' }} />
              <div className="relative flex w-full flex-col items-start gap-3">
                <span className="flex w-full items-center justify-between">
                  <motion.span animate={{ rotate: on && !reduced ? -8 : 0, scale: on ? 1.08 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 16 }} className={cn('grid h-11 w-11 place-items-center rounded-2xl transition-colors duration-500', on ? 'bg-framekit-500 text-zinc-950' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100')}>{s.icon ?? <Layers className={ic} />}</motion.span>
                  <span className={cn('font-mono text-xs tabular-nums transition-colors duration-500', on ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-400')}>{String(i + 1).padStart(2, '0')}</span>
                </span>
                <Title className="font-display text-3xl leading-none tracking-tight">
                  <button type="button" aria-expanded={on} aria-controls={`svc-${s.id}`} onClick={() => setActive(s.id)} className="rounded-md text-left after:absolute after:-inset-5 after:content-['']">{s.title}</button>
                </Title>
                <span className={cn('text-sm leading-snug transition-colors duration-500', on ? 'text-zinc-200' : 'text-zinc-600 dark:text-zinc-400')}>{s.summary}</span>
              </div>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div id={`svc-${s.id}`} key="more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 32 }} className="relative overflow-hidden">
                    <ul className="mt-5 space-y-2 border-t border-white/20 pt-4">
                      {s.deliverables.map((d, k) => (
                        <motion.li key={d} initial={reduced ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + k * 0.06, type: 'spring', stiffness: 320, damping: 28 }} className="flex items-center gap-2.5 text-sm text-zinc-50">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-framekit-500 text-zinc-950"><Check className="h-3 w-3" strokeWidth={3} aria-hidden /></span>{d}
                        </motion.li>
                      ))}
                    </ul>
                    {s.price && <p className="mt-5 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">{s.price}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          </motion.li>
        )
      })}
    </ul>
  )
}
