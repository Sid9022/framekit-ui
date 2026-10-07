import * as React from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Code2, Loader2, Megaphone, PenTool } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type OnboardingData = { workspace: string; role: string; invites: string }

export type OnboardingStepperProps = {
  /** Initial values. */
  defaultValues?: Partial<OnboardingData>
  /** Fires on the final step; return a promise to show the loading state. Reject to show an error. */
  onComplete?: (data: OnboardingData) => void | Promise<void>
  /** Controlled step index (0–3). */
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  className?: string
}

const STEPS = ['Workspace', 'Role', 'Team', 'Done']
const ROLES = [
  { id: 'design', label: 'Design', note: 'Libraries, prototypes', icon: PenTool },
  { id: 'eng', label: 'Engineering', note: 'Components, tokens', icon: Code2 },
  { id: 'mkt', label: 'Marketing', note: 'Pages, campaigns', icon: Megaphone },
]
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-900'

/**
 * Onboarding Stepper — a three-question setup flow that feels like one
 * continuous surface: the progress capsule stretches into the current step
 * with a shared-layout spring, panels slide in from the direction you're
 * travelling, the card height eases between steps, and validation speaks up
 * inline. The final step submits with a held-label spinner and lands on a
 * success tick; Enter advances, focus moves to each new step's heading.
 */
export function OnboardingStepper({ defaultValues, onComplete, step, defaultStep = 0, onStepChange, className }: OnboardingStepperProps) {
  const reduced = usePrefersReducedMotion()
  const uid = React.useId()
  const [inner, setInner] = React.useState(defaultStep)
  const cur = step ?? inner
  const [dir, setDir] = React.useState(1)
  const [data, setData] = React.useState<OnboardingData>({ workspace: '', role: '', invites: '', ...defaultValues })
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const headRef = React.useRef<HTMLHeadingElement>(null)
  const first = React.useRef(true)

  const go = (n: number) => { setDir(n > cur ? 1 : -1); setError(''); if (step === undefined) setInner(n); onStepChange?.(n) }
  React.useEffect(() => { if (first.current) { first.current = false; return } headRef.current?.focus({ preventScroll: true }) }, [cur])

  const validate = (): string => {
    if (cur === 0 && data.workspace.trim().length < 2) return 'Name your workspace — at least 2 characters.'
    if (cur === 1 && !data.role) return 'Pick the role closest to your work.'
    if (cur === 2 && data.invites.trim()) {
      const bad = data.invites.split(/[\s,]+/).filter(Boolean).find((e) => !/^\S+@\S+\.\S+$/.test(e))
      if (bad) return `“${bad}” isn’t an email address. Separate emails with commas.`
    }
    return ''
  }
  const next = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const v = validate()
    if (v) { setError(v); return }
    if (cur === 2) {
      setBusy(true)
      try { await onComplete?.(data); await new Promise((r) => setTimeout(r, 700)); go(3) }
      catch { setError('Couldn’t create the workspace. Check your connection and try again.') }
      finally { setBusy(false) }
      return
    }
    go(cur + 1)
  }
  const inviteCount = data.invites.split(/[\s,]+/).filter(Boolean).length

  const variants = {
    enter: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * 40, filter: 'blur(4px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: d * -40, filter: 'blur(4px)' }),
  }
  const heads = ['Name your workspace', 'What do you do?', 'Invite your team', 'You’re all set']
  const subs = ['This is how teammates will find you. You can change it later.', 'We’ll tailor templates to your role.', 'Optional — add a few emails, separated by commas.', `${data.workspace || 'Your workspace'} is ready${inviteCount ? ` and ${inviteCount} invite${inviteCount > 1 ? 's are' : ' is'} on the way` : ''}.`]

  return (
    <div className={cn('w-full max-w-md rounded-[28px] bg-white p-2 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-24px_rgb(24_24_27/0.35)] dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]', className)}>
      <div className="rounded-[20px] bg-zinc-50 p-5 dark:bg-zinc-950/40 sm:p-6">
        <LayoutGroup id={uid}>
          <ol className="flex items-center gap-1.5" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-900/[0.08] dark:bg-white/[0.1]" aria-current={i === cur ? 'step' : undefined}>
                <span className="sr-only">{`${s}${i < cur ? ', completed' : i === cur ? ', current' : ''}`}</span>
                {i < cur && <motion.span layout className="absolute inset-0 rounded-full bg-zinc-900 dark:bg-zinc-100" />}
                {i === cur && <motion.span layoutId="active" className="absolute inset-0 rounded-full bg-signal-600 dark:bg-signal-300" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 36 }} />}
              </li>
            ))}
          </ol>
        </LayoutGroup>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400">Step <span className="tabular-nums">{Math.min(cur + 1, 3)}</span> of 3</p>
        <motion.div layout={!reduced} transition={{ type: 'spring', stiffness: 380, damping: 36 }} className="relative mt-1 overflow-hidden">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.form
              key={cur}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 34 }}
              onSubmit={next}
              noValidate
            >
              <h3 ref={headRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight text-zinc-950 outline-none dark:text-white">{heads[cur]}</h3>
              <p className="mt-1 text-pretty text-sm text-zinc-600 dark:text-zinc-400">{subs[cur]}</p>
              <div className="mt-5">
                {cur === 0 && (
                  <label className="block">
                    <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">Workspace name</span>
                    <input
                      value={data.workspace}
                      onChange={(e) => { setData({ ...data, workspace: e.target.value }); setError('') }}
                      placeholder="Northwind Studio"
                      autoComplete="organization"
                      aria-invalid={!!error || undefined}
                      aria-describedby={error ? `${uid}-err` : undefined}
                      className={cn('mt-1.5 h-11 w-full rounded-[10px] bg-white px-3 text-base text-zinc-950 ring-1 ring-black/[0.1] placeholder:text-zinc-500 transition-shadow duration-150 sm:text-sm dark:bg-zinc-900 dark:text-white dark:ring-white/[0.12]', 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300', error && 'ring-rose-600 dark:ring-rose-400')}
                    />
                  </label>
                )}
                {cur === 1 && (
                  <div role="radiogroup" aria-label="Role" aria-describedby={error ? `${uid}-err` : undefined} className="grid gap-2">
                    {ROLES.map((r) => {
                      const sel = data.role === r.id
                      return (
                        <button
                          key={r.id}
                          type="button"
                          role="radio"
                          aria-checked={sel}
                          onClick={() => { setData({ ...data, role: r.id }); setError('') }}
                          className={cn('relative flex min-h-14 items-center gap-3 rounded-[14px] bg-white px-3 text-left ring-1 transition-[box-shadow,background-color] duration-150 active:scale-[0.99] dark:bg-zinc-900', sel ? 'ring-2 ring-signal-600 dark:ring-signal-300' : 'ring-black/[0.08] hover:ring-black/[0.16] dark:ring-white/[0.1] dark:hover:ring-white/[0.2]', FOCUS)}
                        >
                          <span className={cn('grid size-9 place-items-center rounded-[10px] transition-colors duration-150', sel ? 'bg-signal-600 text-white dark:bg-signal-300 dark:text-zinc-950' : 'bg-zinc-900/[0.05] text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-300')}><r.icon aria-hidden className="size-4" /></span>
                          <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-zinc-950 dark:text-white">{r.label}</span><span className="block text-xs text-zinc-600 dark:text-zinc-400">{r.note}</span></span>
                          <AnimatePresence>{sel && <motion.span initial={reduced ? { opacity: 0 } : { scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 520, damping: 28 }} className="grid size-5 place-items-center rounded-full bg-signal-600 text-white dark:bg-signal-300 dark:text-zinc-950"><Check aria-hidden className="size-3" strokeWidth={3} /></motion.span>}</AnimatePresence>
                        </button>
                      )
                    })}
                  </div>
                )}
                {cur === 2 && (
                  <label className="block">
                    <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">Emails</span>
                    <textarea
                      value={data.invites}
                      onChange={(e) => { setData({ ...data, invites: e.target.value }); setError('') }}
                      rows={3}
                      placeholder="amara@northwind.dev, teo@northwind.dev"
                      aria-invalid={!!error || undefined}
                      aria-describedby={error ? `${uid}-err` : undefined}
                      className={cn('mt-1.5 w-full resize-none rounded-[10px] bg-white px-3 py-2.5 text-base text-zinc-950 ring-1 ring-black/[0.1] placeholder:text-zinc-500 sm:text-sm dark:bg-zinc-900 dark:text-white dark:ring-white/[0.12]', 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300', error && 'ring-rose-600 dark:ring-rose-400')}
                    />
                  </label>
                )}
                {cur === 3 && (
                  <div className="flex items-center gap-3 rounded-[14px] bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-700/15 dark:bg-emerald-950/60 dark:text-emerald-100 dark:ring-emerald-400/20">
                    <motion.span initial={reduced ? false : { scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.1 }} className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"><Check aria-hidden className="size-4" strokeWidth={3} /></motion.span>
                    Workspace created. Your first project template is waiting.
                  </div>
                )}
              </div>
              <div className="min-h-6 pt-2">
                {error && <p id={`${uid}-err`} role="alert" className="text-[13px] text-rose-700 dark:text-rose-300">{error}</p>}
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                {cur > 0 && cur < 3 ? (
                  <button type="button" onClick={() => go(cur - 1)} disabled={busy} className={cn('inline-flex min-h-11 items-center gap-1.5 rounded-[14px] px-3 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-900/[0.05] hover:text-zinc-950 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-white', FOCUS)}>
                    <ArrowLeft aria-hidden className="size-4" /> Back
                  </button>
                ) : <span />}
                {cur < 3 ? (
                  <motion.button
                    type="submit"
                    disabled={busy}
                    whileTap={reduced || busy ? undefined : { scale: 0.97 }}
                    className={cn('inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-zinc-950 px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgb(0_0_0/0.1),inset_0_1px_0_rgb(255_255_255/0.12)] transition-colors duration-150 hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-80 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200', FOCUS)}
                  >
                    {busy && <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />}
                    {cur === 2 ? (busy ? 'Creating workspace…' : data.invites.trim() ? 'Send invites & finish' : 'Skip & finish') : 'Continue'}
                    {!busy && <ArrowRight aria-hidden className="size-4" />}
                  </motion.button>
                ) : (
                  <button type="button" onClick={() => { setData({ workspace: '', role: '', invites: '' }); go(0) }} className={cn('ml-auto inline-flex min-h-11 items-center rounded-[14px] px-4 text-sm font-medium text-zinc-700 ring-1 ring-black/[0.08] transition-colors duration-150 hover:text-zinc-950 dark:text-zinc-300 dark:ring-white/[0.12] dark:hover:text-white', FOCUS)}>Start over</button>
                )}
              </div>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
      <span role="status" aria-live="polite" className="sr-only">{cur === 3 ? 'Workspace created' : ''}</span>
    </div>
  )
}
