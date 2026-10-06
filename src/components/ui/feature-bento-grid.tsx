import * as React from 'react'
import { motion } from 'motion/react'
import { ArrowRight, CalendarClock, Globe2, Keyboard, LineChart, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BentoArt = 'chart' | 'globe' | 'keys' | 'calendar' | 'shield'

export type BentoItem = {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
  /** Built-in generated illustration for the tile. Ignored when `src` is set. */
  art?: BentoArt
  /** Your own image for the tile's art area. */
  src?: string
  alt?: string
  href?: string
  /** CTA text revealed on hover / focus (always visible on touch). */
  cta?: string
  /** Grid footprint on ≥ md screens. */
  span?: 'wide' | 'tall' | 'full' | 'normal'
}

export type FeatureBentoGridProps = {
  items?: BentoItem[]
  /** Heading level for tile titles. */
  titleAs?: 'h2' | 'h3' | 'h4'
  /** Fires when a tile without `href` is activated. */
  onSelect?: (item: BentoItem) => void
  className?: string
}

export const DEFAULT_BENTO_ITEMS: BentoItem[] = [
  { id: 'insights', title: 'Live insights', description: 'Every deploy charted against conversion within 90 seconds.', icon: <LineChart />, art: 'chart', span: 'wide', cta: 'Explore insights' },
  { id: 'edge', title: 'Global by default', description: '38 regions, routed to the closest healthy one.', icon: <Globe2 />, art: 'globe', span: 'tall', cta: 'See regions' },
  { id: 'keys', title: 'Keyboard first', description: 'Every action is one shortcut away. Press ⌘ K anywhere.', icon: <Keyboard />, art: 'keys', cta: 'View shortcuts' },
  { id: 'schedule', title: 'Scheduled releases', description: 'Queue a launch for 9:00 local time in each market.', icon: <CalendarClock />, art: 'calendar', cta: 'Plan a release' },
  { id: 'secure', title: 'Secure at rest', description: 'Keys rotate every 24 hours; audit logs stream to your SIEM.', icon: <ShieldCheck />, art: 'shield', span: 'full', cta: 'Read the whitepaper' },
]

function Art({ kind, reduced }: { kind: BentoArt; reduced: boolean }) {
  const lift = reduced ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-focus-within:-translate-y-1.5'
  if (kind === 'chart') {
    const pts = [18, 26, 22, 38, 34, 52, 47, 63, 58, 74]
    const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * 32 + 8},${90 - v}`).join(' ')
    return (
      <svg viewBox="0 0 304 100" className={cn('h-full w-full', lift)} aria-hidden preserveAspectRatio="none">
        {pts.map((v, i) => (
          <rect key={i} x={i * 32 + 2} y={96 - v * 0.7} width="12" height={v * 0.7} rx="3" className="fill-zinc-200 dark:fill-white/[0.07]" />
        ))}
        <path d={d} fill="none" className="stroke-signal-600 dark:stroke-signal-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        <circle cx={9 * 32 + 8} cy={90 - 74} r="4.5" className="fill-framekit-500" />
      </svg>
    )
  }
  if (kind === 'globe') {
    const dots: { x: number; y: number; o: number }[] = []
    for (let lat = -70; lat <= 70; lat += 14) {
      const r = Math.cos((lat * Math.PI) / 180)
      const n = Math.max(4, Math.round(16 * r))
      for (let k = 0; k < n; k++) {
        const lon = (k / n) * Math.PI * 2
        const z = Math.cos(lon)
        if (z < -0.1) continue
        dots.push({ x: 60 + Math.sin(lon) * 48 * r, y: 60 - (lat / 90) * 50, o: 0.25 + z * 0.75 })
      }
    }
    return (
      <div className="grid h-full place-items-center" aria-hidden>
      <svg viewBox="0 0 120 120" className={cn('h-auto max-h-56 w-full max-w-56', lift, !reduced && 'group-hover:rotate-6')}>
        <circle cx="60" cy="60" r="52" className="fill-signal-100/70 stroke-black/[0.06] dark:fill-signal-900/30 dark:stroke-white/[0.08]" />
        {dots.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.6" className="fill-signal-700 dark:fill-signal-200" opacity={p.o} />
        ))}
        <circle cx="76" cy="44" r="3.5" className="fill-framekit-500" />
        <circle cx="76" cy="44" r="8" className="fill-framekit-500/20" />
      </svg>
      </div>
    )
  }
  if (kind === 'keys') {
    const keys = ['⌘', 'K', '⇧', 'P']
    return (
      <div className={cn('flex h-full items-center justify-center gap-2', lift)} aria-hidden>
        {keys.map((k, i) => (
          <span
            key={k}
            className={cn(
              'grid h-11 min-w-11 place-items-center rounded-[10px] bg-white px-2 font-mono text-sm font-medium text-zinc-800 ring-1 ring-black/[0.08]',
              'shadow-[inset_0_-2px_0_rgb(0_0_0/0.06),0_1px_2px_rgb(0_0_0/0.06)] dark:bg-zinc-800 dark:text-zinc-100 dark:ring-white/[0.1] dark:shadow-[inset_0_-2px_0_rgb(0_0_0/0.4)]',
              i === 1 && 'text-signal-700 dark:text-signal-200',
            )}
          >
            {k}
          </span>
        ))}
      </div>
    )
  }
  if (kind === 'calendar') {
    return (
      <div className={cn('grid h-full grid-cols-7 content-center gap-1 px-1', lift)} aria-hidden>
        {Array.from({ length: 21 }, (_, i) => (
          <span
            key={i}
            className={cn(
              'aspect-square rounded-[5px]',
              i === 11 ? 'bg-framekit-500' : i % 5 === 2 ? 'bg-signal-300 dark:bg-signal-700' : 'bg-zinc-200/80 dark:bg-white/[0.06]',
            )}
          />
        ))}
      </div>
    )
  }
  return (
    <div className={cn('flex h-full items-center justify-center gap-4', lift)} aria-hidden>
      <svg viewBox="0 0 64 72" className="h-24 w-auto shrink-0">
        <path d="M32 3 58 13v20c0 17-11 29-26 36C17 62 6 50 6 33V13L32 3Z" className="fill-white stroke-black/[0.08] dark:fill-zinc-800 dark:stroke-white/[0.1]" strokeWidth="1.5" />
        <path d="M32 11 50 18v15c0 12-7.5 21-18 26-10.5-5-18-14-18-26V18l18-7Z" className="fill-signal-100 dark:fill-signal-900/60" />
        <path d="m24 35 6 6 11-12" fill="none" className="stroke-signal-700 dark:stroke-signal-200" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="hidden min-w-0 flex-col gap-1.5 sm:flex">
        {['Key rotated · 2 min ago', 'Audit stream · live', 'Encryption · AES-256'].map((t, i) => (
          <span key={t} className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1 font-mono text-[11px] text-zinc-700 ring-1 ring-black/[0.06] dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/[0.08]">
            <span className={cn('h-1.5 w-1.5 rounded-full', i === 1 ? 'bg-framekit-500' : 'bg-emerald-500')} />
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Feature Bento Grid — an asymmetric grid of feature tiles, each with generated art. Hover or focus a tile and it
 * lifts a few pixels, a hairline light follows your pointer around its edge, the art drifts up and a call-to-action
 * rises from the bottom. On touch the CTA is always visible. Tiles are real links or buttons.
 */
export function FeatureBentoGrid({ items = DEFAULT_BENTO_ITEMS, titleAs = 'h3', onSelect, className }: FeatureBentoGridProps) {
  const reduced = usePrefersReducedMotion()
  const Title = titleAs
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <ul className={cn('grid w-full max-w-4xl auto-rows-[minmax(15rem,auto)] grid-cols-1 gap-3 md:grid-cols-3', className)}>
      {items.map((it, i) => {
        const ctaCls = cn(
          'relative mt-3 inline-flex min-h-11 items-center gap-1.5 self-start rounded-full text-sm font-medium text-zinc-950 outline-none dark:text-white',
          "after:absolute after:inset-[-999px] after:content-['']",
          'pointer-fine:translate-y-2 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:translate-y-0 pointer-fine:group-focus-within:opacity-100',
          'transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:transition-opacity',
        )
        const cta = (
          <>
            {it.cta ?? 'Learn more'}
            <span className="sr-only">: {it.title}</span>
            <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </>
        )
        return (
          <motion.li
            key={it.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className={cn(it.span === 'wide' && 'md:col-span-2', it.span === 'full' && 'md:col-span-3', it.span === 'tall' && 'md:row-span-2')}
          >
            <article
              onPointerMove={onMove}
              className={cn(
                'group relative flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-white p-3 pb-2 ring-1 ring-black/[0.06]',
                'shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-20px_rgb(24_24_27/0.3)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                'hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgb(0_0_0/0.05),0_24px_48px_-24px_rgb(24_24_27/0.4)] active:scale-[0.995] motion-reduce:transform-none',
                'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-signal-600 dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] dark:has-[:focus-visible]:ring-signal-300',
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgb(154 134 184 / 0.6), transparent 70%)',
                  WebkitMask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
                  mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
                  padding: 1,
                }}
              />
              <div className="relative min-h-28 flex-1 overflow-hidden rounded-[14px] bg-zinc-50 p-3 ring-1 ring-black/[0.04] dark:bg-white/[0.02] dark:ring-white/[0.05]">
                {it.src ? <img src={it.src} alt={it.alt ?? ''} className="h-full w-full rounded-[10px] object-cover" /> : <Art kind={it.art ?? 'chart'} reduced={reduced} />}
              </div>
              <div className="relative flex flex-col px-2 pt-4">
                <div className="flex items-center gap-2 text-zinc-950 dark:text-zinc-50 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-signal-700 dark:[&_svg]:text-signal-300">
                  {it.icon}
                  <Title className="text-[15px] font-semibold tracking-tight">{it.title}</Title>
                </div>
                <p className="mt-1 text-pretty text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{it.description}</p>
                {it.href ? (
                  <a href={it.href} className={ctaCls}>{cta}</a>
                ) : (
                  <button type="button" onClick={() => onSelect?.(it)} className={ctaCls}>{cta}</button>
                )}
              </div>
            </article>
          </motion.li>
        )
      })}
    </ul>
  )
}
