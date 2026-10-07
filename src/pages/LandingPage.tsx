import * as React from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { SITE } from '@/config/site'
import { componentDocs, getNavGroups, categorySlug } from '@/docs/registry'
import { BrandLink, SearchTrigger, ThemeToggleButton, iconBtn } from '@/components/docs/chrome'
import { cn } from '@/lib/cn'
import { ActivityRings } from '@/components/ui/activity-rings'
import { GlowCandleCard } from '@/components/ui/glow-candle-card'
import { LiquidFillButton } from '@/components/ui/liquid-fill-button'
import { OrbitalBeadLoader } from '@/components/ui/orbital-bead-loader'
import { NeonHaloCard } from '@/components/ui/neon-halo-card'
import { surface, Art, DocLink, EASE, HandleBadge, POP, Reveal, SPRING, h2, muted, overline, pillDark, pillLight, section, sectionY } from './landing/kit'

const Sections = React.lazy(() => import('./landing/Sections'))

const NAV = [
  { label: 'Components', to: '/docs/introduction' },
  { label: 'Categories', to: `/docs/category/${categorySlug('Motion Showcase')}` },
  { label: 'Data widgets', to: `/docs/category/${categorySlug('Data Widgets')}` },
  { label: 'Install', to: '/docs/installation' },
]

function Nav({ count }: { count: number }) {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  React.useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  return (
    <header className={cn('sticky top-0 z-40 transition-[background-color,backdrop-filter] duration-300', scrolled && 'bg-[#F8F8F8]/80 backdrop-blur-xl dark:bg-[#0A0A0B]/80')}>
      <div className={cn(section, 'flex h-16 items-center gap-4')}>
        <BrandLink />
        <nav aria-label="Primary" className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className="rounded-full px-4 py-2 text-sm font-medium text-black/75 transition-colors hover:bg-black/5 hover:text-black dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <div className="hidden sm:block"><SearchTrigger /></div>
          <span className="hidden rounded-full bg-black px-3 py-1.5 text-xs font-semibold tabular-nums text-white md:inline-flex dark:bg-white dark:text-black">{count}+ components</span>
          <ThemeToggleButton />
          <a href={SITE.github} target="_blank" rel="noreferrer" className={cn(iconBtn, 'hidden sm:inline-grid')} aria-label="Framekit UI on GitHub (opens in a new tab)">
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <button type="button" className={cn(iconBtn, 'lg:hidden')} aria-expanded={open} aria-controls="landing-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="landing-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mx-4 mb-3 rounded-[24px] bg-white p-2 ring-1 ring-black/5 lg:hidden dark:bg-zinc-900 dark:ring-white/10"
          >
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-2xl px-4 text-base font-medium text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10">
                {n.label}
              </Link>
            ))}
            <a href={SITE.github} target="_blank" rel="noreferrer" className="flex min-h-12 items-center gap-2 rounded-2xl px-4 text-base font-medium text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10">
              <GithubIcon className="h-4 w-4" /> GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

/** Headline revealed character by character (screen readers get the whole string once). */
function CharReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ')
  let i = 0
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {w.split('').map((ch) => {
              const d = delay + i++ * 0.025
              return (
                <motion.span key={ch + d} className="inline-block" initial={{ opacity: 0, y: '0.45em' }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: d }}>
                  {ch}
                </motion.span>
              )
            })}
            {wi < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </span>
    </span>
  )
}

const HAND = [
  { slug: 'glow-candle-card', label: 'Glow Candle', bg: '#0A0A0A', badge: POP.lime, badgeText: '#000', art: <GlowCandleCard />, scale: 0.42 },
  { slug: 'activity-rings', label: 'Activity Rings', bg: POP.coral, badge: '#000', badgeText: '#fff', art: <ActivityRings />, scale: 0.5 },
  { slug: 'neon-halo-card', label: 'Neon Halo', bg: '#FFFFFF', badge: POP.blue, badgeText: '#fff', art: <NeonHaloCard />, scale: 0.5 },
  { slug: 'orbital-bead-loader', label: 'Bead Loader', bg: POP.lime, badge: POP.red, badgeText: '#fff', art: <OrbitalBeadLoader />, scale: 0.9 },
  { slug: 'liquid-fill-button', label: 'Liquid Fill', bg: POP.blue, badge: '#fff', badgeText: '#000', art: <LiquidFillButton>Get started</LiquidFillButton>, scale: 0.85 },
]
const FAN = [
  { x: -2.1, r: -14, y: 40 },
  { x: -1.05, r: -7, y: 10 },
  { x: 0, r: 0, y: 0 },
  { x: 1.05, r: 7, y: 10 },
  { x: 2.1, r: 14, y: 40 },
]

function Hero({ count, cats }: { count: number; cats: number }) {
  return (
    <section aria-labelledby="hero-title" className={cn(section, 'pb-16 pt-14 text-center sm:pb-24 sm:pt-20')}>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className={cn(overline, 'inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10')}>
        <Sparkles className="h-3.5 w-3.5 text-[#D93838]" aria-hidden /> {count} components · {cats} categories · MIT
      </motion.p>
      <h1 id="hero-title" className="mx-auto mt-7 max-w-[15ch] text-[clamp(2.75rem,8.4vw,7.25rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-black dark:text-white">
        <CharReveal text="Interfaces that feel alive." delay={0.1} />
      </h1>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.55 }} className={cn(muted, 'mx-auto mt-6 max-w-[52ch] text-base sm:text-lg')}>
        Premium, motion-rich React components. Copy the source or install any piece with the shadcn CLI. Light, dark, keyboard and reduced motion included.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.65 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/docs/introduction" className={pillDark}>
          <Sparkles className="h-4 w-4" aria-hidden /> Browse components
        </Link>
        <a href={SITE.github} target="_blank" rel="noreferrer" className="group inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-black underline-offset-4 hover:underline dark:text-white">
          Star on GitHub <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </motion.div>

      {/* Hand of cards */}
      <div className="relative mx-auto mt-14 h-[230px] max-w-[980px] sm:mt-20 sm:h-[340px]">
        {HAND.map((c, i) => {
          const f = FAN[i]
          return (
            <motion.div
              key={c.slug}
              className="absolute left-1/2 top-0 w-[38vw] max-w-[220px] sm:w-[240px] sm:max-w-none"
              style={{ zIndex: i === 2 ? 5 : 4 - Math.abs(i - 2) }}
              initial={{ x: '-50%', rotate: 0, y: 60, opacity: 0, scale: 0.9 }}
              animate={{ x: `calc(-50% + ${f.x * 100}%)`, rotate: f.r, y: f.y, opacity: 1, scale: 1 }}
              transition={{ ...SPRING, stiffness: 160, damping: 20, delay: 0.75 + Math.abs(i - 2) * 0.08 }}
              whileHover={{ y: f.y - 14, rotate: f.r * 0.6, transition: { type: 'spring', stiffness: 400, damping: 24 } }}
            >
              <div className={cn('relative aspect-square overflow-hidden rounded-[28px] ring-1 ring-black/5 dark:ring-white/10', surface(c.bg).className)} style={surface(c.bg).style}>
                <Art scale={c.scale} className="absolute inset-0">{c.art}</Art>
                <DocLink slug={c.slug} label={c.label} className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 sm:inline-flex" />
              </div>
              <HandleBadge handle={c.slug} color={c.badge} text={c.badgeText} delay={1.2 + i * 0.08} className={cn('-top-3', i % 2 ? 'right-2' : 'left-2', i !== 2 && 'max-sm:hidden')} />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function Split() {
  return (
    <section aria-labelledby="why-title" className={cn(section, sectionY, 'grid items-center gap-14 lg:grid-cols-[2fr_3fr]')}>
      <div>
        <Reveal><p className={overline}>Why Framekit</p></Reveal>
        <Reveal delay={0.06}>
          <h2 id="why-title" className={cn(h2, 'mt-4')}>
            Motion with a <span className="text-[#D93838] dark:text-[#FF7051]">reason</span>, never decoration.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className={cn(muted, 'mt-6 max-w-[46ch] text-base')}>
            Every spring, blur and stagger answers a gesture. Components ship with typed props, sensible defaults and a reduced-motion path, so they feel finished on day one.
          </p>
        </Reveal>
        <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-3">
          <Link to="/docs/category/motion-showcase" className={pillDark}>See the motion</Link>
          <Link to="/docs/installation" className={pillLight}>How install works</Link>
        </Reveal>
      </div>
      <div className="relative h-[420px] sm:h-[520px]">
        {[
          { cls: 'left-0 top-6 w-[58%] rotate-[-4deg]', bg: '#0A0A0A', slug: 'glow-candle-card', art: <GlowCandleCard />, s: 0.5, b: POP.lime, bt: '#000' },
          { cls: 'right-0 top-0 w-[48%] rotate-[5deg]', bg: POP.lime, slug: 'activity-rings', art: <ActivityRings />, s: 0.55, b: POP.blue, bt: '#fff' },
          { cls: 'left-[22%] bottom-0 w-[52%] rotate-[1deg]', bg: '#FFFFFF', slug: 'neon-halo-card', art: <NeonHaloCard />, s: 0.55, b: POP.red, bt: '#fff' },
        ].map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.1} y={50} scale={0.9} className={cn('absolute', c.cls)}>
            <div className={cn('relative aspect-[4/3.4] overflow-hidden rounded-[28px] ring-1 ring-black/5 dark:ring-white/10', surface(c.bg).className)} style={surface(c.bg).style}>
              <Art scale={c.s} className="absolute inset-0">{c.art}</Art>
            </div>
            <HandleBadge handle={c.slug} color={c.b} text={c.bt} delay={0.35 + i * 0.1} className="-bottom-3 left-5" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function LandingPage() {
  const count = componentDocs.length
  const groups = getNavGroups().filter((g) => g.title !== 'Getting Started')
  React.useEffect(() => {
    document.title = 'Framekit UI — interfaces that feel alive'
  }, [])
  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8F8F8] text-black dark:bg-[#0A0A0B] dark:text-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <Nav count={count} />
      <main id="main">
        <Hero count={count} cats={groups.length} />
        <Split />
        <React.Suspense fallback={<div className="h-[60vh]" aria-hidden />}>
          <Sections />
        </React.Suspense>
      </main>
    </div>
  )
}
