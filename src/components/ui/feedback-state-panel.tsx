import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, FolderPlus, Loader2, Lock, RotateCcw, WifiOff, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type FeedbackVariant = 'empty' | 'error' | 'offline' | 'permission' | 'success'

export type FeedbackStatePanelProps = {
  /** Controlled variant. */
  variant?: FeedbackVariant
  defaultVariant?: FeedbackVariant
  onVariantChange?: (v: FeedbackVariant) => void
  /** Override the copy for the current variant. */
  title?: string
  description?: string
  primaryLabel?: string
  /** Primary action; return a promise to show the loading state (resolve → success, reject → error). */
  onPrimary?: (variant: FeedbackVariant) => void | Promise<void>
  secondaryLabel?: string
  onSecondary?: () => void
  /** Show the variant switcher (useful in docs). */
  showSwitcher?: boolean
  /** Heading level. */
  titleAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

const COPY: Record<FeedbackVariant, { title: string; body: string; primary: string; secondary?: string; icon: React.ElementType; tone: string; glyph: string }> = {
  empty: { title: 'No projects yet', body: 'Projects hold your pages, components and deploys. Start from a template or import an existing repository.', primary: 'Create project', secondary: 'Import repository', icon: FolderPlus, tone: 'text-signal-700 dark:text-signal-200', glyph: 'from-signal-100 to-white dark:from-signal-300/20 dark:to-zinc-900' },
  error: { title: 'We couldn’t load your projects', body: 'The request timed out after 10 seconds. Your work is safe — try again, or check the status page if it keeps happening.', primary: 'Try again', secondary: 'View status', icon: Zap, tone: 'text-rose-700 dark:text-rose-300', glyph: 'from-rose-100 to-white dark:from-rose-500/20 dark:to-zinc-900' },
  offline: { title: 'You’re offline', body: 'Changes are saved on this device and will sync when you reconnect.', primary: 'Retry connection', icon: WifiOff, tone: 'text-amber-800 dark:text-amber-300', glyph: 'from-amber-100 to-white dark:from-amber-500/20 dark:to-zinc-900' },
  permission: { title: 'Ask for access', body: 'Only workspace admins can view billing. We’ll let Amara Osei know you asked.', primary: 'Request access', secondary: 'Switch workspace', icon: Lock, tone: 'text-zinc-700 dark:text-zinc-300', glyph: 'from-zinc-100 to-white dark:from-white/10 dark:to-zinc-900' },
  success: { title: 'All caught up', body: 'Every deploy is green and there’s nothing waiting for review.', primary: 'Back to dashboard', icon: Check, tone: 'text-emerald-700 dark:text-emerald-300', glyph: 'from-emerald-100 to-white dark:from-emerald-500/20 dark:to-zinc-900' },
}
const ORDER: FeedbackVariant[] = ['empty', 'error', 'offline', 'permission', 'success']
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-900'

function Glyph({ v, reduced }: { v: FeedbackVariant; reduced: boolean }) {
  const c = COPY[v]
  const Icon = c.icon
  return (
    <div aria-hidden className="relative grid size-24 place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-[28px] ring-1 ring-black/[0.05] dark:ring-white/[0.06]"
          style={{ scale: 1 + i * 0.22, opacity: 0.9 - i * 0.3 }}
          animate={reduced ? undefined : { scale: [1 + i * 0.22, 1.06 + i * 0.22, 1 + i * 0.22] }}
          transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        />
      ))}
      <div className={cn('relative grid size-20 place-items-center rounded-[24px] bg-gradient-to-b shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_32px_-16px_rgb(0_0_0/0.3),inset_0_1px_0_rgb(255_255_255/0.8)] ring-1 ring-black/[0.06] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] dark:ring-white/[0.1]', c.glyph)}>
        <motion.span
          key={v}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: v === 'error' ? -12 : 0 }}
          animate={reduced ? { opacity: 1 } : v === 'error' ? { opacity: 1, scale: 1, rotate: [-12, 8, -4, 0] } : { opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          className={c.tone}
        >
          <Icon className="size-8" strokeWidth={1.75} />
        </motion.span>
      </div>
    </div>
  )
}

/**
 * Feedback State Panel — one composable surface for the screens nobody
 * designs: empty, error, offline, permission and success. Each variant has
 * its own glyph and motion character (a gentle settle for empty, a short
 * shake for error, a breathing halo for waiting), copy that names the next
 * step, and a primary action with a real loading → success / error loop.
 * Errors are announced as alerts; everything else politely.
 */
export function FeedbackStatePanel({
  variant,
  defaultVariant = 'empty',
  onVariantChange,
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  showSwitcher = false,
  titleAs: Title = 'h3',
  className,
}: FeedbackStatePanelProps) {
  const reduced = usePrefersReducedMotion()
  const tid = React.useId()
  const [inner, setInner] = React.useState<FeedbackVariant>(defaultVariant)
  const v = variant ?? inner
  const set = (n: FeedbackVariant) => { if (variant === undefined) setInner(n); onVariantChange?.(n) }
  const [busy, setBusy] = React.useState(false)
  const c = COPY[v]

  const primary = async () => {
    setBusy(true)
    const started = Date.now()
    try {
      await (onPrimary ? onPrimary(v) : new Promise((r) => setTimeout(r, 900)))
      await new Promise((r) => setTimeout(r, Math.max(0, 400 - (Date.now() - started))))
      if (v === 'error' || v === 'offline') set('success')
    } catch {
      set('error')
    } finally {
      setBusy(false)
    }
  }

  const rise = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -6, filter: 'blur(4px)' },
    transition: reduced ? { duration: 0.15 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.04 },
  })

  return (
    <div className={cn('flex w-full max-w-md flex-col items-center gap-6', className)}>
      <section
        aria-labelledby={tid}
        className="relative w-full overflow-hidden rounded-[28px] bg-white px-6 py-10 text-center ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] sm:px-10 dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(125_104_153/0.08),transparent)] dark:bg-[radial-gradient(60%_50%_at_50%_0%,rgb(212_203_229/0.08),transparent)]" />
        <div className="relative flex flex-col items-center">
          <Glyph v={v} reduced={reduced} />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={v} className="mt-8 flex flex-col items-center">
              <motion.div {...rise(0)}>
                <Title id={tid} className="text-balance text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">{title ?? c.title}</Title>
              </motion.div>
              <motion.p {...rise(1)} className="mt-2 max-w-[42ch] text-pretty text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description ?? c.body}</motion.p>
              <motion.div {...rise(2)} className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <motion.button
                  type="button"
                  onClick={primary}
                  disabled={busy}
                  whileTap={reduced || busy ? undefined : { scale: 0.97 }}
                  className={cn('inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-zinc-950 px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgb(0_0_0/0.1),inset_0_1px_0_rgb(255_255_255/0.12)] transition-colors duration-150 hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-80 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200', FOCUS)}
                >
                  {busy ? <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" /> : (v === 'error' || v === 'offline') && <RotateCcw aria-hidden className="size-4" />}
                  {busy ? (v === 'error' || v === 'offline' ? 'Retrying…' : 'Working…') : primaryLabel ?? c.primary}
                </motion.button>
                {(secondaryLabel ?? c.secondary) && (
                  <button type="button" onClick={onSecondary} className={cn('inline-flex min-h-11 items-center rounded-[14px] px-4 text-sm font-medium text-zinc-800 ring-1 ring-black/[0.1] transition-colors duration-150 hover:bg-zinc-900/[0.04] hover:text-zinc-950 dark:text-zinc-200 dark:ring-white/[0.14] dark:hover:bg-white/[0.06] dark:hover:text-white', FOCUS)}>
                    {secondaryLabel ?? c.secondary}
                  </button>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        {v === 'error' ? <p role="alert" className="sr-only">{title ?? c.title}</p> : <p role="status" aria-live="polite" className="sr-only">{v === 'success' && !busy ? c.title : ''}</p>}
      </section>
      {showSwitcher && (
        <div role="group" aria-label="Preview state" className="flex max-w-full flex-wrap justify-center gap-1.5">
          {ORDER.map((o) => (
            <button key={o} type="button" aria-pressed={v === o} onClick={() => set(o)} className={cn('min-h-9 rounded-full px-3 text-[13px] font-medium capitalize transition-colors duration-150 pointer-coarse:min-h-11', v === o ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'bg-white text-zinc-700 ring-1 ring-black/[0.08] hover:text-zinc-950 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-white/[0.1] dark:hover:text-white', FOCUS)}>{o}</button>
          ))}
        </div>
      )}
    </div>
  )
}
