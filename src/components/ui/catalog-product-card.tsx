import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { ShoppingCart, Check } from 'lucide-react'

/** Product catalog card with price, image placeholder, add-to-cart micro interaction. */
export function CatalogProductCard({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [added, setAdded] = React.useState(false)

  const add = () => {
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className={cn('w-full max-w-[220px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950', className)}>
      <div className="relative aspect-square bg-gradient-to-br from-signal-300/40 via-violet-400/30 to-framekit-400/40">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-white/40 shadow-inner backdrop-blur-sm dark:bg-white/10" />
        </div>
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur">New</span>
      </div>
      <div className="space-y-2 p-3">
        <p className="text-sm font-semibold leading-snug">Signal Soft Hoodie</p>
        <p className="text-xs text-zinc-500">Lilac mist · Unisex</p>
        <div className="flex items-center justify-between pt-1">
          <p className="text-base font-bold text-signal-700 dark:text-signal-300">$68</p>
          <motion.button
            type="button"
            onClick={add}
            whileTap={reduced ? undefined : { scale: 0.9 }}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition',
              added ? 'bg-emerald-500/20 text-emerald-600' : 'bg-signal-500 text-white',
            )}
          >
            {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            {added ? 'Added' : 'Add'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
