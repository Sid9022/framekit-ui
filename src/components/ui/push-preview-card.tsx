import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Mobile-style push notification preview for marketing / CPaaS. */
export function PushPreviewCard({
  app = 'Framekit',
  title = 'Your parcel is out for delivery',
  body = 'Courier is 12 minutes away. Tap to track live.',
  time = 'now',
  className,
}: {
  app?: string
  title?: string
  body?: string
  time?: string
  className?: string
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className={cn('flex w-full max-w-sm flex-col items-center gap-3', className)}>
      <div className="w-full rounded-[2rem] border border-zinc-300 bg-gradient-to-b from-zinc-200 to-zinc-100 p-3 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900">
        <div className="mb-3 flex justify-center">
          <span className="h-1.5 w-16 rounded-full bg-zinc-400/50" />
        </div>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="rounded-2xl border border-white/60 bg-white/90 p-3 shadow-xl backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/90"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-signal-400 to-signal-600 text-[10px] font-bold text-white shadow-md">
              Fk
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{app}</p>
                <span className="text-[10px] text-zinc-400">{time}</span>
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{body}</p>
            </div>
          </div>
        </motion.div>
        <div className="mt-8 h-24 rounded-2xl bg-zinc-300/40 dark:bg-zinc-800/60" />
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-400">Push preview · CPaaS</p>
    </div>
  )
}
