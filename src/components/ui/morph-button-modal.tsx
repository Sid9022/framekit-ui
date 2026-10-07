import * as React from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { Plus, X, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type MorphButtonModalProps = {
  label?: string
  title?: string
  onSubmit?: (data: { name: string; email: string }) => void
  className?: string
}

/**
 * Morph Button Modal — a pill button that physically becomes the dialog: its
 * surface expands on a shared-layout spring, the label cross-fades into a
 * form, and on submit it shrinks back into a success pill. Focus is trapped
 * and returned; Esc closes.
 */
export function MorphButtonModal({ label = 'Invite teammate', title = 'Invite to workspace', onSubmit, className }: MorphButtonModalProps) {
  const [state, setState] = React.useState<'idle' | 'open' | 'done'>('idle')
  const reduced = usePrefersReducedMotion()
  const btn = React.useRef<HTMLButtonElement>(null)
  const panel = React.useRef<HTMLFormElement>(null)
  const first = React.useRef<HTMLInputElement>(null)
  const id = React.useId()
  React.useEffect(() => {
    if (state === 'open') { first.current?.focus(); return }
    if (state === 'done') { const t = setTimeout(() => setState('idle'), 1800); return () => clearTimeout(t) }
  }, [state])
  const close = () => { setState('idle'); requestAnimationFrame(() => btn.current?.focus()) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close() }
    if (e.key === 'Tab' && panel.current) {
      const f = panel.current.querySelectorAll<HTMLElement>('input,button'); const a = f[0], b = f[f.length - 1]
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus() } else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus() }
    }
  }
  const surface = 'bg-zinc-950 text-white shadow-[0_1px_2px_rgb(0_0_0/0.2),0_24px_48px_-20px_rgb(0_0_0/0.6)] dark:bg-white dark:text-zinc-950'
  return (
    <MotionConfig transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}>
      <div className={cn('relative grid min-h-[380px] w-full place-items-center', className)}>
        <AnimatePresence mode="popLayout" initial={false}>
          {state === 'open' ? (
            <motion.form key="panel" ref={panel} layoutId={`${id}-s`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`} onKeyDown={onKey}
              onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSubmit?.({ name: String(fd.get('name')), email: String(fd.get('email')) }); setState('done') }}
              style={{ borderRadius: 24 }} className={cn('w-full max-w-[380px] p-5', surface)}>
              <motion.div initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)', transition: { delay: 0.08 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}>
                <div className="flex items-center justify-between"><h3 id={`${id}-t`} className="text-base font-semibold tracking-tight">{title}</h3>
                  <button type="button" onClick={close} aria-label="Close" className="grid size-8 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:bg-black/5 dark:hover:bg-black/10"><X className="size-4" /></button></div>
                <label className="mt-4 block text-xs font-medium text-white/70 dark:text-zinc-600">Name<input ref={first} name="name" required autoComplete="name" className="mt-1 h-10 w-full rounded-xl bg-white/10 px-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-sky-400 dark:bg-black/5 dark:text-zinc-950 dark:ring-black/10 dark:placeholder:text-zinc-500" placeholder="Ada Lovelace" /></label>
                <label className="mt-3 block text-xs font-medium text-white/70 dark:text-zinc-600">Email<input name="email" type="email" required autoComplete="email" spellCheck={false} className="mt-1 h-10 w-full rounded-xl bg-white/10 px-3 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-sky-400 dark:bg-black/5 dark:text-zinc-950 dark:ring-black/10 dark:placeholder:text-zinc-500" placeholder="ada@studio.com" /></label>
                <button type="submit" className="mt-5 h-10 w-full rounded-xl bg-white text-sm font-semibold text-zinc-950 transition-transform active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:bg-zinc-950 dark:text-white">Send invite</button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.button key="btn" ref={btn} layoutId={`${id}-s`} onClick={() => state === 'idle' && setState('open')} whileTap={{ scale: 0.96 }} aria-haspopup="dialog"
              style={{ borderRadius: 999 }} className={cn('inline-flex h-11 items-center gap-2 px-5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:ring-offset-zinc-950', state === 'done' ? 'bg-emerald-600 text-white shadow-[0_12px_32px_-12px_rgb(5_150_105/0.7)]' : surface)}>
              <motion.span key={state} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2" aria-live="polite">
                {state === 'done' ? <><Check className="size-4" />Invite sent</> : <><Plus className="size-4" />{label}</>}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
