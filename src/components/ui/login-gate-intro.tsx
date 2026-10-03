import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Lock, LockOpen } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt } from '@/lib/portfolio-art'

export interface LoginGateIntroProps {
  /** Shown on the lock card. */
  name?: string
  /** Small line under the name. */
  role?: string
  /** Seed for the generated lock-screen wallpaper. */
  wallpaperSeed?: number
  /** Status lines cycled while "signing in". */
  steps?: string[]
  /** Call-to-action label. */
  cta?: string
  /** Fires once the gate has opened (after the sequence or Skip). */
  onEnter?: () => void
  /** The site revealed after the gate opens. */
  children?: React.ReactNode
  /** Start unlocked (e.g. for a returning visitor). */
  defaultOpen?: boolean
  className?: string
}

const STEPS = ['Checking credentials', 'Warming up the studio', 'Loading selected work']

/**
 * Login Gate Intro — a lock-screen preloader: big clock, a generated avatar card, a password field that "types" itself,
 * then a short sign-in sequence before the site fades up. Skip link and Enter key bypass it; reduced motion jumps straight in.
 */
export function LoginGateIntro({ name = 'Guest Studio', role = 'Design engineer', wallpaperSeed = 9, steps = STEPS, cta = 'Sign in as guest', onEnter, children, defaultOpen = false, className }: LoginGateIntroProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<'locked' | 'typing' | 'signing' | 'open'>(defaultOpen ? 'open' : 'locked')
  const [dots, setDots] = React.useState(0)
  const [step, setStep] = React.useState(0)
  const [now, setNow] = React.useState(() => new Date())
  const [say, setSay] = React.useState('')
  const timers = React.useRef<number[]>([])
  const enterRef = React.useRef(onEnter)
  enterRef.current = onEnter
  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = [] }
  React.useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 15000); return () => { window.clearInterval(id); clear() } }, [])

  const finish = React.useCallback(() => { clear(); setPhase('open'); setSay('Unlocked. Content shown.'); enterRef.current?.() }, [])
  const go = () => {
    if (phase !== 'locked') return
    if (reduced) { finish(); return }
    setPhase('typing'); setSay('Signing in')
    for (let i = 1; i <= 8; i++) timers.current.push(window.setTimeout(() => setDots(i), 110 * i))
    timers.current.push(window.setTimeout(() => setPhase('signing'), 110 * 9 + 150))
    steps.forEach((_, i) => timers.current.push(window.setTimeout(() => setStep(i), 110 * 9 + 150 + i * 650)))
    timers.current.push(window.setTimeout(finish, 110 * 9 + 150 + steps.length * 650 + 250))
  }
  const relock = () => { clear(); setDots(0); setStep(0); setPhase('locked'); setSay('Locked') }
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const open = phase === 'open'

  return (
    <div className={cn('relative isolate w-full overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-stone-50 dark:border-zinc-800 dark:bg-zinc-950', className)} style={{ minHeight: 420 }}>
      <div aria-hidden={!open || undefined} inert={!open} className={cn('transition-[filter,opacity] duration-700', open ? 'opacity-100' : 'pointer-events-none opacity-0 blur-md')}>{children}</div>

      <AnimatePresence>
        {!open && (
          <motion.div
            key="gate"
            role="dialog"
            aria-label="Welcome gate"
            className="absolute inset-0 z-20 flex flex-col items-center justify-between overflow-hidden px-4 py-8 text-white"
            initial={false}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06, filter: 'blur(14px)' }}
            transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 0.8, 0.2, 1] }}
          >
            <div aria-hidden className="absolute inset-0 -z-10"><PortfolioArt seed={wallpaperSeed} /><div className="absolute inset-0 bg-zinc-950/55 backdrop-blur-[2px]" /></div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/85">{date}</p>
              <p className="font-display text-7xl leading-none tabular-nums sm:text-8xl">{time}</p>
            </div>

            <div className="flex w-full max-w-xs flex-col items-center gap-4 text-center">
              <motion.div animate={phase === 'signing' && !reduced ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 1.2, repeat: phase === 'signing' ? Infinity : 0 }} className="grid size-20 place-items-center rounded-full border border-white/40 bg-gradient-to-br from-signal-300 via-rose-300 to-violet-400 font-display text-3xl text-zinc-950 shadow-xl" aria-hidden>{initials}</motion.div>
              <div>
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-sm text-white/80">{role}</p>
              </div>
              <div className="flex h-11 w-full items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 backdrop-blur" aria-hidden>
                {phase === 'signing' ? <LockOpen className="size-4" /> : <Lock className="size-4" />}
                <span className="flex flex-1 items-center gap-1.5">
                  {phase === 'locked' && <span className="text-sm text-white/75">Password</span>}
                  {phase !== 'locked' && Array.from({ length: dots }, (_, i) => <span key={i} className="size-2 rounded-full bg-white" />)}
                </span>
              </div>
              <div className="h-12 w-full">
                {phase === 'signing' ? (
                  <div className="space-y-2" role="status" aria-live="polite">
                    <div className="h-1 overflow-hidden rounded-full bg-white/25"><motion.div className="h-full rounded-full bg-white" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: steps.length * 0.65, ease: 'linear' }} /></div>
                    <p className="text-xs text-white/85">{steps[step]}…</p>
                  </div>
                ) : (
                  <button type="button" onClick={go} disabled={phase !== 'locked'} autoFocus className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-zinc-950 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:opacity-60">
                    {cta} <ArrowRight className="size-4" aria-hidden />
                  </button>
                )}
              </div>
            </div>

            <button type="button" onClick={finish} className="inline-flex min-h-11 items-center rounded-full px-4 text-xs font-medium text-white/85 underline underline-offset-4 outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white">Skip intro</button>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <button type="button" onClick={relock} className="absolute right-3 top-3 z-30 inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-300 bg-white/90 px-4 text-xs font-medium text-zinc-900 shadow-sm outline-none backdrop-blur hover:bg-white focus-visible:ring-2 focus-visible:ring-signal-600 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100 dark:focus-visible:ring-signal-300">
          <Lock className="size-3.5" aria-hidden /> Lock again
        </button>
      )}
      <p className="sr-only" role="status" aria-live="polite">{say}</p>
    </div>
  )
}
