import * as React from 'react'
import { motion, useInView } from 'motion/react'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type FooterLink = { label: string; href: string }

export type PortfolioFooterProps = {
  /** Oversized closing line, revealed letter by letter. */
  headline?: string
  email?: string
  /** Text repeated in the marquee ribbon. */
  ribbon?: string
  links?: FooterLink[]
  name?: string
  onBackToTop?: () => void
  className?: string
}

const LINKS: FooterLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Journal', href: '#journal' },
  { label: 'Résumé', href: '#resume' },
]

const CSS = `@keyframes fk-pf-rib{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
.fk-pf-rib{animation:fk-pf-rib 28s linear infinite}.fk-pf-rib-wrap:hover .fk-pf-rib{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.fk-pf-rib{animation:none}}`

/**
 * Portfolio Footer — a closing statement in giant display type: letters rise out of masks when the footer scrolls in
 * and a light follows the cursor across the glyphs. A slow ribbon marquee, link columns and a back-to-top button
 * finish it. Paints its own ink surface.
 */
export function PortfolioFooter({ headline = 'Let’s talk.', email = 'hello@yourname.studio', ribbon = 'Open to new projects', links = LINKS, name = 'Your Name', onBackToTop, className }: PortfolioFooterProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const move = (e: React.PointerEvent) => {
    const b = ref.current?.getBoundingClientRect()
    if (!b) return
    ref.current!.style.setProperty('--fx', `${((e.clientX - b.left) / b.width) * 100}%`)
  }
  const chars = Array.from(headline)
  const rib = Array.from({ length: 8 }, () => ribbon)
  return (
    <footer ref={ref} onPointerMove={move} className={cn('relative isolate w-full max-w-4xl overflow-hidden rounded-3xl bg-zinc-950 px-6 pb-6 pt-14 text-zinc-100 ring-1 ring-white/10 sm:px-10 sm:pt-20 dark:bg-[#0f0d14]', className)} style={{ ['--fx' as string]: '50%' }}>
      <style>{CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-70" style={{ background: 'radial-gradient(60% 70% at var(--fx) 0%, rgb(125 104 153 / 0.45), transparent 70%)' }} />
      <p className="text-sm font-medium text-zinc-300">Got a project in mind?</p>
      <h2 aria-label={headline} className="mt-3 font-display text-[clamp(64px,15vw,168px)] leading-[0.9] tracking-tight">
        <span aria-hidden className="block bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(100deg,#f4f4f5 calc(var(--fx) - 30%),#fdba74 var(--fx),#f4f4f5 calc(var(--fx) + 30%))' }}>
          {chars.map((c, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span className="inline-block" initial={reduced ? false : { y: '110%', rotate: 6 }} animate={inView || reduced ? { y: 0, rotate: 0 } : undefined} transition={{ duration: 0.9, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] }}>{c === ' ' ? '\u00a0' : c}</motion.span>
            </span>
          ))}
        </span>
      </h2>
      <a href={`mailto:${email}`} className="group mt-4 inline-flex min-h-11 items-center gap-2 border-b border-zinc-500 pb-1 text-lg font-medium text-white transition-colors hover:border-framekit-400 hover:text-framekit-300 sm:text-2xl">
        {email}<ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
      </a>

      <div className="fk-pf-rib-wrap relative mt-12 overflow-hidden border-y border-white/15 py-3 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]" aria-hidden>
        <div className="fk-pf-rib flex w-max">
          {[...rib, ...rib].map((t, i) => <span key={i} className="mx-5 flex items-center gap-10 whitespace-nowrap font-display text-3xl text-zinc-200">{t}<span className="text-framekit-400">✦</span></span>)}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <nav aria-label="Footer"><ul className="flex flex-wrap gap-x-2 gap-y-1">{links.map((l) => <li key={l.label}><a href={l.href} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">{l.label}</a></li>)}</ul></nav>
        <div className="flex items-center gap-4">
          <p className="text-xs text-zinc-400">© {new Date().getFullYear()} {name}. Designed &amp; built by hand.</p>
          <motion.button type="button" onClick={() => (onBackToTop ? onBackToTop() : window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))} aria-label="Back to top" whileHover={reduced ? undefined : { y: -3 }} whileTap={reduced ? undefined : { scale: 0.9 }} className="grid h-11 w-11 place-items-center rounded-full bg-white text-zinc-950 hover:bg-framekit-300"><ArrowUp className="h-4 w-4" aria-hidden /></motion.button>
        </div>
      </div>
    </footer>
  )
}
