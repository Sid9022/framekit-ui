import * as React from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Approved template preview with header media, body vars, footer, CTAs + shimmer approve. */
export function TemplateMessageCard({
  name = 'order_update_v3',
  header = 'Your order is on the way',
  body = 'Hi {{1}}, package {{2}} left our hub and should arrive by {{3}}.',
  vars = ['Maya', '#FK-20481', 'Thursday 6pm'],
  footer = 'Reply HELP for support · STOP to opt out',
  className,
}: {
  name?: string
  header?: string
  body?: string
  vars?: string[]
  footer?: string
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [approved, setApproved] = React.useState(false)

  const rendered = React.useMemo(() => {
    let t = body
    vars.forEach((v, i) => {
      t = t.replace(`{{${i + 1}}}`, v)
    })
    return t
  }, [body, vars])

  return (
    <div
      className={cn(
        'w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_55px_-30px_rgba(53,43,66,0.45)] dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">Template</p>
          <p className="text-sm font-semibold">{name}</p>
        </div>
        <button
          type="button"
          onClick={() => setApproved(true)}
          className={cn(
            'relative overflow-hidden rounded-full px-3 py-1.5 text-xs font-semibold transition',
            approved
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              : 'bg-signal-500 text-white shadow-md shadow-signal-500/30',
          )}
        >
          {!approved && !reduced && (
            <motion.span
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              animate={{ x: ['-100%', '120%'] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
            />
          )}
          <span className="relative flex items-center gap-1">
            {approved && <CheckCircle2 className="h-3.5 w-3.5" />}
            {approved ? 'Approved' : 'Submit review'}
          </span>
        </button>
      </div>

      <div className="space-y-2 bg-zinc-50 p-4 dark:bg-zinc-900/50">
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
          <div className="flex h-28 items-center justify-center bg-gradient-to-br from-signal-300/40 via-signal-500/20 to-framekit-400/30">
            <ImageIcon className="h-8 w-8 text-signal-700/70 dark:text-signal-200/70" />
          </div>
          <div className="space-y-2 p-3">
            <p className="text-sm font-semibold">{header}</p>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{rendered}</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{footer}</p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2 text-xs font-medium text-signal-700 dark:border-zinc-700 dark:text-signal-300"
              >
                Track order
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2 text-xs font-medium text-signal-700 dark:border-zinc-700 dark:text-signal-300"
              >
                <ExternalLink className="h-3 w-3" />
                Website
              </button>
            </div>
            <div className="flex gap-2">
              {['Confirm', 'Reschedule'].map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-signal-400/15 px-2.5 py-1 text-[10px] font-medium text-signal-800 dark:text-signal-200"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          Vars · {vars.map((v, i) => `{{${i + 1}}}=${v}`).join(' · ')}
        </p>
      </div>
    </div>
  )
}
