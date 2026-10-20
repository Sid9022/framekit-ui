import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { FitArt, focusRing } from './kit'
import { AuroraCoreOrb, CosmicSparkleToggle, GhostGobblerSkull, LiquidMetalOrb, MothLanternToggle, ParticleMorphLoader, StarMorphBuddy } from './live-parts'
import { gsap, MOTION_OK, useGSAP } from './motion'

type Card = { slug: string; label: string; bg: string; design: number | 'auto'; art: React.ReactNode; dark?: boolean }
const noop = () => {}
/* Seven live standouts, left to right. The skull holds the middle. */
export const HERO_CARDS: Card[] = [
  { slug: 'particle-morph-loader', label: 'Particle Morph Loader', bg: '#16131F', dark: true, design: 'auto', art: <ParticleMorphLoader size={200} showLabel={false} points={260} /> },
  { slug: 'cosmic-sparkle-toggle', label: 'Cosmic Sparkle Toggle', bg: '#CDBDFF', design: 'auto', art: <CosmicSparkleToggle checked onCheckedChange={noop} aria-label="Cosmic sparkle" /> },
  { slug: 'liquid-metal-orb', label: 'Liquid Metal Orb', bg: '#E9E6DF', design: 'auto', art: <LiquidMetalOrb /> },
  { slug: 'ghost-gobbler-skull', label: 'Ghost Gobbler Skull', bg: '#0E0D12', dark: true, design: 'auto', art: <GhostGobblerSkull mode="indeterminate" size={150} spread={1.6} showLabel={false} interactive={false} label="Ghost Gobbler Skull" /> },
  { slug: 'moth-lantern-toggle', label: 'Moth Lantern Toggle', bg: '#FFC56B', design: 'auto', art: <MothLanternToggle checked onCheckedChange={noop} aria-label="Moth lantern" /> },
  { slug: 'aurora-core-orb', label: 'Aurora Core Orb', bg: '#0B1418', dark: true, design: 'auto', art: <AuroraCoreOrb /> },
  { slug: 'star-morph-buddy', label: 'Star Morph Buddy', bg: '#2B5BFF', dark: true, design: 'auto', art: <StarMorphBuddy interactive={false} /> },
]
const LAY = [
  { r: -7, y: 0.05 },
  { r: 4, y: -0.03 },
  { r: -3, y: 0.04 },
  { r: 2, y: -0.04 },
  { r: -4, y: 0.03 },
  { r: 5, y: -0.02 },
  { r: -6, y: 0.04 },
]

export const paperBtnInk = cn(
  'inline-flex min-h-11 touch-manipulation select-none items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--pi)] px-5 text-[15px] font-medium text-[var(--pp)] transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.97] motion-reduce:active:scale-100',
  focusRing,
)
export const paperBtnGhost = cn(
  'inline-flex min-h-11 touch-manipulation select-none items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-[15px] font-medium text-[var(--pi)] transition-[transform,background-color] duration-150 hover:bg-[var(--pi)]/[0.06] active:scale-[0.97] motion-reduce:active:scale-100',
  focusRing,
)

export function PaperHero({ count }: { count: number }) {
  const root = React.useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-pcard]')
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({ delay: 0.05 })
      tl.from('[data-ptitle] > span > span', { yPercent: 105, duration: 1, ease: 'power4.out', stagger: 0.06 })
        // Dealt from a single pile in the middle, left to right.
        .from(cards, { x: (i) => (3 - i) * 40, y: 60, rotation: 0, scale: 0.8, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.055 }, 0.2)
        .from('[data-ptag]', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(3)', stagger: 0.12 }, 0.9)
        .from('[data-pfoot] > *', { y: 18, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.07 }, 0.45)
      // Scroll away: the row loosens (outer cards drift further out) while the title lifts.
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.8 } })
        .to(cards, { x: (i) => (i - 3) * Math.min(26, innerWidth * 0.012), y: (i) => -40 - Math.abs(i - 3) * 14, rotation: (i) => LAY[i].r * 1.8, ease: 'none' }, 0)
        .to('[data-ptitle]', { y: -60, opacity: 0.2, ease: 'none' }, 0)
    })
  }, { scope: root })

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative flex h-[calc(100svh-4rem)] min-h-[540px] max-h-[1100px] max-sm:h-auto max-sm:min-h-0 max-sm:pt-8 flex-col items-center overflow-hidden px-4 pb-[clamp(1rem,4svh,3rem)] pt-[clamp(1rem,5svh,4rem)] text-center">
      <h1 id="hero-title" data-ptitle className="max-w-[15ch] text-balance text-[clamp(2.5rem,min(1.2rem+5vw,9.5svh),6.5rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[var(--pi)]">
        <span className="block overflow-hidden pb-[0.06em]"><span className="block">One library.</span></span>
        <span className="block overflow-hidden pb-[0.06em]"><span className="block">Every interface, alive.</span></span>
      </h1>

      {/* Card row: sized from the space it gets (cqh) and the screen width (cqw), so seven cards always fit with a 14px edge. */}
      <div className="pointer-events-none relative my-[clamp(0.5rem,2svh,1.5rem)] w-full min-h-[120px] flex-1 max-sm:my-2 max-sm:h-[58vw] max-sm:flex-none [container-type:size]">
        <div className="absolute left-1/2 top-1/2 [--st:0.74] [--cw:min(15vw,62cqh,calc((100cqw-28px)/5.6),300px)] max-sm:[--st:0.44] max-sm:[--cw:min(62cqh,calc((100cqw-28px)/3.8))]">
          {HERO_CARDS.map((c, i) => {
            return (
              <Link
                key={c.slug}
                to={`/docs/${c.slug}`}
                data-pcard
                tabIndex={-1}
                aria-hidden
                className="group pointer-events-auto absolute left-0 top-0 block aspect-square w-[var(--cw)] will-change-transform"
                style={{ zIndex: i + 1, marginLeft: `calc(var(--cw) * (${i - 3} * var(--st) - 0.5))`, marginTop: `calc(var(--cw) * ${LAY[i].y - 0.5})`, transform: `rotate(${LAY[i].r}deg)` }}
              >
                <span className={cn('block h-full rounded-[clamp(10px,calc(var(--cw)*0.08),20px)] p-[clamp(3px,calc(var(--cw)*0.03),7px)] shadow-[0_1px_2px_rgb(23_20_15/0.08),0_12px_28px_-12px_rgb(23_20_15/0.35)] ring-1 ring-black/[0.06] transition-transform overflow-hidden duration-500 ease-[cubic-bezier(.16,1,.3,1)] dark:shadow-[0_18px_40px_-16px_rgb(0_0_0/0.9)] dark:ring-white/10 [@media(hover:hover)]:group-hover:-translate-y-3 [@media(hover:hover)]:group-hover:scale-[1.04] motion-reduce:transition-none', c.dark ? 'dark' : 'light')} style={{ background: c.bg }}>
                  <FitArt design={c.design} fill={0.86} className="h-full rounded-[clamp(8px,calc(var(--cw)*0.06),15px)]"><React.Suspense fallback={<span className="block h-10 w-10" />}>{c.art}</React.Suspense></FitArt>
                </span>
              </Link>
            )
          })}
          <span data-ptag aria-hidden className="absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2B5BFF] px-2.5 py-1 font-mono text-[11px] font-medium text-white shadow-lg sm:text-[12.5px]" style={{ left: 'calc(var(--cw) * var(--st) * 0.35)', top: 'calc(var(--cw) * -0.66)' }}>@eats-ghosts</span>
          <span data-ptag aria-hidden className="absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#D9F95C] px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-950 shadow-lg sm:text-[12.5px]" style={{ left: 'calc(var(--cw) * var(--st) * -2.1)', top: 'calc(var(--cw) * -0.7)' }}>@flip-me</span>
        </div>
      </div>

      <div data-pfoot className="flex flex-col items-center">
        <p className="max-w-[40ch] text-pretty text-[clamp(0.95rem,min(0.9rem+0.3vw,2.4svh),1.15rem)] leading-snug text-[var(--pm)]">
          Every card up there is running live. <span className="tabular-nums">{count}</span> React components like them, and each one is a file you copy and own.
        </p>
        <div className="mt-[clamp(0.75rem,2.5svh,1.5rem)] flex flex-wrap items-center justify-center gap-2">
          <Link to="/docs/introduction" className={paperBtnInk}>Browse components</Link>
          <Link to="/docs/installation" className={paperBtnGhost}>How install works <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </div>
    </section>
  )
}
