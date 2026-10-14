import * as React from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Accessibility, Boxes, Code2, Command, Heart, Keyboard, Layers, MoonStar, MousePointer2, Palette, Sparkles, Star, Sun, Terminal, Wand2, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'
import { componentDocs, getNavGroups } from '@/docs/registry'
import { GlassAppDock } from '@/components/ui/glass-app-dock'
import { GlowLeaderboardList } from '@/components/ui/glow-leaderboard-list'
import { SparklineKpiTile } from '@/components/ui/sparkline-kpi-tile'
import { InkDripLoader } from '@/components/ui/ink-drip-loader'
import { LatticePulseLoader } from '@/components/ui/lattice-pulse-loader'
import { MorphGlyphLoader } from '@/components/ui/morph-glyph-loader'
import { NeonStrokeButton } from '@/components/ui/neon-stroke-button'
import { ConfettiBurstButton } from '@/components/ui/confetti-burst-button'
import { EASE, FitArt, POP, focusRing, lede, pillDark, section, surface } from './kit'
import { SHOW } from './ShowcaseHero'
import { Faq, FinalCta, Footer } from './Sections'
import { gsap, MOTION_OK, ScrollTrigger, toPoint, useGSAP } from './motion'

type Item = { slug: string; label: string; bg: string; design: number | 'auto'; fill?: number; art: React.ReactNode }
const by = (s: string) => SHOW.find((x) => x.slug === s)! as Item
const EXTRA: Item[] = [
  { slug: 'glass-app-dock', label: 'Glass App Dock', bg: '#E5ECFF', design: 'auto', fill: 0.92, art: <GlassAppDock /> },
  { slug: 'glow-leaderboard-list', label: 'Glow Leaderboard', bg: POP.ink, design: 380, art: <GlowLeaderboardList /> },
  { slug: 'sparkline-kpi-tile', label: 'Sparkline KPI Tile', bg: '#FFFFFF', design: 320, art: <SparklineKpiTile /> },
  { slug: 'ink-drip-loader', label: 'Ink Drip Loader', bg: '#F1F1EF', design: 'auto', art: <InkDripLoader /> },
  { slug: 'lattice-pulse-loader', label: 'Lattice Pulse Loader', bg: POP.ink, design: 'auto', art: <LatticePulseLoader /> },
  { slug: 'morph-glyph-loader', label: 'Morph Glyph Loader', bg: POP.lime, design: 'auto', art: <MorphGlyphLoader /> },
  { slug: 'neon-stroke-button', label: 'Neon Stroke Button', bg: POP.ink, design: 'auto', art: <NeonStrokeButton /> },
  { slug: 'confetti-burst-button', label: 'Confetti Burst Button', bg: '#FFFFFF', design: 'auto', art: <ConfettiBurstButton /> },
]
const ex = (s: string) => EXTRA.find((x) => x.slug === s)!
const pick = (s: string) => SHOW.find((x) => x.slug === s) ? by(s) : ex(s)

const count = componentDocs.length
const cats = getNavGroups().filter((g) => g.title !== 'Getting Started').length

const h2 = 'text-balance text-[clamp(2.1rem,1.3rem+3.4vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950 dark:text-white'
const eyebrow = 'text-[13px] font-medium text-zinc-500 dark:text-zinc-400'

/** A card that holds a real component. `frame` is the outer box classes. */
function Preview({ item, className, label = true, fill }: { item: Item; className?: string; label?: boolean; fill?: number }) {
  const s = surface(item.bg)
  return (
    <div className={cn('flex flex-col rounded-[22px] p-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_20px_44px_-24px_rgb(0_0_0/0.35)] ring-1 ring-black/[0.06] dark:ring-white/10', s.className, className)} style={s.style}>
      <FitArt design={item.design} fill={fill ?? item.fill ?? 0.88} className="min-h-0 flex-1 rounded-[17px]">{item.art}</FitArt>
      {label && <span className="px-2 pb-1 pt-2 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">{item.label}</span>}
    </div>
  )
}

/* ── 2 · Feature: copy left, preview slides up with inner parallax ── */
function Feature() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      const t = { trigger: '[data-fbox]', start: 'top 95%', end: 'top 25%', scrub: 0.6 }
      gsap.fromTo('[data-fbox]', { y: 160 }, { y: 0, ease: 'none', scrollTrigger: t })
      gsap.fromTo('[data-fimg]', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: t })
      gsap.from('[data-fchip]', { y: 40, opacity: 0, scale: 0.9, duration: 0.8, ease: 'back.out(2)', stagger: 0.12, scrollTrigger: { trigger: '[data-fbox]', start: 'top 55%' } })
      gsap.from('[data-fcopy] > *', { y: 30, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 70%' } })
    })
  }, { scope: root })
  return (
    <section ref={root} aria-labelledby="feat-title" className={cn(section, 'grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16')}>
      <div data-fcopy>
        <p className={eyebrow}>Not another button kit</p>
        <h2 id="feat-title" className={cn(h2, 'mt-4')}>The motion is the feature.</h2>
        <p className={cn(lede, 'mt-6 max-w-[42ch]')}>Charts that draw themselves. Numbers that roll. Cards that tilt toward the light. Every piece ships with its timing already tuned, so you spend the afternoon on your product instead of on easing curves.</p>
        <Link to="/docs/budget-area-card" className={cn(pillDark, 'mt-8')}>See it in the docs <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
      <div className="relative">
        <div data-fbox className="relative aspect-[5/4] overflow-hidden rounded-[32px] bg-white shadow-[0_2px_6px_rgb(0_0_0/0.05),0_40px_90px_-40px_rgb(0_0_0/0.45)] ring-1 ring-black/[0.06] dark:bg-[#141416] dark:ring-white/10">
          <div data-fimg className="absolute inset-0 grid place-items-center bg-[radial-gradient(120%_90%_at_70%_0%,#E5ECFF,transparent_60%)] dark:bg-[radial-gradient(120%_90%_at_70%_0%,#1a2346,transparent_60%)]">
            <FitArt design={420} fill={0.7} className="h-full w-full">{by('budget-area-card').art}</FitArt>
          </div>
        </div>
        <span data-fchip aria-hidden className="absolute -left-3 top-[14%] rounded-2xl bg-zinc-950 px-4 py-3 text-[13px] font-semibold text-white shadow-xl sm:-left-8 dark:bg-white dark:text-zinc-950">Draws in 900ms</span>
        <span data-fchip aria-hidden className="absolute -right-2 top-[46%] rounded-2xl bg-[#D9F95C] px-4 py-3 text-[13px] font-semibold text-zinc-950 shadow-xl sm:-right-6">Spring tooltip</span>
        <span data-fchip aria-hidden className="absolute bottom-[8%] left-[10%] rounded-2xl bg-white px-4 py-3 text-[13px] font-semibold text-zinc-950 shadow-xl ring-1 ring-black/[0.06]">Reduced motion aware</span>
      </div>
    </section>
  )
}

/* ── 3 · Tech marquee ── */
const TECH = ['React 19', 'TypeScript', 'Tailwind v4', 'Motion', 'shadcn/ui', 'Vite', 'Next.js', 'Lucide']
function TechMarquee() {
  const row = [...TECH, ...TECH]
  return (
    <section aria-labelledby="stack-title" className="border-y border-black/[0.06] py-8 dark:border-white/[0.08]">
      <h2 id="stack-title" className="sr-only">Built on</h2>
      <p className="sr-only">{TECH.join(', ')}</p>
      <div aria-hidden className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-[fk-marquee_38s_linear_infinite] gap-14 pr-14 motion-reduce:animate-none">
          {row.map((t, i) => <span key={i} className="whitespace-nowrap text-[clamp(1.25rem,1rem+1vw,2rem)] font-semibold tracking-[-0.04em] text-zinc-400 dark:text-zinc-600">{t}</span>)}
        </div>
      </div>
    </section>
  )
}

/* ── 4 · Diagonal cascade → 2×3 grid, one card spins on Y ── */
const CASCADE = ['glow-histogram-card', 'wallet-balance-card', 'spend-donut-card', 'liquid-glass-tab-bar', 'smart-widget-stack', 'glow-level-card']
function Cascade() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      const box = root.current!.querySelector<HTMLElement>('[data-cgrid]')!
      const cards = gsap.utils.toArray<HTMLElement>('[data-ccard]')
      const step = () => Math.min(innerWidth * 0.07, 90)
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${innerHeight * 1.4}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } })
      tl.fromTo(cards,
        { x: (i, el) => toPoint(el, box, (i - 2.5) * step(), (i - 2.5) * step() * 0.55).x, y: (i, el) => toPoint(el, box, (i - 2.5) * step(), (i - 2.5) * step() * 0.55).y, rotation: (i) => -8 + i * 3, scale: 0.86 },
        { x: 0, y: 0, rotation: 0, scale: 1, ease: 'power3.inOut', stagger: 0.04, duration: 1 })
        .fromTo(cards[2], { rotationY: 0 }, { rotationY: 360, ease: 'power3.inOut', duration: 1 }, 0.1)
        .from('[data-ccopy]', { opacity: 0, y: 30, duration: 0.4, ease: 'power3.out' }, 0.6)
    })
  }, { scope: root })
  return (
    <section ref={root} aria-labelledby="casc-title" className="flex min-h-[100svh] flex-col justify-center py-16">
      <div className={cn(section, 'flex flex-col items-center')}>
        <div data-ccopy className="mb-10 text-center">
          <p className={eyebrow}>Widgets</p>
          <h2 id="casc-title" className={cn(h2, 'mt-3')}>Deal them out. They line up.</h2>
        </div>
        <div data-cgrid className="relative grid w-full max-w-[min(1000px,calc((100svh-260px)*1.2))] grid-cols-2 max-sm:max-w-[min(340px,calc((100svh-260px)*0.53))] gap-3 [perspective:1400px] sm:grid-cols-3 sm:gap-5">
          {CASCADE.map((s) => <div key={s} data-ccard className="aspect-[4/5] will-change-transform [transform-style:preserve-3d]"><Preview item={by(s)} className="h-full" /></div>)}
        </div>
      </div>
    </section>
  )
}

/* ── 5 · Tabs swap card sets ── */
const TABS = [
  { id: 'data', label: 'Data', items: ['glow-candle-card', 'sparkline-kpi-tile', 'contribution-heatmap-tile'] },
  { id: 'ui', label: 'Product UI', items: ['dynamic-status-island', 'glass-app-dock', 'liquid-glass-tab-bar'] },
  { id: 'loaders', label: 'Loaders', items: ['ink-drip-loader', 'lattice-pulse-loader', 'morph-glyph-loader'] },
  { id: 'buttons', label: 'Buttons', items: ['neon-stroke-button', 'confetti-burst-button', 'goal-progress-card'] },
]
function TabSwap() {
  const [tab, setTab] = React.useState(0)
  const [dir, setDir] = React.useState(1)
  const go = (i: number) => { setDir(i > tab ? 1 : -1); setTab(i) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const n = (tab + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length
    go(n)
    document.getElementById(`tab-${TABS[n].id}`)?.focus()
  }
  return (
    <section aria-labelledby="tabs-title" className={cn(section, 'py-24 sm:py-32')}>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className={eyebrow}>Browse by job</p>
          <h2 id="tabs-title" className={cn(h2, 'mt-3 max-w-[14ch]')}>Whatever you're building today.</h2>
        </div>
        <div role="tablist" aria-label="Component sets" onKeyDown={onKey} className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-black/[0.04] p-1 dark:bg-white/[0.06]">
          {TABS.map((t, i) => (
            <button key={t.id} id={`tab-${t.id}`} role="tab" aria-selected={tab === i} aria-controls="tab-panel" tabIndex={tab === i ? 0 : -1} onClick={() => go(i)}
              className={cn('relative min-h-10 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors', tab === i ? 'text-zinc-950 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200', focusRing)}>
              {tab === i && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/10" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div id="tab-panel" role="tabpanel" aria-labelledby={`tab-${TABS[tab].id}`} className="relative mt-10 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.ul key={tab} className="grid gap-4 sm:grid-cols-3" custom={dir}>
            {TABS[tab].items.map((s, i) => {
              const it = pick(s)
              return (
                <motion.li key={s}
                  custom={dir}
                  variants={{ in: (d: number) => ({ x: `${d * 60}%`, opacity: 0, rotate: d * 4 }), on: { x: 0, opacity: 1, rotate: 0 }, out: (d: number) => ({ x: `${-d * 60}%`, opacity: 0, rotate: -d * 4 }) }}
                  initial="in" animate="on" exit="out"
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}>
                  <Link to={`/docs/${s}`} className={cn('block aspect-[5/4] rounded-[22px] transition-transform duration-300 [@media(hover:hover)]:hover:-translate-y-1', focusRing)} aria-label={it.label}>
                    <Preview item={it} className="h-full" />
                  </Link>
                </motion.li>
              )
            })}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ── 6 · Depth field: tiles at different speeds around centred copy ── */
const FIELD = [
  { cls: 'left-[2%] top-[4%] w-[22%]', sp: 1.6, s: 'neon-halo-card' },
  { cls: 'right-[4%] top-[2%] w-[18%]', sp: 0.7, s: 'activity-rings' },
  { cls: 'left-[16%] bottom-[2%] w-[16%]', sp: 1.1, s: 'morph-glyph-loader' },
  { cls: 'right-[12%] bottom-[6%] w-[24%]', sp: 1.9, s: 'glow-candle-card' },
  { cls: 'left-[40%] top-[-4%] w-[12%] max-sm:hidden', sp: 0.5, s: 'lattice-pulse-loader' },
  { cls: 'right-[34%] bottom-[-6%] w-[13%] max-sm:hidden', sp: 1.3, s: 'ink-drip-loader' },
]
const ICONS = [
  { I: Sparkles, cls: 'left-[30%] top-[22%]', sp: 2.2, c: POP.lime },
  { I: Zap, cls: 'right-[28%] top-[26%]', sp: 0.9, c: POP.blue },
  { I: Heart, cls: 'left-[6%] top-[52%]', sp: 1.4, c: '#FF5C8A' },
  { I: Star, cls: 'right-[6%] top-[54%]', sp: 2.6, c: '#FFB547' },
]
function DepthField() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
        const sp = Number(el.dataset.speed)
        gsap.fromTo(el, { y: 160 * sp }, { y: -160 * sp, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    })
  }, { scope: root })
  return (
    <section ref={root} aria-labelledby="depth-title" className="relative overflow-hidden py-32 sm:py-48">
      <div aria-hidden className="absolute inset-0">
        {FIELD.map((f) => <div key={f.s} data-speed={f.sp} className={cn('absolute aspect-square min-w-[110px]', f.cls)}><Preview item={pick(f.s)} label={false} className="h-full" /></div>)}
        {ICONS.map(({ I, cls, sp, c }, i) => <span key={i} data-speed={sp} className={cn('absolute grid h-12 w-12 place-items-center rounded-2xl shadow-lg sm:h-14 sm:w-14', cls)} style={{ background: c }}><I className="h-5 w-5 text-zinc-950" /></span>)}
      </div>
      <div className="relative z-10 mx-auto max-w-[760px] px-6 text-center">
        <div className="rounded-[32px] bg-[#F8F8F7]/80 px-6 py-10 backdrop-blur-md dark:bg-[#0A0A0B]/75">
          <p className={eyebrow}>Depth without a 3D engine</p>
          <h2 id="depth-title" className={cn(h2, 'mt-3')}>Layers that know how far away they are.</h2>
          <p className={cn(lede, 'mx-auto mt-5 max-w-[44ch]')}>Parallax, tilt and perspective built from plain CSS transforms. No canvas to babysit, nothing heavy to download.</p>
        </div>
      </div>
    </section>
  )
}

/* ── 7 · Bento: mini fan + slow 3D flip ── */
function Bento() {
  const cell = 'relative overflow-hidden rounded-[28px] bg-white p-6 ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:bg-[#141416] dark:ring-white/[0.08] sm:p-8'
  return (
    <section aria-labelledby="bento-title" className={cn(section, 'py-24 sm:py-32')}>
      <p className={eyebrow}>The small print, made big</p>
      <h2 id="bento-title" className={cn(h2, 'mt-3 max-w-[16ch]')}>Details you'd otherwise skip.</h2>
      <div className="mt-12 grid gap-4 md:grid-cols-6 md:grid-rows-[300px_300px]">
        <div className={cn(cell, 'group min-h-[320px] md:col-span-4')}>
          <h3 className="text-xl font-semibold tracking-[-0.03em]">Light and dark, both designed</h3>
          <p className="mt-2 max-w-[36ch] text-zinc-600 dark:text-zinc-400">Not an inverted afterthought. Each theme gets its own shadows and contrast.</p>
          <div aria-hidden className="pointer-events-none absolute -bottom-10 right-8 h-[200px] w-[260px] max-sm:right-0 max-sm:scale-75">
            {['glow-level-card', 'wallet-balance-card', 'goal-progress-card'].map((s, i) => (
              <div key={s} className={cn('absolute bottom-0 left-1/2 -ml-[80px] h-[190px] w-[160px] origin-bottom transition-[rotate,translate] duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none', ['-rotate-8 group-hover:-rotate-[18deg] group-hover:-translate-x-6', 'rotate-0 group-hover:-translate-y-3', 'rotate-8 group-hover:rotate-[18deg] group-hover:translate-x-6'][i])}>
                <Preview item={pick(s)} label={false} className="h-full" />
              </div>
            ))}
          </div>
        </div>
        <div className={cn(cell, 'md:col-span-2 md:row-span-2 flex flex-col')}>
          <h3 className="text-xl font-semibold tracking-[-0.03em]">Two sides to every card</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">The front shows it off. The back is the one line you paste.</p>
          <div aria-hidden className="mt-6 grid flex-1 place-items-center [perspective:1200px] max-md:h-[280px]">
            <div className="relative h-[240px] w-[190px] animate-[fk-flip_14s_linear_infinite] [transform-style:preserve-3d] motion-reduce:animate-none">
              <div className="absolute inset-0 [backface-visibility:hidden]"><Preview item={by('neon-halo-card')} label={false} className="h-full" /></div>
              <div className="absolute inset-0 flex flex-col justify-between rounded-[22px] bg-[#D9F95C] p-5 text-zinc-950 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <Terminal className="h-6 w-6" />
                <p className="font-mono text-[12px] leading-relaxed">npx shadcn add<br />@framekit/<br />neon-halo-card</p>
              </div>
            </div>
          </div>
        </div>
        <div className={cn(cell, 'md:col-span-2')}>
          <Keyboard className="h-6 w-6 text-[#2B5BFF] dark:text-[#8FA8FF]" aria-hidden />
          <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">Keyboard first</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Focus rings, arrow keys, Escape. The boring parts are done.</p>
        </div>
        <div className={cn(cell, 'md:col-span-2')}>
          <Accessibility className="h-6 w-6 text-[#2B5BFF] dark:text-[#8FA8FF]" aria-hidden />
          <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">Calm when asked</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Turn on reduced motion and everything settles into a gentle fade.</p>
        </div>
      </div>
    </section>
  )
}

/* ── 8 · Dock explodes into a grid, then one card takes focus ── */
const DOCK = [
  { I: Layers, c: '#2B5BFF' }, { I: Wand2, c: '#A855F7' }, { I: Boxes, c: '#0A0A0B' }, { I: Palette, c: '#FF5C8A' },
  { I: Command, c: '#D9F95C' }, { I: MousePointer2, c: '#FFB547' }, { I: Code2, c: '#10B981' }, { I: MoonStar, c: '#334155' }, { I: Sun, c: '#F97316' },
]
function DockBurst() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      const box = root.current!.querySelector<HTMLElement>('[data-dgrid]')!
      const tiles = gsap.utils.toArray<HTMLElement>('[data-dtile]')
      const gap = () => (innerWidth < 640 ? 38 : 64)
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${innerHeight * 2}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } })
      tl.fromTo(tiles,
        { x: (i, el) => toPoint(el, box, (i - 4) * gap(), 0).x, y: (i, el) => toPoint(el, box, 0, 0).y, scale: () => (innerWidth < 640 ? 0.3 : 0.4), borderRadius: 40 },
        { x: 0, y: 0, scale: 1, borderRadius: 24, ease: 'power3.inOut', stagger: { each: 0.03, from: 'center' }, duration: 1 })
        .to('[data-dicon]', { opacity: 0, duration: 0.2 }, 0.85)
        .to('[data-dart]', { opacity: 1, duration: 0.2 }, 0.85)
        .to(tiles.filter((_, i) => i !== 4), { filter: 'blur(10px)', opacity: 0.25, scale: 0.92, duration: 0.6, ease: 'power3.out' }, 1.3)
        .to(tiles[4], { scale: () => (innerWidth < 640 ? 1.9 : 1.7), zIndex: 10, duration: 0.7, ease: 'power4.out' }, 1.3)
        .from('[data-dcopy2]', { opacity: 0, y: 24, duration: 0.4 }, 1.6)
    })
  }, { scope: root })
  return (
    <section ref={root} aria-labelledby="dock-title" className="flex min-h-[100svh] flex-col items-center justify-center overflow-hidden py-16">
      <div className="mb-10 px-6 text-center">
        <p className={eyebrow}>One dock, a whole kit</p>
        <h2 id="dock-title" className={cn(h2, 'mt-3')}>Start small. Open everything.</h2>
      </div>
      <div data-dgrid className="relative grid grid-cols-3 gap-3 sm:gap-4">
        {DOCK.map(({ I, c }, i) => {
          const it = [pick('confetti-burst-button'), pick('sparkline-kpi-tile'), pick('morph-glyph-loader'), pick('ink-drip-loader'), by('activity-rings'), pick('lattice-pulse-loader'), pick('neon-stroke-button'), pick('glow-leaderboard-list'), by('spend-donut-card')][i]
          const s = surface(it.bg)
          return (
            <div key={i} data-dtile className={cn('relative h-[96px] w-[96px] overflow-hidden rounded-[24px] shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] will-change-transform sm:h-[150px] sm:w-[150px] lg:h-[170px] lg:w-[170px]', s.className)} style={s.style}>
              <div data-dart className="absolute inset-0 opacity-0 motion-reduce:opacity-100"><FitArt design={it.design} fill={0.9} className="h-full w-full">{it.art}</FitArt></div>
              <span data-dicon aria-hidden className="absolute inset-0 grid place-items-center motion-reduce:hidden" style={{ background: c }}>
                <I className={cn('h-1/3 w-1/3', c === '#D9F95C' ? 'text-zinc-950' : 'text-white')} />
              </span>
            </div>
          )
        })}
      </div>
      <p data-dcopy2 className={cn(lede, 'mt-12 max-w-[40ch] px-6 text-center')}>Every tile is a real component. Tap one in the docs and you get the preview, the props and the install line.</p>
    </section>
  )
}

/* ── 9 · Count-up stats ── */
const STATS = [
  { n: count, s: '', l: 'components, all animated' },
  { n: cats, s: '', l: 'categories, from charts to 404s' },
  { n: 2, s: '', l: 'themes, each designed by hand' },
  { n: 0, s: '$', l: 'to use. MIT licensed', pre: true },
]
function Stats() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('[data-num]').forEach((el) => {
      const end = Number(el.dataset.num)
      const o = { v: 0 }
      gsap.matchMedia().add(MOTION_OK, () => {
        el.textContent = '0'
        gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: () => { el.textContent = String(Math.round(o.v)) } })
      })
    })
    gsap.matchMedia().add(MOTION_OK, () => gsap.from('[data-stat]', { y: 40, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 80%' } }))
  }, { scope: root })
  return (
    <section ref={root} aria-labelledby="stats-title" className={cn(section, 'py-24 sm:py-32')}>
      <h2 id="stats-title" className="sr-only">Framekit in numbers</h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.l} data-stat className="border-t border-black/10 pt-6 dark:border-white/10">
            <dt className="sr-only">{s.l}</dt>
            <dd className="text-[clamp(3.5rem,2rem+6vw,7.5rem)] font-semibold leading-none tracking-[-0.07em] tabular-nums">{s.s}<span data-num={s.n}>{s.n}</span></dd>
            <dd aria-hidden className="mt-3 text-[15px] text-zinc-600 dark:text-zinc-400">{s.l}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ── 10 · Accent strip ── */
const STRIP = ['Feels alive', 'Springs, not keyframes', 'Copy and ship', 'Light + dark', 'Keyboard first', 'Yours to edit']
const SPIN = [Sparkles, Star, Zap, Heart]
function StripRow({ k, cls }: { k: string; cls: string }) {
  return (
    <div data-row={k} className={cn('flex w-max items-center gap-8 whitespace-nowrap py-4', cls)}>
      {[...STRIP, ...STRIP, ...STRIP].map((t, i) => {
        const I = SPIN[i % SPIN.length]
        return <React.Fragment key={i}><span>{t}</span><I data-spin className="h-[0.7em] w-[0.7em] shrink-0" /></React.Fragment>
      })}
    </div>
  )
}
function AccentStrip() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('[data-row="a"]', { xPercent: 0 }, { xPercent: -25, ease: 'none', scrollTrigger: st })
      gsap.fromTo('[data-row="b"]', { xPercent: -25 }, { xPercent: 0, ease: 'none', scrollTrigger: st })
      gsap.to('[data-spin]', { rotation: 360, duration: 6, ease: 'none', repeat: -1 })
    })
  }, { scope: root })
  return (
    <section ref={root} aria-label="What Framekit feels like" className="relative overflow-hidden py-10">
      <p className="sr-only">{STRIP.join(', ')}</p>
      <div aria-hidden className="-rotate-2 bg-[#D9F95C] text-zinc-950 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.3)]">
        <StripRow k="a" cls="text-[clamp(1.75rem,1.2rem+2.4vw,3.5rem)] font-semibold tracking-[-0.05em]" />
      </div>
      <div aria-hidden className="-mt-2 rotate-1 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
        <StripRow k="b" cls="text-[clamp(1rem,0.9rem+0.6vw,1.4rem)] font-medium tracking-[-0.02em] py-3" />
      </div>
    </section>
  )
}

export default function Kinetic() {
  React.useEffect(() => {
    // Lazy chunk mounts after the hero pin exists: re-measure every trigger once fonts and art have settled.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <>
      <Feature />
      <TechMarquee />
      <Cascade />
      <TabSwap />
      <DepthField />
      <Bento />
      <DockBurst />
      <Stats />
      <AccentStrip />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  )
}
