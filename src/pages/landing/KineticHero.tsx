import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { FitArt, focusRing, pillDark, pillLight, surface } from './kit'
import { SHOW } from './ShowcaseHero'
import { gsap, MOTION_OK, REDUCED, useGSAP } from './motion'

type Card = (typeof SHOW)[number]
const pick = (slug: string, bg?: string): Card => { const c = SHOW.find((x) => x.slug === slug)!; return bg ? { ...c, bg } : c }
/* Five vivid squares, left to right. The centre card is the hero. */
const CARDS = [
  pick('wallet-balance-card'),
  pick('goal-progress-card'),
  pick('neon-halo-card'),
  pick('dynamic-status-island', '#FFB547'),
  pick('contribution-heatmap-tile'),
]

/* One straight line: centres share y = 0, origin is the card centre (no arch). Step is 0.625 × card width (≈7.5vw at 12vw). */
const SPREAD = [
  { k: -2, r: -13, s: 0.8, z: 1 },
  { k: -1, r: -7, s: 0.9, z: 2 },
  { k: 0, r: 0, s: 1, z: 3 },
  { k: 1, r: 7, s: 0.9, z: 2 },
  { k: 2, r: 13, s: 0.8, z: 1 },
]
const TAGS = [
  { t: 'Springs, not keyframes', pos: 'left-[calc(50%-var(--cw)*0.625-var(--cw)*0.42)] -translate-x-full max-sm:left-[calc(50%-var(--cw)*0.06)]', c: 'bg-[#D9F95C] text-zinc-950' },
  { t: 'Light + dark', pos: 'left-[calc(50%+var(--cw)*0.625+var(--cw)*0.42)] max-sm:left-[calc(50%+var(--cw)*0.06)]', c: 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' },
]

export function KineticHero({ count }: { count: number }) {
  const root = React.useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-hcard]')
    const center = cards[2]
    const others = cards.filter((_, i) => i !== 2)
    const spreadOf = (el: HTMLElement) => SPREAD[cards.indexOf(el)]
    const step = () => center.offsetWidth * 0.625
    const final = (els: HTMLElement[]) => ({ x: (i: number) => spreadOf(els[i]).k * step(), y: 0, rotation: (i: number) => spreadOf(els[i]).r, scale: (i: number) => spreadOf(els[i]).s })
    const mm = gsap.matchMedia()
    gsap.set(cards, { transformOrigin: '50% 50%' })

    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({ delay: 0.1 })
      tl.from('[data-hcopy] > *', { y: 24, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07 })
        // 1 · the centre card drops in on a spring
        .fromTo(center, { y: -140, scale: 0.7, rotation: -6, opacity: 0 }, { y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.72)' }, 0.3)
        // 2 · the rest wait behind it, then slide out along the line
        .set(others, { x: 0, y: 0, rotation: 0, scale: 0.86, opacity: 0 }, 0)
        .to(others, { opacity: 1, duration: 0.2 }, 0.75)
        .to(others, { ...final(others), duration: 0.95, ease: 'back.out(1.15)', stagger: { each: 0.04, from: 'center' } }, 0.75)
        .from('[data-htag]', { scale: 0, opacity: 0, y: 12, duration: 0.6, ease: 'back.out(3)', stagger: 0.1 }, 1.35)
      gsap.utils.toArray<HTMLElement>('[data-htag]').forEach((t, i) => gsap.to(t, { y: i ? 6 : -6, duration: 2.8 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.2 }))
      // Scrolls away normally; the row just drifts up a touch slower than the page for depth.
      gsap.to('[data-hrow]', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 64px', end: 'bottom top', scrub: 1 } })
      const onResize = () => { if (!tl.isActive()) gsap.set(others, final(others)) }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    })

    mm.add(REDUCED, () => {
      gsap.set(cards, final(cards))
      const onResize = () => gsap.set(cards, final(cards))
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    })
  }, { scope: root })

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative flex h-[calc(100svh-4rem)] min-h-[500px] flex-col overflow-hidden">
      <div data-hcopy className="relative z-20 mx-auto flex max-w-[1100px] flex-col items-center px-6 pt-[clamp(0.75rem,3.5svh,4.5rem)] text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-700 shadow-[0_1px_2px_rgb(0_0_0/0.06)] ring-1 ring-black/[0.06] dark:bg-white/[0.06] dark:text-zinc-300 dark:ring-white/10">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#2B5BFF]" />
          <span className="tabular-nums">{count}</span> components · free and open source
        </p>
        <h1 id="hero-title" className="mt-[clamp(0.75rem,2.2svh,1.5rem)] max-w-[13ch] text-balance text-[clamp(2.4rem,min(1.4rem+5.2vw,10.5svh),6.75rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-zinc-950 dark:text-white">
          One library. Every interface, alive.
        </h1>
        <p className="mt-[clamp(0.75rem,2.2svh,1.5rem)] max-w-[46ch] text-pretty text-[clamp(0.95rem,min(0.9rem+0.25vw,2.4svh),1.15rem)] leading-relaxed text-zinc-600 dark:text-zinc-400">
          React components that move like they mean it. Copy one command, the source lands in your repo, and it's yours to bend.
        </p>
        <div className="mt-[clamp(1rem,3svh,2rem)] flex flex-wrap items-center justify-center gap-3">
          <Link to="/docs/introduction" className={pillDark}>Browse components <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          <Link to="/docs/installation" className={cn(pillLight, 'max-sm:hidden')}>Install guide</Link>
        </div>
      </div>

      {/* Card row: sized by the space left under the CTAs (cqh), so it never rides up into the copy. */}
      <div className="pointer-events-none relative z-10 mt-[clamp(0.5rem,3svh,2.5rem)] min-h-[170px] flex-1 [container-type:size]">
        <div data-hrow className="absolute inset-0 [--cw:min(clamp(124px,12vw,272px),calc(100cqh-3.75rem))] max-sm:[--cw:min(36vw,calc(100cqh-3.75rem))]">
          <div className="absolute inset-x-0 top-[calc(2.25rem+var(--cw)/2+(100cqh-var(--cw)-3.75rem)*0.3)]">
            {CARDS.map((c, i) => {
              const s = surface(c.bg)
              return (
                <Link
                  key={c.slug}
                  to={`/docs/${c.slug}`}
                  data-hcard
                  tabIndex={-1}
                  aria-hidden
                  className={cn('group pointer-events-auto absolute left-1/2 top-0 -ml-[calc(var(--cw)/2)] -mt-[calc(var(--cw)/2)] block aspect-square w-[var(--cw)] will-change-transform', focusRing)}
                  style={{ zIndex: SPREAD[i].z }}
                >
                  <span className={cn('block h-full rounded-[clamp(18px,1.9vw,30px)] p-[clamp(5px,0.5vw,8px)] shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_1px_2px_rgb(0_0_0/0.06),0_14px_28px_-14px_rgb(0_0_0/0.22),0_40px_70px_-34px_rgb(0_0_0/0.45)] ring-1 ring-black/[0.06] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_40px_70px_-30px_rgb(0_0_0/0.85)] dark:ring-white/10 [@media(hover:hover)]:group-hover:-translate-y-2.5 motion-reduce:transition-none', s.className)} style={s.style}>
                    <FitArt design={c.design} fill={0.9} className="h-full rounded-[clamp(14px,1.5vw,23px)]">{c.art}</FitArt>
                  </span>
                </Link>
              )
            })}
            {TAGS.map((t) => (
              <span key={t.t} data-htag aria-hidden className={cn('absolute top-[calc(var(--cw)*-0.5-0.5rem)] max-sm:top-[calc(var(--cw)*-0.5-1.6rem)] z-20 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold tracking-[-0.01em] shadow-[0_8px_24px_-8px_rgb(0_0_0/0.3)] sm:px-3.5 sm:py-2 sm:text-[13.5px]', t.pos, t.c)}>
                {t.t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
