import * as React from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { SITE } from '@/config/site'
import { componentDocs, getNavGroups, categorySlug } from '@/docs/registry'
import { BrandLink, SearchTrigger, ThemeToggleButton, iconBtn } from '@/components/docs/chrome'
import { useCommandPalette } from '@/components/command-palette'
import { cn } from '@/lib/cn'
import { ActivityRings } from '@/components/ui/activity-rings'
import { GlowCandleCard } from '@/components/ui/glow-candle-card'
import { LiquidFillButton } from '@/components/ui/liquid-fill-button'
import { RollingNumberStepper } from '@/components/ui/rolling-number-stepper'
import { NeonHaloCard } from '@/components/ui/neon-halo-card'
import { GoalProgressCard } from '@/components/ui/goal-progress-card'
import { surface, EASE, FitArt, HandleBadge, Overline, POP, Reveal, SPRING, card, focusRing, h2, lede, pillDark, pillLight, section, sectionY } from './landing/kit'

const Sections = React.lazy(() => import('./landing/Sections'))

const NAV = [
  { label: 'Components', to: '/docs/introduction' },
  { label: 'Motion', to: `/docs/category/${categorySlug('Motion Showcase')}` },
  { label: 'Widgets', to: `/docs/category/${categorySlug('Data Widgets')}` },
  { label: 'Install', to: '/docs/installation' },
]

/* ── Mobile sheet: modal dialog with focus trap, Esc, scroll lock and focus return ── */
function MobileSheet({ open, onClose, returnTo }: { open: boolean; onClose: () => void; returnTo: React.RefObject<HTMLButtonElement | null> }) {
  const panel = React.useRef<HTMLDivElement>(null)
  const { setOpen: openSearch } = useCommandPalette()
  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const main = document.getElementById('main')
    main?.setAttribute('inert', '')
    const t = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('a,button')?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = [...panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')]
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    const btn = returnTo.current
    return () => {
      cancelAnimationFrame(t)
      document.body.style.overflow = prev
      main?.removeAttribute('inert')
      document.removeEventListener('keydown', onKey)
      btn?.focus()
    }
  }, [open, onClose, returnTo])

  // Portal: the sticky header uses backdrop-filter, which would otherwise become the containing block.
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div className="absolute inset-0 bg-zinc-950/30 backdrop-blur-sm dark:bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            id="landing-menu"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className={cn(card, 'absolute inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] origin-top overflow-y-auto overscroll-contain rounded-[28px] p-2 shadow-[0_2px_6px_rgb(0_0_0/0.08),0_32px_80px_-32px_rgb(0_0_0/0.45)] max-h-[calc(100dvh-1.5rem)]')}
          >
            <div className="flex h-14 items-center justify-between pl-4 pr-1">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">Menu</span>
              <button type="button" onClick={onClose} className={cn(iconBtn, focusRing)} aria-label="Close menu">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav aria-label="Mobile">
              <ul>
                {NAV.map((n, i) => (
                  <motion.li key={n.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.04 + i * 0.04 }}>
                    <Link to={n.to} onClick={onClose} className={cn('group flex min-h-14 items-center justify-between rounded-[20px] px-4 text-[1.375rem] font-semibold tracking-[-0.03em] text-zinc-950 transition-colors hover:bg-black/[0.04] dark:text-white dark:hover:bg-white/[0.06]', focusRing)}>
                      {n.label}
                      <ArrowUpRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-black/[0.06] p-2 pt-4 dark:border-white/[0.08]">
              <button type="button" onClick={() => { onClose(); openSearch(true) }} className={cn(pillLight, 'w-full')}>
                <Search className="h-4 w-4" aria-hidden /> Search
              </button>
              <a href={SITE.github} target="_blank" rel="noreferrer" className={cn(pillDark, 'w-full')}>
                <GithubIcon className="h-4 w-4" /> GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Nav() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const close = React.useCallback(() => setOpen(false), [])
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled ? 'border-black/[0.06] bg-[#F8F8F7]/80 backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.08] dark:bg-[#0A0A0B]/75' : 'border-transparent',
      )}
    >
      <div className={cn(section, 'flex h-16 items-center gap-3')}>
        <BrandLink />
        <nav aria-label="Primary" className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className={cn('rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white', focusRing)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <SearchTrigger className="shrink-0 whitespace-nowrap" />
          <ThemeToggleButton />
          <a href={SITE.github} target="_blank" rel="noreferrer" className={cn(iconBtn, 'hidden sm:inline-grid')} aria-label="Framekit UI on GitHub (opens in a new tab)">
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <button ref={trigger} type="button" className={cn(iconBtn, 'lg:hidden')} aria-expanded={open} aria-controls="landing-menu" aria-haspopup="dialog" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
      <MobileSheet open={open} onClose={close} returnTo={trigger} />
    </header>
  )
}

/** Headline revealed word by word with a soft blur (screen readers get the whole string once). */
function WordRise({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(' ').map((w, i, a) => (
          <React.Fragment key={i}>
            <motion.span className="inline-block" initial={{ opacity: 0, y: '0.3em', filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.06 }}>
              {w}
            </motion.span>
            {i < a.length - 1 && ' '}
          </React.Fragment>
        ))}
      </span>
    </span>
  )
}

/*
 * Hero fan — positions live in CSS (translate/rotate properties + custom props), so it re-composes per
 * breakpoint without JS: 3 cards under 768 px (sized in vw so they never crop), 5 from 768 px.
 * Motion only animates the entrance on an inner wrapper.
 */
const HAND = [
  { slug: 'liquid-fill-button', label: 'Liquid Fill Button', bg: POP.blue, art: <LiquidFillButton>Get started</LiquidFillButton>, design: 'auto' as const, cls: 'hidden md:block w-[150px] [--fx:-250px] [--fy:44px] rotate-[-12deg] lg:w-[184px] lg:[--fx:-360px] xl:w-[220px] xl:[--fx:-440px] xl:[--fy:52px]' },
  { slug: 'activity-rings', label: 'Activity Rings', bg: '#FFFFFF', art: <ActivityRings />, design: 'auto' as const, cls: 'w-[34vw] [--fx:-25vw] [--fy:20px] rotate-[-8deg] sm:w-[176px] sm:[--fx:-180px] md:w-[160px] md:[--fx:-134px] md:[--fy:14px] md:rotate-[-6deg] lg:w-[200px] lg:[--fx:-190px] xl:w-[236px] xl:[--fx:-228px] xl:[--fy:18px]' },
  { slug: 'neon-halo-card', label: 'Neon Halo Card', bg: POP.ink, art: <NeonHaloCard />, design: 380, cls: 'w-[48vw] [--fx:0px] [--fy:0px] sm:w-[220px] md:w-[190px] lg:w-[232px] xl:w-[272px]' },
  { slug: 'rolling-number-stepper', label: 'Rolling Number Stepper', bg: POP.lime, art: <RollingNumberStepper />, design: 'auto' as const, cls: 'w-[34vw] [--fx:25vw] [--fy:20px] rotate-[8deg] sm:w-[176px] sm:[--fx:180px] md:w-[160px] md:[--fx:134px] md:[--fy:14px] md:rotate-[6deg] lg:w-[200px] lg:[--fx:190px] xl:w-[236px] xl:[--fx:228px] xl:[--fy:18px]' },
  { slug: 'glow-candle-card', label: 'Glow Candle Card', bg: '#F1F1EF', art: <GlowCandleCard />, design: 440, cls: 'hidden md:block w-[150px] [--fx:250px] [--fy:44px] rotate-[12deg] lg:w-[184px] lg:[--fx:360px] xl:w-[220px] xl:[--fx:440px] xl:[--fy:52px]' },
]

function Hero({ count, cats }: { count: number; cats: number }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate">
      {/* Ambient light: faint lime/blue wash, intentionally different per theme. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] bg-[radial-gradient(50%_40%_at_50%_72%,rgb(217_249_92/0.28),transparent_70%),radial-gradient(40%_30%_at_70%_20%,rgb(43_91_255/0.06),transparent_70%)] dark:bg-[radial-gradient(50%_40%_at_50%_72%,rgb(217_249_92/0.10),transparent_70%),radial-gradient(45%_35%_at_50%_0%,rgb(43_91_255/0.18),transparent_70%)]" />
      <div className={cn(section, 'pb-20 pt-12 text-center sm:pb-28 sm:pt-16 lg:pt-20')}>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="inline-flex max-w-full items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-[13px] font-medium text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/[0.06] dark:bg-white/[0.05] dark:text-zinc-300 dark:ring-white/[0.1]">
          <span className="rounded-full bg-[#D9F95C] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-950">New</span>
          <span className="truncate"><span className="tabular-nums">{count}</span> components · <span className="tabular-nums">{cats}</span> categories</span>
        </motion.p>
        <h1 id="hero-title" className="mx-auto mt-6 max-w-[14ch] text-balance text-[clamp(2.625rem,1.6rem+5.4vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950 sm:mt-8 dark:text-white">
          <WordRise text="Interfaces that feel alive." delay={0.08} />
        </h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.35 }} className={cn(lede, 'mx-auto mt-6 max-w-[46ch]')}>
          Premium, motion-rich React components. Copy the source or install with the shadcn CLI — light, dark, keyboard and reduced motion included.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.45 }} className="mx-auto mt-8 flex max-w-sm flex-col items-stretch justify-center gap-3 min-[420px]:max-w-none min-[420px]:flex-row min-[420px]:items-center">
          <Link to="/docs/introduction" className={cn(pillDark, 'h-12 px-6 text-[15px]')}>
            Browse components <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href={SITE.github} target="_blank" rel="noreferrer" className={cn(pillLight, 'h-12 px-6 text-[15px]')}>
            <GithubIcon className="h-4 w-4" /> Star on GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </motion.div>

        {/* Hand of cards */}
        <div className="relative mx-auto mt-14 h-[calc(48vw+48px)] max-w-[1100px] sm:mt-16 sm:h-[288px] md:h-[264px] lg:h-[308px] xl:h-[348px]">
          {HAND.map((c, i) => {
            const d = Math.abs(i - 2)
            const s = surface(c.bg)
            return (
              <div key={c.slug} className={cn('absolute left-1/2 top-3', c.cls)} style={{ translate: 'calc(-50% + var(--fx)) var(--fy)', zIndex: 5 - d }}>
                <motion.div
                  initial={{ y: 48, opacity: 0, scale: 0.92 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ ...SPRING, stiffness: 170, damping: 22, delay: 0.5 + d * 0.08 }}
                  className="relative [@media(hover:hover)]:transition-transform [@media(hover:hover)]:duration-300 [@media(hover:hover)]:hover:-translate-y-2"
                >
                  <Link to={`/docs/${c.slug}`} className={cn('relative block aspect-square overflow-hidden rounded-[24px] shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-24px_rgb(24_24_27/0.4)] ring-1 ring-black/[0.06] sm:rounded-[28px] dark:shadow-[0_24px_48px_-24px_rgb(0_0_0/0.8)] dark:ring-white/[0.1]', focusRing, s.className)} style={s.style}>
                    <FitArt design={c.design} fill={i === 2 ? 0.86 : 0.8} className="absolute inset-0">{c.art}</FitArt>
                    <span className="sr-only">Open the {c.label} demo</span>
                  </Link>
                  {i === 2 && <HandleBadge handle={c.slug} color={POP.lime} text="#0A0A0B" delay={0.9} className="-top-3 left-1/2 -translate-x-1/2" />}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Stack strip ─────────────────────────────────────────────────────── */
const STACK = ['React 19', 'TypeScript', 'Tailwind v4', 'Motion', 'shadcn/ui', 'Vite']
function StackStrip() {
  return (
    <section aria-labelledby="stack-title" className="border-y border-black/[0.06] dark:border-white/[0.08]">
      <div className={cn(section, 'flex flex-col items-center gap-5 py-8 lg:flex-row lg:justify-between lg:gap-8')}>
        <h2 id="stack-title" className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">Built on the stack you trust</h2>
        <Reveal as="div" className="w-full lg:w-auto">
          <ul className="grid grid-cols-3 gap-x-6 gap-y-3 text-center sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10 lg:justify-end">
            {STACK.map((s) => (
              <li key={s} className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-500 sm:text-lg dark:text-zinc-400" translate="no">{s}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Why (collage) ───────────────────────────────────────────────────── */
const COLLAGE = [
  { cls: 'left-0 top-0 w-[64%] rotate-[-3deg] z-[1]', bg: POP.ink, slug: 'glow-candle-card', art: <GlowCandleCard />, design: 440, badge: [POP.lime, '#0A0A0B'], bcls: '-bottom-3 left-5' },
  { cls: 'right-0 top-[10%] w-[50%] rotate-[4deg] z-[2]', bg: '#FFFFFF', slug: 'activity-rings', art: <ActivityRings />, design: 'auto', badge: [POP.ink, '#fff'], bcls: '-top-3 right-5' },
  { cls: 'left-[16%] bottom-0 w-[58%] rotate-[1deg] z-[3]', bg: '#F1F1EF', slug: 'goal-progress-card', art: <GoalProgressCard />, design: 380, badge: [POP.blue, '#fff'], bcls: '-bottom-3 right-5' },
] as const
function Why() {
  return (
    <section aria-labelledby="why-title" className={cn(section, sectionY, 'grid items-center gap-14 lg:grid-cols-[5fr_7fr] lg:gap-16')}>
      <div className="min-w-0">
        <Reveal><Overline>Why Framekit</Overline></Reveal>
        <Reveal delay={0.04}>
          <h2 id="why-title" className={cn(h2, 'mt-4')}>
            Motion with a <span className="text-[#2B5BFF] dark:text-[#8FA8FF]">reason</span>, never decoration.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className={cn(lede, 'mt-6 max-w-[46ch]')}>
            Every spring, blur and stagger answers a gesture. Components ship with typed props, sensible defaults and a reduced-motion path, so they feel finished on day one.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-black/[0.06] pt-6 dark:border-white/[0.08]">
            {[['AA', 'contrast, both themes'], ['44px', 'touch targets'], ['0', 'runtime deps']].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-2xl font-semibold tabular-nums tracking-[-0.03em] text-zinc-950 dark:text-white">{n}</dd>
                <dd className="mt-1 text-xs leading-snug text-zinc-600 dark:text-zinc-400">{l}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.16} className="mt-8 flex flex-wrap gap-3">
          <Link to="/docs/category/motion-showcase" className={pillDark}>See the motion</Link>
          <Link to="/docs/installation" className={pillLight}>How install works</Link>
        </Reveal>
      </div>
      <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[560px] sm:aspect-[1.15/1] lg:max-w-none">
        {COLLAGE.map((c, i) => {
          const s = surface(c.bg)
          return (
            <Reveal key={c.slug} delay={i * 0.08} y={24} scale={0.96} className={cn('absolute', c.cls)}>
              <div className={cn('relative aspect-[4/3.3] overflow-hidden rounded-[24px] shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_48px_-24px_rgb(24_24_27/0.35)] ring-1 ring-black/[0.06] sm:rounded-[28px] dark:shadow-[0_24px_48px_-24px_rgb(0_0_0/0.8)] dark:ring-white/[0.1]', s.className)} style={s.style}>
                <FitArt design={c.design} fill={0.84} className="absolute inset-0">{c.art}</FitArt>
              </div>
              <HandleBadge handle={c.slug} color={c.badge[0]} text={c.badge[1]} delay={0.3 + i * 0.08} className={cn(c.bcls, 'max-sm:hidden')} />
            </Reveal>
          )
        })}
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
    <div className="min-h-screen overflow-x-clip bg-[#F8F8F7] text-zinc-950 antialiased [-webkit-tap-highlight-color:transparent] dark:bg-[#0A0A0B] dark:text-white">
      <a href="#main" className={cn('sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-white')}>Skip to content</a>
      <Nav />
      <main id="main">
        <Hero count={count} cats={groups.length} />
        <StackStrip />
        <Why />
        <React.Suspense fallback={<div className="h-[100vh]" aria-hidden />}>
          <Sections />
        </React.Suspense>
      </main>
    </div>
  )
}
