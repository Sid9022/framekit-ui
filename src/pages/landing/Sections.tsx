import * as React from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Boxes, Check, Code2, Copy, Heart, Keyboard, Layers, MoonStar, MousePointer2, Play, Sparkles, Star, Terminal, Wand2, Zap } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { SITE } from '@/config/site'
import { categorySlug, componentDocs, getNavGroups } from '@/docs/registry'
import { CopyButton, registryItemUrl } from '@/components/docs/install-block'
import { LazyMount } from '@/components/docs/lazy-mount'
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
import { RollingNumberStepper } from '@/components/ui/rolling-number-stepper'
import { GoalProgressCard } from '@/components/ui/goal-progress-card'
import { surface, Art, DocLink, EASE, HandleBadge, POP, Reveal, SPRING, h2, muted, overline, pillDark, pillLight, section, sectionY } from './kit'

const groups = getNavGroups().filter((g) => g.title !== 'Getting Started')
const count = componentDocs.length
const cmd = (slug: string) => `npx shadcn@latest add ${registryItemUrl(slug)}`

/* 3 ── Feature banner ─────────────────────────────────────────────────── */
const BANNER = [
  { slug: 'glass-app-dock', title: 'Glass App Dock', note: 'Magnify on a spring', bg: 'linear-gradient(135deg,#2B5BFF,#7AA2FF)', art: <GlassAppDock />, s: 0.9 },
  { slug: 'budget-area-card', title: 'Budget Area Card', note: 'Charts that draw themselves', bg: 'linear-gradient(135deg,#FF7051,#FFC2A8)', art: <BudgetAreaCard />, s: 0.8 },
  { slug: 'goal-progress-card', title: 'Goal Progress Card', note: 'Numbers that roll', bg: 'linear-gradient(135deg,#A855F7,#F0ABFC)', art: <GoalProgressCard />, s: 0.8 },
]
function Banner() {
  const [i, setI] = React.useState(0)
  const b = BANNER[i]
  const go = (d: number) => setI((v) => (v + d + BANNER.length) % BANNER.length)
  return (
    <section aria-labelledby="banner-title" className={cn(section, 'pb-20 sm:pb-[128px]')}>
      <Reveal scale={0.94} y={30}>
        <div className="relative overflow-hidden rounded-[32px] p-5 text-white sm:p-10" style={{ background: b.bg, transition: 'background 600ms' }}>
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            {['Live demo', 'Spring physics', 'Keyboard ready'].map((p) => (
              <span key={p} className="rounded-full bg-black/25 px-3 py-1.5 text-xs font-semibold backdrop-blur">{p}</span>
            ))}
          </div>
          <div className="relative z-10 mt-6 grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">Featured · {i + 1}/{BANNER.length}</p>
              <AnimatePresence mode="wait">
                <motion.div key={b.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
                  <h2 id="banner-title" className="mt-3 text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-none tracking-[-0.045em] [text-shadow:0_1px_12px_rgb(0_0_0/0.25)]">{b.title}</h2>
                  <p className="mt-3 text-lg text-white/95 [text-shadow:0_1px_8px_rgb(0_0_0/0.3)]">{b.note}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to={`/docs/${b.slug}`} className={pillLight}><Play className="h-4 w-4" aria-hidden /> Watch it move</Link>
                <button type="button" onClick={() => go(-1)} aria-label="Previous featured component" className="grid h-11 w-11 place-items-center rounded-full bg-black/25 backdrop-blur transition-transform hover:bg-black/40 active:scale-95"><ArrowLeft className="h-4 w-4" aria-hidden /></button>
                <button type="button" onClick={() => go(1)} aria-label="Next featured component" className="grid h-11 w-11 place-items-center rounded-full bg-black/25 backdrop-blur transition-transform hover:bg-black/40 active:scale-95"><ArrowRight className="h-4 w-4" aria-hidden /></button>
              </div>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-[24px] bg-white/20 ring-1 ring-white/30 backdrop-blur-sm sm:h-[380px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={b.slug} className="absolute inset-0" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: EASE }}>
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

/* 4 ── Trusted by ─────────────────────────────────────────────────────── */
const STACK = ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Motion', 'shadcn/ui', 'Vite', 'Lucide']
function Trusted() {
  return (
    <section aria-labelledby="stack-title" className={cn(section, 'pb-20 text-center sm:pb-[128px]')}>
      <Reveal><h2 id="stack-title" className={overline}>Built on the stack you already trust</h2></Reveal>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {STACK.map((s, i) => (
          <motion.li key={s} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }} className="text-xl font-semibold tracking-[-0.03em] text-black/70 sm:text-2xl dark:text-white/70" translate="no">
            {s}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/* 5 ── Statement + posters ───────────────────────────────────────────── */
function WordReveal({ text, highlight }: { text: string; highlight: string }) {
  const [pre, post] = text.split(highlight)
  const w = (s: string) => s.trim().split(' ').filter(Boolean)
  const all = [...w(pre).map((t) => ({ t, h: false })), { t: highlight, h: true }, ...w(post).map((t) => ({ t, h: false }))]
  return (
    <>
      {all.map((x, i) => (
        <motion.span key={i} className="relative mr-[0.25em] inline-block" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}>
          {x.h ? (
            <span className="relative whitespace-nowrap text-[#2B5BFF] dark:text-[#7A9BFF]">
              {x.t}
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full" aria-hidden>
                <motion.path d="M4 14 C 60 4, 120 18, 180 9 S 280 6, 296 12" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.07 }} />
              </svg>
            </span>
          ) : x.t}
        </motion.span>
      ))}
    </>
  )
}
const POSTER_COLORS = [POP.red, '#0A0A0A', POP.lime, POP.blue, POP.orange]
const POSTER_TEXT = ['#fff', '#fff', '#000', '#fff', '#000']
function Statement() {
  const top = [...groups].sort((a, b) => b.items.length - a.items.length).slice(0, 5)
  return (
    <section aria-labelledby="statement-title" className={cn(section, sectionY, 'text-center')}>
      <Reveal><p className={overline}>One command per component</p></Reveal>
      <h2 id="statement-title" className={cn(h2, 'mx-auto mt-5 max-w-[18ch]')}>
        <WordReveal text="Copy one command and ship an interface that feels finished." highlight="feels finished." />
      </h2>
      <div className="mt-16 flex justify-center gap-3 overflow-x-auto pb-4 sm:gap-5 [scrollbar-width:none]">
        {top.map((g, i) => (
          <motion.div key={g.title} className="shrink-0" initial={{ opacity: 0, x: (2 - i) * 120, rotate: (i - 2) * 6, y: 40 }} whileInView={{ opacity: 1, x: 0, rotate: 0, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ ...SPRING, stiffness: 140, damping: 20, delay: i * 0.08 }}>
            <Link to={`/docs/category/${categorySlug(g.title)}`} className="group flex h-[320px] w-[190px] flex-col justify-between rounded-[28px] p-5 text-left transition-transform duration-300 hover:-translate-y-2 sm:h-[380px] sm:w-[220px]" style={{ background: POSTER_COLORS[i], color: POSTER_TEXT[i] }}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Category</span>
              <span>
                <span className="block text-6xl font-semibold tabular-nums tracking-[-0.05em]">{g.items.length}</span>
                <span className="mt-2 block text-xl font-semibold leading-tight tracking-[-0.03em]">{g.title}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">Explore <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* 6 ── Tabs + 2×2 grid ───────────────────────────────────────────────── */
const TAB_CATS = ['Data Widgets', 'Website Sections', 'Product UI', 'Motion Showcase'].filter((t) => groups.some((g) => g.title === t))
const TILE_BG = ['bg-white dark:bg-zinc-900', 'bg-[#D9F95C] text-black', 'bg-black text-white dark:bg-zinc-800', 'bg-[#FFE1D9] text-black dark:bg-[#3a1e17] dark:text-white']
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
  return (
    <section aria-labelledby="tabs-title" className={cn(section, sectionY, 'grid gap-12 lg:grid-cols-[1fr_1.3fr]')}>
      <div>
        <Reveal><p className={overline}>Browse by need</p></Reveal>
        <Reveal delay={0.06}><h2 id="tabs-title" className={cn(h2, 'mt-4')}>Pick a shelf. Everything on it moves.</h2></Reveal>
        <Reveal delay={0.12}>
          <div role="tablist" aria-label="Component categories" onKeyDown={onKey} className="mt-8 flex flex-wrap gap-2">
            {TAB_CATS.map((t, i) => (
              <button key={t} ref={(el) => { refs.current[i] = el }} role="tab" id={`tab-${i}`} aria-selected={tab === i} aria-controls="tab-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} className={cn('relative min-h-11 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF]', tab === i ? 'text-white dark:text-black' : 'bg-white text-black ring-1 ring-black/10 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:ring-white/15')}>
                {tab === i && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-black dark:bg-white" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.18}><Link to={`/docs/category/${categorySlug(TAB_CATS[tab])}`} className={cn(pillDark, 'mt-8')}>All {TAB_CATS[tab]} <ArrowRight className="h-4 w-4" aria-hidden /></Link></Reveal>
      </div>
      <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((d, i) => (
            <motion.div key={d.slug} initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}>
              <Link to={`/docs/${d.slug}`} className={cn('group flex h-full min-h-[200px] flex-col justify-between rounded-[28px] p-6 ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1 dark:ring-white/10', TILE_BG[i])}>
                <span className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-current/10"><Boxes className="h-5 w-5" aria-hidden /></span>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span>
                  <span className="block text-xl font-semibold tracking-[-0.03em]">{d.title}</span>
                  <span className="mt-2 line-clamp-2 block text-sm opacity-80">{d.description}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* 7 ── Cloud ─────────────────────────────────────────────────────────── */
const CLOUD_POS = [
  [6, 10], [20, 2], [78, 4], [92, 14], [2, 46], [12, 78], [28, 88], [70, 90], [86, 76], [96, 48], [40, 0], [58, 96], [16, 30], [84, 32],
]
const CLOUD_BG = [POP.red, POP.blue, POP.lime, POP.orange, '#0A0A0A', POP.coral, POP.purple]
function Cloud() {
  const names = componentDocs.filter((d) => d.isNew).slice(-CLOUD_POS.length)
  return (
    <section aria-labelledby="cloud-title" className={cn(section, sectionY)}>
      <div className="relative mx-auto flex min-h-[520px] max-w-[1100px] items-center justify-center sm:min-h-[600px]">
        <ul aria-hidden className="absolute inset-0">
          {names.map((d, i) => {
            const [x, y] = CLOUD_POS[i]
            const big = i % 3 === 0
            return (
              <motion.li key={d.slug} className={cn('absolute -translate-x-1/2 -translate-y-1/2', i > 8 && 'max-sm:hidden')} style={{ left: `${x}%`, top: `${y}%` }} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ ...SPRING, delay: ((i * 7) % 11) * 0.06 }}>
                <span className={cn('grid place-items-center rounded-[22px] text-lg font-semibold', big ? 'h-20 w-20 sm:h-24 sm:w-24' : 'h-14 w-14 sm:h-16 sm:w-16')} style={{ background: CLOUD_BG[i % CLOUD_BG.length], color: [1, 4, 6].includes(i % CLOUD_BG.length) ? '#fff' : '#000', rotate: `${((i * 13) % 20) - 10}deg` }}>
                  {d.title.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </span>
              </motion.li>
            )
          })}
        </ul>
        <div className="relative z-10 max-w-[560px] px-6 text-center">
          <Reveal><p className={overline}>One registry</p></Reveal>
          <Reveal delay={0.06}><h2 id="cloud-title" className={cn(h2, 'mt-4')}><span className="tabular-nums">{count}</span> components, one install path.</h2></Reveal>
          <Reveal delay={0.12}><p className={cn(muted, 'mt-5')}>Every piece is its own shadcn registry item with its dependencies listed. Install one, or a whole shelf.</p></Reveal>
          <Reveal delay={0.18}><Link to="/docs/installation" className={cn(pillDark, 'mt-8')}><Terminal className="h-4 w-4" aria-hidden /> Installation guide</Link></Reveal>
        </div>
      </div>
    </section>
  )
}

/* 8 ── Bento ─────────────────────────────────────────────────────────── */
function Bento() {
  const install = cmd('glow-candle-card')
  return (
    <section aria-labelledby="bento-title" className={cn(section, sectionY)}>
      <Reveal><p className={overline}>Built properly</p></Reveal>
      <Reveal delay={0.06}><h2 id="bento-title" className={cn(h2, 'mt-4 max-w-[16ch]')}>Premium on the outside, careful on the inside.</h2></Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4" scale={0.96}>
          <div className="flex h-full flex-col justify-between gap-8 rounded-[32px] bg-white p-7 ring-1 ring-black/5 sm:p-9 dark:bg-zinc-900 dark:ring-white/10">
            <div>
              <Code2 className="h-6 w-6" aria-hidden />
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">Install with the shadcn CLI</h3>
              <p className={cn(muted, 'mt-2 max-w-[48ch]')}>The source lands in your repo, typed and editable. No runtime package, no lock-in.</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-[#F1F1F1] p-2 pl-4 dark:bg-black">
              <code className="min-w-0 flex-1 truncate font-mono text-[13px]" translate="no">{install}</code>
              <CopyButton value={install} meta={{ slug: 'glow-candle-card', kind: 'landing-bento' }} label="Copy install command" />
            </div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-2" delay={0.08} scale={0.96}>
          <div className="flex h-full min-h-[260px] flex-col justify-between rounded-[32px] bg-[#2B5BFF] p-7 text-white sm:p-9">
            <Keyboard className="h-6 w-6" aria-hidden />
            <div>
              <p className="text-5xl font-semibold tracking-[-0.05em]">AA</p>
              <h3 className="mt-2 text-lg font-semibold">Accessible by default</h3>
              <p className="mt-1 text-sm text-white/90">Keyboard, focus rings, screen-reader labels and reduced motion.</p>
            </div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-3" delay={0.12} scale={0.96}>
          <div className="relative h-[340px] overflow-hidden rounded-[32px] bg-[#FFE1D9] ring-1 ring-black/5 dark:bg-[#2a1712] dark:ring-white/10">
            <LazyMount minHeight={340}><Art scale={0.75} className="h-[340px]">{<SpendDonutCard />}</Art></LazyMount>
            <HandleBadge handle="spend-donut-card" color="#000" className="left-5 top-5" />
            <DocLink slug="spend-donut-card" label="Open demo" className="absolute bottom-4 right-4" />
          </div>
        </Reveal>
        <Reveal className="md:col-span-3" delay={0.16} scale={0.96}>
          <div className="relative flex h-[340px] flex-col overflow-hidden rounded-[32px] bg-[#0A0A0A] p-7 text-white ring-1 ring-white/10">
            <div className="flex items-center gap-2"><MoonStar className="h-5 w-5" aria-hidden /><h3 className="text-lg font-semibold">Light and dark, tuned separately</h3></div>
            <LazyMount minHeight={240} className="mt-2 flex-1"><Art scale={0.6} className="h-[250px]">{<GlowLeaderboardList />}</Art></LazyMount>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* 9 ── Carousel ───────────────────────────────────────────────────────── */
const CAROUSEL = [
  { slug: 'ink-drip-loader', title: 'Ink Drip Loader', bg: '#FFFFFF', art: <InkDripLoader />, s: 1 },
  { slug: 'confetti-burst-button', title: 'Confetti Burst Button', bg: POP.lime, art: <ConfettiBurstButton />, s: 1 },
  { slug: 'lattice-pulse-loader', title: 'Lattice Pulse Loader', bg: '#0A0A0A', art: <LatticePulseLoader />, s: 1 },
  { slug: 'rolling-number-stepper', title: 'Rolling Number Stepper', bg: '#FFE1D9', art: <RollingNumberStepper />, s: 0.9 },
  { slug: 'neon-stroke-button', title: 'Neon Stroke Button', bg: '#111827', art: <NeonStrokeButton>Launch</NeonStrokeButton>, s: 1 },
  { slug: 'morph-glyph-loader', title: 'Morph Glyph Loader', bg: '#E5ECFF', art: <MorphGlyphLoader />, s: 1 },
  { slug: 'sparkline-kpi-tile', title: 'Sparkline KPI Tile', bg: '#FFFFFF', art: <SparklineKpiTile />, s: 0.75 },
]
function Carousel() {
  return (
    <section aria-labelledby="carousel-title" className={cn(sectionY, "overflow-hidden [contain:paint]")}>
      <div className={cn(section, 'flex flex-wrap items-end justify-between gap-6')}>
        <div>
          <Reveal><p className={overline}>Try them here</p></Reveal>
          <Reveal delay={0.06}><h2 id="carousel-title" className={cn(h2, 'mt-4')}>Small pieces, big feel.</h2></Reveal>
        </div>
        <Reveal delay={0.1}><Link to="/docs/introduction" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#9333EA] px-5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF]">View all {count} <ArrowRight className="h-4 w-4" aria-hidden /></Link></Reveal>
      </div>
      <ul className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pl-5 pr-5 [scrollbar-width:thin] sm:pl-[max(2rem,calc((100vw-1280px)/2+2rem))]" aria-label="Live component demos">
        {CAROUSEL.map((c, i) => (
          <motion.li key={c.slug} className="w-[280px] shrink-0 snap-start sm:w-[340px]" initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}>
            <div className={cn('relative h-[300px] overflow-hidden rounded-[28px] ring-1 ring-black/5 dark:ring-white/10', surface(c.bg).className)} style={surface(c.bg).style}>
              <LazyMount minHeight={300}><Art scale={c.s} live className="h-[300px]">{c.art}</Art></LazyMount>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 px-1">
              <h3 className="font-semibold tracking-[-0.02em]">{c.title}</h3>
              <Link to={`/docs/${c.slug}`} className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-[#6B7280] hover:text-black dark:text-zinc-400 dark:hover:text-white">Docs <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /><span className="sr-only"> for {c.title}</span></Link>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

/* 10 ── Dramatic reveal ───────────────────────────────────────────────── */
const FALL = [Sparkles, Zap, Heart, Star, Layers, Wand2, MousePointer2, Boxes, Code2]
function Dramatic() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' })
  const [step, setStep] = React.useState(0)
  React.useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setStep(1), 700)
    const t2 = setTimeout(() => setStep(2), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView])
  return (
    <section aria-labelledby="maker-title" className={cn(section, sectionY)}>
      <div className="text-center">
        <Reveal><p className={overline}>Open source</p></Reveal>
        <Reveal delay={0.06}><h2 id="maker-title" className={cn(h2, 'mx-auto mt-4 max-w-[16ch]')}>Made in the open, for everyone who ships.</h2></Reveal>
      </div>
      <div ref={ref} className="relative mx-auto mt-12 h-[520px] max-w-[900px] overflow-hidden rounded-[32px] bg-[#EDEDED] dark:bg-zinc-900">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3 p-3" aria-hidden>
          {FALL.map((Icon, i) => (
            <motion.div key={i} className="grid place-items-center rounded-[22px] bg-white dark:bg-zinc-800" initial={{ opacity: 0, y: -260, rotate: (i % 3 - 1) * 20 }} animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}} transition={{ ...SPRING, stiffness: 220, damping: 18, delay: i * 0.06 }}>
              <Icon className="h-8 w-8" style={{ color: [POP.red, POP.blue, POP.orange, POP.purple][i % 4] }} />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="absolute overflow-hidden rounded-[22px]"
          initial={false}
          animate={step >= 2 ? { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: 32 } : { left: 'calc(33.333% + 4px)', top: 'calc(33.333% + 4px)', width: 'calc(33.333% - 8px)', height: 'calc(33.333% - 8px)', borderRadius: 22 }}
          style={{ opacity: step >= 1 ? 1 : 0, background: 'linear-gradient(135deg,#FF7051,#D93838 40%,#2B5BFF)' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          <AnimatePresence>
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }} className="absolute inset-x-5 bottom-5 rounded-[24px] bg-white/80 p-6 text-black ring-1 ring-white/60 backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:w-[420px] sm:-translate-x-1/2 dark:bg-black/70 dark:text-white dark:ring-white/15">
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-black text-white dark:bg-white dark:text-black"><Sparkles className="h-6 w-6" aria-hidden /></span>
                  <div>
                    <p className="text-lg font-semibold tracking-[-0.02em]">{SITE.name}</p>
                    <p className="text-sm text-[#4B5563] dark:text-zinc-300" translate="no">@Sid9022 · {SITE.license} · v{SITE.version}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {[[count, 'components'], [groups.length, 'categories'], ['0', 'runtime deps']].map(([n, l]) => (
                    <div key={l} className="rounded-2xl bg-black/5 py-3 dark:bg-white/10"><p className="text-xl font-semibold tabular-nums">{n}</p><p className="text-xs text-[#4B5563] dark:text-zinc-300">{l}</p></div>
                  ))}
                </div>
                <a href={SITE.github} target="_blank" rel="noreferrer" className={cn(pillDark, 'mt-5 w-full justify-center')}><GithubIcon className="h-4 w-4" /> Star on GitHub<span className="sr-only"> (opens in a new tab)</span></a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* 11 ── Install paths ─────────────────────────────────────────────────── */
const PLANS = [
  { name: 'Copy & paste', price: 'Free', icon: Copy, note: 'Open any doc page and copy the source.', points: ['Full TypeScript source', 'Tailwind classes, no config', 'Edit everything'], cta: 'Browse docs', to: '/docs/introduction' },
  { name: 'shadcn CLI', price: 'Free', icon: Terminal, note: 'One command adds the file and its deps.', points: ['Registry item per component', 'Dependencies resolved', 'Works with any shadcn app'], cta: 'Install guide', to: '/docs/installation', popular: true },
  { name: 'Contribute', price: 'Free', icon: GithubIcon, note: 'Docs and AI prompts make adding one easy.', points: ['AGENTS.md and checklists', 'Wiring check script', 'MIT licensed'], cta: 'Open GitHub', href: SITE.github },
]
function Plans() {
  return (
    <section aria-labelledby="plans-title" className={cn(section, sectionY)}>
      <div className="text-center">
        <Reveal><p className={overline}>Three ways in</p></Reveal>
        <Reveal delay={0.06}><h2 id="plans-title" className={cn(h2, 'mx-auto mt-4 max-w-[16ch]')}>Free, whichever way you install.</h2></Reveal>
      </div>
      <div className="mt-14 grid items-stretch gap-4 md:grid-cols-3">
        {PLANS.map((p, i) => {
          const Icon = p.icon
          const hot = !!p.popular
          const cls = cn(hot ? 'bg-black text-white hover:bg-zinc-800' : 'bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black', 'mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-transform active:scale-[0.97]')
          return (
            <motion.div key={p.name} initial={{ opacity: 0, y: 40, scale: 0.92 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ ...SPRING, stiffness: 260, damping: 22, delay: i * 0.12 }}
              className={cn('relative flex flex-col rounded-[32px] p-8 ring-1', hot ? 'bg-[#F97316] text-black ring-black/5 md:-my-4 md:py-12' : 'bg-white ring-black/5 dark:bg-zinc-900 dark:ring-white/10')}>
              {hot && <span className="absolute right-6 top-6 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">Popular</span>}
              <Icon className="h-6 w-6" aria-hidden />
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{p.name}</h3>
              <p className="mt-2 text-5xl font-semibold tracking-[-0.05em]">{p.price}</p>
              <p className={cn('mt-3 text-sm', hot ? 'text-black/80' : muted)}>{p.note}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.points.map((pt) => <li key={pt} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0" aria-hidden /> {pt}</li>)}
              </ul>
              <div className="mt-auto">
                {p.href ? <a href={p.href} target="_blank" rel="noreferrer" className={cls}>{p.cta}<span className="sr-only"> (opens in a new tab)</span></a> : <Link to={p.to!} className={cls}>{p.cta}</Link>}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* 12 ── Lime marquee ─────────────────────────────────────────────────── */
const MARQ = ['Feels alive', '✦', 'Springs', '🫧', 'Light + dark', '⚡', 'Keyboard first', '🎛️', 'Copy & ship', '✺']
function Marquee() {
  const row = [...MARQ, ...MARQ]
  return (
    <section aria-label="Framekit highlights" className="overflow-hidden bg-[#D9F95C] py-10 text-black sm:py-14">
      <motion.div className="flex w-max items-center gap-10" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, ease: 'linear', repeat: Infinity }} aria-hidden>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap text-[clamp(3rem,9vw,8rem)] font-semibold leading-none tracking-[-0.05em]">
            {t}
            {i % 4 === 2 && <span className="inline-block h-[0.7em] w-[1.2em] rounded-full" style={{ background: [POP.blue, POP.red, POP.purple][i % 3] }} />}
          </span>
        ))}
      </motion.div>
      <p className="sr-only">{MARQ.filter((t) => t.length > 2).join(', ')}</p>
    </section>
  )
}

/* 13 ── Split cards ──────────────────────────────────────────────────── */
function SplitCards() {
  return (
    <section className={cn(section, sectionY, 'grid gap-4 md:grid-cols-2')}>
      <Reveal scale={0.95}>
        <div className="flex min-h-[380px] flex-col justify-between rounded-[32px] bg-[#FFD6E0] p-8 text-black sm:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">Start building</p>
          <div>
            <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">Your next landing page is one copy away.</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/docs/introduction" className={cn(pillDark, 'dark:bg-black dark:text-white dark:hover:bg-zinc-800')}><Sparkles className="h-4 w-4" aria-hidden /> Browse components</Link>
              <Link to={`/docs/category/${categorySlug('Website Sections')}`} className={cn(pillLight, 'dark:bg-white dark:text-black dark:ring-black/10 dark:hover:bg-zinc-100')}>Website sections</Link>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal scale={0.95} delay={0.08}>
        <div className="flex min-h-[380px] flex-col justify-between rounded-[32px] bg-white p-8 ring-1 ring-black/5 sm:p-12 dark:bg-zinc-900 dark:ring-white/10">
          <p className={overline}>Contribute</p>
          <div>
            <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">Built something that moves? Add it.</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={SITE.github} target="_blank" rel="noreferrer" className={pillDark}><GithubIcon className="h-4 w-4" /> Open on GitHub<span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* 14 ── Footer ───────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: 'Product', links: [['Introduction', '/docs/introduction'], ['Installation', '/docs/installation']] },
    { title: 'Categories', links: groups.slice(0, 5).map((g) => [g.title, `/docs/category/${categorySlug(g.title)}`]) },
    { title: 'More shelves', links: groups.slice(5, 10).map((g) => [g.title, `/docs/category/${categorySlug(g.title)}`]) },
  ]
  return (
    <footer className="border-t border-black/10 dark:border-white/10">
      <div className={cn(section, 'grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]')}>
        <div>
          <p className="text-2xl font-semibold tracking-[-0.03em]">{SITE.name}</p>
          <p className={cn(muted, 'mt-3 max-w-[32ch] text-sm')}>{SITE.description}</p>
          <a href={SITE.github} target="_blank" rel="noreferrer" className={cn(pillLight, 'mt-6')}><GithubIcon className="h-4 w-4" /> GitHub<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold">{c.title}</h2>
            <ul className="mt-4 space-y-1">
              {c.links.map(([l, to]) => <li key={to}><Link to={to} className="inline-flex min-h-9 items-center text-sm text-[#6B7280] hover:text-black dark:text-zinc-400 dark:hover:text-white">{l}</Link></li>)}
            </ul>
          </nav>
        ))}
      </div>
      <div className={cn(section, 'flex flex-wrap justify-between gap-2 border-t border-black/10 py-6 text-xs text-[#6B7280] dark:border-white/10 dark:text-zinc-400')}>
        <p>© {new Date().getFullYear()} {SITE.name} · {SITE.license} · v{SITE.version}</p>
        <p>Made with springs, not keyframes.</p>
      </div>
    </footer>
  )
}

export default function Sections() {
  return (
    <>
      <Banner />
      <Trusted />
      <Statement />
      <Tabs />
      <Cloud />
      <Bento />
      <Carousel />
      <Dramatic />
      <Plans />
      <Marquee />
      <SplitCards />
      <Footer />
    </>
  )
}
