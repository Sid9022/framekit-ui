import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play, Sparkles } from 'lucide-react'
import { componentDocs } from '@/docs/registry'
import { SITE } from '@/config/site'
import { GithubIcon } from '@/components/icons'
import { GlassAppDock } from '@/components/ui/glass-app-dock'
import { GlowLeaderboardList } from '@/components/ui/glow-leaderboard-list'
import { SparklineKpiTile } from '@/components/ui/sparkline-kpi-tile'
import { InkDripLoader } from '@/components/ui/ink-drip-loader'
import { MorphGlyphLoader } from '@/components/ui/morph-glyph-loader'
import { NeonStrokeButton } from '@/components/ui/neon-stroke-button'
import { cn } from '@/lib/cn'
import { FitArt, POP, focusRing, surface } from './kit'
import { SHOW } from './ShowcaseHero'
import { Faq, Footer } from './Sections'
import { paperBtnGhost, paperBtnInk } from './PaperHero'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from './motion'

type Item = { slug: string; label: string; bg: string; design: number | 'auto'; fill?: number; art: React.ReactNode }
const EXTRA: Item[] = [
  { slug: 'glass-app-dock', label: 'Glass App Dock', bg: '#E5ECFF', design: 'auto', fill: 0.92, art: <GlassAppDock /> },
  { slug: 'glow-leaderboard-list', label: 'Glow Leaderboard', bg: POP.ink, design: 380, art: <GlowLeaderboardList /> },
  { slug: 'sparkline-kpi-tile', label: 'Sparkline KPI Tile', bg: '#FFFFFF', design: 320, art: <SparklineKpiTile /> },
  { slug: 'ink-drip-loader', label: 'Ink Drip Loader', bg: '#F1F1EF', design: 'auto', art: <InkDripLoader /> },
  { slug: 'morph-glyph-loader', label: 'Morph Glyph Loader', bg: POP.lime, design: 'auto', art: <MorphGlyphLoader /> },
  { slug: 'neon-stroke-button', label: 'Neon Stroke Button', bg: POP.ink, design: 'auto', art: <NeonStrokeButton /> },
]
const pick = (s: string, bg?: string): Item => {
  const it = (SHOW.find((x) => x.slug === s) as Item | undefined) ?? EXTRA.find((x) => x.slug === s)!
  return bg ? { ...it, bg } : it
}
const catOf = (slug: string) => componentDocs.find((d) => d.slug === slug)?.category ?? 'Component'

/* ── Shared type ─────────────────────────────────────────────────────── */
const wrap = 'mx-auto w-full max-w-[1440px] px-[max(1rem,env(safe-area-inset-left))] sm:px-8 lg:px-12'
const eyebrow = 'font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-[var(--pm)]'
const title = 'text-balance text-[clamp(2.1rem,1.1rem+3.6vw,4.75rem)] font-medium leading-[1] tracking-[-0.05em] text-[var(--pi)]'
const body = 'text-pretty text-[clamp(1rem,0.95rem+0.25vw,1.2rem)] leading-relaxed text-[var(--pm)]'
const panel = 'rounded-[22px] bg-[var(--pc)] ring-1 ring-[var(--pl)] shadow-[0_1px_2px_rgb(23_20_15/0.05),0_16px_36px_-20px_rgb(23_20_15/0.3)] dark:shadow-none'

/** A frame holding a live component. */
function Art({ item, className, fill, radius = 'rounded-[18px]' }: { item: Item; className?: string; fill?: number; radius?: string }) {
  const s = surface(item.bg)
  return (
    <div className={cn('p-1.5 shadow-[0_1px_2px_rgb(23_20_15/0.08),0_14px_30px_-14px_rgb(23_20_15/0.35)] ring-1 ring-black/[0.06] dark:shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] dark:ring-white/10', radius, s.className, className)} style={s.style}>
      <FitArt design={item.design} fill={fill ?? item.fill ?? 0.86} className="h-full w-full rounded-[13px]">{item.art}</FitArt>
    </div>
  )
}

/** Small speech-bubble handle, the way people tag each other on a shared board. */
function Tag({ children, tone = 'blue', className }: { children: React.ReactNode; tone?: 'blue' | 'lime' | 'ink' | 'coral'; className?: string }) {
  const c = { blue: 'bg-[#2B5BFF] text-white', lime: 'bg-[#D9F95C] text-zinc-950', ink: 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950', coral: 'bg-[#FF6B4A] text-white' }[tone]
  return <span aria-hidden className={cn('pointer-events-none absolute z-20 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] font-medium shadow-lg sm:text-[12px]', c, className)}>{children}</span>
}

/** Fade-rise the direct children of [data-rise] blocks as they enter. */
function useRise(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
        gsap.from(el.children, { y: 28, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 82%' } })
      })
    })
  }, { scope })
}

/* ── 1 · Library: copy left, a little stack that shuffles as you scroll ── */
function Library() {
  const root = React.useRef<HTMLElement>(null)
  useRise(root)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.timeline({ scrollTrigger: { trigger: '[data-lstack]', start: 'top 90%', end: 'bottom 30%', scrub: 1 } })
        .fromTo('[data-lcard="0"]', { rotation: -2, x: 0 }, { rotation: -10, x: '-14%', ease: 'none' }, 0)
        .fromTo('[data-lcard="1"]', { rotation: 2, y: 0 }, { rotation: 4, y: '-8%', ease: 'none' }, 0)
        .fromTo('[data-lcard="2"]', { rotation: 6, x: 0 }, { rotation: 13, x: '14%', ease: 'none' }, 0)
    })
  }, { scope: root })
  const stack = [pick('budget-area-card'), pick('glow-histogram-card'), pick('activity-rings', '#FFC56B')]
  return (
    <section ref={root} aria-labelledby="lib-title" className={cn(wrap, 'grid items-center gap-14 py-[clamp(4rem,10vw,9rem)] md:grid-cols-2')}>
      <div data-rise>
        <p className={eyebrow}>The library</p>
        <h2 id="lib-title" className={cn(title, 'mt-4 max-w-[13ch]')}>Charts, cards, <span className="text-[#2B5BFF] dark:text-[#8FA8FF]">and loaders that</span> actually move.</h2>
        <p className={cn(body, 'mt-6 max-w-[40ch]')}>Most kits hand you a static box and wish you luck with the easing. Here the timing is already in the file, tuned by hand, and it respects reduced motion out of the box.</p>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Link to="/docs/introduction" className={paperBtnInk}>Start browsing</Link>
          <Link to="/guides" className={paperBtnGhost}>Read the guides <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
      <div data-lstack className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
        {stack.map((it, i) => (
          <div key={it.slug} data-lcard={i} className="absolute left-[18%] top-[8%] aspect-[4/5] w-[56%] will-change-transform" style={{ zIndex: i, transform: `rotate(${[-2, 2, 6][i]}deg)` }}>
            <Art item={it} className="h-full" radius="rounded-[22px]" />
          </div>
        ))}
        <Tag tone="ink" className="right-[6%] top-[2%]">@charts</Tag>
        <Tag tone="lime" className="bottom-[6%] left-[4%]">draws in 900ms</Tag>
      </div>
    </section>
  )
}

/* ── 2 · Up close: one component on a big blue wall, growing to full width ── */
function UpClose() {
  const root = React.useRef<HTMLElement>(null)
  const [paused, setPaused] = React.useState(false)
  useRise(root)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.fromTo('[data-wall]', { scale: 0.86, borderRadius: 40 }, { scale: 1, borderRadius: 26, ease: 'none', scrollTrigger: { trigger: '[data-wall]', start: 'top 95%', end: 'top 25%', scrub: 1 } })
      gsap.fromTo('[data-wallart]', { y: 80 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '[data-wall]', start: 'top bottom', end: 'bottom top', scrub: 1 } })
    })
  }, { scope: root })
  const it = pick('lit-product-card-3d')
  return (
    <section ref={root} aria-labelledby="close-title" className={cn(wrap, 'pb-[clamp(4rem,8vw,7rem)]')}>
      <div data-rise className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Up close · Lit Product Card 3D</p>
          <h2 id="close-title" className={cn(title, 'mt-4')}>Lean in. It leans back.</h2>
        </div>
        <p className={cn(body, 'max-w-[34ch]')}>Move your cursor over the card. The highlight and the shadow follow the tilt, like a print under a desk lamp.</p>
      </div>
      <div data-wall className="relative mt-10 grid aspect-[4/5] place-items-center overflow-hidden rounded-[26px] bg-[#2B5BFF] will-change-transform sm:aspect-[16/9]">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_70%_at_30%_20%,rgb(255_255_255/0.22),transparent_60%),radial-gradient(50%_50%_at_90%_100%,rgb(217_249_92/0.25),transparent_70%)]" />
        <div data-wallart className={cn('relative h-[78%] w-[86%] sm:h-[84%] sm:w-[50%]', paused && '[&_*]:![animation-play-state:paused]')}>
          <FitArt design={it.design} fill={0.95} className="h-full w-full">{it.art}</FitArt>
        </div>
        <Tag tone="lime" className="right-[6%] top-[7%]">@tilt</Tag>
        <Link to={`/docs/${it.slug}`} className={cn('absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-medium text-zinc-950 shadow-lg transition-transform hover:-translate-y-0.5', focusRing)}>Open in docs <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} className={cn('absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-zinc-950/80 px-4 text-sm font-medium text-white backdrop-blur motion-reduce:hidden', focusRing)}>
          {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}{paused ? 'Play' : 'Pause'}
        </button>
      </div>
    </section>
  )
}

/* ── 3 · Stack strip: the tools it plays well with ── */
const STACK = ['React 19', 'TypeScript', 'Tailwind v4', 'Motion', 'shadcn/ui', 'Vite', 'Next.js', 'Lucide', 'Radix', 'GSAP']
function StackStrip() {
  const [paused, setPaused] = React.useState(false)
  return (
    <section aria-labelledby="stack-title" className={cn(wrap, 'pb-[clamp(4rem,8vw,7rem)]')}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="stack-title" className="text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] font-medium tracking-[-0.04em] text-[var(--pi)]">Fits the stack you <span className="text-[var(--pm)]">already ship.</span></h2>
          <p className={cn(body, 'mt-2 text-[15px] sm:text-base')}>Plain React and Tailwind. No runtime of ours, no provider to wrap.</p>
        </div>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Play the stack list' : 'Pause the stack list'} className={cn('grid h-11 w-11 place-items-center rounded-full text-[var(--pi)] ring-1 ring-[var(--pl)] hover:bg-[var(--pi)]/[0.05] motion-reduce:hidden', focusRing)}>
          {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      <p className="sr-only">{STACK.join(', ')}</p>
      <div aria-hidden className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex w-max motion-safe:animate-[fk-paper-marquee_36s_linear_infinite]" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
          {[...STACK, ...STACK].map((t, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap px-6 text-[clamp(1.1rem,0.9rem+0.8vw,1.6rem)] font-medium tracking-[-0.03em] text-[var(--pm)] sm:px-10">
              <span className="h-2 w-2 rotate-45 rounded-[2px] bg-[var(--pls)]" />{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 4 · Statement: pinned. A pile of cards gathers, the sentence inks in word by word. ── */
const LINE: { w: string; chip?: { c: string; t: string } }[] = [
  { w: 'Whether' }, { w: 'you' }, { w: 'ship' }, { w: 'dashboards' }, { w: 'all' }, { w: 'day' }, { w: '/' }, { w: 'or' }, { w: 'just' }, { w: 'want' }, { w: 'one' },
  { w: 'button' }, { w: 'that', chip: { c: '#D9F95C', t: '✦' } }, { w: 'feels' }, { w: 'right,' }, { w: 'Framekit' }, { w: 'hands' }, { w: 'you' }, { w: 'parts' }, { w: 'that' },
  { w: 'already', chip: { c: '#2B5BFF', t: '↻' } }, { w: 'know' }, { w: 'how' }, { w: 'to' }, { w: 'move.' },
]
function Statement() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${innerHeight * 1.4}`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true } })
      tl.from('[data-scard]', { x: (i) => (i - 2) * 160, y: 120, rotation: (i) => (i - 2) * 14, opacity: 0, ease: 'power3.out', duration: 0.35, stagger: 0.03 }, 0)
        .fromTo('[data-sword]', { opacity: 0.16 }, { opacity: 1, ease: 'none', duration: 0.6, stagger: 0.6 / LINE.length }, 0.15)
        .from('[data-sicons] > *', { y: 20, opacity: 0, duration: 0.15, stagger: 0.04 }, 0.7)
    })
  }, { scope: root })
  const cards = [pick('glass-app-dock'), pick('goal-progress-card'), pick('wallet-balance-card'), pick('glow-candle-card'), pick('morph-glyph-loader')]
  return (
    <section ref={root} aria-labelledby="statement" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      <div className="relative h-[clamp(120px,24svh,240px)] w-full max-w-[680px]">
        {cards.map((it, i) => (
          <div key={it.slug} data-scard className="absolute left-1/2 top-1/2 aspect-square w-[clamp(92px,min(18vw,22svh),210px)] -translate-x-1/2 -translate-y-1/2" style={{ zIndex: i === 2 ? 9 : i, marginLeft: `${(i - 2) * 12}%`, rotate: `${(i - 2) * 5}deg` }}>
            <Art item={it} className="h-full" />
          </div>
        ))}
      </div>
      <p id="statement" className="relative mt-[clamp(1.5rem,5svh,3.5rem)] max-w-[24ch] text-balance text-[clamp(1.6rem,0.9rem+2.6vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.04em] text-[var(--pi)]">
        {LINE.map((t, i) => (
          <React.Fragment key={i}>
            <span data-sword className={t.w === '/' ? 'text-[var(--pm)]' : t.w === 'Framekit' ? 'text-[#2B5BFF] dark:text-[#8FA8FF]' : undefined}>{t.w}</span>
            {t.chip && <span aria-hidden data-sword className="mx-[0.18em] inline-grid h-[0.9em] w-[0.9em] translate-y-[0.08em] place-items-center rounded-full text-[0.5em] text-white" style={{ background: t.chip.c, color: t.chip.c === '#D9F95C' ? '#0a0a0b' : '#fff' }}>{t.chip.t}</span>}
            {' '}
          </React.Fragment>
        ))}
      </p>
      <div data-sicons aria-hidden className="mt-8 flex gap-4 text-[var(--pm)]">
        {['⌘', '◐', '⇥', '✳'].map((g) => <span key={g} className="text-lg">{g}</span>)}
      </div>
      <Tag tone="coral" className="left-[6%] top-[22%] max-sm:top-[12%]">@motion</Tag>
      <Tag tone="blue" className="bottom-[18%] right-[6%] max-sm:bottom-[10%]">@a11y</Tag>
    </section>
  )
}

/* ── 5 · Take: copy left, a little app window with tabs right ── */
const SHELVES = {
  Dashboards: ['budget-area-card', 'spend-donut-card', 'sparkline-kpi-tile', 'glow-level-card', 'contribution-heatmap-tile', 'glow-leaderboard-list'],
  Motion: ['neon-halo-card', 'ink-drip-loader', 'dynamic-status-island', 'neon-stroke-button', 'smart-widget-stack', 'liquid-glass-tab-bar'],
} as const
type Shelf = keyof typeof SHELVES
function Take() {
  const root = React.useRef<HTMLElement>(null)
  const [tab, setTab] = React.useState<Shelf>('Dashboards')
  useRise(root)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.from('[data-tcell]', { y: 50, scale: 0.92, opacity: 0, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.05 })
    })
  }, { scope: root, dependencies: [tab] })
  const tabs = Object.keys(SHELVES) as Shelf[]
  return (
    <section ref={root} aria-labelledby="take-title" className={cn(wrap, 'grid items-center gap-12 py-[clamp(4rem,9vw,8rem)] lg:grid-cols-[0.8fr_1.2fr]')}>
      <div data-rise>
        <p className={eyebrow}>Our take</p>
        <h2 id="take-title" className={cn(title, 'mt-4 max-w-[12ch]')}>Motion is part of the component.</h2>
        <p className={cn(body, 'mt-6 max-w-[40ch]')}>Not a wrapper you add later. The spring, the stagger and the reduced-motion fallback live in the same file as the markup, so you read it once and you know everything it does.</p>
        <Link to="/guides" className={cn(paperBtnGhost, '-ml-4 mt-6')}>Why we build it this way <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      <div className={cn(panel, 'p-2 sm:p-3')}>
        <div className="flex items-center justify-between gap-2 px-1 pb-2 sm:pb-3">
          <div role="tablist" aria-label="Component shelves" className="flex gap-1 rounded-full bg-[var(--pp)] p-1 ring-1 ring-[var(--pl)]">
            {tabs.map((t) => (
              <button key={t} type="button" role="tab" id={`tab-${t}`} aria-selected={tab === t} aria-controls="take-panel" onClick={() => setTab(t)}
                className={cn('min-h-9 rounded-full px-3.5 text-[13px] font-medium transition-colors', tab === t ? 'bg-[var(--pi)] text-[var(--pp)]' : 'text-[var(--pm)] hover:text-[var(--pi)]', focusRing)}>{t}</button>
            ))}
          </div>
          <Link to="/docs/introduction" className={cn('inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] font-medium text-[var(--pi)] hover:bg-[var(--pi)]/[0.06]', focusRing)}><Sparkles className="h-3.5 w-3.5" aria-hidden /> All</Link>
        </div>
        <div id="take-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {SHELVES[tab].map((s) => {
            const it = pick(s)
            return (
              <Link key={s} to={`/docs/${s}`} data-tcell className={cn('group block rounded-[18px]', focusRing)} aria-label={it.label}>
                <Art item={it} className="aspect-[4/5] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] [@media(hover:hover)]:group-hover:-translate-y-1.5" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── 6 · Shelf: a horizontal row you can drag, swipe or step through ── */
const SHELF = ['neon-halo-card', 'glow-candle-card', 'goal-progress-card', 'dynamic-status-island', 'glass-app-dock', 'spend-donut-card', 'glow-histogram-card', 'morph-glyph-loader', 'wallet-balance-card']
function ShelfRow() {
  const root = React.useRef<HTMLElement>(null)
  const track = React.useRef<HTMLUListElement>(null)
  const [p, setP] = React.useState(0)
  useRise(root)
  React.useEffect(() => {
    const t = track.current
    if (!t) return
    const on = () => setP(t.scrollLeft / Math.max(1, t.scrollWidth - t.clientWidth))
    on()
    t.addEventListener('scroll', on, { passive: true })
    return () => t.removeEventListener('scroll', on)
  }, [])
  const step = (d: number) => {
    const t = track.current
    if (!t) return
    const w = (t.querySelector('li') as HTMLElement | null)?.offsetWidth ?? 300
    t.scrollBy({ left: d * (w + 16), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  const nav = cn('grid h-11 w-11 place-items-center rounded-full text-[var(--pi)] ring-1 ring-[var(--pls)] transition-colors hover:bg-[var(--pi)] hover:text-[var(--pp)] disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-[var(--pi)]', focusRing)
  return (
    <section ref={root} aria-labelledby="shelf-title" className={cn(wrap, 'grid gap-10 py-[clamp(3rem,7vw,6rem)] lg:grid-cols-[minmax(260px,0.42fr)_1fr] lg:items-start lg:pr-0')}>
      <div data-rise className="lg:sticky lg:top-28">
        <p className={eyebrow}>New this month</p>
        <h2 id="shelf-title" className={cn(title, 'mt-4 max-w-[10ch]')}>A shelf of moving parts.</h2>
        <p className={cn(body, 'mt-5 max-w-[34ch]')}>A few recent ones. Every card opens its docs page with the live demo and the source.</p>
        <Link to="/docs/introduction" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2B5BFF] px-5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF] outline-none">See all {componentDocs.length}</Link>
      </div>
      <div className="min-w-0">
        <ul ref={track} aria-label="Recent components" className="-my-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SHELF.map((s) => {
            const it = pick(s)
            return (
              <li key={s} className="w-[min(72vw,300px)] shrink-0 snap-start">
                <Link to={`/docs/${s}`} className={cn('group block rounded-[18px]', focusRing)}>
                  <Art item={it} className="aspect-square transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] [@media(hover:hover)]:group-hover:-translate-y-1.5" />
                  <span className="mt-3 block text-[15px] font-medium tracking-[-0.02em] text-[var(--pi)]">{it.label}</span>
                  <span className="block text-[13px] text-[var(--pm)]">{catOf(s)} · Free</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="mt-5 flex items-center gap-2 pr-4 sm:pr-8 lg:pr-12">
          <button type="button" className={nav} onClick={() => step(-1)} disabled={p <= 0.01} aria-label="Previous components"><ArrowLeft className="h-4 w-4" aria-hidden /></button>
          <button type="button" className={nav} onClick={() => step(1)} disabled={p >= 0.99} aria-label="Next components"><ArrowRight className="h-4 w-4" aria-hidden /></button>
          <div aria-hidden className="ml-3 h-[3px] max-w-[220px] flex-1 overflow-hidden rounded-full bg-[var(--pl)]">
            <div className="h-full w-1/3 rounded-full bg-[var(--pi)] transition-transform duration-150" style={{ transform: `translateX(${p * 200}%)` }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 7 · Price: three cards, all zero. They straighten up as they arrive. ── */
const PLANS = [
  { name: 'Copy', note: 'Open any docs page and copy the file. That’s the whole install.', tone: 'paper' },
  { name: 'CLI', note: 'One shadcn command drops the source and its deps into your repo.', tone: 'blue', badge: 'Most used' },
  { name: 'Fork', note: 'MIT licensed. Rename it, ship it in a paid product, no credit needed.', tone: 'paper' },
] as const
function Price() {
  const root = React.useRef<HTMLElement>(null)
  useRise(root)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.from('[data-plan]', { y: 120, rotation: (i) => [-14, 4, 16][i], opacity: 0, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: '[data-plans]', start: 'top 92%', end: 'top 45%', scrub: 1 } })
    })
  }, { scope: root })
  return (
    <section ref={root} aria-labelledby="price-title" className={cn(wrap, 'grid items-center gap-12 py-[clamp(4rem,9vw,8rem)] lg:grid-cols-[0.8fr_1.2fr]')}>
      <div data-rise>
        <p className={eyebrow}>Pricing</p>
        <h2 id="price-title" className={cn(title, 'mt-4')}>What it costs.</h2>
        <p className={cn(body, 'mt-5 max-w-[36ch]')}>Nothing, in three different ways. Pick the one that matches how you like to work.</p>
      </div>
      <ul data-plans className="grid gap-4 sm:grid-cols-3 sm:gap-3 lg:gap-4">
        {PLANS.map((p, i) => {
          const blue = p.tone === 'blue'
          return (
            <li key={p.name} data-plan className={cn('relative flex min-h-[220px] flex-col rounded-[22px] p-5 sm:min-h-[280px]', blue ? 'bg-[#2B5BFF] text-white shadow-[0_24px_50px_-20px_rgb(43_91_255/0.6)] sm:-translate-y-4' : cn(panel, 'text-[var(--pi)]'))} style={{ rotate: `${[-2, 0, 2][i]}deg` }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-medium">{p.name}</h3>
                {'badge' in p && <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#2B5BFF]">{p.badge}</span>}
              </div>
              <p className="mt-3 flex items-start gap-0.5 font-medium tracking-[-0.05em]"><span className="mt-1.5 text-lg">$</span><span className="text-[3.25rem] leading-none">0</span><span className={cn('self-end pb-1 text-sm tracking-normal', blue ? 'text-white/70' : 'text-[var(--pm)]')}>/forever</span></p>
              <p className={cn('mt-auto pt-6 text-[14px] leading-snug', blue ? 'text-white/85' : 'text-[var(--pm)]')}>{p.note}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* ── 8 · Band: a lime wall with a slow banner and the wordmark peeking out ── */
const BAND = ['Free forever', 'Light and dark', 'Keyboard first', 'Yours to edit']
function Band() {
  const [paused, setPaused] = React.useState(false)
  return (
    <section aria-label="Framekit in four lines" className={cn(wrap, 'py-[clamp(2rem,5vw,4rem)]')}>
      <div className="relative overflow-hidden rounded-[26px] bg-[#D9F95C] text-zinc-950">
        <p className="sr-only">{BAND.join(', ')}</p>
        <div aria-hidden className="pt-[clamp(2rem,6vw,4.5rem)]">
          <div className="flex w-max motion-safe:animate-[fk-paper-marquee_30s_linear_infinite]" style={{ animationPlayState: paused ? 'paused' : 'running' }}>
            {[...BAND, ...BAND].map((t, i) => (
              <span key={i} className="flex items-center whitespace-nowrap text-[clamp(2rem,1.2rem+4vw,5.5rem)] font-medium leading-none tracking-[-0.05em]">
                {t}<span className="mx-[0.35em] inline-grid h-[0.7em] w-[0.7em] place-items-center rounded-[0.18em] text-[0.4em] text-white" style={{ background: ['#2B5BFF', '#FF6B4A', '#0A0A0B', '#7C5CFF'][i % 4] }}>✦</span>
              </span>
            ))}
          </div>
        </div>
        <p aria-hidden className="-mb-[0.22em] mt-[clamp(1rem,4vw,3rem)] select-none text-center text-[clamp(4.5rem,1rem+19vw,22rem)] font-semibold leading-[0.8] tracking-[-0.07em] text-zinc-950/[0.12]">framekit</p>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Play banner' : 'Pause banner'} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-zinc-950/10 text-zinc-950 hover:bg-zinc-950/20 motion-reduce:hidden outline-none focus-visible:outline-2 focus-visible:outline-zinc-950">
          {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
        </button>
      </div>
    </section>
  )
}

/* ── 9 · Two doors out ── */
function Doors() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-doorart]').forEach((el) => gsap.fromTo(el, { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 40%', scrub: 1 } }))
    })
  }, { scope: root })
  return (
    <section ref={root} aria-label="Next steps" className={cn(wrap, 'grid gap-3 pb-[clamp(3rem,7vw,6rem)] md:grid-cols-2 md:gap-4')}>
      <div className="relative isolate flex min-h-[440px] flex-col justify-end overflow-hidden rounded-[26px] bg-[#16130F] p-6 text-white sm:min-h-[520px] sm:p-8">
        <div data-doorart aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[68%]"><FitArt design={420} fill={0.72} className="dark h-full w-full">{pick('glow-histogram-card').art}</FitArt></div>
        <GithubIcon className="h-5 w-5" />
        <h2 className="mt-3 text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] font-medium tracking-[-0.04em]">Star it, fork it.</h2>
        <p className="mt-2 max-w-[36ch] text-white/70">The whole thing is on GitHub. Issues, ideas and pull requests are all welcome.</p>
        <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 text-[15px] font-medium text-zinc-950 hover:bg-zinc-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Open the repo<span className="sr-only"> (opens in a new tab)</span></a>
      </div>
      <div className="relative isolate flex min-h-[440px] flex-col justify-end overflow-hidden rounded-[26px] bg-[#FFB3C7] p-6 text-zinc-950 sm:min-h-[520px] sm:p-8">
        <div data-doorart aria-hidden className="light absolute inset-x-0 top-0 -z-10 h-[68%]"><FitArt design={400} fill={0.7} className="h-full w-full">{pick('spend-donut-card').art}</FitArt></div>
        <span className="text-xl" aria-hidden>✎</span>
        <h2 className="mt-3 text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] font-medium tracking-[-0.04em]">Learn the tricks.</h2>
        <p className="mt-2 max-w-[36ch] text-zinc-950/70">Short guides on springs, staggers and making motion that doesn't get in the way.</p>
        <Link to="/guides" className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-zinc-950 px-5 text-[15px] font-medium text-white hover:bg-zinc-800 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950">Read the guides</Link>
      </div>
    </section>
  )
}

export default function Paper() {
  React.useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <>
      <Library />
      <UpClose />
      <StackStrip />
      <Statement />
      <Take />
      <ShelfRow />
      <Price />
      <Band />
      <Doors />
      <div className="[&_section]:max-w-[1440px]"><Faq /></div>
      <Footer />
    </>
  )
}
