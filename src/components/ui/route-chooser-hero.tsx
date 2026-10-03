import * as React from 'react'
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform, animate } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export interface RouteChoice {
  id: string
  /** Small mono label, e.g. "Route 01". */
  label: string
  title: string
  blurb: string
  cta?: string
  href?: string
}

export interface RouteChooserHeroProps {
  eyebrow?: string
  headline?: string
  /** First route = daylight path (left), second = night path (right). */
  routes?: [RouteChoice, RouteChoice]
  /** Fires on click / Enter. */
  onChoose?: (route: RouteChoice) => void
  className?: string
}

const DEFAULT_ROUTES: [RouteChoice, RouteChoice] = [
  { id: 'commission', label: 'Route 01 · by day', title: 'Work with me', blurb: 'Product design and front-end for teams who ship in daylight: scoped, calm, on time.', cta: 'See the studio work' },
  { id: 'lab', label: 'Route 02 · by night', title: 'Wander the lab', blurb: 'Half-finished experiments, odd interactions and notes from after hours.', cta: 'Open the lab' },
]

const STARS = Array.from({ length: 26 }, (_, i) => ({ x: (i * 197) % 1000, y: 20 + ((i * 89) % 230), r: 0.8 + ((i * 7) % 5) / 5 }))
const LEFT = 'M500 470 C 500 440 495 425 480 405 C 440 350 330 350 250 318'
const RIGHT = 'M500 470 C 500 440 505 425 520 405 C 560 350 670 350 750 318'
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

/**
 * Route Chooser Hero — a two-way fork in the road under a sky that follows your attention: hover or focus the left card
 * and it is noon, the right one and the moon rises, while a lantern walks that branch. Plain buttons/links underneath.
 */
export function RouteChooserHero({ eyebrow = 'Pick a road', headline = 'Two ways in. Both end well.', routes = DEFAULT_ROUTES, onChoose, className }: RouteChooserHeroProps) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState<0 | 1 | null>(null)
  const [chosen, setChosen] = React.useState<number | null>(null)
  const [say, setSay] = React.useState('')
  const pathRefs = [React.useRef<SVGPathElement>(null), React.useRef<SVGPathElement>(null)]
  const lantern = React.useRef<SVGGElement>(null)
  const moodRaw = useMotionValue(0.5)
  const mood = useSpring(moodRaw, { stiffness: 70, damping: 18 })
  const prog = useMotionValue(0)
  const dayOp = useTransform(mood, (m) => clamp01(1 - 2 * m))
  const duskOp = useTransform(mood, (m) => clamp01(2 * (1 - m)))
  const nightHills = useTransform(mood, (m) => clamp01(m * 1.4 - 0.2))
  const starOp = useTransform(mood, (m) => clamp01((m - 0.45) * 2.2))
  const sunY = useTransform(mood, [0, 0.5, 1], [150, 300, 470])
  const moonY = useTransform(mood, [0, 0.5, 1], [470, 380, 120])

  const branch = React.useRef(0)
  useMotionValueEvent(prog, 'change', (v) => {
    const p = pathRefs[branch.current].current
    const g = lantern.current
    if (!p || !g) return
    const pt = p.getPointAtLength(v * p.getTotalLength())
    g.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
    g.style.opacity = v < 0.02 ? '0' : '1'
  })

  const focusRoute = (i: 0 | 1 | null) => {
    setActive(i)
    if (reduced) { moodRaw.set(i === null ? 0.5 : i); return }
    moodRaw.set(i === null ? 0.5 : i)
    if (i === null) { animate(prog, 0, { duration: 0.6, ease: 'easeInOut' }); return }
    if (branch.current !== i) { prog.set(0); branch.current = i }
    animate(prog, 1, { duration: 1.5, ease: [0.4, 0, 0.2, 1] })
  }
  const choose = (i: 0 | 1) => { setChosen(i); onChoose?.(routes[i]); setSay(`${routes[i].title} chosen`) }

  return (
    <section aria-labelledby="rch-title" className={cn('relative isolate w-full max-w-5xl overflow-hidden rounded-[2rem] border border-zinc-300 bg-indigo-950 text-zinc-950 dark:border-zinc-800 dark:text-zinc-50', className)}>
      <svg aria-hidden viewBox="0 0 1000 520" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 -z-10 size-full">
        <defs>
          <linearGradient id="rch-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1030" /><stop offset=".6" stopColor="#2a2370" /><stop offset="1" stopColor="#5b3a9a" /></linearGradient>
          <linearGradient id="rch-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a3a8f" /><stop offset=".55" stopColor="#d9667f" /><stop offset="1" stopColor="#f7b267" /></linearGradient>
          <linearGradient id="rch-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4aa8f0" /><stop offset=".7" stopColor="#a5dcfa" /><stop offset="1" stopColor="#fff1c9" /></linearGradient>
          <radialGradient id="rch-glow"><stop offset="0" stopColor="#fff7c2" stopOpacity=".9" /><stop offset="1" stopColor="#fff7c2" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1000" height="520" fill="url(#rch-night)" />
        <motion.rect width="1000" height="520" fill="url(#rch-dusk)" style={{ opacity: duskOp }} />
        <motion.rect width="1000" height="520" fill="url(#rch-day)" style={{ opacity: dayOp }} />
        <motion.g style={{ opacity: starOp }} fill="#fff">{STARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} />)}</motion.g>
        <motion.g style={{ y: sunY }}><circle cx="270" cy="0" r="120" fill="url(#rch-glow)" /><circle cx="270" cy="0" r="38" fill="#ffd45e" /></motion.g>
        <motion.g style={{ y: moonY }}><circle cx="740" cy="0" r="90" fill="#c7d2fe" opacity=".18" /><circle cx="740" cy="0" r="30" fill="#eef2ff" /><circle cx="752" cy="-6" r="26" fill="#2a2370" opacity=".55" /></motion.g>
        {/* hills: day set, night set cross-fades on top */}
        <path d="M0 330 C 140 270 260 300 380 320 C 520 345 640 270 780 295 C 880 312 940 300 1000 285 V520 H0Z" fill="#6bbf7a" />
        <motion.path d="M0 330 C 140 270 260 300 380 320 C 520 345 640 270 780 295 C 880 312 940 300 1000 285 V520 H0Z" fill="#241a5e" style={{ opacity: nightHills }} />
        <path d="M0 380 C 160 340 300 372 460 392 C 620 412 800 352 1000 372 V520 H0Z" fill="#3f9b5d" />
        <motion.path d="M0 380 C 160 340 300 372 460 392 C 620 412 800 352 1000 372 V520 H0Z" fill="#150f40" style={{ opacity: nightHills }} />
        {/* the road */}
        {[LEFT, RIGHT].map((d, i) => (
          <g key={i}>
            <path ref={pathRefs[i]} d={d} fill="none" stroke="#f1e3c0" strokeWidth="20" strokeLinecap="round" opacity={active === i || chosen === i ? 0.95 : 0.6} />
            <path d={d} fill="none" stroke="#a8875a" strokeWidth="2.5" strokeDasharray="2 12" strokeLinecap="round" opacity=".8" />
          </g>
        ))}
        {[[250, 318], [750, 318]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}><line y1="0" y2="-34" stroke="#f8fafc" strokeWidth="3" /><path d="M0 -34 L22 -27 L0 -20Z" fill={i === 0 ? '#ef6a3a' : '#7c6cf0'} /></g>
        ))}
        <g ref={lantern} style={{ opacity: 0 }}><circle r="22" fill="url(#rch-glow)" /><circle r="5.5" fill="#fff3b0" stroke="#92400e" strokeWidth="1.5" /></g>
      </svg>

      <div className="px-5 pb-8 pt-10 sm:px-10 sm:pt-14">
        <p className="inline-block rounded-full bg-white/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-800 backdrop-blur dark:bg-zinc-950/70 dark:text-zinc-200">{eyebrow}</p>
        <h2 id="rch-title" className="mt-4 max-w-xl rounded-2xl bg-white/80 px-4 py-2 font-display text-4xl leading-[1.05] text-zinc-950 backdrop-blur sm:text-6xl dark:bg-zinc-950/70 dark:text-zinc-50">{headline}</h2>
        <div className="mt-[190px] grid gap-3 sm:mt-[210px] sm:grid-cols-2 sm:gap-6">
          {routes.map((r, i) => {
            const idx = i as 0 | 1
            const cls = cn('group relative flex min-h-11 flex-col items-start gap-2 rounded-2xl border border-white/70 bg-white/85 p-5 text-left shadow-lg outline-none backdrop-blur-md transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950 dark:border-white/10 dark:bg-zinc-950/80 dark:focus-visible:ring-signal-300', chosen === i && 'ring-2 ring-signal-600 dark:ring-signal-300')
            const inner = (
              <>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400">{r.label}</span>
                <span className="font-display text-3xl leading-tight text-zinc-950 dark:text-zinc-50">{r.title}</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{r.blurb}</span>
                <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{chosen === i ? <><Check className="size-4" aria-hidden /> Heading there</> : <>{r.cta ?? 'Go'} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden /></>}</span>
              </>
            )
            const common = { onMouseEnter: () => focusRoute(idx), onFocus: () => focusRoute(idx), onMouseLeave: () => focusRoute(null), onBlur: () => focusRoute(null), onClick: () => choose(idx), className: cls }
            return r.href ? <a key={r.id} href={r.href} {...common}>{inner}</a> : <button key={r.id} type="button" {...common}>{inner}</button>
          })}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{say}</p>
    </section>
  )
}
