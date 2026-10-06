import * as React from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from 'motion/react'
import { Heart, RotateCcw, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Card = { id: string; title: string; subtitle?: string; color: string }
type Dir = -1 | 1

/** Stacked cards you can drag, tap or arrow-key left/right to dismiss (swipe deck). */
export function SwipeCards({
  cards: initial,
  className,
  onSwipe,
  showControls = true,
  labels = { left: 'Pass', right: 'Keep' },
}: {
  cards: Card[]
  className?: string
  /** Fires after a card leaves the deck. */
  onSwipe?: (card: Card, direction: 'left' | 'right') => void
  /** Pass / keep / reset buttons under the deck (keyboard and touch friendly). */
  showControls?: boolean
  /** Words used for the two directions (buttons, stamps and announcements). */
  labels?: { left: string; right: string }
}) {
  const [cards, setCards] = React.useState(initial)
  const [dir, setDir] = React.useState<Dir>(1)
  const [announce, setAnnounce] = React.useState('')
  const reduced = usePrefersReducedMotion()

  const swipe = (d: Dir) => {
    const top = cards[cards.length - 1]
    if (!top) return
    setDir(d)
    const rest = cards.slice(0, -1)
    setCards(rest)
    const word = d === 1 ? labels.right : labels.left
    setAnnounce(`${top.title}: ${word}. ${rest.length ? `${rest.length} left` : 'Deck cleared'}.`)
    onSwipe?.(top, d === 1 ? 'right' : 'left')
  }
  const reset = () => {
    setCards(initial)
    setAnnounce(`Deck reset, ${initial.length} cards.`)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      swipe(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      swipe(1)
    }
  }

  const btn =
    'inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-700 ring-1 ring-zinc-950/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_6px_16px_-8px_rgba(0,0,0,0.2)] transition-[transform,background-color] duration-150 hover:bg-zinc-50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 disabled:opacity-40 disabled:active:scale-100 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-white/10 dark:hover:bg-zinc-800 dark:focus-visible:ring-signal-300'

  return (
    <div className={cn('mx-auto flex w-72 flex-col items-center gap-12', className)}>
      <div
        role="group"
        aria-roledescription="card deck"
        aria-label={`Card deck, ${cards.length} left. Use left and right arrow keys to ${labels.left.toLowerCase()} or ${labels.right.toLowerCase()}.`}
        tabIndex={0}
        onKeyDown={onKey}
        className="relative h-80 w-full rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent dark:focus-visible:ring-signal-300"
      >
        {cards.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-zinc-950/15 text-center dark:border-white/15">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">You’re all caught up</p>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Reset the deck to start again.</p>
          </div>
        )}
        <AnimatePresence custom={{ dir, reduced }}>
          {cards.map((card, i) => (
            <SwipeCard
              key={card.id}
              card={card}
              depth={cards.length - 1 - i}
              reduced={reduced}
              labels={labels}
              onSwipe={swipe}
            />
          ))}
        </AnimatePresence>
      </div>

      {showControls && (
        <div className="flex items-center gap-4">
          <button type="button" className={btn} onClick={() => swipe(-1)} disabled={!cards.length} aria-label={labels.left}>
            <X aria-hidden className="h-5 w-5" />
          </button>
          <button type="button" className={cn(btn, 'h-11 w-11')} onClick={reset} aria-label="Reset deck">
            <RotateCcw aria-hidden className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={cn(btn, 'text-rose-600 dark:text-rose-400')}
            onClick={() => swipe(1)}
            disabled={!cards.length}
            aria-label={labels.right}
          >
            <Heart aria-hidden className="h-5 w-5" />
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}

const exitVariants = {
  exit: ({ dir, reduced }: { dir: Dir; reduced: boolean }) =>
    reduced
      ? { opacity: 0, transition: { duration: 0.15 } }
      : { x: dir * 360, rotate: dir * 16, opacity: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 30 } },
}

function SwipeCard({
  card,
  depth,
  reduced,
  labels,
  onSwipe,
}: {
  card: Card
  depth: number
  reduced: boolean
  labels: { left: string; right: string }
  onSwipe: (d: Dir) => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-14, 14])
  const keep = useTransform(x, [20, 110], [0, 1])
  const pass = useTransform(x, [-110, -20], [1, 0])
  const isTop = depth === 0

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) onSwipe(info.offset.x > 0 ? 1 : -1)
  }

  return (
    <motion.div
      variants={exitVariants}
      exit="exit"
      initial={false}
      animate={{ scale: 1 - Math.min(depth, 3) * 0.05, y: Math.min(depth, 3) * 14, opacity: depth > 2 ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
      className={cn(
        'absolute inset-0 overflow-hidden rounded-[28px] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),0_24px_48px_-24px_rgba(0,0,0,0.5)] ring-1 ring-black/10 ring-inset',
        isTop && 'cursor-grab touch-pan-y active:cursor-grabbing',
      )}
      style={{
        x: isTop ? x : 0,
        rotate: isTop && !reduced ? rotate : 0,
        zIndex: 10 - depth,
        background: card.color,
        transformOrigin: '50% 100%',
      }}
      drag={isTop ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      aria-hidden={!isTop}
    >
      {/* art: soft light, grain-free sheen and a darkening scrim behind the text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 85% 0%, rgba(255,255,255,0.38), transparent 55%), radial-gradient(90% 70% at 0% 100%, rgba(0,0,0,0.25), transparent 60%), linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.42) 100%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <p className="text-2xl font-semibold tracking-[-0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,0.25)]">{card.title}</p>
        {card.subtitle && <p className="mt-1 text-sm text-white/90">{card.subtitle}</p>}
        {isTop && (
          <p className="mt-4 text-xs font-medium text-white/85">
            Drag, or use ← → keys
          </p>
        )}
      </div>
      {isTop && !reduced && (
        <>
          <motion.span
            aria-hidden
            style={{ opacity: keep }}
            className="absolute left-5 top-5 -rotate-6 rounded-lg px-2.5 py-1 text-xs font-bold tracking-[0.12em] uppercase ring-2 ring-white/90 backdrop-blur-sm"
          >
            {labels.right}
          </motion.span>
          <motion.span
            aria-hidden
            style={{ opacity: pass }}
            className="absolute right-5 top-5 rotate-6 rounded-lg px-2.5 py-1 text-xs font-bold tracking-[0.12em] uppercase ring-2 ring-white/90 backdrop-blur-sm"
          >
            {labels.left}
          </motion.span>
        </>
      )}
    </motion.div>
  )
}
