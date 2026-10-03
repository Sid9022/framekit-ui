import * as React from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { AlertCircle, ArrowRight, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ContactValues = { name: string; email: string; topic: string; message: string }

export type ContactFormCardProps = {
  /** Async submit. Resolve for the success animation; reject / throw to land the retry state. */
  onSubmit?: (values: ContactValues) => void | Promise<unknown>
  topics?: string[]
  title?: string
  description?: string
  submitLabel?: string
  successTitle?: string
  successMessage?: string
  maxLength?: number
  headingAs?: 'h2' | 'h3'
  className?: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: ContactValues, max: number) {
  const e: Partial<Record<keyof ContactValues, string>> = {}
  if (v.name.trim().length < 2) e.name = 'Tell me your name (at least 2 characters).'
  if (!v.email.trim()) e.email = 'An email is needed so I can reply.'
  else if (!EMAIL.test(v.email.trim())) e.email = 'That email looks off — try name@domain.com.'
  if (v.message.trim().length < 10) e.message = 'A few more words please (at least 10 characters).'
  else if (v.message.length > max) e.message = `Keep it under ${max} characters.`
  return e
}

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="group/field relative">
      <div className="mb-1.5 flex items-baseline justify-between"><label htmlFor={id} className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</label>{hint}</div>
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-x-3 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-signal-600 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within/field:scale-x-100 dark:bg-signal-300" style={{ bottom: error ? 'calc(1.5rem + 2px)' : 0 }} />
      <AnimatePresence initial={false}>
        {error && (
          <motion.p id={`${id}-err`} role="alert" initial={{ opacity: 0, height: 0, y: -4 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden pt-1.5 text-sm font-medium text-rose-700 dark:text-rose-300">
            <span className="flex items-start gap-1.5"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls = 'block w-full rounded-xl border bg-white px-3.5 py-3 text-base text-zinc-950 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-500 focus:border-signal-600 focus:ring-4 focus:ring-signal-600/15 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus:border-signal-300 dark:focus:ring-signal-300/20 min-h-11'

/**
 * Contact Form Card — validated on blur and on submit with inline, announced errors (and a shake + focus jump to the
 * first problem), an optional async `onSubmit` with a sending morph, a drawn-check success scene with a particle
 * burst, and a failure state that keeps everything typed and offers Retry.
 */
export function ContactFormCard({
  onSubmit,
  topics = ['Product design', 'Front-end build', 'Brand & motion', 'Something else'],
  title = 'Let’s make something',
  description = 'Tell me about the project — I reply within two working days.',
  submitLabel = 'Send message',
  successTitle = 'Message sent',
  successMessage = 'Thanks! I’ll be in touch within two working days.',
  maxLength = 600,
  headingAs: H = 'h3',
  className,
}: ContactFormCardProps) {
  const reduced = usePrefersReducedMotion()
  const uid = React.useId()
  const [v, setV] = React.useState<ContactValues>({ name: '', email: '', topic: topics[0] ?? '', message: '' })
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [status, setStatus] = React.useState<Status>('idle')
  const shaker = useAnimationControls()
  const formRef = React.useRef<HTMLFormElement>(null)
  const errors = validate(v, maxLength)
  const show = (k: keyof ContactValues) => (touched[k] || touched.__all ? errors[k] : undefined)
  const id = (k: string) => `${uid}-${k}`
  const set = (k: keyof ContactValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((o) => ({ ...o, [k]: e.target.value }))
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }))

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (status === 'sending') return
    setTouched({ __all: true })
    const errs = validate(v, maxLength)
    const first = (['name', 'email', 'message'] as const).find((k) => errs[k])
    if (first) {
      if (!reduced) void shaker.start({ x: [0, -9, 8, -5, 3, 0], transition: { duration: 0.4 } })
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await (onSubmit ? onSubmit(v) : new Promise((r) => setTimeout(r, 1100)))
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }
  const reset = () => { setV({ name: '', email: '', topic: topics[0] ?? '', message: '' }); setTouched({}); setStatus('idle') }

  const dots = React.useMemo(() => Array.from({ length: 14 }, (_, k) => ({ a: (k / 14) * Math.PI * 2 + 0.2, d: 56 + (k % 3) * 14, c: ['#7d6899', '#f97316', '#34d399', '#fbbf24'][k % 4] })), [])

  return (
    <motion.div
      className={cn('relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_48px_-24px_rgb(24_24_27/0.25)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none', className)}
      animate={shaker}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div key="ok" role="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-center">
            <div className="relative grid h-24 w-24 place-items-center">
              {!reduced && dots.map((d, k) => (
                <motion.span key={k} className="absolute h-2 w-2 rounded-full" style={{ background: d.c }} initial={{ x: 0, y: 0, scale: 0, opacity: 1 }} animate={{ x: Math.cos(d.a) * d.d, y: Math.sin(d.a) * d.d, scale: [0, 1.2, 0], opacity: [1, 1, 0] }} transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} />
              ))}
              <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden>
                <motion.circle cx="48" cy="48" r="40" fill="none" strokeWidth="5" strokeLinecap="round" className="stroke-emerald-600 dark:stroke-emerald-400" initial={{ pathLength: reduced ? 1 : 0, rotate: -90 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }} style={{ originX: '50%', originY: '50%', rotate: -90 }} />
                <motion.path d="M30 49l13 13 24-27" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="stroke-emerald-600 dark:stroke-emerald-400" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.5, ease: [0.65, 0, 0.35, 1] }} />
              </svg>
            </div>
            <motion.div initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, type: 'spring', stiffness: 260, damping: 26 }}>
              <H className="font-display text-4xl text-zinc-950 dark:text-zinc-50">{successTitle}</H>
              <p className="mx-auto mt-2 max-w-[34ch] text-zinc-700 dark:text-zinc-300">{successMessage}</p>
              <button type="button" onClick={reset} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"><RotateCcw className="h-4 w-4" aria-hidden />Send another</button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form key="form" ref={formRef} noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} className="space-y-4" aria-describedby={`${uid}-d`}>
            <div>
              <H className="font-display text-4xl leading-tight text-zinc-950 dark:text-zinc-50">{title}</H>
              <p id={`${uid}-d`} className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id={id('name')} label="Name" error={show('name')}>
                <input id={id('name')} name="name" autoComplete="name" value={v.name} onChange={set('name')} onBlur={blur('name')} aria-invalid={!!show('name')} aria-describedby={show('name') ? `${id('name')}-err` : undefined} placeholder="Ada Lovelace" disabled={status === 'sending'} className={cn(inputCls, show('name') ? 'border-rose-600 dark:border-rose-400' : 'border-zinc-300 dark:border-zinc-700')} />
              </Field>
              <Field id={id('email')} label="Email" error={show('email')}>
                <input id={id('email')} name="email" type="email" autoComplete="email" value={v.email} onChange={set('email')} onBlur={blur('email')} aria-invalid={!!show('email')} aria-describedby={show('email') ? `${id('email')}-err` : undefined} placeholder="ada@example.com" disabled={status === 'sending'} className={cn(inputCls, show('email') ? 'border-rose-600 dark:border-rose-400' : 'border-zinc-300 dark:border-zinc-700')} />
              </Field>
            </div>
            <fieldset className="min-w-0">
              <legend className="mb-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">What’s it about?</legend>
              <div className="flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <label key={t} className={cn('relative inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal-600', v.topic === t ? 'text-white dark:text-zinc-950' : 'text-zinc-800 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-100 dark:text-zinc-200 dark:ring-zinc-700 dark:hover:bg-zinc-800')}>
                    <input type="radio" name={id('topic')} value={t} checked={v.topic === t} onChange={() => setV((o) => ({ ...o, topic: t }))} className="sr-only" disabled={status === 'sending'} />
                    {v.topic === t && <motion.span layoutId={`${uid}-topic`} className="absolute inset-0 rounded-full bg-zinc-950 dark:bg-zinc-50" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                    <span className="relative">{t}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Field id={id('message')} label="Message" error={show('message')} hint={<span className={cn('text-xs tabular-nums', v.message.length > maxLength ? 'font-semibold text-rose-700 dark:text-rose-300' : 'text-zinc-600 dark:text-zinc-400')} aria-hidden>{v.message.length}/{maxLength}</span>}>
              <textarea id={id('message')} name="message" rows={4} value={v.message} onChange={set('message')} onBlur={blur('message')} aria-invalid={!!show('message')} aria-describedby={show('message') ? `${id('message')}-err` : undefined} placeholder="A short brief, a timeline, a dream…" disabled={status === 'sending'} className={cn(inputCls, 'resize-none', show('message') ? 'border-rose-600 dark:border-rose-400' : 'border-zinc-300 dark:border-zinc-700')} />
            </Field>

            <AnimatePresence initial={false}>
              {status === 'error' && (
                <motion.div role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <p className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-900 dark:border-rose-500/40 dark:bg-rose-950/50 dark:text-rose-100"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />Couldn’t send — nothing was lost. Check your connection and try again.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              aria-live="polite"
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className={cn('relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-base font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_8px_20px_-8px_rgb(0_0_0/0.45)] transition-colors disabled:cursor-wait', status === 'error' ? 'bg-rose-700 hover:bg-rose-800' : 'bg-zinc-950 hover:bg-zinc-800 dark:bg-signal-600 dark:hover:bg-signal-500')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={status} className="flex items-center gap-2" initial={reduced ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: -16, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {status === 'sending' ? <><Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />Sending…</> : status === 'error' ? <><RotateCcw className="h-4 w-4" aria-hidden />Retry</> : <>{submitLabel}<ArrowRight className="h-4 w-4" aria-hidden /></>}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
