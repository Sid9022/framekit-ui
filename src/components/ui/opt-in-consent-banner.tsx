import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Soft WhatsApp-style opt-in compliance banner with animated check / decline. */
export function OptInConsentBanner({
  brand = 'Framekit Commerce',
  className,
}: {
  brand?: string
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [state, setState] = React.useState<'idle' | 'accepted' | 'declined'>('idle')

  return (
    <div className={cn('w-full max-w-lg', className)}>
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="rounded-2xl border border-signal-300/40 bg-gradient-to-br from-signal-50 to-white p-4 shadow-[0_20px_45px_-28px_rgba(53,43,66,0.45)] dark:border-signal-700/40 dark:from-signal-900/40 dark:to-zinc-950"
          >
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Message opt-in</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              {brand} would like to send you order updates and support replies over messaging. You can opt out anytime
              by replying <span className="font-mono text-signal-700 dark:text-signal-300">STOP</span>.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setState('accepted')}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-signal-500 py-2.5 text-xs font-semibold text-white shadow-md shadow-signal-500/30"
              >
                <Check className="h-3.5 w-3.5" />
                Yes, opt in
              </button>
              <button
                type="button"
                onClick={() => setState('declined')}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-200 py-2.5 text-xs font-semibold text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
                No thanks
              </button>
            </div>
          </motion.div>
        )}
        {state === 'accepted' && (
          <motion.div
            key="ok"
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-50/80 px-4 py-4 dark:border-emerald-700/40 dark:bg-emerald-950/40"
          >
            <motion.span
              initial={reduced ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white"
            >
              <Check className="h-5 w-5" />
            </motion.span>
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">You are opted in</p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">We will only message about your orders.</p>
            </div>
            <button type="button" onClick={() => setState('idle')} className="ml-auto text-[10px] font-medium text-emerald-700 underline dark:text-emerald-300">
              Reset
            </button>
          </motion.div>
        )}
        {state === 'declined' && (
          <motion.div
            key="no"
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              <X className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">No messages will be sent</p>
              <p className="text-xs text-zinc-500">You can opt in later from account settings.</p>
            </div>
            <button type="button" onClick={() => setState('idle')} className="ml-auto text-[10px] font-medium text-zinc-500 underline">
              Reset
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
