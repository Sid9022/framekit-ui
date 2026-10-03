import * as React from 'react'
import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight, Pause, Play, Quote } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type Testimonial = { quote: string; name: string; role: string; company?: string }

export type TestimonialCarouselProps = {
  items?: Testimonial[]
  /** Auto-advance interval in ms (0 disables). */
  interval?: number
  onChange?: (index: number) => void
  className?: string
}

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'She rebuilt our onboarding in six weeks and the activation number moved more than the previous two years combined.', name: 'Maya Okonkwo', role: 'VP Product', company: 'Brightside' },
  { quote: 'The rare designer who prototypes in code. Every handoff arrived with motion specs we could ship as-is.', name: 'Jonas Lindqvist', role: 'Engineering Lead', company: 'Halcyon Studio' },
  { quote: 'Calm, fast and ridiculously thorough. Our launch site felt custom-built for every visitor.', name: 'Priya Raman', role: 'Founder', company: 'Tidewater Institute' },
  { quote: 'Great taste plus real accessibility chops. Our audit went from 63 findings to zero.', name: 'Tomás Herrera', role: 'Head of Design', company: 'Fieldwork' },
]

const swipe = 80

/**
 * Testimonial Carousel — large display-type quotes that slide with direction-aware springs, swipe/drag, arrow keys,
 * and a progress-filled dot for the auto-advance. Pauses on hover, focus and drag; carries a visible Pause control.
 */
export function TestimonialCarousel({ items = DEFAULT_ITEMS, interval = 7000, onChange, className }: TestimonialCarouselProps) {
  const reduced = usePrefersReducedMotion()
  const [[i, dir], setPage] = React.useState<[number, number]>([0, 0])
  const [hold, setHold] = React.useState(false)
  const [userPaused, setUserPaused] = React.useState(false)
  const n = items.length
  const playing = interval > 0 && !userPaused && !hold && !reduced
  const go = React.useCallback((d: number) => setPage(([c]) => [(c + d + n) % n, d]), [n])
  const jump = (t: number) => setPage(([c]) => [t, t > c ? 1 : -1])
  React.useEffect(() => { onChange?.(i) }, [i]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (!playing) return
    const t = window.setTimeout(() => go(1), interval)
    return () => window.clearTimeout(t)
  }, [playing, i, interval, go])
  const cur = items[i]
  const words = cur.quote.split(' ')

  return (
    <section
      role="group"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1) } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) } }}
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      className={cn('relative w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm outline-offset-4 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900', className)}
    >
      <Quote aria-hidden className="absolute right-6 top-6 h-14 w-14 text-signal-200 dark:text-signal-800 sm:h-20 sm:w-20" strokeWidth={1.2} />
      <div className="relative min-h-[300px] overflow-hidden sm:min-h-[260px]" aria-live={playing ? 'off' : 'polite'} aria-atomic>
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <motion.figure
            key={i}
            custom={dir}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
            drag={reduced ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragStart={() => setHold(true)}
            onDragEnd={(_, info: PanInfo) => { setHold(false); if (info.offset.x < -swipe || info.velocity.x < -500) go(1); else if (info.offset.x > swipe || info.velocity.x > 500) go(-1) }}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * 90, filter: reduced ? 'none' : 'blur(8px)' }),
              center: { opacity: 1, x: 0, filter: 'blur(0px)' },
              exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * -90, filter: reduced ? 'none' : 'blur(8px)' }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <blockquote className="font-display text-3xl leading-[1.12] tracking-tight text-zinc-950 sm:text-[2.6rem] dark:text-zinc-50">
              <span className="sr-only">{cur.quote}</span>
              <span aria-hidden>
                {words.map((w, k) => (
                  <span key={k} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span className="inline-block" initial={reduced ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.04 * k, ease: [0.16, 1, 0.3, 1] }}>{w}&nbsp;</motion.span>
                  </span>
                ))}
              </span>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,#7d6899,#f97316)] text-sm font-semibold text-white">{cur.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span>
              <span className="leading-tight"><span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">{cur.name}</span><span className="block text-sm text-zinc-600 dark:text-zinc-400">{cur.role}{cur.company ? `, ${cur.company}` : ''}</span></span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center" role="group" aria-label="Choose testimonial">
          {items.map((t, k) => (
            <button key={t.name} type="button" onClick={() => jump(k)} aria-label={`Show testimonial ${k + 1}: ${t.name}`} aria-current={k === i} className="grid h-11 w-8 place-items-center">
              <span className="relative block h-1.5 overflow-hidden rounded-full bg-zinc-300 transition-[width] duration-300 dark:bg-zinc-700" style={{ width: k === i ? 36 : 8 }}>
                {k === i && (
                  <motion.span key={`${i}-${playing}`} className="absolute inset-0 origin-left rounded-full bg-zinc-950 dark:bg-zinc-50" initial={{ scaleX: playing ? 0 : 1 }} animate={{ scaleX: 1 }} transition={{ duration: playing ? interval / 1000 : 0, ease: 'linear' }} />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {interval > 0 && (
            <button type="button" onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? 'Resume auto-advance' : 'Pause auto-advance'} className="grid h-11 w-11 place-items-center rounded-full text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
              {userPaused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
            </button>
          )}
          <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-zinc-300 text-zinc-900 transition-transform hover:bg-zinc-100 active:scale-90 motion-reduce:active:scale-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"><ArrowLeft className="h-4 w-4" aria-hidden /></button>
          <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full bg-zinc-950 text-white transition-transform hover:bg-zinc-800 active:scale-90 motion-reduce:active:scale-100 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"><ArrowRight className="h-4 w-4" aria-hidden /></button>
        </div>
      </div>
    </section>
  )
}
