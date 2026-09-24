import * as React from 'react'
import { motion, useMotionValue, animate } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type TideCard = { id: string; title: string; body: string; tone?: string }

/** Horizontally draggable deck — radius & depth respond to drag velocity. */
export function TideDeck({
  cards,
  className,
}: {
  cards: TideCard[]
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = React.useState(0)
  const x = useMotionValue(0)

  const go = (dir: number) => {
    setIndex((i) => (i + dir + cards.length) % cards.length)
    x.set(0)
  }

  return (
    <div className={cn('relative mx-auto w-full max-w-sm', className)}>
      <div className="relative h-56">
        {cards.map((card, i) => {
          const offset = (i - index + cards.length) % cards.length
          const visible = offset < 3
          if (!visible) return null
          const isFront = offset === 0
          return (
            <motion.div
              key={card.id}
              className="absolute inset-0 flex flex-col justify-between border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
              style={{
                x: isFront ? x : 0,
                zIndex: 10 - offset,
                scale: 1 - offset * 0.04,
                y: offset * 10,
                borderRadius: reduced ? 20 : 16 + offset * 6,
                background: card.tone || undefined,
              }}
              drag={isFront && !reduced ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
                  go(info.offset.x > 0 ? -1 : 1)
                } else {
                  animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
                }
              }}
              role={isFront ? 'group' : undefined}
              aria-roledescription={isFront ? 'slide' : undefined}
              aria-label={isFront ? card.title : undefined}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Deck</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{card.body}</p>
              </div>
              <p className="text-xs text-zinc-400">
                {index + 1} / {cards.length}
              </p>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Previous card"
          onClick={() => go(-1)}
          className="rounded-full border border-zinc-200 p-2 dark:border-zinc-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next card"
          onClick={() => go(1)}
          className="rounded-full border border-zinc-200 p-2 dark:border-zinc-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
