import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { focusRing } from './kit'
import { gsap, MOTION_OK, REDUCED, useGSAP } from './motion'
import { mono, useBoxWidth } from './live'

const Skull = React.lazy(() => import('@/components/ui/ghost-gobbler-skull').then((m) => ({ default: m.GhostGobblerSkull })))
const GHOSTS = 8

export const btnInk = cn(
  'inline-flex min-h-11 touch-manipulation select-none items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[var(--pi)] px-5 text-[15px] font-medium text-[var(--pp)] shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.97] motion-reduce:active:scale-100',
  focusRing,
)
export const btnGhost = cn(
  'inline-flex min-h-11 touch-manipulation select-none items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-[15px] font-medium text-[var(--pi)] ring-1 ring-[var(--pls)] transition-[transform,background-color] duration-150 hover:bg-[var(--pi)]/[0.06] active:scale-[0.97] motion-reduce:active:scale-100',
  focusRing,
)

/**
 * Hero: the headline on one side, a dark specimen case on the other. The case holds the real Ghost Gobbler Skull.
 * Scrolling through the pinned hero feeds it: scroll progress is its loading progress, eight ghosts, then the finale.
 */
export function SpecimenHero({ count }: { count: number }) {
  const root = React.useRef<HTMLElement>(null)
  const [fed, setFed] = React.useState(0)
  const [reduced, setReduced] = React.useState(false)
  const [stage, sw] = useBoxWidth<HTMLDivElement>()
  const size = Math.round(Math.max(110, Math.min(240, sw / 2.15)))

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.timeline({ delay: 0.05 })
        .from('[data-hline] > span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.08 })
        .from('[data-hcase]', { y: 60, rotation: 3, scale: 0.94, opacity: 0, duration: 1.2, ease: 'expo.out' }, 0.15)
        .from('[data-hfade]', { y: 14, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 0.4)
      const tl = gsap.timeline({
        scrollTrigger: {
          // Wide screens pin the hero and feed the skull in place. Phones (where the case sits under the copy) feed it as it scrolls past.
          ...(innerWidth >= 1024
            ? { trigger: root.current, start: 'top top+=64', end: () => `+=${innerHeight * 1.1}`, pin: true, anticipatePin: 1 }
            : { trigger: '[data-hcase]', start: 'top 75%', end: 'bottom 25%' }),
          scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: (st) => setFed(Math.min(GHOSTS, Math.floor(st.progress * 1.12 * GHOSTS + 0.0001))),
        },
      })
      tl.to('[data-hcase]', { rotation: -1.5, scale: 1.03, ease: 'none' }, 0)
        .to('[data-hcopy]', { y: -24, ease: 'none' }, 0)
        .to('[data-hcue]', { opacity: 0, duration: 0.15 }, 0)
        .fromTo('[data-hdone]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15 }, 0.85)
    })
    mm.add(REDUCED, () => { setReduced(true); setFed(GHOSTS) })
  }, { scope: root })

  const done = fed >= GHOSTS
  return (
    <section ref={root} aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[1440px] items-center gap-8 px-[max(1rem,env(safe-area-inset-left))] py-[clamp(1.5rem,5svh,4rem)] sm:px-8 max-lg:content-center max-lg:gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:px-12">
        <div data-hcopy className="relative z-10 max-lg:contents">
          <p data-hfade className={cn(mono, 'flex items-center gap-2 text-[var(--pm)] max-lg:order-1')}>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />
            Framekit UI · <span className="tabular-nums">{count}</span> live specimens
          </p>
          <h1 id="hero-title" data-hline className="mt-5 text-[clamp(2.6rem,1.2rem+5vw,6.5rem)] max-lg:order-2 max-lg:-mt-2 max-lg:max-w-[12ch] font-semibold leading-[0.92] tracking-[-0.055em] text-[var(--pi)]">
            <span className="block overflow-hidden pb-[0.08em]"><span className="block">One library.</span></span>
            <span className="block overflow-hidden pb-[0.08em]"><span className="block">Every interface, <span className="font-display font-normal italic tracking-[-0.02em] text-[#FF6B4A]">alive.</span></span></span>
          </h1>
          <p data-hfade className="mt-6 max-w-[42ch] max-lg:order-4 max-lg:mt-0 text-pretty text-[clamp(1rem,0.95rem+0.3vw,1.2rem)] leading-relaxed text-[var(--pm)]">
            React components with the motion already in them. Skulls that eat ghosts, particles that change shape, switches you'll want to flip twice. Copy the file and it's yours.
          </p>
          <div data-hfade className="mt-8 flex flex-wrap items-center gap-2 max-lg:order-5 max-lg:mt-0">
            <Link to="/docs/introduction" className={btnInk}>Browse components <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <Link to="/docs/installation" className={btnGhost}>Install in one line</Link>
          </div>
        </div>

        <figure data-hcase className="relative mx-auto w-full max-w-[620px] will-change-transform max-lg:order-3">
          <div className="dark relative overflow-hidden rounded-[28px] bg-[#0E0D12] p-2 shadow-[0_2px_4px_rgb(23_20_15/0.12),0_40px_80px_-30px_rgb(23_20_15/0.55)] ring-1 ring-black/10 dark:ring-white/10">
            <div className="flex items-center justify-between px-3 pb-2 pt-1.5">
              <span className={cn(mono, 'text-white/50')}>No. 001</span>
              <span className={cn(mono, 'text-white/50')}>Ghost Gobbler Skull</span>
            </div>
            <div ref={stage} className="relative grid aspect-[5/4] place-items-center overflow-hidden rounded-[20px] bg-[radial-gradient(70%_60%_at_50%_45%,#231c33,#0a090d_75%)]">
              <div aria-hidden className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />
              {sw > 0 && (
                <React.Suspense fallback={null}>
                  <Skull mode="determinate" progress={reduced ? 1 : fed / GHOSTS} total={GHOSTS} size={size} spread={1.7} showLabel={false} label="Hero skull" />
                </React.Suspense>
              )}
            </div>
            <figcaption className="flex min-h-11 items-center justify-between gap-3 px-3 pt-2 text-[13px] text-white/70">
              <span className="relative">
                <span data-hcue className="inline-flex items-center gap-1.5"><ArrowDown className="h-3.5 w-3.5 motion-safe:animate-bounce" aria-hidden /> Scroll to feed it</span>
                <span data-hdone className={cn('absolute left-0 top-0 whitespace-nowrap text-[#D9F95C]', !done && 'opacity-0')}>Full. That was a loading bar.</span>
              </span>
              <span className="font-mono tabular-nums text-white" aria-live="polite">{fed}/{GHOSTS} ghosts</span>
            </figcaption>
          </div>
          <span aria-hidden className="absolute -left-1 -top-3 -rotate-6 sm:top-10 rounded-full bg-[#D9F95C] px-3 py-1.5 text-[12px] font-semibold text-zinc-950 shadow-lg sm:-left-6">eyes follow you</span>
          <span aria-hidden className="absolute -right-1 bottom-16 rotate-3 rounded-full bg-[#2B5BFF] px-3 py-1.5 text-[12px] font-semibold text-white shadow-lg sm:-right-5">click it to chomp</span>
        </figure>
      </div>
    </section>
  )
}
