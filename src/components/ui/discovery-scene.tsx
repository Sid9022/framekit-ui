import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { List, RotateCcw, Sparkle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export interface DiscoveryItem {
  title: string
  text: string
}

export interface DiscoverySceneProps {
  /** Up to six facts, mapped in order to: window, wall print, lamp, mug, notebook, record player. */
  items?: DiscoveryItem[]
  /** Heading above the scene. */
  title?: string
  /** Fires when the last sparkle is found. */
  onComplete?: () => void
  className?: string
}

const SPOTS = [
  { key: 'window', label: 'the window', x: 72.5, y: 23 },
  { key: 'print', label: 'the wall print', x: 18.5, y: 25 },
  { key: 'lamp', label: 'the desk lamp', x: 22, y: 51 },
  { key: 'mug', label: 'the mug', x: 41, y: 67 },
  { key: 'notebook', label: 'the notebook', x: 60, y: 73 },
  { key: 'record', label: 'the record player', x: 79, y: 66 },
] as const

const DEFAULTS: DiscoveryItem[] = [
  { title: 'Night owl, mostly', text: 'The best ideas show up after the city goes quiet. The window stays open.' },
  { title: 'Small prints, big feelings', text: 'That print is a grid of 64 tiny squares — a colour study that taught me restraint.' },
  { title: 'Lamp on, phone away', text: 'Two hours of deep work every morning, under one warm light.' },
  { title: 'Third coffee, still honest', text: 'Black, no sugar. I sketch on the napkin while it cools.' },
  { title: 'Everything starts on paper', text: 'Every interface here began as ugly boxes in this notebook.' },
  { title: 'Side A on repeat', text: 'Ambient records while I build. If the grid sings, it ships.' },
]

const Star4 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden><path d="M12 1.5c.7 5.8 3 8.8 10.5 10.5-7.5 1.7-9.8 4.7-10.5 10.5C11.3 16.7 9 13.7 1.5 12 9 10.3 11.3 7.3 12 1.5Z" fill="currentColor" /></svg>
)

/**
 * Discovery Scene — an illustrated desk at night (day in light mode) with six hidden sparkles. Find them all: each reveals
 * a small fact and lights up its object. A live "found n / 6" counter, a plain list alternative and a replay button.
 */
export function DiscoveryScene({ items = DEFAULTS, title = 'Look around the desk', onComplete, className }: DiscoverySceneProps) {
  const reduced = usePrefersReducedMotion()
  const data = SPOTS.map((s, i) => ({ ...s, ...(items[i] ?? DEFAULTS[i]) }))
  const [found, setFound] = React.useState<number[]>([])
  const [current, setCurrent] = React.useState<number | null>(null)
  const [list, setList] = React.useState(false)
  const [burst, setBurst] = React.useState(0)
  const has = (i: number) => found.includes(i)
  const done = found.length === data.length

  const reveal = (i: number) => {
    setCurrent(i)
    if (!has(i)) {
      const next = [...found, i]
      setFound(next)
      if (next.length === data.length) { setBurst((b) => b + 1); onComplete?.() }
    }
  }
  const reset = () => { setFound([]); setCurrent(null); setList(false) }
  const cur = current === null ? null : data[current]
  const pulse = reduced ? undefined : { scale: [1, 1.18, 1], opacity: [0.9, 1, 0.9] }

  return (
    <section aria-label="Discovery scene" className={cn('w-full max-w-4xl rounded-[2rem] border border-zinc-200 bg-stone-50 p-3 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 sm:p-5', className)}>
      <style>{`@keyframes fk-ds-spin{to{transform:rotate(360deg)}}@keyframes fk-ds-steam{0%{opacity:0;transform:translateY(6px)}40%{opacity:.8}100%{opacity:0;transform:translateY(-22px)}}@media (prefers-reduced-motion:reduce){.fk-ds-a{animation:none!important}}`}</style>
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
        <h3 className="font-display text-2xl leading-tight sm:text-3xl">{title}</h3>
        <div className="flex items-center gap-2">
          <p className="rounded-full border border-zinc-300 bg-white px-3 py-2 font-mono text-xs tabular-nums text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" role="status" aria-live="polite">
            {done ? 'All found ✦' : `Found ${found.length} / ${data.length}`}
          </p>
          <button type="button" aria-pressed={list} onClick={() => setList((l) => !l)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 text-xs font-medium outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-signal-600 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:focus-visible:ring-signal-300"><List className="size-4" aria-hidden />{list ? 'Hide list' : 'Show as list'}</button>
          <button type="button" onClick={reset} aria-label="Start over" className="inline-flex size-11 items-center justify-center rounded-full border border-zinc-300 bg-white outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-signal-600 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:focus-visible:ring-signal-300"><RotateCcw className="size-4" aria-hidden /></button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800" style={{ aspectRatio: '800 / 480' }}>
        <svg viewBox="0 0 800 480" className="absolute inset-0 size-full" role="img" aria-label="An illustrated desk with a lamp, mug, notebook and record player beside a window">
          <defs>
            <radialGradient id="ds-lamp" cx=".2" cy=".15" r=".9"><stop offset="0" stopColor="#fde68a" stopOpacity=".75" /><stop offset="1" stopColor="#fde68a" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="800" height="345" className="fill-amber-100 dark:fill-indigo-950" />
          <rect y="300" width="800" height="45" className="fill-amber-200/70 dark:fill-indigo-900/60" />
          {/* window */}
          <g>
            <rect x="480" y="48" width="220" height="190" rx="10" className="fill-sky-200 dark:fill-[#0a0f2e]" />
            <g className="hidden dark:inline" fill="#fff">{[[510, 80, 1.6], [560, 110, 1.2], [620, 76, 1.8], [670, 130, 1.2], [530, 170, 1.4], [600, 190, 1], [655, 205, 1.6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={has(0) ? 1 : 0.55} className={has(0) && !reduced ? 'fk-ds-a' : undefined} />)}</g>
            <circle cx="640" cy="98" r="26" className="fill-yellow-300 dark:fill-indigo-100" />
            <circle cx="650" cy="92" r="22" className="hidden fill-[#0a0f2e] dark:inline" />
            {has(0) && <circle cx="640" cy="98" r="70" fill="#c7d2fe" opacity=".18" />}
            <path d="M590 48 V238 M480 143 H700" className="stroke-white dark:stroke-indigo-300/50" strokeWidth="8" />
            <rect x="480" y="48" width="220" height="190" rx="10" fill="none" className="stroke-amber-700 dark:stroke-indigo-300/70" strokeWidth="10" />
          </g>
          {/* wall print */}
          <g transform={`rotate(${has(1) ? -3 : 0} 148 120)`} style={{ transition: 'transform .5s' }}>
            <rect x="90" y="66" width="120" height="108" className="fill-white stroke-amber-800 dark:fill-indigo-100 dark:stroke-indigo-400" strokeWidth="6" />
            {Array.from({ length: 16 }, (_, i) => <rect key={i} x={104 + (i % 4) * 25} y={80 + Math.floor(i / 4) * 22} width="21" height="18" rx="2" fill={['#f97316', '#6366f1', '#10b981', '#f43f5e'][(i * 3 + Math.floor(i / 4)) % 4]} opacity={has(1) ? 1 : 0.75} />)}
          </g>
          {/* lamp light */}
          {has(2) && <polygon points="180,225 40,345 420,345 250,225" fill="url(#ds-lamp)" />}
          {/* desk */}
          <rect x="30" y="338" width="740" height="26" rx="8" className="fill-amber-700 dark:fill-amber-900" />
          <rect x="60" y="364" width="680" height="116" className="fill-amber-800 dark:fill-[#1e1534]" />
          <rect x="80" y="378" width="190" height="64" rx="6" className="fill-amber-900/40 dark:fill-black/30" />
          {/* lamp */}
          <g>
            <ellipse cx="110" cy="336" rx="34" ry="7" className="fill-zinc-700 dark:fill-zinc-500" />
            <path d="M110 334 L136 262 L172 232" fill="none" className="stroke-zinc-700 dark:stroke-zinc-400" strokeWidth="7" strokeLinecap="round" />
            <path d="M158 220 L214 238 L196 262 L150 244Z" className={has(2) ? 'fill-amber-300' : 'fill-zinc-600 dark:fill-zinc-500'} />
            {has(2) && <circle cx="188" cy="256" r="9" fill="#fff7c2" />}
          </g>
          {/* mug */}
          <g>
            <rect x="308" y="304" width="46" height="34" rx="6" className="fill-rose-400 dark:fill-rose-300" />
            <path d="M354 312 q18 2 0 18" fill="none" className="stroke-rose-400 dark:stroke-rose-300" strokeWidth="6" />
            {has(3) && [0, 1, 2].map((i) => <path key={i} className="fk-ds-a" d={`M${318 + i * 12} 298 q-6 -10 0 -18`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" style={reduced ? { opacity: 0.6 } : { animation: `fk-ds-steam 2.4s ${i * 0.5}s infinite` }} />)}
          </g>
          {/* notebook */}
          <g>
            <path d="M410 340 L440 322 L572 322 L552 340Z" className="fill-white dark:fill-stone-200" />
            <path d="M425 335 L445 326 H555 M435 330 L449 324" className="stroke-zinc-400" strokeWidth="1.5" fill="none" />
            {has(4) && <path d="M450 332 q10 -6 18 0 t18 0 t18 0 t18 0" stroke="#4f46e5" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
            <rect x="560" y="316" width="46" height="5" rx="2" transform="rotate(-18 560 318)" fill="#f59e0b" />
          </g>
          {/* record player */}
          <g>
            <rect x="618" y="300" width="124" height="38" rx="5" className="fill-zinc-800 dark:fill-zinc-700" />
            <ellipse cx="680" cy="304" rx="52" ry="9" className="fill-zinc-900 dark:fill-zinc-950" />
            <ellipse cx="680" cy="304" rx="48" ry="7" fill="#111" stroke="#374151" />
            <g className={has(5) ? 'fk-ds-a' : undefined} style={has(5) && !reduced ? { transformOrigin: '680px 304px', animation: 'fk-ds-spin 1.6s linear infinite' } : undefined}>
              <ellipse cx="680" cy="304" rx="14" ry="2.6" fill="#f43f5e" /><circle cx="670" cy="304" r="1.2" fill="#fff" />
            </g>
            <path d="M728 296 L698 304" className="stroke-zinc-300" strokeWidth="3" strokeLinecap="round" />
          </g>
          {/* plant (decorative) */}
          <g><path d="M735 336 h38 l-6 -34 h-26Z" className="fill-orange-500 dark:fill-orange-700" /><path d="M754 304 C 740 270 730 262 722 250 M754 304 C 760 262 772 252 782 242 M754 304 C 752 280 752 262 754 244" fill="none" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="5" strokeLinecap="round" /></g>
        </svg>

        {data.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => reveal(i)}
            aria-label={`${has(i) ? 'Found' : 'Hidden sparkle'}: ${s.label}`}
            aria-pressed={has(i)}
            className="group absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-signal-300"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <motion.span animate={has(i) ? undefined : pulse} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.3 }} className={cn('grid size-8 place-items-center rounded-full border shadow-md transition-colors', has(i) ? 'border-zinc-900/20 bg-white/90 text-zinc-500 dark:border-white/20 dark:bg-zinc-900/90 dark:text-zinc-300' : 'border-amber-500 bg-amber-300 text-amber-950 group-hover:bg-amber-200')}>
              <Star4 className="size-4" />
            </motion.span>
          </button>
        ))}

        <AnimatePresence>
          {burst > 0 && !reduced && (
            <motion.div key={burst} aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2.2 }}>
              {Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return <motion.span key={i} className="absolute text-amber-400" initial={{ x: 0, y: 0, scale: 0.3 }} animate={{ x: Math.cos(a) * 230, y: Math.sin(a) * 140, scale: 1, rotate: 180 }} transition={{ duration: 1.4, ease: 'easeOut' }}><Star4 className="size-5" /></motion.span> })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 min-h-[92px] rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900" aria-live="polite">
        {cur ? (
          <div key={current}>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400">Found · {cur.label}</p>
            <p className="mt-1 font-display text-2xl leading-tight">{cur.title}</p>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{cur.text}</p>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"><Sparkle className="size-4 text-amber-600" aria-hidden />Six sparkles are hiding in this room. Tap one to read what it says.</p>
        )}
        {done && <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">That’s the whole desk. Thanks for looking around.</p>}
      </div>

      {list && (
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {data.map((s, i) => (
            <li key={s.key} className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              <button type="button" onClick={() => reveal(i)} className="min-h-11 w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300">
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-600 dark:text-zinc-400">{String(i + 1).padStart(2, '0')} · {s.label}{has(i) ? ' · found' : ''}</span>
                <span className="mt-1 block font-semibold">{s.title}</span>
                <span className="block text-zinc-700 dark:text-zinc-300">{s.text}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
