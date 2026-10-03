import * as React from 'react'
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'motion/react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt, useInViewOnce } from '@/lib/portfolio-art'

export type BentoWeather = { temp: number; label: string; kind: 'sun' | 'cloud' | 'rain' | 'moon' }

export type BentoProfileBoardProps = {
  name?: string
  role?: string
  location?: string
  /** IANA zone for the live analogue clock. */
  timeZone?: string
  /** "Building …" status chip. */
  building?: string
  /** Optional avatar image; otherwise a generated bust is drawn. */
  avatarSrc?: string
  stack?: string[]
  weather?: BentoWeather
  nowPlaying?: { title: string; artist: string }
  /** Which visitor the reader is (1-based). */
  visitorNumber?: number
  ctaLabel?: string
  ctaHref?: string
  headingAs?: 'h2' | 'h3' | 'h4'
  className?: string
}

const ordinal = (n: number) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n.toLocaleString('en-US') + (s[(v - 20) % 10] || s[v] || s[0]) }

function useNow(tz?: string) {
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(t) }, [])
  return React.useMemo(() => {
    try {
      const p = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, timeZone: tz }).formatToParts(now)
      const g = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0)
      return { h: g('hour') % 24, m: g('minute'), s: g('second') }
    } catch { return { h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() } }
  }, [now, tz])
}

function Tile({ className, children, label, index, reduced, seen }: { className?: string; children: React.ReactNode; label?: string; index: number; reduced: boolean; seen: boolean }) {
  const x = useMotionValue(-200), y = useMotionValue(-200)
  const glow = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgb(154 134 184 / 0.22), transparent 70%)`
  return (
    <motion.div
      role="group"
      aria-label={label}
      className={cn('group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-4 shadow-[0_1px_0_rgb(255_255_255/0.7)_inset] sm:p-5 dark:border-zinc-800 dark:bg-zinc-900', className)}
      initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={seen || reduced ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 220, damping: 26, delay: index * 0.06 }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top) }}
      onPointerLeave={() => { x.set(-200); y.set(-200) }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: glow }} />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400'

function Clock({ tz, location }: { tz?: string; location: string }) {
  const { h, m, s } = useNow(tz)
  const night = h < 6 || h >= 19
  const ha = ((h % 12) + m / 60) * 30, ma = (m + s / 60) * 6, sa = s * 6
  const text = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <p className={eyebrow}>Local time</p>
      <div className="flex items-center gap-4">
        <svg viewBox="-50 -50 100 100" aria-hidden className="size-20 shrink-0 sm:size-[5.5rem]">
          <circle r="47" className={cn('stroke-zinc-300 dark:stroke-zinc-700', night ? 'fill-zinc-900 dark:fill-zinc-950' : 'fill-amber-50 dark:fill-amber-100/10')} strokeWidth="1.5" />
          {Array.from({ length: 12 }).map((_, i) => <line key={i} x1="0" y1={i % 3 === 0 ? -38 : -41} x2="0" y2="-44" transform={`rotate(${i * 30})`} strokeWidth={i % 3 === 0 ? 2 : 1} className={night ? 'stroke-zinc-300' : 'stroke-zinc-500 dark:stroke-zinc-400'} />)}
          <line x1="0" y1="3" x2="0" y2="-24" strokeWidth="3" strokeLinecap="round" transform={`rotate(${ha})`} className={night ? 'stroke-white' : 'stroke-zinc-900 dark:stroke-zinc-100'} />
          <line x1="0" y1="4" x2="0" y2="-34" strokeWidth="2" strokeLinecap="round" transform={`rotate(${ma})`} className={night ? 'stroke-white' : 'stroke-zinc-900 dark:stroke-zinc-100'} />
          <g style={{ transform: `rotate(${sa}deg)`, transition: s === 0 ? 'none' : 'transform 1s linear' }}><line x1="0" y1="8" x2="0" y2="-38" strokeWidth="1.2" className="stroke-framekit-500" /></g>
          <circle r="2.5" className="fill-framekit-500" />
        </svg>
        <div>
          <p className="font-display text-4xl leading-none tabular-nums text-zinc-950 dark:text-zinc-50">{text}</p>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300"><MapPin className="size-3" aria-hidden />{location}</p>
        </div>
      </div>
    </div>
  )
}

function WeatherGlyph({ kind, reduced }: { kind: BentoWeather['kind']; reduced: boolean }) {
  const spin = reduced ? {} : { animate: { rotate: 360 }, transition: { duration: 40, repeat: Infinity, ease: 'linear' as const } }
  return (
    <svg viewBox="-30 -30 60 60" aria-hidden className="size-16">
      {kind === 'sun' && (<><motion.g {...spin}>{Array.from({ length: 8 }).map((_, i) => <line key={i} x1="0" y1="-20" x2="0" y2="-26" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 45})`} className="stroke-amber-500" />)}</motion.g><circle r="13" className="fill-amber-400" /></>)}
      {kind === 'moon' && <path d="M10 -18 A20 20 0 1 0 18 10 A15 15 0 1 1 10 -18Z" className="fill-indigo-300" />}
      {(kind === 'cloud' || kind === 'rain') && (<><circle cx="-8" cy="-2" r="10" className="fill-zinc-300 dark:fill-zinc-500" /><circle cx="6" cy="-6" r="13" className="fill-zinc-200 dark:fill-zinc-400" /><rect x="-18" y="2" width="38" height="10" rx="5" className="fill-zinc-200 dark:fill-zinc-400" />{kind === 'rain' && [-8, 2, 12].map((x, i) => <motion.line key={x} x1={x} y1="16" x2={x - 3} y2="24" strokeWidth="2.5" strokeLinecap="round" className="stroke-sky-500" animate={reduced ? undefined : { opacity: [0, 1, 0], y: [0, 5] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }} />)}</>)}
    </svg>
  )
}

/**
 * Bento Profile Board — a "profile as a dashboard" grid: identity with a build status, a live analogue clock, weather,
 * now-playing, a visitor odometer, stack chips, a mini activity strip and a CTA. Tiles rise in on a stagger and each lights
 * its own border under the cursor.
 */
export function BentoProfileBoard({
  name = 'Noa Lindqvist', role = 'Design engineer', location = 'Gothenburg, SE', timeZone = 'Europe/Stockholm', building = 'a tiny weather-journal app',
  avatarSrc, stack = ['TypeScript', 'React', 'Motion', 'Tailwind', 'Postgres', 'Figma', 'Rust'], weather = { temp: 14, label: 'Light cloud', kind: 'cloud' },
  nowPlaying = { title: 'Paper Lanterns', artist: 'The Tidewater Set' }, visitorNumber = 2701, ctaLabel = 'Book a call', ctaHref = '#', headingAs = 'h3', className,
}: BentoProfileBoardProps) {
  const reduced = usePrefersReducedMotion()
  const [ref, seen] = useInViewOnce<HTMLDivElement>({ threshold: 0.1 })
  const Heading = headingAs
  const count = useSpring(0, { stiffness: 60, damping: 20 })
  const [shown, setShown] = React.useState(reduced ? visitorNumber : 0)
  React.useEffect(() => { if (!seen) return; if (reduced) { setShown(visitorNumber); return } count.set(visitorNumber); return count.on('change', (v) => setShown(Math.round(v))) }, [seen, visitorNumber, reduced, count])
  const bars = React.useMemo(() => Array.from({ length: 22 }, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))), [])
  const act = React.useMemo(() => Array.from({ length: 26 * 5 }, (_, i) => { const v = Math.sin(i * 12.9898) * 43758.5453; const r = v - Math.floor(v); return r < 0.35 ? 0 : r < 0.6 ? 1 : r < 0.82 ? 2 : r < 0.94 ? 3 : 4 }), [])
  const actCls = ['bg-zinc-200 dark:bg-zinc-800', 'bg-signal-200 dark:bg-signal-900', 'bg-signal-400 dark:bg-signal-700', 'bg-signal-600 dark:bg-signal-400', 'bg-signal-800 dark:bg-signal-200']
  const t = { reduced, seen }

  return (
    <div ref={ref} className={cn('grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4', className)}>
      <Tile index={0} label="Introduction" className="col-span-2 sm:row-span-2" {...t}>
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="relative size-20 overflow-hidden rounded-[1.4rem] ring-1 ring-black/10 sm:size-24 dark:ring-white/15">
              {avatarSrc ? <img src={avatarSrc} alt={name} className="size-full object-cover" /> : (
                <>
                  <PortfolioArt seed={21} motif="orbs" />
                  <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0"><circle cx="50" cy="40" r="15" fill="rgb(255 255 255/0.92)" /><path d="M20 100 C20 70 80 70 80 100Z" fill="rgb(255 255 255/0.92)" /></svg>
                </>
              )}
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-950/50 dark:text-emerald-50">
              <span className="relative grid size-2 place-items-center" aria-hidden>{!reduced && <motion.span className="absolute inset-0 rounded-full bg-emerald-500" animate={{ scale: [1, 2.8], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />}<span className="relative size-2 rounded-full bg-emerald-500" /></span>
              Building {building}
            </span>
          </div>
          <div>
            <Heading className="font-display text-5xl leading-[0.95] tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">{name}</Heading>
            <p className="mt-2 text-base text-zinc-700 dark:text-zinc-300">{role} who sweats the last 5% — motion, type and the small states nobody asked for.</p>
          </div>
        </div>
      </Tile>

      <Tile index={1} label="Local clock" className="col-span-2" {...t}><Clock tz={timeZone} location={location} /></Tile>

      <Tile index={2} label="Weather" {...t}>
        <div className="flex h-full flex-col justify-between gap-2">
          <p className={eyebrow}>Outside</p>
          <div className="flex items-end justify-between gap-2"><WeatherGlyph kind={weather.kind} reduced={reduced} /><p className="text-right"><span className="font-display text-4xl leading-none tabular-nums text-zinc-950 dark:text-zinc-50">{weather.temp}°</span><span className="block text-xs text-zinc-700 dark:text-zinc-300">{weather.label}</span></p></div>
        </div>
      </Tile>

      <Tile index={3} label="Visitor counter" {...t}>
        <div className="flex h-full flex-col justify-between gap-2">
          <p className={eyebrow}>Visitors</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">You&rsquo;re the<span className="mt-0.5 block font-display text-4xl leading-none tabular-nums text-zinc-950 dark:text-zinc-50" aria-label={ordinal(visitorNumber)}>{ordinal(shown)}</span></p>
        </div>
      </Tile>

      <Tile index={4} label="Now playing" className="col-span-2" {...t}>
        <div className="flex h-full items-center gap-4">
          <div className="flex h-14 items-end gap-[3px]" aria-hidden>
            {bars.map((b, i) => <motion.span key={i} className="w-[3px] origin-bottom rounded-full bg-gradient-to-t from-signal-600 to-framekit-500" style={{ height: 56 }} initial={false} animate={reduced ? { scaleY: b } : { scaleY: [b, Math.min(1, b + 0.45), b * 0.6, b] }} transition={{ duration: 1.2 + (i % 5) * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }} />)}
          </div>
          <div className="min-w-0"><p className={eyebrow}>Now playing</p><p className="mt-1 truncate font-display text-2xl leading-tight text-zinc-950 dark:text-zinc-50">{nowPlaying.title}</p><p className="truncate text-sm text-zinc-700 dark:text-zinc-300">{nowPlaying.artist}</p></div>
        </div>
      </Tile>

      <Tile index={5} label="Activity" className="col-span-2" {...t}>
        <p className={eyebrow}>Last 26 weeks</p>
        <div className="mt-3 grid grid-flow-col grid-rows-5 gap-[3px]" aria-hidden style={{ gridTemplateColumns: 'repeat(26, minmax(0, 1fr))' }}>
          {act.map((l, i) => <span key={i} className={cn('aspect-square rounded-[3px]', actCls[l])} />)}
        </div>
      </Tile>

      <Tile index={6} label="Stack" className="col-span-2" {...t}>
        <p className={eyebrow}>Daily tools</p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {stack.map((s) => <li key={s} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-800 transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-[-2deg] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">{s}</li>)}
        </ul>
      </Tile>

      <Tile index={7} label="Contact" className="col-span-2 overflow-hidden !border-zinc-900 !bg-zinc-950 text-white dark:!border-zinc-700 dark:!bg-zinc-100 dark:text-zinc-950" {...t}>
        <a href={ctaHref} className="group/cta flex h-full min-h-20 items-center justify-between gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950 dark:focus-visible:ring-zinc-950 dark:focus-visible:ring-offset-zinc-100">
          <span><span className="block font-mono text-[11px] uppercase tracking-[0.16em] opacity-80">Say hello</span><span className="mt-1 block font-display text-3xl leading-none">{ctaLabel}</span></span>
          <span className="grid size-12 place-items-center rounded-full bg-white text-zinc-950 transition-transform duration-300 group-hover/cta:rotate-45 group-hover/cta:scale-110 dark:bg-zinc-950 dark:text-white"><ArrowUpRight className="size-5" aria-hidden /></span>
        </a>
      </Tile>
    </div>
  )
}
