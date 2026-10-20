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
import { gsap, MOTION_OK, REDUCED, ScrollTrigger, useGSAP } from './motion'
import { Live, useBoxWidth } from './live'
import type { ParticleShape, ParticleMorphState } from '@/components/ui/particle-morph-loader'
import { AuroraCoreOrb, CosmicSparkleToggle, GhostGobblerSkull, InkBloomToggle, LiquidMetalOrb, MothLanternToggle, ParticleHaloOrb, ParticleMorphLoader, PullCordLampToggle, ShredderDeleteButton, StarMorphBuddy, TideglassToggle, WatchfulEyeToggle, WeatherVaneToggle } from './live-parts'

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
        <p className={eyebrow}><span className="text-[#FF6B4A]">01</span> · The library</p>
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

/* ── 2 · Feed the skull: a growing panel; scrolling through it is the loader's progress ── */
const GHOSTS = 8
function UpClose() {
  const root = React.useRef<HTMLElement>(null)
  const [fed, setFed] = React.useState(0)
  const [wallRef, ww] = useBoxWidth<HTMLDivElement>()
  useRise(root)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.fromTo('[data-wall]', { scale: 0.88, borderRadius: 44 }, { scale: 1, borderRadius: 28, ease: 'none', scrollTrigger: { trigger: '[data-wall]', start: 'top 95%', end: 'top 30%', scrub: 1 } })
      ScrollTrigger.create({ trigger: '[data-wall]', start: 'top 70%', end: 'bottom 45%', onUpdate: (st) => setFed(Math.min(GHOSTS, Math.floor(st.progress * 1.1 * GHOSTS))) })
    })
    mm.add(REDUCED, () => setFed(GHOSTS))
  }, { scope: root })
  const size = Math.round(Math.max(120, Math.min(260, ww / 3.4)))
  return (
    <section ref={root} aria-labelledby="close-title" className={cn(wrap, 'pb-[clamp(4rem,8vw,7rem)]')}>
      <div data-rise className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={eyebrow}><span className="text-[#FF6B4A]">02</span> · Up close · Ghost Gobbler Skull</p>
          <h2 id="close-title" className={cn(title, 'mt-4')}>Scroll to <span className="font-display font-normal italic tracking-[-0.02em] text-[#FF6B4A]">feed</span> it.</h2>
        </div>
        <p className={cn(body, 'max-w-[34ch]')}>It's a progress loader. Each ghost it swallows is an eighth of the job. Here your scroll is the job, so keep going.</p>
      </div>
      <div ref={wallRef} data-wall className="dark relative mt-10 grid aspect-[4/5] place-items-center overflow-hidden rounded-[28px] bg-[radial-gradient(70%_70%_at_50%_45%,#2a1f45,#0b0a10_75%)] will-change-transform sm:aspect-[16/9]">
        <div aria-hidden className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        <Live className="grid place-items-center">
          {ww > 0 && <GhostGobblerSkull mode="determinate" progress={fed / GHOSTS} total={GHOSTS} size={size} spread={1.8} showLabel={false} label="Skull loader" />}
        </Live>
        <Tag tone="lime" className="left-[5%] top-[7%]">eyes follow you</Tag>
        <Tag tone="blue" className="right-[5%] top-[14%]">click to chomp</Tag>
        <p className="absolute bottom-4 left-4 inline-flex min-h-11 items-center rounded-full bg-white/10 px-4 font-mono text-[13px] tabular-nums text-white backdrop-blur" aria-live="polite">{fed}/{GHOSTS} ghosts{fed >= GHOSTS ? ' · full' : ''}</p>
        <Link to="/docs/ghost-gobbler-skull" className={cn('absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-medium text-zinc-950 shadow-lg transition-transform hover:-translate-y-0.5', focusRing)}>Get the skull <ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
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
  { w: 'You' }, { w: 'could' }, { w: 'spend' }, { w: 'a' }, { w: 'week' }, { w: 'tuning' }, { w: 'one' }, { w: 'spring.', chip: { c: '#D9F95C', t: '✦' } }, { w: 'Or' }, { w: 'paste' }, { w: 'ours,', chip: { c: '#2B5BFF', t: '↻' } }, { w: 'and' }, { w: 'spend' }, { w: 'that' }, { w: 'week' }, { w: 'on' }, { w: 'the' }, { w: 'thing' }, { w: 'you' }, { w: 'are' }, { w: 'actually' }, { w: 'building.' },
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
            <span data-sword className={t.w === 'paste' ? 'text-[#2B5BFF] dark:text-[#8FA8FF]' : undefined}>{t.w}</span>
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

/* ── 5 · The workbench: an app window with two tabs, both playable ── */
const SHAPES: ParticleShape[] = ['sphere', 'ribbon', 'shell', 'tetra', 'ring', 'helix']
const TINTS = [{ n: 'Iris', c: '#a78bfa' }, { n: 'Glacier', c: '#7dd3fc' }, { n: 'Ember', c: '#fdba74' }, { n: 'Bloom', c: '#f9a8d4' }]
const STATES: ParticleMorphState[] = ['loading', 'done', 'error']
const BOARD = [
  { slug: 'moth-lantern-toggle', name: 'Moth Lantern', C: MothLanternToggle },
  { slug: 'watchful-eye-toggle', name: 'Watchful Eye', C: WatchfulEyeToggle },
  { slug: 'cosmic-sparkle-toggle', name: 'Cosmic Sparkle', C: CosmicSparkleToggle },
  { slug: 'ink-bloom-toggle', name: 'Ink Bloom', C: InkBloomToggle },
  { slug: 'weather-vane-toggle', name: 'Weather Vane', C: WeatherVaneToggle },
  { slug: 'tideglass-toggle', name: 'Tideglass', C: TideglassToggle },
]
const chip = (on: boolean) => cn('min-h-11 rounded-full px-3.5 text-[13px] font-medium capitalize transition-[background-color,color,transform] duration-150 active:scale-[0.96] sm:min-h-9', on ? 'bg-[var(--pi)] text-[var(--pp)]' : 'text-[var(--pm)] ring-1 ring-[var(--pl)] hover:text-[var(--pi)]', focusRing)
type Tab = 'Toggles' | 'Particles'
function Take() {
  const root = React.useRef<HTMLElement>(null)
  const [tab, setTab] = React.useState<Tab>('Toggles')
  const [on, setOn] = React.useState<boolean[]>(() => BOARD.map(() => false))
  const [shape, setShape] = React.useState<ParticleShape | 'all'>('all')
  const [tint, setTint] = React.useState(TINTS[0])
  const [state, setState] = React.useState<ParticleMorphState>('loading')
  const timers = React.useRef<number[]>([])
  useRise(root)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.from('[data-tcell]', { y: 40, scale: 0.94, opacity: 0, duration: 0.6, ease: 'back.out(1.4)', stagger: 0.05, scrollTrigger: { trigger: '[data-tpanel]', start: 'top 85%' } })
    })
  }, { scope: root, dependencies: [tab] })
  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const count = on.filter(Boolean).length
  const all = count === BOARD.length
  const flipAll = () => {
    timers.current.forEach(clearTimeout)
    const to = !all
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    BOARD.forEach((_, i) => { timers.current[i] = window.setTimeout(() => setOn((p) => p.map((v, j) => (j === i ? to : v))), reduce ? 0 : i * 110) })
  }
  const tabs: Tab[] = ['Toggles', 'Particles']
  return (
    <section ref={root} aria-labelledby="take-title" className={cn(wrap, 'grid items-center gap-12 py-[clamp(4rem,9vw,8rem)] lg:grid-cols-[0.75fr_1.25fr]')}>
      <div data-rise>
        <p className={eyebrow}><span className="text-[#FF6B4A]">04</span> · The workbench</p>
        <h2 id="take-title" className={cn(title, 'mt-4 max-w-[12ch]')}>Don't take our word. <span className="text-[var(--pm)]">Play with it.</span></h2>
        <p className={cn(body, 'mt-6 max-w-[40ch]')}>Two drawers from the kit, wired up for real. Flip the switches one by one or all at once. Bend the particle loader into a new shape, then tell it the upload failed.</p>
        <Link to="/docs/introduction" className={cn(paperBtnGhost, '-ml-4 mt-6')}>Everything else <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      <div className={cn(panel, 'min-w-0 p-2 sm:p-3')}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2 sm:pb-3">
          <div role="tablist" aria-label="Workbench" className="flex gap-1 rounded-full bg-[var(--pp)] p-1 ring-1 ring-[var(--pl)]">
            {tabs.map((t) => (
              <button key={t} type="button" role="tab" id={`tab-${t}`} aria-selected={tab === t} aria-controls="take-panel" onClick={() => setTab(t)}
                className={cn('min-h-9 rounded-full px-3.5 text-[13px] font-medium transition-colors', tab === t ? 'bg-[var(--pi)] text-[var(--pp)]' : 'text-[var(--pm)] hover:text-[var(--pi)]', focusRing)}>{t}</button>
            ))}
          </div>
          {tab === 'Toggles' ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] tabular-nums text-[var(--pm)]" aria-live="polite">{count}/{BOARD.length} on</span>
              <button type="button" onClick={flipAll} className={cn('inline-flex min-h-9 items-center rounded-full bg-[#FF6B4A] px-4 text-[13px] font-semibold text-white transition-transform active:scale-[0.97] hover:brightness-105 max-sm:min-h-11', focusRing)}>{all ? 'Lights out' : 'Flip all'}</button>
            </div>
          ) : (
            <span className="font-mono text-[12px] text-[var(--pm)]">400 points · canvas</span>
          )}
        </div>
        <div data-tpanel id="take-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          {tab === 'Toggles' ? (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {BOARD.map((t, i) => (
                <li key={t.slug} data-tcell className={cn('relative flex min-h-[160px] flex-col rounded-[18px] bg-[var(--pp)] p-3 ring-1 ring-[var(--pl)] transition-colors duration-500 sm:min-h-[200px]', on[i] && 'bg-[color-mix(in_oklab,var(--pp),#FFC56B_22%)]')}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--pm)]">{on[i] ? 'on' : 'off'}</span>
                    <Link to={`/docs/${t.slug}`} aria-label={`${t.name} docs`} className={cn('-m-2.5 grid h-11 w-11 place-items-center rounded-full text-[var(--pm)] hover:text-[var(--pi)]', focusRing)}><ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
                  </div>
                  <Live className="grid flex-1 place-items-center [&>*]:scale-[1.1] sm:[&>*]:scale-[1.4]">
                    <t.C checked={on[i]} onCheckedChange={(v: boolean) => setOn((p) => p.map((x, j) => (j === i ? v : x)))} aria-label={t.name} />
                  </Live>
                  <p className="text-[14px] font-medium tracking-[-0.01em] text-[var(--pi)]">{t.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <div data-tcell className="dark relative grid aspect-square place-items-center overflow-hidden rounded-[18px] bg-[radial-gradient(60%_60%_at_50%_45%,#1c1830,#09080c_75%)] sm:aspect-[4/3]">
                <Live className="grid h-full w-full place-items-center">
                  <ParticleMorphLoader key={shape} shapes={shape === 'all' ? SHAPES : [shape]} color={tint.c} state={state} size={300} onRetry={() => setState('loading')} className="max-sm:scale-[0.85]" />
                </Live>
              </div>
              <div data-tcell className="flex flex-col gap-4 p-1 md:w-[180px]" role="group" aria-label="Loader controls">
                <div><p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--pm)]">Shape</p>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Shape">{(['all', ...SHAPES] as const).map((x) => <button key={x} type="button" aria-pressed={shape === x} onClick={() => { setShape(x); setState('loading') }} className={chip(shape === x)}>{x === 'all' ? 'All six' : x}</button>)}</div></div>
                <div><p className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--pm)]">Ink</p>
                  <div className="flex gap-0.5" role="group" aria-label="Tint">{TINTS.map((t) => (
                    <button key={t.n} type="button" aria-pressed={tint.n === t.n} aria-label={t.n} onClick={() => setTint(t)} className={cn('grid h-11 w-11 place-items-center rounded-full', focusRing)}>
                      <span className={cn('h-7 w-7 rounded-full ring-offset-2 ring-offset-[var(--pc)]', tint.n === t.n && 'ring-2 ring-[var(--pi)]')} style={{ background: t.c }} />
                    </button>))}</div></div>
                <div><p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--pm)]">Job</p>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="State">{STATES.map((x) => <button key={x} type="button" aria-pressed={state === x} onClick={() => setState(x)} className={chip(state === x)}>{x}</button>)}</div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── 6 · Shelf: a horizontal row you can drag, swipe or step through ── */
const SHELF: { slug: string; name: string; note: string; tone: 'dark' | 'light'; bg: string; node: React.ReactNode }[] = [
  { slug: 'liquid-metal-orb', name: 'Liquid Metal Orb', note: 'Tap it. It changes mood.', tone: 'dark', bg: 'radial-gradient(70% 70% at 50% 40%,#2a2a33,#0b0b0e)', node: <LiquidMetalOrb /> },
  { slug: 'pull-cord-lamp-toggle', name: 'Pull-cord Lamp', note: 'Pull the cord down, let go.', tone: 'light', bg: '#F3E6CF', node: <PullCordLampToggle /> },
  { slug: 'shredder-delete-button', name: 'Shredder Delete', note: 'Deleting, but satisfying.', tone: 'light', bg: '#E9E5F7', node: <ShredderDeleteButton variant="violet" /> },
  { slug: 'star-morph-buddy', name: 'Star Morph Buddy', note: 'Click and it wakes up.', tone: 'dark', bg: 'radial-gradient(90% 80% at 50% 20%,#1a1740,#07060f)', node: <StarMorphBuddy onActivate={() => new Promise((r) => setTimeout(r, 1400))} /> },
  { slug: 'aurora-core-orb', name: 'Aurora Core Orb', note: 'Click to change what it is doing.', tone: 'dark', bg: 'radial-gradient(70% 70% at 50% 40%,#13202a,#06090c)', node: <AuroraCoreOrb /> },
  { slug: 'particle-halo-orb', name: 'Particle Halo Orb', note: 'A voice assistant, minus the voice.', tone: 'dark', bg: 'radial-gradient(70% 70% at 50% 40%,#221a2e,#08070b)', node: <ParticleHaloOrb /> },
]
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
        <p className={eyebrow}><span className="text-[#FF6B4A]">05</span> · The odd shelf</p>
        <h2 id="shelf-title" className={cn(title, 'mt-4 max-w-[10ch]')}>Things people screenshot.</h2>
        <p className={cn(body, 'mt-5 max-w-[34ch]')}>Orbs, a mascot, a lamp with a real cord. Every one is live, so poke at it, then grab the source.</p>
        <Link to="/docs/introduction" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2B5BFF] px-5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF] outline-none">See all {componentDocs.length}</Link>
      </div>
      <div className="min-w-0">
        <ul ref={track} aria-label="Standout components" className="-my-6 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SHELF.map((d, i) => (
            <li key={d.slug} className="w-[min(78vw,320px)] shrink-0 snap-start">
              <div className={cn(d.tone, 'relative grid aspect-square place-items-center overflow-hidden rounded-[22px] ring-1 ring-black/[0.06] dark:ring-white/10')} style={{ background: d.bg }}>
                <span className={cn('absolute left-3.5 top-3 font-mono text-[10.5px] uppercase tracking-[0.12em]', d.tone === 'dark' ? 'text-white/45' : 'text-black/45')}>No. {String(i + 1).padStart(2, '0')}</span>
                <Live className="grid h-full w-full place-items-center p-4">{d.node}</Live>
              </div>
              <div className="mt-3 flex items-start justify-between gap-2">
                <div><p className="text-[15px] font-medium tracking-[-0.02em] text-[var(--pi)]">{d.name}</p><p className="text-[13px] text-[var(--pm)]">{d.note}</p></div>
                <Link to={`/docs/${d.slug}`} aria-label={`${d.name} docs`} className={cn('-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--pm)] hover:text-[var(--pi)]', focusRing)}><ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
              </div>
            </li>
          ))}
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
        <p className={eyebrow}><span className="text-[#FF6B4A]">06</span> · Pricing</p>
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
