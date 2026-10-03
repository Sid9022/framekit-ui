import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type CopyEmailButtonProps = {
  email?: string
  /** Text shown after copying. */
  copiedLabel?: string
  /** ms before returning to idle. */
  resetAfter?: number
  onCopy?: (email: string) => void
  className?: string
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

/**
 * Copy Email Button — a pill that shows your address. Press it and the glyph draws into a check, the label rolls to
 * “Copied” on a blurred vertical swap, a ring pulses out and a polite live region confirms. Falls back to a select
 * hint if the clipboard is blocked.
 */
export function CopyEmailButton({ email = 'hello@yourname.studio', copiedLabel = 'Copied to clipboard', resetAfter = 2200, onCopy, className }: CopyEmailButtonProps) {
  const reduced = usePrefersReducedMotion()
  const [state, setState] = React.useState<'idle' | 'copied' | 'failed'>('idle')
  const [pulse, setPulse] = React.useState(0)
  const timer = React.useRef<number>(0)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  const click = async () => {
    const ok = await copyText(email)
    setState(ok ? 'copied' : 'failed')
    setPulse((p) => p + 1)
    if (ok) onCopy?.(email)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), resetAfter)
  }
  const swap = { initial: reduced ? { opacity: 0 } : { y: 14, opacity: 0, filter: 'blur(4px)' }, animate: { y: 0, opacity: 1, filter: 'blur(0px)' }, exit: reduced ? { opacity: 0 } : { y: -14, opacity: 0, filter: 'blur(4px)' } }
  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <motion.button
        type="button"
        onClick={click}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
        className={cn('group relative inline-flex min-h-12 items-center gap-3 overflow-visible rounded-full border py-2 pl-5 pr-2 text-base font-medium shadow-sm transition-colors duration-300', state === 'copied' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-100' : state === 'failed' ? 'border-amber-600 bg-amber-50 text-amber-950 dark:border-amber-400 dark:bg-amber-950/60 dark:text-amber-100' : 'border-zinc-300 bg-white text-zinc-950 hover:border-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-300')}
      >
        {!reduced && pulse > 0 && state !== 'idle' && <motion.span key={pulse} aria-hidden className="pointer-events-none absolute inset-0 rounded-full border-2 border-emerald-500" initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.35, opacity: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} />}
        <span className="relative inline-grid h-6 overflow-hidden text-left [&>*]:col-start-1 [&>*]:row-start-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={state} {...swap} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} className="leading-6">
              {state === 'idle' ? email : state === 'copied' ? copiedLabel : 'Select & press Ctrl+C'}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className={cn('grid h-8 w-8 place-items-center rounded-full transition-colors duration-300', state === 'copied' ? 'bg-emerald-600 text-white dark:bg-emerald-400 dark:text-emerald-950' : state === 'failed' ? 'bg-amber-600 text-white dark:bg-amber-400 dark:text-amber-950' : 'bg-zinc-950 text-white group-hover:bg-signal-700 dark:bg-zinc-50 dark:text-zinc-950')}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={state} initial={reduced ? false : { scale: 0.4, rotate: -90, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={reduced ? undefined : { scale: 0.4, opacity: 0 }} transition={{ type: 'spring', stiffness: 520, damping: 22 }} className="grid">
              {state === 'idle' ? <Copy className="h-4 w-4" aria-hidden /> : state === 'copied' ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> : <TriangleAlert className="h-4 w-4" aria-hidden />}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="sr-only">Copy email address</span>
      </motion.button>
      <span role="status" aria-live="polite" className="sr-only">{state === 'copied' ? `${email} copied to clipboard` : state === 'failed' ? 'Copy failed. Select the address and press Control C.' : ''}</span>
    </div>
  )
}
