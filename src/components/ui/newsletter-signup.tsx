import * as React from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type NewsletterStatus = 'idle' | 'loading' | 'success' | 'error'

export type NewsletterSignupProps = {
  title?: string
  description?: string
  /** Resolve to subscribe, reject (or throw) to show the error state. Defaults to a fake 1.2 s request that fails for addresses containing “fail”. */
  onSubscribe?: (email: string) => Promise<void>
  buttonLabel?: string
  className?: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Newsletter Signup — an inline email capture whose button morphs between
 * Subscribe → spinner → check, with inline validation, a shake on error, a
 * polite live region and a success state that swaps the form for a thank-you.
 */
export function NewsletterSignup({ title = 'The changelog, in your inbox', description = 'One short email a month. Product updates and engineering notes — no spam, unsubscribe anytime.', onSubscribe, buttonLabel = 'Subscribe', className }: NewsletterSignupProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<NewsletterStatus>('idle')
  const [msg, setMsg] = React.useState('')
  const controls = useAnimationControls()
  const setShake = (_: unknown) => { if (!reduced) controls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.35 } }) }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return
    if (!EMAIL.test(email.trim())) { setStatus('error'); setMsg('Enter a valid email, like name@company.com.'); setShake(0); return }
    setStatus('loading'); setMsg('')
    try {
      await (onSubscribe ? onSubscribe(email.trim()) : new Promise<void>((res, rej) => setTimeout(() => (email.includes('fail') ? rej(new Error()) : res()), 1200)))
      setStatus('success'); setMsg(`Check ${email.trim()} to confirm.`)
    } catch {
      setStatus('error'); setMsg('Something went wrong. Please try again.'); setShake(0)
    }
  }
  return (
    <section aria-labelledby={`${id}-t`} className={cn('w-full max-w-xl rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] sm:p-8 dark:border-white/10 dark:bg-zinc-900 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]', className)}>
      <h2 id={`${id}-t`} className="text-balance text-xl font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">{title}</h2>
      <p className="mt-1.5 text-pretty text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div key="ok" initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} className="mt-5 flex items-center gap-3 rounded-[14px] bg-emerald-600/[0.08] p-3 dark:bg-emerald-400/10">
            <motion.span initial={reduced ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.1 }} className="grid size-8 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-4" aria-hidden /></motion.span>
            <div><p className="text-sm font-medium text-zinc-900 dark:text-white">You’re on the list.</p><p className="text-[13px] text-zinc-700 dark:text-zinc-300">{msg}</p></div>
            <button type="button" onClick={() => { setStatus('idle'); setEmail('') }} className="ml-auto rounded-[8px] px-2 py-1 text-[13px] font-medium text-zinc-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-zinc-300">Undo</button>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={submit} exit={{ opacity: 0, y: -6 }} className="mt-5">
            <motion.div animate={controls}
              className={cn('flex flex-col gap-2 rounded-[14px] sm:flex-row sm:rounded-full sm:border sm:bg-zinc-50 sm:p-1 sm:dark:bg-zinc-950/60', status === 'error' ? 'sm:border-red-500/60' : 'sm:border-black/[0.08] sm:focus-within:border-signal-500 sm:dark:border-white/10')}>
              <label htmlFor={`${id}-e`} className="sr-only">Email address</label>
              <input id={`${id}-e`} type="email" inputMode="email" autoComplete="email" spellCheck={false} value={email} onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                placeholder="you@company.com" aria-invalid={status === 'error' || undefined} aria-describedby={`${id}-m`} disabled={status === 'loading'}
                className="h-11 min-w-0 flex-1 rounded-[12px] border border-black/[0.1] bg-zinc-50 px-4 text-base text-zinc-900 outline-none placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-signal-500 sm:rounded-full sm:border-0 sm:bg-transparent sm:text-sm sm:focus-visible:ring-0 dark:border-white/10 dark:bg-zinc-950/60 dark:text-white sm:dark:bg-transparent" />
              <motion.button type="submit" layout={!reduced} aria-busy={status === 'loading'} transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-zinc-900 px-5 text-sm font-medium text-white transition-[background-color,transform] hover:bg-zinc-800 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2 sm:h-10 sm:rounded-full dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus-visible:ring-offset-zinc-900">
                {status === 'loading' ? <><Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />Subscribing…</> : <>{buttonLabel}<ArrowRight aria-hidden className="size-4" /></>}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
      <p id={`${id}-m`} role="status" aria-live="polite" className={cn('mt-2 flex min-h-5 items-center gap-1.5 text-[13px]', status === 'error' ? 'text-red-700 dark:text-red-400' : 'text-zinc-600 dark:text-zinc-400')}>
        {status === 'error' && <AlertCircle aria-hidden className="size-3.5" />}{status === 'error' ? msg : status === 'success' ? '' : 'We’ll never share your email.'}
      </p>
    </section>
  )
}
