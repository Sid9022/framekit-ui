import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { FitArt, focusRing, labelTone, pillDark, pillLight, surface } from './kit'
import { InstallPill, SHOW } from './ShowcaseHero'
import { gsap, MOTION_OK, REDUCED, useGSAP } from './motion'

const PICKS = ['glow-candle-card', 'activity-rings', 'goal-progress-card', 'neon-halo-card', 'dynamic-status-island', 'contribution-heatmap-tile']
const CARDS = PICKS.map((s) => SHOW.find((x) => x.slug === s)!)

/* Fan: ±15°, hinged at the bottom centre. Scatter: where each card lands once the copy changes (vw / vh). */
const FAN_ROT = [-15, -9, -3, 3, 9, 15]
const SCATTER = [
  { x: -36, y: -50, r: -10 },
  { x: 34, y: -54, r: 8 },
  { x: -40, y: -8, r: 6 },
  { x: 38, y: -12, r: -7 },
  { x: -22, y: 18, r: -4 },
  { x: 24, y: 16, r: 11 },
]
/* Phones: keep the middle band clear for the second line; three cards above it, three below. */
const SCATTER_M = [
  { x: -33, y: -50, r: -9 },
  { x: 33, y: -52, r: 8 },
  { x: -36, y: 3, r: 7 },
  { x: 36, y: 1, r: -8 },
  { x: 0, y: 8, r: -3 },
  { x: 2, y: -56, r: 4 },
]
const scatter = () => (innerWidth < 640 ? SCATTER_M : SCATTER)
const TAGS = [
  { t: 'Springs, not keyframes', cls: 'left-[6%] top-[34%] sm:left-[14%]', c: 'bg-[#D9F95C] text-zinc-950' },
  { t: 'Light + dark', cls: 'right-[5%] top-[30%] sm:right-[15%]', c: 'bg-white text-zinc-950 ring-1 ring-black/10' },
  { t: 'Keyboard first', cls: 'left-[8%] bottom-[6%] sm:left-[12%] max-sm:hidden', c: 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' },
  { t: 'shadcn add', cls: 'right-[8%] bottom-[16%] sm:right-[22%]', c: 'bg-[#2B5BFF] text-white' },
]

export function KineticHero({ count }: { count: number }) {
  const root = React.useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('[data-hcard]')
    const tags = gsap.utils.toArray<HTMLElement>('[data-htag]')
    const w = () => cards[0].offsetWidth
    const fanX = (i: number) => (i - 2.5) * w() * (innerWidth < 640 ? 0.36 : 0.5)
    const fanY = (i: number) => Math.abs(i - 2.5) ** 2 * 4
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      gsap.set(cards, { transformOrigin: '50% 100%' })
      const intro = gsap.timeline({ delay: 0.15 })
      intro
        .from('[data-hcopy] > *', { y: 28, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07 })
        .from(cards, { y: 180, opacity: 0, rotation: 0, duration: 0.8, ease: 'power3.out', stagger: 0.04 }, 0.1)
        .to(cards, { x: (i) => fanX(i), y: (i) => fanY(i), rotation: (i) => FAN_ROT[i], duration: 1.1, ease: 'elastic.out(1, 0.75)', stagger: { each: 0.05, from: 'center' } }, 0.7)
        .from(tags, { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(3)', stagger: 0.09 }, 1.15)
      tags.forEach((t, i) => gsap.to(t, { y: i % 2 ? 7 : -7, duration: 2.6 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 }))

      // Pin; once the intro settles, scrub fan → stack → scatter while the copy swaps.
      const pin = { trigger: root.current, start: 'top 64px', end: () => `+=${innerHeight * (innerWidth < 640 ? 1.3 : 1.6)}`, pin: true, anticipatePin: 1 }
      let scroll: gsap.core.Timeline | undefined
      const st = gsap.timeline({ scrollTrigger: { ...pin, scrub: 1, invalidateOnRefresh: true } })
      st.to({}, { duration: 1 }) // placeholder so the pin length exists from the first frame
      intro.eventCallback('onComplete', () => {
        scroll = gsap.timeline()
        scroll
          .fromTo(cards, { x: (i) => fanX(i), y: (i) => fanY(i), rotation: (i) => FAN_ROT[i] }, { x: 0, y: (i) => -i * 3, rotation: (i) => (i % 2 ? 2 : -2), ease: 'power3.inOut', duration: 0.3, stagger: 0.01, immediateRender: false })
          .to(tags, { scale: 0.4, opacity: 0, duration: 0.15, ease: 'power3.in', stagger: 0.02 }, 0.05)
          .to('[data-hcopy]', { y: -60, opacity: 0, duration: 0.2, ease: 'power3.in' }, 0.22)
          .to(cards, { x: (i) => (scatter()[i].x * innerWidth) / 100, y: (i) => (scatter()[i].y * innerHeight) / 100, rotation: (i) => scatter()[i].r, scale: () => (innerWidth < 640 ? 0.74 : 0.9), ease: 'power4.out', duration: 0.45, stagger: { each: 0.025, from: 'center' } }, 0.42)
          .fromTo('[data-hcopy2] > *', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power4.out', stagger: 0.05 }, 0.55)
        st.clear().add(scroll, 0)
        st.scrollTrigger?.refresh()
      })
      return () => { scroll?.kill() }
    })

    mm.add(REDUCED, () => {
      gsap.set(cards, { transformOrigin: '50% 100%', x: (i) => fanX(i), y: (i) => fanY(i), rotation: (i) => FAN_ROT[i] })
    })
  }, { scope: root })

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative flex h-[calc(100svh-4rem)] min-h-[520px] flex-col overflow-hidden">
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

      <div data-hcopy2 className="pointer-events-none absolute inset-x-0 top-[38%] z-20 mx-auto flex max-w-[760px] flex-col items-center px-6 text-center opacity-100 [&>*]:opacity-0">
        <p className="text-balance text-[clamp(2rem,1.2rem+3.6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950 dark:text-white">Pick one. Paste it. Watch it move.</p>
        <div className="pointer-events-auto mt-6 flex w-full max-w-[488px] justify-center"><InstallPill paused={false} /></div>
      </div>

      <div className="pointer-events-none relative z-10 mt-[clamp(0.75rem,3svh,2.5rem)] min-h-[180px] flex-1 [container-type:size] [perspective:1600px]">
        {CARDS.map((c, i) => {
          const s = surface(c.bg)
          return (
            <Link
              key={c.slug}
              to={`/docs/${c.slug}`}
              data-hcard
              tabIndex={-1}
              aria-hidden
              className={cn('pointer-events-auto absolute bottom-[max(1.25rem,calc((100cqh-var(--cw)*1.32)/2-1.5rem))] left-1/2 -ml-[calc(var(--cw)/2)] group block w-[var(--cw)] will-change-transform [--cw:min(clamp(112px,max(13.5vw,16svh),232px),calc((100cqh-4.5rem)/1.32))] max-sm:[--cw:min(max(112px,18svh),calc((100cqh-3.5rem)/1.32))]', focusRing)}
              style={{ zIndex: i < 3 ? i + 1 : 6 - i + 3 }}
            >
              <span className={cn('block rounded-[24px] p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.55),0_1px_2px_rgb(0_0_0/0.06),0_12px_24px_-12px_rgb(0_0_0/0.18),0_32px_64px_-28px_rgb(0_0_0/0.4)] ring-1 ring-black/[0.06] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_32px_64px_-28px_rgb(0_0_0/0.8)] dark:ring-white/10 [@media(hover:hover)]:group-hover:-translate-y-3 [@media(hover:hover)]:group-hover:scale-[1.03] motion-reduce:transition-none', s.className)} style={s.style}>
                <FitArt design={c.design} fill={0.94} className="aspect-[4/5] rounded-[19px]">{c.art}</FitArt>
                <span className={cn('block px-1.5 pb-0.5 pt-1.5 text-[11px] font-medium tracking-[-0.01em] sm:text-[12px]', labelTone(c.bg))}>{c.label}</span>
              </span>
            </Link>
          )
        })}
        {TAGS.map((t) => (
          <span key={t.t} data-htag aria-hidden className={cn('absolute z-20 rounded-full px-3.5 py-2 text-[12.5px] font-semibold tracking-[-0.01em] shadow-[0_8px_24px_-8px_rgb(0_0_0/0.3)] sm:text-[13.5px]', t.cls, t.c)}>{t.t}</span>
        ))}
      </div>
    </section>
  )
}
