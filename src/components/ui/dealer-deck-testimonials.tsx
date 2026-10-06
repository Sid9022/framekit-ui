import * as React from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, Layers, Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type DealerTestimonial = {
  id: string
  quote: string
  name: string
  role: string
  /** 1–5 */
  rating?: number
  /** Optional avatar image. */
  src?: string
}

export type DealerDeckTestimonialsProps = {
  items?: DealerTestimonial[]
  title?: string
  /** Card-back colour. */
  accent?: string
  /** Controlled number of dealt cards. */
  dealt?: number
  defaultDealt?: number
  onDealtChange?: (dealt: number) => void
  titleAs?: 'h2' | 'h3'
  className?: string
}

export const DEFAULT_DEALER_TESTIMONIALS: DealerTestimonial[] = [
  { id: 't1', quote: 'They rebuilt our booking flow in three weeks. Support tickets about checkout dropped by half the month after.', name: 'Amara Nwosu', role: 'COO, Tidepool Clinics', rating: 5 },
  { id: 't2', quote: 'The only agency that asked to see our analytics before showing us a single mockup.', name: 'Daniel Varga', role: 'Founder, Lumen Freight', rating: 5 },
  { id: 't3', quote: 'Every screen came with the edge cases already designed. Our engineers noticed immediately.', name: 'Keiko Tanaka', role: 'VP Engineering, Orbitly', rating: 5 },
  { id: 't4', quote: 'Calm, precise, and honest about trade-offs. I would hire them again tomorrow.', name: 'Rafael Mendes', role: 'Product Lead, Harbor Bank', rating: 4 },
  { id: 't5', quote: 'Our app store rating went from 3.9 to 4.7 without adding a single feature.', name: 'Sienna Brooks', role: 'Head of Mobile, Fernway', rating: 5 },
  { id: 't6', quote: 'They write the clearest handoff notes I have ever read. Zero back-and-forth.', name: 'Omar Haddad', role: 'Eng Manager, Copperline', rating: 5 },
]

const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

function CardBack({ accent }: { accent: string }) {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg aria-hidden viewBox="0 0 100 118" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      <defs>
        <pattern id={`${id}p`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 4h8M4 0v8" stroke="#f5d9a8" strokeOpacity="0.28" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100" height="118" fill={accent} />
      <rect x="6" y="6" width="88" height="106" rx="5" fill={`url(#${id}p)`} stroke="#f5d9a8" strokeOpacity="0.55" strokeWidth="0.6" />
      <rect x="9" y="9" width="82" height="100" rx="3.5" fill="none" stroke="#f5d9a8" strokeOpacity="0.3" strokeWidth="0.4" />
      <circle cx="50" cy="59" r="15" fill={accent} stroke="#f5d9a8" strokeOpacity="0.7" strokeWidth="0.7" />
      <path d="M50 49 L52.6 56.4 L60 59 L52.6 61.6 L50 69 L47.4 61.6 L40 59 L47.4 56.4Z" fill="#f5d9a8" opacity="0.85" />
    </svg>
  )
}

/**
 * Dealer Deck Testimonials — praise dealt like playing cards. A face-down
 * deck waits on the table; deal and the top card slides across on a spring,
 * flips face-up mid-flight and lands slightly askew on the pile, so the
 * quotes stack up like a winning hand. Take one back, or gather the deck.
 */
export function DealerDeckTestimonials({
  items = DEFAULT_DEALER_TESTIMONIALS,
  title = 'Dealt from real projects',
  accent = '#8c1230',
  dealt: dealtProp,
  defaultDealt = 1,
  onDealtChange,
  titleAs: Title = 'h2',
  className,
}: DealerDeckTestimonialsProps) {
  const reduced = usePrefersReducedMotion()
  const n = items.length
  const ref = React.useRef<HTMLDivElement>(null)
  const [W, setW] = React.useState(720)
  const [inner, setInner] = React.useState(Math.min(n, defaultDealt))
  const k = Math.min(n, Math.max(0, dealtProp ?? inner))

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const set = (v: number) => {
    const next = Math.min(n, Math.max(0, v))
    if (dealtProp === undefined) setInner(next)
    onDealtChange?.(next)
  }

  const wide = W >= 620
  const cw = Math.min(290, wide ? W * 0.4 : W * 0.62)
  const ch = cw * (wide ? 1.18 : 1.42)
  const deck = wide ? { x: -W * 0.27, y: 10, s: 0.62 } : { x: -W / 2 + cw * 0.18 + 4, y: 0, s: 0.36 }
  const pile = wide ? { x: W * 0.1, y: 0 } : { x: W / 2 - cw / 2 - 10, y: 0 }
  const top = items[k - 1]

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') set(k + 1)
    else if (e.key === 'ArrowLeft') set(k - 1)
    else if (e.key === 'Home') set(0)
    else if (e.key === 'End') set(n)
    else return
    e.preventDefault()
  }

  return (
    <section
      aria-label={title}
      onKeyDown={onKeyDown}
      className={cn('relative isolate w-full overflow-hidden rounded-3xl px-4 pb-6 pt-7 ring-1 ring-black/[0.06] sm:px-8 dark:ring-white/[0.07]', className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_10%,#fbf7f0,#ece4d6)] dark:bg-[radial-gradient(120%_90%_at_50%_10%,#1c1416,#0a0708)]">
        <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply dark:opacity-[0.08] dark:mix-blend-screen" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <Title className="text-[26px] leading-none tracking-[-0.02em] text-zinc-950 sm:text-[32px] dark:text-zinc-50" style={{ fontFamily: "var(--font-display, 'Instrument Serif'), Georgia, serif" }}>{title}</Title>
        <p className="shrink-0 text-[12px] font-medium tabular-nums text-zinc-700 dark:text-zinc-300">{k} / {n} dealt</p>
      </div>

      <div ref={ref} className="relative mt-4 w-full [perspective:1600px]" style={{ height: ch + 36 }}>
        {/* deck click target */}
        <button
          type="button"
          onClick={() => set(k + 1)}
          disabled={k >= n}
          aria-label={k >= n ? 'Deck is empty' : `Deal next testimonial (${n - k} left)`}
          className="absolute z-[400] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-default dark:focus-visible:ring-zinc-100"
          style={{ left: '50%', top: '50%', width: Math.max(44, cw * deck.s + 8), height: Math.max(44, ch * deck.s + 8), transform: `translate(${deck.x - (cw * deck.s + 8) / 2}px, ${deck.y - (ch * deck.s + 8) / 2}px)` }}
        />
        {items.map((it, i) => {
          const onPile = i < k
          const d = i - k
          const p = k - 1 - i
          const target = onPile
            ? { x: pile.x + jitter(i) * 14, y: pile.y + Math.min(p, 4) * 3, rotate: jitter(i + 7) * 6, rotateY: 0, scale: 1 - Math.min(p, 4) * 0.015, zIndex: 100 + i, opacity: p > 4 ? 0 : 1 }
            : { x: deck.x + Math.min(d, 6) * 1.2, y: deck.y + Math.min(d, 6) * 1.6, rotate: -3 + jitter(i) * 2, rotateY: 180, scale: deck.s, zIndex: 300 - d, opacity: 1 }
          return (
            <motion.div
              key={it.id}
              aria-hidden={i !== k - 1}
              className="absolute left-1/2 top-1/2"
              style={{ width: cw, height: ch, marginLeft: -cw / 2, marginTop: -ch / 2, transformStyle: 'preserve-3d' }}
              initial={false}
              animate={target}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 150, damping: 20, mass: 0.9, zIndex: { duration: 0 }, rotateY: { type: 'spring', stiffness: 110, damping: 17 } }}
            >
              {/* front */}
              <figure className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] bg-white p-5 text-zinc-900 shadow-[0_1px_2px_rgb(40_20_10/0.1),0_22px_40px_-22px_rgb(40_20_10/0.5)] ring-1 ring-black/[0.06] [backface-visibility:hidden] dark:bg-[#1b1718] dark:text-zinc-100 dark:shadow-[0_22px_40px_-18px_rgb(0_0_0/0.8)] dark:ring-white/[0.08]">
                <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400">
                  {Array.from({ length: 5 }, (_, s) => <Star key={s} aria-hidden className={cn('size-3.5', s < (it.rating ?? 5) ? 'fill-current' : 'opacity-30')} />)}
                  <span className="sr-only">{it.rating ?? 5} out of 5</span>
                </div>
                <blockquote className="mt-3 flex flex-1 items-center leading-[1.15] tracking-[-0.01em]" style={{ fontFamily: "var(--font-display, 'Instrument Serif'), Georgia, serif", fontSize: Math.max(17, cw * (wide ? 0.084 : 0.088)) }}>
                  “{it.quote}”
                </blockquote>
                <figcaption className="mt-3 flex items-center gap-3 border-t border-zinc-900/[0.08] pt-3 dark:border-white/[0.08]">
                  {it.src ? (
                    <img src={it.src} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white" style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 50%, #c08a3e))` }}>
                      {it.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-semibold">{it.name}</span>
                    <span className="block truncate text-[12px] text-zinc-600 dark:text-zinc-400">{it.role}</span>
                  </span>
                </figcaption>
              </figure>
              {/* back */}
              <div className="absolute inset-0 overflow-hidden rounded-[18px] shadow-[0_1px_2px_rgb(40_20_10/0.15),0_14px_30px_-18px_rgb(40_20_10/0.6)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <CardBack accent={accent} />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <button type="button" onClick={() => set(k - 1)} disabled={k === 0} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium text-zinc-800 outline-none ring-1 ring-zinc-900/10 transition-colors hover:bg-zinc-900/[0.04] focus-visible:ring-2 focus-visible:ring-zinc-900 disabled:opacity-40 dark:text-zinc-200 dark:ring-white/15 dark:hover:bg-white/[0.06] dark:focus-visible:ring-zinc-100">
          <ChevronLeft aria-hidden className="size-4" /> Take back
        </button>
        <motion.button
          type="button"
          onClick={() => set(k >= n ? 0 : k + 1)}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-[13px] font-medium text-white shadow-[0_8px_20px_-10px_rgb(0_0_0/0.5)] outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950 dark:focus-visible:ring-zinc-50 dark:focus-visible:ring-offset-zinc-950"
        >
          <Layers aria-hidden className="size-4" />
          {k >= n ? 'Gather the deck' : 'Deal next'}
        </motion.button>
      </div>
      <p role="status" aria-live="polite" className="sr-only">{top ? `${top.name}, ${top.role}: ${top.quote}` : 'All cards gathered into the deck.'}</p>
    </section>
  )
}
