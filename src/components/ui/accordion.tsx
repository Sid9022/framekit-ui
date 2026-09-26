import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export function Accordion({
  items,
  className,
  type = 'single',
}: {
  items: { value: string; title: string; content: React.ReactNode }[]
  className?: string
  type?: 'single' | 'multiple'
}) {
  const [open, setOpen] = React.useState<string[]>([])
  const reduced = usePrefersReducedMotion()

  const toggle = (v: string) => {
    setOpen((prev) => {
      const isOpen = prev.includes(v)
      if (type === 'single') return isOpen ? [] : [v]
      return isOpen ? prev.filter((x) => x !== v) : [...prev, v]
    })
  }

  return (
    <div className={cn('divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.value)
        return (
          <div key={item.value}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(item.value)}
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
            >
              {item.title}
              <ChevronDown
                className={cn('h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400 transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
