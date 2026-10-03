import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { handleTablistKeys } from '@/lib/roving'

export type ShelfBook = {
  id: string
  title: string
  author: string
  blurb: string
  /** 0.7–1 relative height. */
  height?: number
  /** px width of the spine. */
  width?: number
  /** Hue 0–360 for the generated cover. */
  hue?: number
  /** Small ribbon on the open cover, e.g. “Re-reading”. */
  badge?: string
  pattern?: 'bands' | 'dots' | 'stripes' | 'plain'
}

export type BookSpineShelfProps = {
  books?: ShelfBook[]
  defaultValue?: string
  value?: string
  onValueChange?: (id: string) => void
  title?: string
  className?: string
}

const DEFAULT_BOOKS: ShelfBook[] = [
  { id: 'b1', title: 'The Shape of Quiet', author: 'M. Aldous', blurb: 'On designing for the moments between actions — empty states, waiting, and rest.', height: 0.96, width: 46, hue: 18, pattern: 'bands' },
  { id: 'b2', title: 'Grids & Gravity', author: 'R. Okonkwo', blurb: 'A practical argument for layouts that feel inevitable rather than arranged.', height: 0.84, width: 38, hue: 215, pattern: 'dots' },
  { id: 'b3', title: 'Slow Software', author: 'H. Lindgren', blurb: 'Why the fastest products feel unhurried, and how to build them.', height: 1, width: 52, hue: 150, badge: 'Re-reading', pattern: 'stripes' },
  { id: 'b4', title: 'Letterforms at Night', author: 'S. Whitcombe', blurb: 'A field guide to type that survives dark mode, small screens and tired eyes.', height: 0.9, width: 42, hue: 275, pattern: 'plain' },
  { id: 'b5', title: 'Motion, Explained', author: 'D. Takeda', blurb: 'Springs, easing and choreography as a language for cause and effect.', height: 0.78, width: 36, hue: 340, pattern: 'bands' },
  { id: 'b6', title: 'Small Tools', author: 'E. Brandt', blurb: 'Building the little utilities that quietly make a team faster.', height: 0.93, width: 44, hue: 45, pattern: 'dots' },
  { id: 'b7', title: 'Atlas of Interfaces', author: 'J. Moreau', blurb: 'A visual history of the controls we touch every day, from knobs to gestures.', height: 0.86, width: 40, hue: 190, pattern: 'stripes' },
]

function Spine({ b, h }: { b: ShelfBook; h: number }) {
  const hue = b.hue ?? 220
  return (
    <span aria-hidden className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-[3px] py-3 text-white shadow-[inset_-3px_0_5px_rgb(0_0_0/0.28),inset_2px_0_2px_rgb(255_255_255/0.22)]" style={{ background: `linear-gradient(90deg, hsl(${hue} 55% 34%), hsl(${hue} 60% 42%) 45%, hsl(${hue} 55% 30%))`, height: h }}>
      {b.pattern === 'bands' && <><span className="absolute inset-x-0 top-5 h-1.5 bg-white/30" /><span className="absolute inset-x-0 bottom-5 h-1.5 bg-white/30" /></>}
      {b.pattern === 'stripes' && <span className="absolute inset-0 opacity-25" style={{ background: 'repeating-linear-gradient(0deg, #fff 0 2px, transparent 2px 9px)' }} />}
      {b.pattern === 'dots' && <span className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(#fff 1.2px, transparent 1.4px) 0 0/10px 10px' }} />}
      <span className="relative size-2.5 rounded-full border border-white/70" />
      <span className="relative mx-auto max-h-[74%] overflow-hidden whitespace-nowrap font-display text-[17px] leading-none tracking-wide" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{b.title}</span>
      <span className="relative h-2 w-4 border-y border-white/60" />
    </span>
  )
}

/**
 * Book Spine Shelf — a shelf of generated spines. The hovered book slides out and its neighbours lean away; selecting
 * one swings the cover open into a reading card with an optional ribbon. Arrow keys walk the shelf.
 */
export function BookSpineShelf({ books = DEFAULT_BOOKS, value, defaultValue, onValueChange, title = 'On my shelf', className }: BookSpineShelfProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultValue ?? books[2]?.id ?? books[0].id)
  const sel = value ?? inner
  const [hover, setHover] = React.useState<string | null>(null)
  const book = books.find((b) => b.id === sel) ?? books[0]
  const hoverIdx = hover ? books.findIndex((b) => b.id === hover) : -1
  const H = 190
  const pick = (id: string) => { if (value === undefined) setInner(id); onValueChange?.(id) }

  return (
    <div className={cn('w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-5 sm:p-7 dark:border-zinc-800 dark:bg-zinc-900', className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">[ {title} ]</p>
      <div className="mt-5 grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        <div>
          <div role="radiogroup" aria-label="Books on the shelf" onKeyDown={handleTablistKeys} className="framekit-scroll flex items-end gap-[3px] overflow-x-auto px-1 pb-0 pt-6" style={{ height: H + 24 }}>
            {books.map((b, i) => {
              const on = b.id === book.id
              const lean = hoverIdx < 0 || reduced ? 0 : i === hoverIdx ? 0 : Math.sign(i - hoverIdx) * (Math.abs(i - hoverIdx) === 1 ? 5 : 0)
              const h = H * (b.height ?? 0.9)
              return (
                <motion.button
                  key={b.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`${b.title} by ${b.author}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(b.id)}
                  onPointerEnter={() => setHover(b.id)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(b.id)}
                  onBlur={() => setHover(null)}
                  className="relative shrink-0 origin-bottom rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-900"
                  style={{ width: Math.max(44, b.width ?? 42), height: h }}
                  initial={false}
                  animate={{ y: on ? -14 : hover === b.id ? -10 : 0, rotate: lean, x: lean * 1.4 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                >
                  <Spine b={b} h={h} />
                  {on && <span aria-hidden className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-framekit-500" />}
                </motion.button>
              )
            })}
          </div>
          <div aria-hidden className="h-3 rounded-sm bg-gradient-to-b from-stone-300 to-stone-400 shadow-[0_6px_10px_-4px_rgb(0_0_0/0.35)] dark:from-zinc-700 dark:to-zinc-800" />
        </div>

        <div className="relative min-h-[15rem] [perspective:900px]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={book.id}
              className="relative origin-left overflow-hidden rounded-r-xl rounded-l-[3px] border border-black/10 p-5 text-white shadow-[0_18px_30px_-14px_rgb(0_0_0/0.5)]"
              style={{ background: `linear-gradient(145deg, hsl(${book.hue ?? 220} 58% 38%), hsl(${((book.hue ?? 220) + 30) % 360} 62% 24%))`, minHeight: '15rem' }}
              initial={reduced ? { opacity: 0 } : { rotateY: -70, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { rotateY: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            >
              <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-black/25" />
              <span aria-hidden className="absolute -right-8 -top-8 size-32 rounded-full border-[14px] border-white/10" />
              <div className="relative pl-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">{book.author}</p>
                <h3 className="mt-3 font-display text-[2rem] leading-[1] tracking-tight">{book.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/90">{book.blurb}</p>
              </div>
              {book.badge && (
                <span className="absolute bottom-4 right-[-2.2rem] rotate-[-35deg] bg-framekit-500 px-10 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-950 shadow">{book.badge}</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
