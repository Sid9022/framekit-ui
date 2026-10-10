import * as React from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Copy, Pause, Play, Terminal } from 'lucide-react'
import { track } from '@vercel/analytics'
import { registryItemUrl } from '@/components/docs/install-block'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PerspectiveTunnelCarousel, type TunnelItem } from '@/components/ui/perspective-tunnel-carousel'
import { GlowCandleCard } from '@/components/ui/glow-candle-card'
import { ActivityRings } from '@/components/ui/activity-rings'
import { NeonHaloCard } from '@/components/ui/neon-halo-card'
import { BudgetAreaCard } from '@/components/ui/budget-area-card'
import { DynamicStatusIsland } from '@/components/ui/dynamic-status-island'
import { LitProductCard3D } from '@/components/ui/lit-product-card-3d'
import { GoalProgressCard } from '@/components/ui/goal-progress-card'
import { GlowHistogramCard } from '@/components/ui/glow-histogram-card'
import { SpendDonutCard } from '@/components/ui/spend-donut-card'
import { SmartWidgetStack } from '@/components/ui/smart-widget-stack'
import { LiquidGlassTabBar } from '@/components/ui/liquid-glass-tab-bar'
import { ContributionHeatmapTile } from '@/components/ui/contribution-heatmap-tile'
import { GlowLevelCard } from '@/components/ui/glow-level-card'
import { WalletBalanceCard } from '@/components/ui/wallet-balance-card'
import { GithubStarsLink } from '@/components/github-stars'
import { EASE, FitArt, POP, focusRing, pillLime, surface } from './kit'

/* Showcase entries: a real component, its backdrop, and the line the install pill reads out. */
const SHOW: { slug: string; label: string; note: string; bg: string; design: number | 'auto'; fill?: number; art: React.ReactNode; phone?: boolean }[] = [
  { slug: 'neon-halo-card', label: 'Neon Halo Card', note: 'Light that sweeps around the edge.', bg: POP.ink, design: 380, art: <NeonHaloCard />, phone: true },
  { slug: 'activity-rings', label: 'Activity Rings', note: 'Rings that close on a spring.', bg: '#FFFFFF', design: 'auto', art: <ActivityRings />, phone: true },
  { slug: 'glow-candle-card', label: 'Glow Candle Card', note: 'Neon candlesticks that stream live.', bg: '#F1F1EF', design: 440, art: <GlowCandleCard />, phone: true },
  { slug: 'goal-progress-card', label: 'Goal Progress Card', note: 'Numbers roll, milestones celebrate.', bg: POP.lime, design: 380, art: <GoalProgressCard />, phone: true },
  { slug: 'dynamic-status-island', label: 'Dynamic Status Island', note: 'A pill that morphs between states.', bg: '#E5ECFF', design: 420, art: <DynamicStatusIsland />, phone: true },
  { slug: 'budget-area-card', label: 'Budget Area Card', note: 'A chart that draws itself in.', bg: '#FFFFFF', design: 420, art: <BudgetAreaCard />, phone: true },
  { slug: 'lit-product-card-3d', label: 'Lit Product Card 3D', note: 'Highlights and shadows track the tilt.', bg: '#F1F1EF', design: 380, art: <LitProductCard3D />, phone: true },
  { slug: 'glow-histogram-card', label: 'Glow Histogram Card', note: 'Bars rise with glowing caps.', bg: POP.ink, design: 420, art: <GlowHistogramCard /> },
  { slug: 'liquid-glass-tab-bar', label: 'Liquid Glass Tab Bar', note: 'A glass lens slides between tabs.', bg: POP.blue, design: 380, fill: 0.92, art: <LiquidGlassTabBar /> },
  { slug: 'contribution-heatmap-tile', label: 'Contribution Heatmap', note: 'Activity cells pop in on a wave.', bg: POP.lime, design: 460, art: <ContributionHeatmapTile /> },
  { slug: 'spend-donut-card', label: 'Spend Donut Card', note: 'Segments sweep in, totals roll up.', bg: '#E5ECFF', design: 400, art: <SpendDonutCard /> },
  { slug: 'glow-level-card', label: 'Glow Level Card', note: 'Neon level bars light up in sequence.', bg: POP.ink, design: 420, art: <GlowLevelCard /> },
  { slug: 'smart-widget-stack', label: 'Smart Widget Stack', note: 'Widgets flip on a damped spring.', bg: '#FFFFFF', design: 'auto', art: <SmartWidgetStack /> },
  { slug: 'wallet-balance-card', label: 'Wallet Balance Card', note: 'Pick a card; the balance rolls to match.', bg: POP.blue, design: 380, art: <WalletBalanceCard /> },
]

/** Router-aware anchor for the tunnel cards (the library component renders `linkAs` with `href`). */
function RouterA({ href, ...rest }: React.ComponentPropsWithoutRef<'a'> & { href: string }) {
  return <Link to={href} {...rest} />
}

function useWidth() {
  const [w, setW] = React.useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth))
  React.useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener('resize', on, { passive: true })
    return () => window.removeEventListener('resize', on)
  }, [])
  return w
}

/** Tunnel geometry per breakpoint. Overlay layouts put the copy above / below the vanishing point. */
function geometry(w: number) {
  if (w < 768) {
    const we = Math.min(w * 0.5, 260)
    return { overlay: false, wc: Math.min(w * 0.3, 150), we, band: Math.round(we * (4 / 3) * 1.02) }
  }
  if (w < 1024) {
    const wc = w * 0.115
    return { overlay: true, wc, we: w * 0.34, band: Math.round(wc * (4 / 3) + 56) }
  }
  const wc = Math.min(132, Math.max(84, w * 0.062))
  return { overlay: true, wc, we: Math.min(w * 0.235, 460), band: Math.round(wc * (4 / 3) + 72) }
}

/** Headline rises word by word out of a soft blur; screen readers get the string once. */
function Rise({ words, delay = 0 }: { words: { t: string; i?: boolean }[]; delay?: number }) {
  return (
    <span aria-hidden className="block">
      {words.map((w, k) => (
        <React.Fragment key={k}>
          <motion.span className={cn('inline-block', w.i && 'italic')} initial={{ opacity: 0, y: '0.28em', filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.9, ease: EASE, delay: delay + k * 0.07 }}>
            {w.t}
          </motion.span>
          {k < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  )
}

/* ── Install pill: icon · two lines that swap every 2.8 s · copy ─────────── */
function InstallPill({ paused }: { paused: boolean }) {
  const [i, setI] = React.useState(0)
  const [hold, setHold] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<number | undefined>(undefined)
  const s = SHOW[i]
  const full = `npx shadcn@latest add ${registryItemUrl(s.slug)}`
  React.useEffect(() => {
    if (paused || hold) return
    const id = window.setInterval(() => { if (!document.hidden) setI((v) => (v + 1) % SHOW.length) }, 2800)
    return () => window.clearInterval(id)
  }, [paused, hold])
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = async () => {
    try { await navigator.clipboard.writeText(full) } catch { /* blocked: still confirm */ }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
    track('copy', { slug: s.slug, kind: 'landing-hero-pill' })
  }
  const lineMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -14 }, transition: { duration: 0.4, ease: EASE } }
  return (
    <div
      ref={ref}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node)) setHold(false) }}
      className="flex w-full max-w-[488px] items-center gap-3 rounded-full sm:w-[400px] lg:w-[488px] bg-[#111] py-2 pl-2 pr-2 text-left shadow-[0_1px_2px_rgb(0_0_0/0.2),0_16px_40px_-16px_rgb(0_0_0/0.45),inset_0_1px_0_rgb(255_255_255/0.08)] dark:bg-[#18181B] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_0_1px_rgb(255_255_255/0.08)]"
    >
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[#D9F95C]"><Terminal className="h-[18px] w-[18px]" /></span>
      <div className="relative h-10 min-w-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div key={s.slug} className="absolute inset-0 flex flex-col justify-center" {...lineMotion}>
            <p className="truncate font-mono text-[13px] leading-5 text-white" translate="no"><span className="hidden text-white/50 lg:inline">npx shadcn add </span>@framekit/{s.slug}</p>
            <p className="truncate text-[12.5px] leading-5 text-zinc-400">{s.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : `Copy install command for ${s.label}`}
        className={cn('relative grid h-10 w-10 shrink-0 touch-manipulation place-items-center rounded-full bg-white text-zinc-950 transition-[transform,background-color] duration-150 hover:bg-zinc-200 active:scale-[0.94] motion-reduce:active:scale-100 pointer-coarse:h-11 pointer-coarse:w-11', 'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9F95C]')}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span key={copied ? 'y' : 'n'} initial={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }} transition={{ type: 'spring', stiffness: 520, damping: 30 }}>
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          </motion.span>
        </AnimatePresence>
      </button>
      <span className="sr-only" role="status" aria-live="polite">{copied ? `Copied the install command for ${s.label}` : ''}</span>
    </div>
  )
}

/* Film grain (generated SVG noise) for the off-white stage. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const GRAIN_LIGHT = GRAIN.replace("values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'", "values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'")

export function ShowcaseHero({ count, cats }: { count: number; cats: number }) {
  const w = useWidth()
  const g = geometry(w)
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = React.useState(false)
  const phone = w < 768
  const items: TunnelItem[] = React.useMemo(
    () =>
      SHOW.filter((s) => !phone || s.phone).map((s) => {
        const sf = surface(s.bg)
        return {
          id: s.slug,
          label: s.label,
          href: `/docs/${s.slug}`,
          content: (
            <span className={cn('absolute inset-0 block', sf.className)} style={sf.style}>
              <FitArt design={s.design} fill={s.fill ?? 0.84} className="absolute inset-0">{s.art}</FitArt>
            </span>
          ),
        }
      }),
    [phone],
  )
  const overlay = g.overlay && !reduced
  const bandH = reduced ? Math.round(Math.min(w * 0.46, 220) * (4 / 3) + 40) : g.band

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-x-clip bg-[#F4F4F4] dark:bg-[#0B0B0C]">
      {/* Stage: grain + a soft top light; dark gets its own cool key light. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] dark:hidden" style={{ backgroundImage: GRAIN }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden opacity-[0.05] dark:block" style={{ backgroundImage: GRAIN_LIGHT }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,rgb(255_255_255/0.9),transparent_70%)] dark:bg-[radial-gradient(55%_45%_at_50%_0%,rgb(43_91_255/0.16),transparent_70%),radial-gradient(40%_30%_at_50%_100%,rgb(217_249_92/0.06),transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-[#F8F8F7] dark:to-[#0A0A0B]" />

      <div className={cn('relative flex flex-col items-center text-center', overlay ? 'pb-16 pt-12 lg:pb-20 lg:pt-14' : 'pb-14 pt-10 sm:pt-12')}>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="relative z-10 mx-6 inline-flex max-w-[calc(100%-3rem)] items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-[13px] font-medium text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/[0.06] dark:bg-[#161618] dark:text-zinc-300 dark:ring-white/[0.1]">
          <span className="rounded-full bg-[#D9F95C] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-950">New</span>
          <span className="truncate"><span className="tabular-nums">{count}</span> components · <span className="tabular-nums">{cats}</span> categories</span>
        </motion.p>

        <h1 id="hero-title" className="relative z-10 mx-6 mt-6 max-w-[16ch] text-balance font-display text-[clamp(2.75rem,2.1rem+2.7vw,5.5rem)] font-normal leading-[1] tracking-[-0.02em] text-zinc-950 sm:mt-7 dark:text-white">
          <span className="sr-only">One library. Every interface, alive.</span>
          <Rise words={[{ t: 'One' }, { t: 'library.' }]} delay={0.05} />
          <Rise words={[{ t: 'Every' }, { t: 'interface,' }, { t: 'alive.', i: true }]} delay={0.2} />
        </h1>

        {/* The tunnel band. In overlay layouts the outer cards bleed above and below it, behind the copy. */}
        <motion.div
          className={cn('relative w-full', overlay ? 'mt-6 lg:mt-8' : 'mt-6')}
          style={{ height: bandH }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
        >
          <PerspectiveTunnelCarousel
            items={items}
            linkAs={RouterA}
            centerWidth={g.wc}
            edgeWidth={g.we}
            clip={false}
            controls={false}
            paused={paused}
            onPausedChange={setPaused}
            speed={phone ? 0.3 : 0.34}
            label="Framekit components in motion"
            className="h-full"
          />
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.45 }} className={cn('relative z-10 mx-6 max-w-[42ch] text-pretty text-[15px] leading-relaxed text-[#4A4A4A] sm:text-base dark:text-zinc-400', overlay ? 'mt-6 lg:mt-8' : 'mt-6')}>
          <span className="tabular-nums">{count}</span> premium, motion-rich React components. Every card drifting past is the real thing — copy one command and the source is yours, light, dark and keyboard included.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.55 }} className="relative z-10 mt-8 flex w-full max-w-[calc(100%-3rem)] flex-col items-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <InstallPill paused={paused} />
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Link to="/docs/introduction" className={cn(pillLime, 'h-14 flex-1 px-6 text-[15px] sm:flex-none')}>
              Browse components <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={paused ? 'Play the component tunnel' : 'Pause the component tunnel'}
                className={cn('grid h-14 w-14 shrink-0 touch-manipulation place-items-center rounded-full bg-white text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.08] transition-[background-color,transform] duration-150 hover:bg-zinc-50 active:scale-[0.94] motion-reduce:active:scale-100 dark:bg-[#161618] dark:text-white dark:ring-white/[0.12] dark:hover:bg-white/[0.1]', focusRing)}
              >
                {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
              </button>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, ease: EASE, delay: 0.7 }} className="relative z-10 mt-3">
          <GithubStarsLink focusClassName={focusRing} />
        </motion.div>
      </div>

    </section>
  )
}
