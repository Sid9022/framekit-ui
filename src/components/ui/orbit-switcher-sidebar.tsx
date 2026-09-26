import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { MessageSquare, Phone, Smartphone, type LucideIcon } from 'lucide-react'

type Product = 'messaging' | 'voice' | 'sms'

const PRODUCTS: { id: Product; label: string; icon: LucideIcon; hue: string; items: string[] }[] = [
  {
    id: 'messaging',
    label: 'Messaging',
    icon: MessageSquare,
    hue: 'from-signal-500 to-violet-600',
    items: ['Inbox', 'Templates', 'Flows', 'Opt-ins'],
  },
  {
    id: 'voice',
    label: 'Voice',
    icon: Phone,
    hue: 'from-sky-500 to-indigo-600',
    items: ['Live calls', 'Queues', 'IVR', 'Recordings'],
  },
  {
    id: 'sms',
    label: 'SMS',
    icon: Smartphone,
    hue: 'from-framekit-500 to-rose-600',
    items: ['Senders', 'Campaigns', 'Delivery', 'Keywords'],
  },
]

/** Multi-product switcher orb/rail that morphs context between Messaging / Voice / SMS. */
export function OrbitSwitcherSidebar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [product, setProduct] = React.useState<Product>('messaging')
  const [active, setActive] = React.useState('Inbox')
  const current = PRODUCTS.find((p) => p.id === product)!
  const Icon = current.icon

  React.useEffect(() => {
    setActive(current.items[0])
  }, [product])

  return (
    <aside className={cn('flex h-[400px] w-[240px] flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0a12] text-zinc-900 dark:text-zinc-100', className)}>
      <div className="flex flex-col items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
        <div className="relative flex h-20 w-20 items-center justify-center">
          {PRODUCTS.map((p, i) => {
            const a = (i / PRODUCTS.length) * Math.PI * 2 - Math.PI / 2
            const x = Math.cos(a) * 34
            const y = Math.sin(a) * 34
            const PIcon = p.icon
            const on = product === p.id
            return (
              <motion.button
                key={p.id}
                type="button"
                onClick={() => setProduct(p.id)}
                className={cn(
                  'absolute flex h-8 w-8 items-center justify-center rounded-full border transition',
                  on ? 'border-zinc-900/25 dark:border-white/40 bg-zinc-900/[0.07] dark:bg-white/15 text-zinc-900 dark:text-white' : 'border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200',
                )}
                style={{ left: `calc(50% + ${x}px - 16px)`, top: `calc(50% + ${y}px - 16px)` }}
                animate={on && !reduced ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: on ? Infinity : 0 }}
                aria-label={p.label}
              >
                <PIcon className="h-3.5 w-3.5" />
              </motion.button>
            )
          })}
          <motion.div
            key={product}
            initial={reduced ? false : { scale: 0.7, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className={cn('flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg', current.hue)}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={product}
            initial={reduced ? false : { y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            className="text-sm font-semibold"
          >
            {current.label}
          </motion.p>
        </AnimatePresence>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        <AnimatePresence mode="wait">
          <motion.ul
            key={product}
            initial={reduced ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-1"
          >
            {current.items.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className={cn(
                    'w-full rounded-xl px-3 py-2 text-left text-sm transition',
                    active === item ? 'bg-signal-500/25 text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-900/[0.04] dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200',
                  )}
                >
                  {item}
                </button>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </nav>
    </aside>
  )
}
