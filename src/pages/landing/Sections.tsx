import * as React from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Boxes, Check, Code2, Copy, Keyboard, Layers, MoonStar, MousePointer2, Pause, Play, Sparkles, Star, Terminal, Wand2, Zap, Heart } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { SITE } from '@/config/site'
import { categorySlug, componentDocs, getNavGroups } from '@/docs/registry'
import { CopyButton, registryItemUrl } from '@/components/docs/install-block'
import { LazyMount } from '@/components/docs/lazy-mount'
import { BrandLink } from '@/components/docs/chrome'
import { cn } from '@/lib/cn'
import { GlassAppDock } from '@/components/ui/glass-app-dock'
import { SpendDonutCard } from '@/components/ui/spend-donut-card'
import { GlowLeaderboardList } from '@/components/ui/glow-leaderboard-list'
import { SparklineKpiTile } from '@/components/ui/sparkline-kpi-tile'
import { BudgetAreaCard } from '@/components/ui/budget-area-card'
import { InkDripLoader } from '@/components/ui/ink-drip-loader'
import { LatticePulseLoader } from '@/components/ui/lattice-pulse-loader'
import { MorphGlyphLoader } from '@/components/ui/morph-glyph-loader'
import { NeonStrokeButton } from '@/components/ui/neon-stroke-button'
import { ConfettiBurstButton } from '@/components/ui/confetti-burst-button'
import { GoalProgressCard } from '@/components/ui/goal-progress-card'
import { surface, Art, DocLink, EASE, HandleBadge, Overline, POP, Reveal, SPRING, SectionHeader, card, focusRing, gutter, h2, muted, pillDark, pillLight, pillLime, section, sectionY, useReduced } from './kit'

const groups = getNavGroups().filter((g) => g.title !== 'Getting Started')
const count = componentDocs.length
const cmd = (slug: string) => `npx shadcn@latest add ${registryItemUrl(slug)}`
const fineHover = '[@media(hover:hover)]:transition-transform [@media(hover:hover)]:duration-300 [@media(hover:hover)]:ease-out [@media(hover:hover)]:hover:-translate-y-1'

/* ── Featured banner ─────────────────────────────────────────────────── */
const BANNER = [
  { slug: 'glass-app-dock', title: 'Glass App Dock', note: 'Icons magnify on a spring and bounce on launch.', art: <GlassAppDock />, s: 0.9 },
  { slug: 'budget-area-card', title: 'Budget Area Card', note: 'A chart that draws itself, with a tooltip that springs between points.', art: <BudgetAreaCard />, s: 0.8 },
  { slug: 'goal-progress-card', title: 'Goal Progress Card', note: 'Numbers roll, the ring fills, the milestone celebrates.', art: <GoalProgressCard />, s: 0.8 },
]
function Banner() {
  const [i, setI] = React.useState(0)
  const b = BANNER[i]
  const go = (d: number) => setI((v) => (v + d + BANNER.length) % BANNER.length)
  const ctrl = cn('grid h-11 w-11 touch-manipulation place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur transition-[background-color,transform] duration-150 hover:bg-white/25 active:scale-95 motion-reduce:active:scale-100', 'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white')
  return (
    <section aria-labelledby="banner-title" className={cn(section, 'pb-20 sm:pb-28 lg:pb-32')}>
      <Reveal y={24} scale={0.98}>
        <div className="relative isolate overflow-hidden rounded-[32px] bg-[#2B5BFF] p-6 text-white shadow-[0_1px_2px_rgb(43_91_255/0.2),0_32px_64px_-32px_rgb(43_91_255/0.6)] sm:p-10 lg:p-12 dark:bg-[#1F3FD1] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_100%_0%,rgb(255_255_255/0.22),transparent_60%),radial-gradient(60%_50%_at_0%_100%,rgb(10_10_11/0.25),transparent_60%)]" />
          <div className="grid items-center gap-8 lg:grid-cols-[5fr_7fr] lg:gap-12">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white">Featured · <span className="tabular-nums">{i + 1}/{BANNER.length}</span></p>
              <p className="sr-only" aria-live="polite">Featured {i + 1} of {BANNER.length}: {b.title}</p>
              <div className="mt-4 min-h-[8.5rem] sm:min-h-[9.5rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={b.slug} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }} transition={{ duration: 0.35, ease: EASE }}>
                    <h2 id="banner-title" className="text-balance text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.045em]">{b.title}</h2>
                    <p className="mt-3 max-w-[38ch] text-pretty text-base text-white/85 sm:text-lg">{b.note}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to={`/docs/${b.slug}`} className={cn(pillLight, 'ring-0 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100')}><Play className="h-4 w-4" aria-hidden /> Open demo</Link>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => go(-1)} aria-label="Previous featured component" className={ctrl}><ArrowLeft className="h-4 w-4" aria-hidden /></button>
                  <button type="button" onClick={() => go(1)} aria-label="Next featured component" className={ctrl}><ArrowRight className="h-4 w-4" aria-hidden /></button>
                </div>
                <div className="ml-1 flex items-center gap-1.5" aria-hidden>
                  {BANNER.map((x, k) => <span key={x.slug} className={cn('h-1.5 rounded-full bg-white transition-[width,opacity] duration-300', k === i ? 'w-5 opacity-100' : 'w-1.5 opacity-40')} />)}
                </div>
              </div>
            </div>
            <div className="relative h-[280px] min-w-0 overflow-hidden rounded-[24px] bg-white/[0.14] ring-1 ring-white/25 shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] sm:h-[360px] lg:h-[400px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={b.slug} className="absolute inset-0" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.45, ease: EASE }}>
                  <Art scale={b.s} className="h-full" live>{b.art}</Art>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ── Statement + category posters ─────────────────────────────────────── */
function WordReveal({ text, highlight }: { text: string; highlight: string }) {
  const [pre, post] = text.split(highlight)
  const w = (s: string) => s.trim().split(' ').filter(Boolean)
  const all = [...w(pre).map((t) => ({ t, h: false })), { t: highlight, h: true }, ...w(post).map((t) => ({ t, h: false }))]
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {all.map((x, i) => (
          <motion.span key={i} className="relative mr-[0.25em] inline-block" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}>
            {x.h ? (
              <span className="relative whitespace-nowrap text-[#2B5BFF] dark:text-[#8FA8FF]">
                {x.t}
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-2.5 w-full" aria-hidden>
                  <motion.path d="M4 14 C 60 4, 120 18, 180 9 S 280 6, 296 12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.04 }} />
                </svg>
              </span>
            ) : x.t}
          </motion.span>
        ))}
      </span>
    </>
  )
}
const POSTERS = [
  { bg: POP.ink, fg: '#fff', sub: 'text-white/70', dark: 'dark:ring-1 dark:ring-white/[0.1]' },
  { bg: POP.lime, fg: '#0A0A0B', sub: 'text-black/70', dark: '' },
  { bg: '#FFFFFF', fg: '#0A0A0B', sub: 'text-black/60', dark: 'ring-1 ring-black/[0.06]' },
  { bg: POP.blue, fg: '#fff', sub: 'text-white', dark: '' },
  { bg: '#E9E9E6', fg: '#0A0A0B', sub: 'text-black/60', dark: '' },
]
function Statement() {
  const sorted = [...groups].sort((a, b) => b.items.length - a.items.length)
  const top = sorted.slice(0, 5)
  const rest = sorted.slice(5)
  return (
    <section aria-labelledby="statement-title" className={cn(sectionY, 'text-center')}>
      <div className={section}>
        <Reveal><Overline className="justify-center">One command per component</Overline></Reveal>
        <h2 id="statement-title" className={cn(h2, 'mx-auto mt-4 max-w-[18ch]')}>
          <WordReveal text="Copy one command and ship an interface that feels finished." highlight="feels finished." />
        </h2>
      </div>
      {/* Full-bleed snap row on small screens; centred row from lg. */}
      <ul className={cn('mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] sm:mt-16 sm:gap-4 lg:justify-center lg:overflow-visible', gutter, 'scroll-px-6 sm:scroll-px-8')} aria-label="Largest categories">
        {top.map((g, i) => {
          const p = POSTERS[i]
          return (
            <Reveal as="li" key={g.title} delay={i * 0.05} y={24} className="shrink-0 snap-start">
              <Link to={`/docs/category/${categorySlug(g.title)}`} className={cn('group flex h-[300px] w-[200px] flex-col justify-between rounded-[28px] p-6 text-left shadow-[0_1px_2px_rgb(0_0_0/0.05),0_16px_40px_-20px_rgb(0_0_0/0.3)] sm:h-[340px] sm:w-[216px]', fineHover, focusRing, p.dark)} style={{ background: p.bg, color: p.fg }}>
                <span className={cn('text-xs font-semibold uppercase tracking-[0.12em]', p.sub)}>Category</span>
                <span>
                  <span className="block text-[3.5rem] font-semibold leading-none tabular-nums tracking-[-0.05em]">{g.items.length}</span>
                  <span className="mt-3 block text-xl font-semibold leading-tight tracking-[-0.03em]">{g.title}</span>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium">Explore <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
                </span>
              </Link>
            </Reveal>
          )
        })}
      </ul>
      <div className={section}>
        <Reveal delay={0.1}>
          <p className="mt-10 text-sm font-medium text-zinc-600 dark:text-zinc-400">…and <span className="tabular-nums">{rest.length}</span> more shelves</p>
          <ul className="mx-auto mt-4 flex max-w-[60rem] flex-wrap justify-center gap-2" aria-label="More categories">
            {rest.map((g) => (
              <li key={g.title}>
                <Link to={`/docs/category/${categorySlug(g.title)}`} className={cn('inline-flex min-h-9 items-center gap-2 rounded-full bg-white px-3.5 text-[13px] font-medium text-zinc-800 ring-1 ring-black/[0.06] transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-950 hover:ring-black/[0.12] pointer-coarse:min-h-11 dark:bg-white/[0.05] dark:text-zinc-300 dark:ring-white/[0.08] dark:hover:bg-white/[0.09] dark:hover:text-white', focusRing)}>
                  {g.title} <span className="tabular-nums text-zinc-500 dark:text-zinc-400">{g.items.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Tabs + 2×2 grid ─────────────────────────────────────────────────── */
const TAB_CATS = ['Data Widgets', 'Website Sections', 'Product UI', 'Motion Showcase'].filter((t) => groups.some((g) => g.title === t))
const TAB_ICON = [Layers, Boxes, MousePointer2, Wand2]
function Tabs() {
  const [tab, setTab] = React.useState(0)
  const items = (groups.find((g) => g.title === TAB_CATS[tab])?.items ?? []).slice(0, 4)
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: React.KeyboardEvent) => {
    const n = TAB_CATS.length
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (tab + 1) % n : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (tab - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
    if (next < 0) return
    e.preventDefault()
    setTab(next)
    refs.current[next]?.focus()
  }
  const Icon = TAB_ICON[tab] ?? Boxes
  return (
    <section aria-labelledby="tabs-title" className={cn(section, sectionY, 'grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16')}>
      <div className="min-w-0">
        <Reveal><Overline>Browse by need</Overline></Reveal>
        <Reveal delay={0.04}><h2 id="tabs-title" className={cn(h2, 'mt-4')}>Pick a shelf. Everything on it moves.</h2></Reveal>
        <Reveal delay={0.08}>
          <div role="tablist" aria-label="Component categories" onKeyDown={onKey} className="mt-8 inline-flex max-w-full flex-wrap gap-1 rounded-[24px] bg-black/[0.04] p-1 dark:bg-white/[0.06]">
            {TAB_CATS.map((t, i) => (
              <button key={t} ref={(el) => { refs.current[i] = el }} role="tab" id={`tab-${i}`} aria-selected={tab === i} aria-controls="tab-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} className={cn('relative min-h-11 touch-manipulation rounded-full px-4 text-sm font-medium transition-colors duration-150', focusRing, tab === i ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white')}>
                {tab === i && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_4px_12px_-4px_rgb(0_0_0/0.12)] ring-1 ring-black/[0.04] dark:bg-zinc-800 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] dark:ring-white/[0.06]" transition={{ type: 'spring', stiffness: 460, damping: 36 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12}><Link to={`/docs/category/${categorySlug(TAB_CATS[tab])}`} className={cn(pillDark, 'mt-8')}>All {TAB_CATS[tab]} <ArrowRight className="h-4 w-4" aria-hidden /></Link></Reveal>
      </div>
      <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((d, i) => (
            <motion.div key={d.slug} className="min-w-0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}>
              <Link to={`/docs/${d.slug}`} className={cn(card, 'group flex h-full min-h-[184px] flex-col justify-between gap-6 p-6', fineHover, focusRing, i === 0 && 'bg-zinc-950 text-white ring-zinc-950 dark:bg-[#D9F95C] dark:text-zinc-950 dark:ring-[#D9F95C]')}>
                <span className="flex items-center justify-between">
                  <span className={cn('grid h-10 w-10 place-items-center rounded-[14px]', i === 0 ? 'bg-white/10 dark:bg-black/10' : 'bg-black/[0.04] dark:bg-white/[0.06]')}><Icon className="h-5 w-5" aria-hidden /></span>
                  <ArrowUpRight className="h-5 w-5 opacity-60 transition-[transform,opacity] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-semibold tracking-[-0.02em]">{d.title}</span>
                  <span className={cn('mt-1.5 line-clamp-2 text-sm leading-relaxed', i === 0 ? 'text-white/70 dark:text-zinc-800' : 'text-zinc-600 dark:text-zinc-400')}>{d.description}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ── Bento ────────────────────────────────────────────────────────────── */
function Bento() {
  const install = cmd('glow-candle-card')
  return (
    <section aria-labelledby="bento-title" className={cn(section, sectionY)}>
      <SectionHeader id="bento-title" eyebrow="Built properly" title="Premium on the outside, careful on the inside." titleClassName="max-w-[16ch]" />
      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <Reveal className="min-w-0 md:col-span-4">
          <div className={cn(card, 'flex h-full flex-col justify-between gap-8 p-6 sm:p-8')}>
            <div>
              <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-black/[0.04] dark:bg-white/[0.06]"><Code2 className="h-5 w-5" aria-hidden /></span>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">Install with the shadcn CLI</h3>
              <p className={cn(muted, 'mt-2 max-w-[48ch]')}>The source lands in your repo, typed and editable. No runtime package, no lock-in.</p>
            </div>
            <div className="flex min-w-0 items-center gap-2 rounded-[16px] bg-[#F4F4F2] p-2 pl-4 ring-1 ring-black/[0.04] dark:bg-black dark:ring-white/[0.06]">
              <span className="select-none font-mono text-[13px] text-zinc-400" aria-hidden>$</span>
              <code tabIndex={0} aria-label="Install command" className={cn('min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-md font-mono text-[13px] [scrollbar-width:none]', focusRing)} translate="no">{install}</code>
              <CopyButton value={install} meta={{ slug: 'glow-candle-card', kind: 'landing-bento' }} label="Copy install command" className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        </Reveal>
        <Reveal className="min-w-0 md:col-span-2" delay={0.06}>
          <div className="flex h-full min-h-[240px] flex-col justify-between rounded-[24px] bg-[#D9F95C] p-6 text-zinc-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_16px_40px_-24px_rgb(120_150_0/0.5)] sm:p-8">
            <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-black/[0.06]"><Keyboard className="h-5 w-5" aria-hidden /></span>
            <div>
              <p className="text-5xl font-semibold tracking-[-0.05em]">AA</p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em]">Accessible by default</h3>
              <p className="mt-1 text-sm text-black/70">Keyboard, focus rings, screen-reader labels and reduced motion.</p>
            </div>
          </div>
        </Reveal>
        <Reveal className="min-w-0 md:col-span-3" delay={0.08}>
          <div className={cn(card, 'relative h-[340px] overflow-hidden')}>
            <LazyMount minHeight={340}><Art scale={0.72} className="h-[340px]">{<SpendDonutCard />}</Art></LazyMount>
            <HandleBadge handle="spend-donut-card" className="left-5 top-5" />
            <DocLink slug="spend-donut-card" label="Open demo" className="absolute bottom-4 right-4" />
          </div>
        </Reveal>
        <Reveal className="min-w-0 md:col-span-3" delay={0.1}>
          <div className="relative flex h-[340px] flex-col overflow-hidden rounded-[24px] bg-[#0A0A0B] p-6 text-white ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_24px_48px_-28px_rgb(0_0_0/0.6)] sm:p-8">
            <div className="flex items-center gap-2"><MoonStar className="h-5 w-5 text-[#D9F95C]" aria-hidden /><h3 className="text-lg font-semibold tracking-[-0.02em]">Light and dark, tuned separately</h3></div>
            <LazyMount minHeight={240} className="mt-2 flex-1"><Art scale={0.6} className="h-[250px]">{<GlowLeaderboardList />}</Art></LazyMount>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Carousel ─────────────────────────────────────────────────────────── */
const CAROUSEL = [
  { slug: 'ink-drip-loader', title: 'Ink Drip Loader', bg: '#FFFFFF', art: <InkDripLoader />, s: 1 },
  { slug: 'confetti-burst-button', title: 'Confetti Burst Button', bg: POP.lime, art: <ConfettiBurstButton />, s: 1 },
  { slug: 'lattice-pulse-loader', title: 'Lattice Pulse Loader', bg: POP.ink, art: <LatticePulseLoader />, s: 1 },
  { slug: 'neon-stroke-button', title: 'Neon Stroke Button', bg: POP.ink, art: <NeonStrokeButton>Launch</NeonStrokeButton>, s: 1 },
  { slug: 'morph-glyph-loader', title: 'Morph Glyph Loader', bg: '#E5ECFF', art: <MorphGlyphLoader />, s: 1 },
  { slug: 'sparkline-kpi-tile', title: 'Sparkline KPI Tile', bg: '#FFFFFF', art: <SparklineKpiTile />, s: 0.75 },
]
function Carousel() {
  const list = React.useRef<HTMLUListElement>(null)
  const scroll = (d: number) => {
    const el = list.current
    if (!el) return
    const item = el.querySelector('li')
    const step = item ? item.getBoundingClientRect().width + 16 : 320
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: d * step, behavior: reduced ? 'auto' : 'smooth' })
  }
  const arrow = cn('grid h-11 w-11 touch-manipulation place-items-center rounded-full bg-white text-zinc-950 shadow-[0_1px_2px_rgb(0_0_0/0.05)] ring-1 ring-black/[0.08] transition-[background-color,transform] duration-150 hover:bg-zinc-50 active:scale-95 motion-reduce:active:scale-100 dark:bg-white/[0.06] dark:text-white dark:ring-white/[0.12] dark:hover:bg-white/[0.1]', focusRing)
  return (
    <section aria-labelledby="carousel-title" className={sectionY}>
      <div className={section}>
        <SectionHeader
          id="carousel-title"
          eyebrow="Try them here"
          title="Small pieces, big feel."
          body="Live demos — tap, hover and drag. Swipe for more."
          action={
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 [@media(hover:hover)]:flex">
                <button type="button" onClick={() => scroll(-1)} aria-label="Scroll demos left" aria-controls="demo-rail" className={arrow}><ArrowLeft className="h-4 w-4" aria-hidden /></button>
                <button type="button" onClick={() => scroll(1)} aria-label="Scroll demos right" aria-controls="demo-rail" className={arrow}><ArrowRight className="h-4 w-4" aria-hidden /></button>
              </div>
              <Link to="/docs/introduction" className={pillDark}>View all <span className="tabular-nums">{count}</span> <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          }
        />
      </div>
      <ul
        id="demo-rail"
        ref={list}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:none] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] scroll-pl-[max(1.5rem,env(safe-area-inset-left))] sm:pl-[max(2rem,calc((100vw-1280px)/2+2rem))] sm:scroll-pl-[max(2rem,calc((100vw-1280px)/2+2rem))] [mask-image:linear-gradient(90deg,#000_calc(100%-48px),transparent)]"
        aria-label="Live component demos"
      >
        {CAROUSEL.map((c, i) => {
          const s = surface(c.bg)
          return (
            <Reveal as="li" key={c.slug} delay={i * 0.04} className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[320px]">
              <div className={cn('relative h-[300px] overflow-hidden rounded-[24px] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-16px_rgb(0_0_0/0.14)] ring-1 ring-black/[0.06] dark:shadow-none dark:ring-white/[0.08]', s.className)} style={s.style}>
                <LazyMount minHeight={300}><Art scale={c.s} live className="h-[300px]">{c.art}</Art></LazyMount>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 px-1">
                <h3 className="truncate font-semibold tracking-[-0.02em]">{c.title}</h3>
                <Link to={`/docs/${c.slug}`} className={cn('inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/[0.04] hover:text-zinc-950 pointer-coarse:min-h-11 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white', focusRing)}>Docs <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /><span className="sr-only"> for {c.title}</span></Link>
              </div>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}

/* ── Open source reveal ───────────────────────────────────────────────── */
const FALL = [Sparkles, Zap, Heart, Star, Layers, Wand2, MousePointer2, Boxes, Code2]
function OpenSource() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' })
  const reduced = useReduced()
  const [timed, setStep] = React.useState(0)
  // Reduced motion: no timer sequence — the final state is derived directly.
  const step = reduced && inView ? 2 : timed
  React.useEffect(() => {
    if (!inView || reduced) return
    const t1 = setTimeout(() => setStep(1), 600)
    const t2 = setTimeout(() => setStep(2), 1300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView, reduced])
  return (
    <section aria-labelledby="maker-title" className={cn(section, sectionY)}>
      <SectionHeader id="maker-title" align="center" eyebrow="Open source" title="Made in the open, for everyone who ships." titleClassName="max-w-[16ch]" />
      <div ref={ref} className="relative mx-auto mt-12 h-[480px] max-w-[900px] overflow-hidden rounded-[32px] bg-[#EDEDEA] ring-1 ring-black/[0.04] sm:h-[520px] dark:bg-[#111113] dark:ring-white/[0.06]">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-2 sm:gap-3 sm:p-3" aria-hidden>
          {FALL.map((Icon, i) => (
            <motion.div key={i} className="grid place-items-center rounded-[24px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:bg-[#18181B] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]" initial={{ opacity: 0, y: -120 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...SPRING, stiffness: 240, damping: 24, delay: i * 0.04 }}>
              <Icon className={cn('h-7 w-7', i === 4 ? 'text-[#2B5BFF] dark:text-[#8FA8FF]' : 'text-zinc-400 dark:text-zinc-600')} />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="absolute overflow-hidden"
          initial={false}
          animate={step >= 2 ? { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: 32 } : { left: 'calc(33.333% + 4px)', top: 'calc(33.333% + 4px)', width: 'calc(33.333% - 8px)', height: 'calc(33.333% - 8px)', borderRadius: 24 }}
          style={{ opacity: step >= 1 ? 1 : 0, background: 'radial-gradient(80% 70% at 50% 0%, #4A74FF 0%, #2B5BFF 45%, #0A0A0B 100%)' }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 24 }}
        >
          <AnimatePresence>
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.25 }} className="absolute inset-x-4 bottom-4 rounded-[24px] bg-white/85 p-5 text-zinc-950 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_24px_48px_-24px_rgb(0_0_0/0.5)] ring-1 ring-white/60 backdrop-blur-xl sm:inset-x-auto sm:bottom-8 sm:left-1/2 sm:w-[420px] sm:-translate-x-1/2 sm:p-6 dark:bg-zinc-950/75 dark:text-white dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] dark:ring-white/[0.12]">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-zinc-950 text-[#D9F95C] dark:bg-white dark:text-zinc-950"><Sparkles className="h-5 w-5" aria-hidden /></span>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold tracking-[-0.02em]">{SITE.name}</p>
                    <p className="truncate text-sm text-zinc-600 dark:text-zinc-300" translate="no">@Sid9022 · {SITE.license} · v{SITE.version}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {[[count, 'components'], [groups.length, 'categories'], ['0', 'runtime deps']].map(([n, l]) => (
                    <div key={l} className="rounded-[14px] bg-black/[0.04] py-3 dark:bg-white/[0.08]"><p className="text-xl font-semibold tabular-nums tracking-[-0.02em]">{n}</p><p className="text-xs text-zinc-600 dark:text-zinc-300">{l}</p></div>
                  ))}
                </div>
                <a href={SITE.github} target="_blank" rel="noreferrer" className={cn(pillDark, 'mt-5 w-full')}><GithubIcon className="h-4 w-4" /> Star on GitHub<span className="sr-only"> (opens in a new tab)</span></a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Three ways in ────────────────────────────────────────────────────── */
const STEPS = [
  { name: 'Copy & paste', icon: Copy, note: 'Open any doc page and copy the source.', points: ['Full TypeScript source', 'Tailwind classes, no config', 'Edit everything'], cta: 'Browse docs', to: '/docs/introduction' },
  { name: 'shadcn CLI', icon: Terminal, note: 'One command adds the file and its dependencies.', points: ['Registry item per component', 'Dependencies resolved', 'Works with any shadcn app'], cta: 'Install guide', to: '/docs/installation', hot: true },
  { name: 'Contribute', icon: GithubIcon, note: 'Docs and AI prompts make adding one easy.', points: ['AGENTS.md and checklists', 'Wiring check script', 'MIT licensed'], cta: 'Open GitHub', href: SITE.github },
]
function Steps() {
  return (
    <section aria-labelledby="plans-title" className={cn(section, sectionY)}>
      <SectionHeader id="plans-title" align="center" eyebrow="Three ways in" title="Free, whichever way you install." titleClassName="max-w-[16ch]" body="No accounts, no licences to manage. Pick the path that fits your workflow." />
      <ol className="mt-12 grid items-stretch gap-4 sm:mt-16 md:grid-cols-3">
        {STEPS.map((p, i) => {
          const Icon = p.icon
          const hot = !!p.hot
          const btn = cn(hot ? pillLime : pillDark, 'mt-8 w-full')
          return (
            <Reveal as="li" key={p.name} delay={i * 0.06} className="min-w-0">
              <div className={cn('relative flex h-full flex-col p-6 sm:p-8', hot ? 'rounded-[24px] bg-zinc-950 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_24px_48px_-24px_rgb(0_0_0/0.5)] ring-1 ring-zinc-950 dark:bg-[#18181B] dark:ring-white/[0.12]' : card)}>
                <div className="flex items-center justify-between">
                  <span className={cn('font-mono text-xs tabular-nums', hot ? 'text-white/60' : 'text-zinc-500')}>0{i + 1}</span>
                  {hot && <span className="rounded-full bg-[#D9F95C] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-950">Recommended</span>}
                </div>
                <span className={cn('mt-6 grid h-10 w-10 place-items-center rounded-[14px]', hot ? 'bg-white/10' : 'bg-black/[0.04] dark:bg-white/[0.06]')}><Icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em]">{p.name}</h3>
                <p className={cn('mt-2 text-sm leading-relaxed', hot ? 'text-white/70' : muted)}>{p.note}</p>
                <ul className={cn('mt-6 space-y-3 border-t pt-6 text-sm', hot ? 'border-white/10' : 'border-black/[0.06] dark:border-white/[0.08]')}>
                  {p.points.map((pt) => <li key={pt} className="flex items-center gap-2.5"><Check className={cn('h-4 w-4 shrink-0', hot ? 'text-[#D9F95C]' : 'text-[#2B5BFF] dark:text-[#8FA8FF]')} aria-hidden /> {pt}</li>)}
                </ul>
                <div className="mt-auto">
                  {p.href ? <a href={p.href} target="_blank" rel="noreferrer" className={btn}>{p.cta}<span className="sr-only"> (opens in a new tab)</span></a> : <Link to={p.to!} className={btn}>{p.cta}</Link>}
                </div>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}

/* ── Lime marquee (CSS-driven, pausable, off under reduced motion) ──────── */
const MARQ = ['Feels alive', 'Springs, not keyframes', 'Light + dark', 'Keyboard first', 'Copy & ship', 'Reduced motion']
function Marquee() {
  const [paused, setPaused] = React.useState(false)
  const ref = React.useRef<HTMLElement>(null)
  const visible = useInView(ref, { margin: '100px 0px' })
  const row = [...MARQ, ...MARQ]
  return (
    <section ref={ref} aria-label="Framekit highlights" className="relative overflow-hidden bg-[#D9F95C] py-8 text-zinc-950 sm:py-12">
      <div aria-hidden className="flex w-max items-center motion-safe:animate-[fk-marquee_40s_linear_infinite]" style={{ animationPlayState: paused || !visible ? 'paused' : 'running' }}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap text-[clamp(2.5rem,1.5rem+5vw,6.5rem)] font-semibold leading-none tracking-[-0.05em]">
            {t}
            <span className="mx-[0.4em] inline-block h-[0.22em] w-[0.22em] rounded-full bg-zinc-950" />
          </span>
        ))}
      </div>
      <p className="sr-only">{MARQ.join(', ')}</p>
      <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Play highlights marquee' : 'Pause highlights marquee'} className={cn('absolute bottom-2 right-[max(0.5rem,env(safe-area-inset-right))] grid h-11 w-11 touch-manipulation place-items-center rounded-full bg-zinc-950/10 text-zinc-950 transition-colors hover:bg-zinc-950/20 motion-reduce:hidden', 'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950')}>
        {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
      </button>
    </section>
  )
}

/* ── Final CTA ────────────────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className={cn(section, sectionY)}>
      <Reveal y={24} scale={0.98}>
        <div className="relative isolate overflow-hidden rounded-[32px] bg-zinc-950 px-6 py-16 text-center text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_32px_64px_-32px_rgb(0_0_0/0.5)] sm:px-12 sm:py-24 dark:bg-[#111113] dark:ring-1 dark:ring-white/[0.08]">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_120%,rgb(217_249_92/0.28),transparent_70%),radial-gradient(40%_40%_at_50%_-10%,rgb(43_91_255/0.35),transparent_70%)]" />
          <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.12] [background-image:radial-gradient(rgb(255_255_255/0.6)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]" />
          <Overline className="justify-center text-white/70 dark:text-white/70" dot={POP.lime}>Start building</Overline>
          <h2 id="cta-title" className="mx-auto mt-4 max-w-[16ch] text-balance text-[clamp(2.25rem,1.5rem+3.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.05em]">Your next interface is one command away.</h2>
          <p className="mx-auto mt-5 max-w-[44ch] text-pretty text-base text-white/70 sm:text-lg">Browse <span className="tabular-nums">{count}</span> components across <span className="tabular-nums">{groups.length}</span> shelves. Copy what you need — it&rsquo;s yours.</p>
          <div className="mx-auto mt-10 flex max-w-sm flex-col items-stretch justify-center gap-3 min-[420px]:max-w-none min-[420px]:flex-row min-[420px]:items-center">
            <Link to="/docs/introduction" className={cn(pillLime, 'h-12 px-6 text-[15px]')}>Browse components <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link to={`/docs/category/${categorySlug('Website Sections')}`} className={cn(pillLight, 'h-12 bg-white/[0.06] px-6 text-[15px] text-white ring-white/[0.15] hover:bg-white/[0.12] hover:ring-white/25 dark:bg-white/[0.06]')}>Website sections</Link>
          </div>
          <p className="mt-10 text-sm text-white/60">
            Built something that moves?{' '}
            <a href={SITE.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Contribute on GitHub<ArrowUpRight className="h-3.5 w-3.5" aria-hidden /><span className="sr-only"> (opens in a new tab)</span></a>
          </p>
        </div>
      </Reveal>
    </section>
  )
}

/* ── Footer ───────────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: 'Product', links: [['Introduction', '/docs/introduction'], ['Installation', '/docs/installation'], ['Motion Showcase', `/docs/category/${categorySlug('Motion Showcase')}`], ['Data Widgets', `/docs/category/${categorySlug('Data Widgets')}`]] },
    { title: 'Categories', links: groups.slice(0, 5).map((g) => [g.title, `/docs/category/${categorySlug(g.title)}`]) },
    { title: 'More shelves', links: groups.slice(5, 10).map((g) => [g.title, `/docs/category/${categorySlug(g.title)}`]) },
  ]
  return (
    <footer className="border-t border-black/[0.06] pb-[env(safe-area-inset-bottom)] dark:border-white/[0.08]">
      <div className={cn(section, 'grid grid-cols-2 gap-x-6 gap-y-10 py-16 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-10')}>
        <div className="col-span-2 md:col-span-1">
          <BrandLink />
          <p className={cn(muted, 'mt-4 max-w-[34ch] text-sm leading-relaxed')}>{SITE.description}</p>
          <a href={SITE.github} target="_blank" rel="noreferrer" className={cn(pillLight, 'mt-6')}><GithubIcon className="h-4 w-4" /> Star on GitHub<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
        {cols.map((c, i) => (
          <nav key={c.title} aria-label={c.title} className={cn('min-w-0', i === 2 && 'max-md:col-span-2')}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-950 dark:text-white">{c.title}</h2>
            <ul className={cn('mt-4 space-y-1', i === 2 && 'max-md:grid max-md:grid-cols-2 max-md:gap-x-6 max-md:space-y-0')}>
              {c.links.map(([l, to]) => <li key={to}><Link to={to} className={cn('inline-flex min-h-8 items-center rounded-md text-sm text-zinc-600 transition-colors hover:text-zinc-950 pointer-coarse:min-h-11 dark:text-zinc-400 dark:hover:text-white', focusRing)}>{l}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className={cn(section, 'flex flex-col gap-2 border-t border-black/[0.06] py-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08] dark:text-zinc-400')}>
        <p>© {new Date().getFullYear()} {SITE.name} · {SITE.license} · <span className="tabular-nums">v{SITE.version}</span></p>
        <p>Made with springs, not keyframes.</p>
      </div>
    </footer>
  )
}

export default function Sections() {
  return (
    <>
      <Banner />
      <Statement />
      <Tabs />
      <Bento />
      <Carousel />
      <OpenSource />
      <Steps />
      <Marquee />
      <FinalCta />
      <Footer />
    </>
  )
}
