import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, Info, Siren, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Tone = 'info' | 'warn' | 'critical'

const META: Record<Tone, { icon: typeof Info; label: string; cls: string; bar: string }> = {
  info: {
    icon: Info,
    label: 'Info',
    cls: 'border-sky-300/50 bg-sky-50 text-sky-950 dark:border-sky-700/50 dark:bg-sky-950/50 dark:text-sky-50',
    bar: 'bg-sky-500',
  },
  warn: {
    icon: AlertTriangle,
    label: 'Warning',
    cls: 'border-amber-300/50 bg-amber-50 text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-50',
    bar: 'bg-amber-500',
  },
  critical: {
    icon: Siren,
    label: 'Critical',
    cls: 'border-rose-400/50 bg-rose-50 text-rose-950 dark:border-rose-700/50 dark:bg-rose-950/40 dark:text-rose-50',
    bar: 'bg-rose-500',
  },
}

/** Full-width priority banner with slide-in, auto-dismiss progress, actions. */
export function PriorityBannerAlert({
  tone = 'warn',
  title = 'Elevated failure rate on SMS egress',
  body = 'Provider latency crossed 800ms. Failover to secondary route is recommended.',
  duration = 6000,
  className,
}: {
  tone?: Tone
  title?: string
  body?: string
  duration?: number
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = React.useState(true)
  const [toneState, setToneState] = React.useState<Tone>(tone)
  const meta = META[toneState]
  const Icon = meta.icon

  React.useEffect(() => {
    if (!visible) return
    const id = window.setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(id)
  }, [visible, duration, toneState])

  return (
    <div className={cn('flex w-full max-w-lg flex-col gap-3', className)}>
      <div className="flex gap-2">
        {(['info', 'warn', 'critical'] as Tone[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setToneState(t)
              setVisible(true)
            }}
            className="rounded-full border border-zinc-200 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider dark:border-zinc-700"
          >
            {t}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {visible && (
          <motion.div
            key={toneState + String(visible)}
            initial={reduced ? false : { opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={cn('relative overflow-hidden rounded-2xl border p-4 shadow-lg', meta.cls)}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-black/20">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-70">{meta.label}</span>
                </div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-0.5 text-xs opacity-80">{body}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="rounded-lg bg-black/10 px-3 py-1.5 text-xs font-semibold dark:bg-white/10">
                    Failover now
                  </button>
                  <button type="button" onClick={() => setVisible(false)} className="rounded-lg px-3 py-1.5 text-xs font-medium opacity-70 hover:opacity-100">
                    Dismiss
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => setVisible(false)} className="rounded-md p-1 opacity-60 hover:opacity-100" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <motion.div
              className={cn('absolute bottom-0 left-0 h-0.5', meta.bar)}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
