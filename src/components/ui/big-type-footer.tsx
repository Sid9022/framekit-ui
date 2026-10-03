import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BigTypeFooterLink = { label: string; href: string }

export type BigTypeFooterProps = {
  /** The oversized word (keeps one line, scales to the width). */
  word?: string
  eyebrow?: string
  email?: string
  links?: BigTypeFooterLink[]
  /** Ticker phrases. */
  ticker?: string[]
  /** IANA zone for the live clock; omit to hide. */
  timeZone?: string
  /** Scrolling element used by the back-to-top button (defaults to window). */
  scrollContainer?: React.RefObject<HTMLElement | null>
  credit?: string
  className?: string
}

const DEFAULT_LINKS: BigTypeFooterLink[] = [
  { label: 'Instagram', href: '#' }, { label: 'LinkedIn', href: '#' }, { label: 'GitHub', href: '#' }, { label: 'Read.cv', href: '#' },
]

function Letter({ ch, i, n, mx, active, reduced }: { ch: string; i: number; n: number; mx: MotionValue<number>; active: MotionValue<number>; reduced: boolean }) {
  const d = useTransform([mx, active], ([m, a]) => { const c = (i + 0.5) / n; const dist = Math.abs((m as number) - c) * n; return Math.max(0, 1 - dist / 2.6) * (a as number) })
  const scaleY = useTransform(d, [0, 1], [1, 1.28])
  const y = useTransform(d, [0, 1], [0, -14])
  const skew = useTransform(d, [0, 1], [0, -5])
  return <motion.span aria-hidden className="inline-block origin-bottom" style={reduced ? undefined : { scaleY, y, skewX: skew }}>{ch === ' ' ? '\u00a0' : ch}</motion.span>
}

/**
 * Big-Type Footer — a closing section built around one enormous word whose letters swell and lean toward the cursor, a
 * ticker, quiet link columns, a live local clock and a back-to-top button. Light paper / dark ink, never a fixed palette.
 */
export function BigTypeFooter({ word = "Let's talk", eyebrow = 'Scrolled all the way down? Good.', email = 'hello@example.com', links = DEFAULT_LINKS, ticker = ['Open for new projects', 'Booking from November', 'Design + engineering', 'Say hello'], timeZone, scrollContainer, credit = 'Designed & built by hand.', className }: BigTypeFooterProps) {
  const reduced = usePrefersReducedMotion()
  const mxRaw = useMotionValue(0.5)
  const mx = useSpring(mxRaw, { stiffness: 200, damping: 24 })
  const act = useMotionValue(0)
  const actS = useSpring(act, { stiffness: 160, damping: 22 })
  const [time, setTime] = React.useState('')
  React.useEffect(() => {
    if (!timeZone) return
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone, timeZoneName: 'short' })
    const t = () => setTime(f.format(new Date()))
    t(); const id = window.setInterval(t, 20000)
    return () => window.clearInterval(id)
  }, [timeZone])
  const letters = Array.from(word)
  const toTop = () => { const el = scrollContainer?.current; if (el) el.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) }
  const loop = [...ticker, ...ticker]

  return (
    <footer className={cn('relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-stone-100 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50', className)}>
      <style>{`@keyframes fk-btf{to{transform:translate3d(-50%,0,0)}}@media (prefers-reduced-motion:reduce){.fk-btf{animation:none!important}}`}</style>
      <div className="px-5 pt-8 sm:px-10 sm:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">{eyebrow}</p>
          <button type="button" onClick={toTop} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 text-sm font-medium outline-none transition-colors hover:bg-zinc-950 hover:text-white focus-visible:ring-2 focus-visible:ring-signal-600 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 dark:focus-visible:ring-signal-300">
            Back to top <ArrowUp className="size-4" aria-hidden />
          </button>
        </div>
        <a href={`mailto:${email}`} aria-label={`${word} — email ${email}`} className="group mt-8 block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300"
          onPointerMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); mxRaw.set((e.clientX - b.left) / b.width); act.set(1) }} onPointerLeave={() => act.set(0)}>
          <span className="block select-none whitespace-nowrap text-center font-display leading-[0.9] tracking-[-0.03em] text-zinc-950 dark:text-zinc-50" style={{ fontSize: `clamp(3.4rem, ${Math.min(21, 150 / Math.max(5, letters.length))}vw, 11rem)` }}>
            {letters.map((c, i) => <Letter key={i} ch={c} i={i} n={letters.length} mx={mx} active={actS} reduced={reduced} />)}
          </span>
          <span className="mt-4 flex items-center justify-center gap-2 text-base font-medium sm:text-lg">{email}<ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden /></span>
        </a>
      </div>

      <div className="mt-8 overflow-hidden border-y border-zinc-300 py-3 dark:border-zinc-800" aria-hidden>
        <div className="fk-btf flex w-max gap-10 whitespace-nowrap font-display text-2xl italic text-zinc-800 dark:text-zinc-200" style={reduced ? undefined : { animation: 'fk-btf 28s linear infinite' }}>
          {loop.map((t, i) => <span key={i} className="flex items-center gap-10">{t}<span className="size-2 rounded-full bg-framekit-500" /></span>)}
        </div>
      </div>

      <div className="grid gap-6 px-5 py-6 sm:grid-cols-[1fr_auto] sm:items-end sm:px-10 sm:py-8">
        <ul className="flex flex-wrap gap-x-1 gap-y-1">
          {links.map((l) => <li key={l.label}><a href={l.href} className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-zinc-800 underline-offset-4 outline-none transition-colors hover:bg-zinc-950 hover:text-white focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-zinc-200 dark:hover:bg-zinc-50 dark:hover:text-zinc-950 dark:focus-visible:ring-signal-300">{l.label}</a></li>)}
        </ul>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-zinc-700 dark:text-zinc-300">
          {time && <span className="tabular-nums"><span className="sr-only">Local time </span>{time}</span>}
          <span>{credit}</span>
        </div>
      </div>
    </footer>
  )
}
