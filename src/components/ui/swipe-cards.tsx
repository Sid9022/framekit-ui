import * as React from 'react'
import { motion, useMotionValue, useTransform, type PanInfo } from 'motion/react'
import { cn } from '@/lib/cn'

type Card = { id: string; title: string; subtitle?: string; color: string }

/** Stacked cards you can drag left/right to dismiss (swipe deck). */
export function SwipeCards({
  cards: initial,
  className,
}: {
  cards: Card[]
  className?: string
}) {
  const [cards, setCards] = React.useState(initial)

  const remove = (id: string) => setCards((c) => c.filter((x) => x.id !== id))

  return (
    <div className={cn('relative mx-auto h-64 w-72', className)}>
      {cards.length === 0 && (
        <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700">
          Deck cleared — refresh to reset
        </div>
      )}
      {cards.map((card, i) => (
        <SwipeCard
          key={card.id}
          card={card}
          index={i}
          total={cards.length}
          onRemove={() => remove(card.id)}
        />
      ))}
    </div>
  )
}

function SwipeCard({
  card,
  index,
  total,
  onRemove,
}: {
  card: Card
  index: number
  total: number
  onRemove: () => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-18, 18])
  const opacity = useTransform(x, [-200, -120, 0, 120, 200], [0, 1, 1, 1, 0])
  const isTop = index === total - 1

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 120) onRemove()
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl p-5 shadow-xl"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : (total - 1 - index) * 2,
        opacity: isTop ? opacity : 1,
        zIndex: index,
        background: card.color,
        scale: 1 - (total - 1 - index) * 0.04,
        y: (total - 1 - index) * 8,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
    >
      <p className="text-lg font-semibold text-white">{card.title}</p>
      {card.subtitle && <p className="mt-1 text-sm text-white/80">{card.subtitle}</p>}
      {isTop && <p className="absolute bottom-4 left-5 text-xs text-white/70">Drag to swipe</p>}
    </motion.div>
  )
}
