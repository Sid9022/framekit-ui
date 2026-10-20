import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, RotateCcw } from 'lucide-react'
import { componentDocs } from '@/docs/registry'
import type { ParticleShape, ParticleMorphState } from '@/components/ui/particle-morph-loader'
import { cn } from '@/lib/cn'
import { focusRing } from './kit'
import { InstallPill } from './ShowcaseHero'
import { Faq, FinalCta, Footer } from './Sections'
import { btnGhost } from './SpecimenHero'
import { Live, mono } from './live'
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from './motion'

/* Heavy demos load on demand (their own chunks), and only mount near the viewport (<Live>). */
const lazyNamed = <K extends string>(load: () => Promise<Record<K, React.ComponentType<any>>>, name: K) =>
  React.lazy(() => load().then((m) => ({ default: m[name] })))
const ParticleMorphLoader = lazyNamed(() => import('@/components/ui/particle-morph-loader'), 'ParticleMorphLoader')
const LiquidMetalOrb = lazyNamed(() => import('@/components/ui/liquid-metal-orb'), 'LiquidMetalOrb')
const AuroraCoreOrb = lazyNamed(() => import('@/components/ui/aurora-core-orb'), 'AuroraCoreOrb')
const StarMorphBuddy = lazyNamed(() => import('@/components/ui/star-morph-buddy'), 'StarMorphBuddy')
const ShredderDeleteButton = lazyNamed(() => import('@/components/ui/shredder-delete-button'), 'ShredderDeleteButton')
const PullCordLampToggle = lazyNamed(() => import('@/components/ui/pull-cord-lamp-toggle'), 'PullCordLampToggle')
const ParticleHaloOrb = lazyNamed(() => import('@/components/ui/particle-halo-orb'), 'ParticleHaloOrb')
const MothLanternToggle = lazyNamed(() => import('@/components/ui/moth-lantern-toggle'), 'MothLanternToggle')
const CosmicSparkleToggle = lazyNamed(() => import('@/components/ui/cosmic-sparkle-toggle'), 'CosmicSparkleToggle')
const WatchfulEyeToggle = lazyNamed(() => import('@/components/ui/watchful-eye-toggle'), 'WatchfulEyeToggle')
const InkBloomToggle = lazyNamed(() => import('@/components/ui/ink-bloom-toggle'), 'InkBloomToggle')
const WeatherVaneToggle = lazyNamed(() => import('@/components/ui/weather-vane-toggle'), 'WeatherVaneToggle')
const TideglassToggle = lazyNamed(() => import('@/components/ui/tideglass-toggle'), 'TideglassToggle')

const wrap = 'mx-auto w-full max-w-[1440px] px-[max(1rem,env(safe-area-inset-left))] sm:px-8 lg:px-12'
const title = 'text-balance text-[clamp(2.1rem,1.1rem+3.6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--pi)]'
const serif = 'font-display font-normal italic tracking-[-0.02em]'
const body = 'text-pretty text-[clamp(1rem,0.95rem+0.25vw,1.15rem)] leading-relaxed text-[var(--pm)]'
const sheet = 'rounded-[28px] bg-[var(--pc)] ring-1 ring-[var(--pl)] shadow-[0_1px_2px_rgb(23_20_15/0.05),0_24px_48px_-28px_rgb(23_20_15/0.3)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]'
const chip = (on: boolean) => cn('min-h-11 rounded-full px-3.5 text-[13px] font-medium capitalize transition-[background-color,color,transform] duration-150 active:scale-[0.96] sm:min-h-9', on ? 'bg-[var(--pi)] text-[var(--pp)]' : 'text-[var(--pm)] ring-1 ring-[var(--pl)] hover:text-[var(--pi)] hover:ring-[var(--pls)]', focusRing)

function useRise(scope: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
        gsap.from(el.children, { y: 24, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%' } })
      })
    })
  }, { scope })
}

function Head({ no, kicker, children, id, lede, className }: { no: string; kicker: string; children: React.ReactNode; id: string; lede?: React.ReactNode; className?: string }) {
  return (
    <div data-rise className={className}>
      <p className={cn(mono, 'flex items-center gap-3 text-[var(--pm)]')}><span className="text-[#FF6B4A]">{no}</span><span aria-hidden className="h-px w-8 bg-[var(--pls)]" />{kicker}</p>
      <h2 id={id} className={cn(title, 'mt-4')}>{children}</h2>
      {lede && <p className={cn(body, 'mt-5 max-w-[44ch]')}>{lede}</p>}
    </div>
  )
}

/* ── 02 · The particle lab: one loader, every knob you'd want ─────────── */
const SHAPES: ParticleShape[] = ['sphere', 'ribbon', 'shell', 'tetra', 'ring', 'helix']
const TINTS = [{ n: 'Iris', c: '#a78bfa' }, { n: 'Glacier', c: '#7dd3fc' }, { n: 'Ember', c: '#fdba74' }, { n: 'Bloom', c: '#f9a8d4' }]
const STATES: ParticleMorphState[] = ['loading', 'done', 'error']
function ParticleLab() {
  const root = React.useRef<HTMLElement>(null)
  const [shape, setShape] = React.useState<ParticleShape | 'cycle'>('cycle')
  const [tint, setTint] = React.useState(TINTS[0])
  const [state, setState] = React.useState<ParticleMorphState>('loading')
  useRise(root)
  return (
    <section ref={root} aria-labelledby="lab-title" className={cn(wrap, 'grid items-center gap-10 py-[clamp(4rem,10vw,9rem)] lg:grid-cols-[0.85fr_1.15fr] lg:gap-16')}>
      <div>
        <Head no="02" kicker="Particle Morph Loader" id="lab-title" lede="Four hundred points that fold between six shapes while you wait. Pick one, change the ink, then tell it the job finished. Or failed. It handles both.">
          A loader worth <span className={cn(serif, 'text-[#7C5CFF] dark:text-[#a78bfa]')}>waiting</span> for.
        </Head>
        <div className="mt-8 space-y-4" role="group" aria-label="Loader controls">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Shape">
            {(['cycle', ...SHAPES] as const).map((s) => <button key={s} type="button" aria-pressed={shape === s} onClick={() => { setShape(s); setState('loading') }} className={chip(shape === s)}>{s === 'cycle' ? 'All six' : s}</button>)}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-1.5" role="group" aria-label="Tint">
              {TINTS.map((t) => (
                <button key={t.n} type="button" aria-pressed={tint.n === t.n} aria-label={t.n} onClick={() => setTint(t)} className={cn('grid h-11 w-11 place-items-center rounded-full transition-transform active:scale-90', focusRing)}>
                  <span className={cn('h-7 w-7 rounded-full ring-offset-2 ring-offset-[var(--pp)] transition-shadow', tint.n === t.n && 'ring-2 ring-[var(--pi)]')} style={{ background: t.c }} />
                </button>
              ))}
            </div>
            <div className="flex gap-1.5" role="group" aria-label="State">
              {STATES.map((s) => <button key={s} type="button" aria-pressed={state === s} onClick={() => setState(s)} className={chip(state === s)}>{s}</button>)}
            </div>
          </div>
        </div>
      </div>
      <div className="dark relative grid aspect-square w-full place-items-center overflow-hidden rounded-[28px] bg-[radial-gradient(60%_60%_at_50%_45%,#1c1830,#09080c_75%)] ring-1 ring-white/10 sm:aspect-[5/4]">
        <Live className="grid h-full w-full place-items-center">
          <ParticleMorphLoader key={shape} shapes={shape === 'cycle' ? SHAPES : [shape]} color={tint.c} state={state} size={340} onRetry={() => setState('loading')} className="max-sm:scale-[0.85]" />
        </Live>
        <span className={cn(mono, 'absolute left-4 top-4 text-white/45')}>No. 002 · canvas · {shape === 'cycle' ? '6 shapes' : shape}</span>
      </div>
    </section>
  )
}

/* ── 03 · Switchboard: seven toggles and one switch that flips them all ── */
type T = { slug: string; name: string; C: React.ComponentType<any> }
const BOARD: T[] = [
  { slug: 'moth-lantern-toggle', name: 'Moth Lantern', C: MothLanternToggle },
  { slug: 'watchful-eye-toggle', name: 'Watchful Eye', C: WatchfulEyeToggle },
  { slug: 'cosmic-sparkle-toggle', name: 'Cosmic Sparkle', C: CosmicSparkleToggle },
  { slug: 'ink-bloom-toggle', name: 'Ink Bloom', C: InkBloomToggle },
  { slug: 'weather-vane-toggle', name: 'Weather Vane', C: WeatherVaneToggle },
  { slug: 'tideglass-toggle', name: 'Tideglass', C: TideglassToggle },
]
function Switchboard() {
  const root = React.useRef<HTMLElement>(null)
  const [on, setOn] = React.useState<boolean[]>(() => BOARD.map(() => false))
  const timers = React.useRef<number[]>([])
  useRise(root)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.from('[data-cell]', { y: 60, rotation: (i) => (i % 2 ? 4 : -4), opacity: 0, duration: 0.9, ease: 'back.out(1.3)', stagger: { each: 0.06, from: 'start' }, scrollTrigger: { trigger: '[data-board]', start: 'top 80%' } })
    })
  }, { scope: root })
  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const count = on.filter(Boolean).length
  const all = count === BOARD.length
  const flipAll = () => {
    timers.current.forEach(clearTimeout)
    const to = !all
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    BOARD.forEach((_, i) => {
      timers.current[i] = window.setTimeout(() => setOn((p) => p.map((v, j) => (j === i ? to : v))), reduce ? 0 : i * 110)
    })
  }
  return (
    <section ref={root} aria-labelledby="board-title" className={cn(wrap, 'py-[clamp(3rem,8vw,7rem)]')}>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Head no="03" kicker="Toggles" id="board-title" lede="A switch is the smallest thing on a page and the one people touch most. These are worth the touch.">
          Go on, <span className={cn(serif, 'text-[#2B5BFF] dark:text-[#8FA8FF]')}>flip</span> one.
        </Head>
        <div className={cn(sheet, 'flex shrink-0 items-center gap-4 rounded-full py-1.5 pl-5 pr-1.5')}>
          <p className="text-[14px] text-[var(--pm)]" aria-live="polite"><span className="font-mono font-medium tabular-nums text-[var(--pi)]">{count}/{BOARD.length}</span> on</p>
          <button type="button" onClick={flipAll} className={cn('inline-flex min-h-11 items-center gap-2 rounded-full bg-[#FF6B4A] px-5 text-[14px] font-semibold text-white transition-transform active:scale-[0.97] hover:brightness-105', focusRing)}>{all ? 'Lights out' : 'Flip them all'}</button>
        </div>
      </div>
      <ul data-board className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
        {BOARD.map((t, i) => (
          <li key={t.slug} data-cell className={cn(sheet, 'relative flex min-h-[180px] flex-col overflow-hidden p-3 sm:min-h-[240px] lg:min-h-[280px] transition-colors duration-500 sm:p-4', on[i] && 'bg-[color-mix(in_oklab,var(--pc),#FFC56B_16%)]')}>
            <div className="flex items-start justify-between gap-2">
              <span className={cn(mono, 'text-[10px] text-[var(--pm)] sm:text-[11px]')}>0{i + 1} · {on[i] ? 'on' : 'off'}</span>
              <Link to={`/docs/${t.slug}`} aria-label={`${t.name} docs`} className={cn('-m-2 grid h-11 w-11 place-items-center rounded-full text-[var(--pm)] hover:text-[var(--pi)]', focusRing)}><ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <Live className="grid flex-1 place-items-center [&>*]:scale-[1.15] sm:[&>*]:scale-[1.5] lg:[&>*]:scale-[1.8]">
              <t.C checked={on[i]} onCheckedChange={(v: boolean) => setOn((p) => p.map((x, j) => (j === i ? v : x)))} aria-label={t.name} />
            </Live>
            <p className="text-[14px] font-medium tracking-[-0.01em] text-[var(--pi)] sm:text-[15px]">{t.name}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ── 04 · Cabinet: pinned horizontal drawer of oddities (native swipe on phones) ── */
const DRAWER: { slug: string; name: string; note: string; tone: 'dark' | 'light'; bg: string; node: React.ReactNode }[] = [
  { slug: 'liquid-metal-orb', name: 'Liquid Metal Orb', note: 'Tap it. It changes mood.', tone: 'dark', bg: 'radial-gradient(70% 70% at 50% 40%,#2a2a33,#0b0b0e)', node: <LiquidMetalOrb /> },
  { slug: 'pull-cord-lamp-toggle', name: 'Pull-cord Lamp', note: 'Drag the cord down and let go.', tone: 'light', bg: '#F3E9D8', node: <PullCordLampToggle /> },
  { slug: 'star-morph-buddy', name: 'Star Morph Buddy', note: 'A helper who wakes up when you click.', tone: 'dark', bg: 'radial-gradient(90% 80% at 50% 20%,#1a1740,#07060f)', node: <StarMorphBuddy onActivate={() => new Promise((r) => setTimeout(r, 1400))} /> },
  { slug: 'shredder-delete-button', name: 'Shredder Delete', note: 'Deleting a file, but satisfying.', tone: 'light', bg: '#EDEBF5', node: <ShredderDeleteButton variant="violet" /> },
  { slug: 'aurora-core-orb', name: 'Aurora Core Orb', note: 'Click to switch what it is doing.', tone: 'dark', bg: 'radial-gradient(70% 70% at 50% 40%,#13202a,#06090c)', node: <AuroraCoreOrb /> },
  { slug: 'particle-halo-orb', name: 'Particle Halo Orb', note: 'A voice assistant, minus the voice.', tone: 'dark', bg: 'radial-gradient(70% 70% at 50% 40%,#221a2e,#08070b)', node: <ParticleHaloOrb /> },
]
function Cabinet() {
  const root = React.useRef<HTMLElement>(null)
  const track = React.useRef<HTMLUListElement>(null)
  const [p, setP] = React.useState(0)
  useGSAP(() => {
    gsap.matchMedia().add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
      const t = track.current!
      const dist = () => t.scrollWidth - t.clientWidth
      gsap.to(t, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top+=64', end: () => `+=${dist()}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: (s) => setP(s.progress) },
      })
      gsap.from('[data-plate]', { y: 80, rotation: (i) => (i % 2 ? 3 : -3), opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      t.style.overflow = 'visible'
      return () => { t.style.overflow = '' }
    })
  }, { scope: root })
  React.useEffect(() => {
    const t = track.current
    if (!t) return
    const on = () => { if (t.style.overflow !== 'visible') setP(t.scrollLeft / Math.max(1, t.scrollWidth - t.clientWidth)) }
    t.addEventListener('scroll', on, { passive: true })
    return () => t.removeEventListener('scroll', on)
  }, [])
  const step = (d: number) => {
    const t = track.current
    if (!t) return
    if (t.style.overflow === 'visible') {
      const st = ScrollTrigger.getAll().find((s) => s.trigger === root.current)
      if (st) window.scrollTo({ top: st.start + (st.end - st.start) * Math.min(1, Math.max(0, p + d / (DRAWER.length - 1))), behavior: 'smooth' })
      return
    }
    t.scrollBy({ left: d * ((t.querySelector('li') as HTMLElement)?.offsetWidth + 16), behavior: 'smooth' })
  }
  const nav = cn('grid h-11 w-11 place-items-center rounded-full text-[var(--pi)] ring-1 ring-[var(--pls)] transition-colors hover:bg-[var(--pi)] hover:text-[var(--pp)] disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-[var(--pi)]', focusRing)
  return (
    <section ref={root} aria-labelledby="cab-title" className="overflow-hidden py-[clamp(3rem,6vw,5rem)] lg:flex lg:min-h-[calc(100svh-4rem)] lg:flex-col lg:justify-center">
      <div className={cn(wrap, 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between')}>
        <Head no="04" kicker="The odd drawer" id="cab-title" lede="Orbs, mascots, a lamp with a cord. The pieces people screenshot. Each one is live, so poke at it.">
          Things that <span className={cn(serif, 'text-[#FF6B4A]')}>shouldn't</span> be this fun.
        </Head>
        <div className="flex items-center gap-2">
          <button type="button" className={nav} onClick={() => step(-1)} disabled={p <= 0.01} aria-label="Previous"><ArrowLeft className="h-4 w-4" aria-hidden /></button>
          <button type="button" className={nav} onClick={() => step(1)} disabled={p >= 0.99} aria-label="Next"><ArrowRight className="h-4 w-4" aria-hidden /></button>
          <div aria-hidden className="ml-2 h-[3px] w-24 overflow-hidden rounded-full bg-[var(--pl)]"><div className="h-full rounded-full bg-[var(--pi)]" style={{ width: `${Math.max(8, p * 100)}%` }} /></div>
        </div>
      </div>
      <ul ref={track} aria-label="Component drawer" className={cn(wrap, 'mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] lg:snap-none [&::-webkit-scrollbar]:hidden')}>
        {DRAWER.map((d, i) => (
          <li key={d.slug} data-plate className="w-[min(82vw,400px)] shrink-0 snap-center lg:w-[min(30vw,440px)]">
            <div className={cn(d.tone, 'relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[28px] ring-1 ring-black/[0.06] dark:ring-white/10')} style={{ background: d.bg }}>
              <span className={cn(mono, 'absolute left-4 top-4', d.tone === 'dark' ? 'text-white/45' : 'text-black/45')}>No. 0{i + 5}</span>
              <Live className="grid h-full w-full place-items-center p-6">{d.node}</Live>
            </div>
            <div className="mt-3 flex items-start justify-between gap-3 px-1">
              <div>
                <p className="text-[16px] font-medium tracking-[-0.02em] text-[var(--pi)]">{d.name}</p>
                <p className="text-[14px] text-[var(--pm)]">{d.note}</p>
              </div>
              <Link to={`/docs/${d.slug}`} className={cn('-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[var(--pm)] hover:text-[var(--pi)]', focusRing)} aria-label={`${d.name} docs`}><ArrowUpRight className="h-4 w-4" aria-hidden /></Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ── 05 · The line: words ink in as you read them ──────────────────────── */
const LINE = 'Nothing on this page is a recording. Every skull, swarm and switch you just played with is the same file you would paste into your app tonight.'
function Line() {
  const root = React.useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.fromTo('[data-w]', { opacity: 0.18 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 45%', scrub: true } })
    })
  }, { scope: root })
  return (
    <section ref={root} aria-label="Why it matters" className={cn(wrap, 'py-[clamp(4rem,10vw,9rem)]')}>
      <p className="mx-auto max-w-[22ch] text-balance text-center text-[clamp(1.9rem,1rem+3.4vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.045em] text-[var(--pi)]">
        {LINE.split(' ').map((w, i) => <React.Fragment key={i}><span data-w className={w.startsWith('recording') ? cn(serif, 'text-[#FF6B4A]') : undefined}>{w}</span>{' '}</React.Fragment>)}
      </p>
    </section>
  )
}

/* ── 06 · How: three steps, one command ───────────────────────────────── */
const STEPS = [
  { t: 'Find one', d: 'Browse by shelf or hit ⌘ K and type what you need.' },
  { t: 'Run the line', d: 'The shadcn CLI drops the source and its deps into your project.' },
  { t: 'Make it yours', d: 'It is a plain .tsx file. Change the colours, the timing, the copy.' },
]
function How() {
  const root = React.useRef<HTMLElement>(null)
  useRise(root)
  return (
    <section ref={root} aria-labelledby="how-title" className={cn(wrap, 'grid gap-10 pb-[clamp(3rem,8vw,6rem)] lg:grid-cols-2 lg:items-center')}>
      <div>
        <Head no="06" kicker="Install" id="how-title">Three steps. <span className="text-[var(--pm)]">One is copy.</span></Head>
        <ol data-rise className="mt-8 space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--pi)] font-mono text-[13px] font-medium text-[var(--pp)]">{i + 1}</span>
              <div><p className="font-medium text-[var(--pi)]">{s.t}</p><p className="text-[15px] text-[var(--pm)]">{s.d}</p></div>
            </li>
          ))}
        </ol>
      </div>
      <div className={cn(sheet, 'grid min-w-0 gap-5 p-4 sm:p-8')}>
        <p className={cn(mono, 'text-[var(--pm)]')}>Try it, it copies</p>
        <div className="min-w-0"><InstallPill paused={false} /></div>
        <div className="flex flex-wrap gap-2">
          <Link to="/docs/installation" className={btnGhost}>Full install guide</Link>
          <Link to="/docs/ghost-gobbler-skull" className={btnGhost}><RotateCcw className="h-4 w-4" aria-hidden /> Grab the skull</Link>
        </div>
        <p className="text-[13px] text-[var(--pm)]"><span className="tabular-nums">{componentDocs.length}</span> components, MIT licensed, no account.</p>
      </div>
    </section>
  )
}

export default function Lab() {
  React.useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 700)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <>
      <ParticleLab />
      <Switchboard />
      <Cabinet />
      <Line />
      <How />
      <Faq />
      <FinalCta />
      <Footer />
    </>
  )
}
