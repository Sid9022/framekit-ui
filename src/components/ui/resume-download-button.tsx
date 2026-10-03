import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Download } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ResumeDownloadButtonProps = {
  /** File URL — a real download is triggered when the sheet lands in the tray. */
  href?: string
  /** Downloaded file name. */
  fileName?: string
  /** Meta shown on the button (“PDF · 184 KB”). */
  meta?: string
  label?: string
  /** Called after the animation instead of / in addition to the anchor download. */
  onDownload?: () => void
  /** ms for the “printing” phase. */
  duration?: number
  className?: string
}

type Phase = 'idle' | 'printing' | 'done'

/**
 * Résumé Download Button — click and the document glyph prints itself line by line, then drops into a tray as the
 * file downloads and the label settles on “Saved”. A calm paper-and-tray metaphor, with a live status for screen readers.
 */
export function ResumeDownloadButton({ href, fileName = 'resume.pdf', meta = 'PDF · 184 KB', label = 'Download résumé', onDownload, duration = 1500, className }: ResumeDownloadButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const timers = React.useRef<number[]>([])
  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), [])
  const start = () => {
    if (phase !== 'idle') return
    setPhase('printing')
    const dur = reduced ? 300 : duration
    timers.current.push(window.setTimeout(() => {
      setPhase('done')
      if (href) { const a = document.createElement('a'); a.href = href; a.download = fileName; document.body.appendChild(a); a.click(); a.remove() }
      onDownload?.()
    }, dur))
    timers.current.push(window.setTimeout(() => setPhase('idle'), dur + 2600))
  }
  const lines = [0, 1, 2, 3]
  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <motion.button
        type="button"
        onClick={start}
        aria-disabled={phase !== 'idle'}
        whileHover={reduced || phase !== 'idle' ? undefined : { y: -2 }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 460, damping: 26 }}
        className={cn('group relative flex min-h-14 items-center gap-3.5 overflow-hidden rounded-2xl border py-2 pl-2.5 pr-5 text-left shadow-sm transition-colors duration-500', phase === 'done' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-50' : 'border-zinc-300 bg-white text-zinc-950 hover:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-300')}
      >
        <span className="relative grid h-10 w-10 shrink-0 place-items-center" aria-hidden>
          <span className={cn('absolute inset-x-1 bottom-0 h-1.5 rounded-full transition-colors duration-500', phase === 'done' ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-zinc-300 dark:bg-zinc-700')} />
          <motion.span
            className="absolute inset-x-[7px] top-0 flex h-9 flex-col gap-[3px] rounded-[5px] bg-zinc-950 p-[5px] pt-[7px] shadow-sm dark:bg-zinc-50"
            initial={false}
            animate={phase === 'done' ? { y: 7, scaleY: 0.35, opacity: 0.9 } : { y: 0, scaleY: 1, opacity: 1 }}
            style={{ originY: 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
          >
            {lines.map((k) => (
              <motion.span
                key={k}
                className="h-[3px] origin-left rounded-full bg-white dark:bg-zinc-950"
                style={{ width: k === 3 ? '55%' : '100%' }}
                initial={false}
                animate={{ scaleX: phase === 'idle' && k > 0 ? (k === 1 ? 0.7 : 0.45) : 1, opacity: phase === 'printing' ? [0.2, 1] : 1 }}
                transition={phase === 'printing' && !reduced ? { duration: (duration / 1000) / 4, delay: (k * duration) / 4000, ease: 'easeOut' } : { duration: 0.2 }}
              />
            ))}
          </motion.span>
        </span>
        <span className="flex min-w-[9.5rem] flex-col leading-tight">
          <span className="relative h-5 overflow-hidden text-base font-semibold">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={phase} className="block" initial={reduced ? { opacity: 0 } : { y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { y: -18, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
                {phase === 'idle' ? label : phase === 'printing' ? 'Preparing…' : 'Saved to downloads'}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">{phase === 'done' ? fileName : meta}</span>
        </span>
        <span className={cn('grid h-8 w-8 place-items-center rounded-full transition-colors duration-500', phase === 'done' ? 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950' : 'bg-zinc-950 text-white group-hover:bg-signal-700 dark:bg-zinc-50 dark:text-zinc-950')} aria-hidden>
          {phase === 'done' ? <Check className="h-4 w-4" strokeWidth={3} /> : <motion.span animate={phase === 'printing' && !reduced ? { y: [0, 3, 0] } : { y: 0 }} transition={{ repeat: phase === 'printing' ? Infinity : 0, duration: 0.7 }}><Download className="h-4 w-4" /></motion.span>}
        </span>
      </motion.button>
      <span role="status" aria-live="polite" className="sr-only">{phase === 'printing' ? 'Preparing résumé' : phase === 'done' ? `Résumé downloaded as ${fileName}` : ''}</span>
    </div>
  )
}
