import * as React from 'react'
import { Heart, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type Kudos = { id: string; name: string; role: string; text: string; /** word(s) in `text` to underline */ mark?: string; hue?: number }

export type KudosWallProps = {
  items?: Kudos[]
  /** Visible height of the wall in px. */
  height?: number
  /** Seconds per full loop of the slowest column. */
  duration?: number
  className?: string
}

const DEFAULT_ITEMS: Kudos[] = [
  { id: 'k1', name: 'Imani Okafor', role: 'Head of Product, Foldline', text: 'Rare to find someone who debugs the design and the build in the same afternoon.', mark: 'same afternoon', hue: 12 },
  { id: 'k2', name: 'Jonas Weiss', role: 'Founder, Parcel & Co.', text: 'Our checkout conversion jumped 18% and nobody could say what changed. It just felt calmer.', mark: 'felt calmer', hue: 200 },
  { id: 'k3', name: 'Priya Raman', role: 'Eng Manager, Lumen', text: 'The prototype was so good the team shipped it as the first version.', mark: 'shipped it', hue: 280 },
  { id: 'k4', name: 'Tomás Ferreira', role: 'Creative Director', text: 'Motion that explains instead of decorating. Our onboarding finally makes sense.', mark: 'explains instead of decorating', hue: 150 },
  { id: 'k5', name: 'Hana Sato', role: 'Design Lead, Kōbō', text: 'Handoff docs I actually read twice. Respectful of everyone’s time.', mark: 'read twice', hue: 40 },
  { id: 'k6', name: 'Marcus Bell', role: 'CTO, Tidewater', text: 'Quietly raised our quality bar across the whole front end.', mark: 'quality bar', hue: 330 },
  { id: 'k7', name: 'Lena Duarte', role: 'Product Designer', text: 'Pair-designed for a week and learned more than from a whole course.', mark: 'learned more', hue: 100 },
  { id: 'k8', name: 'Owen Clarke', role: 'Indie founder', text: 'Booked a call, got a plan, shipped in two weeks. Zero drama.', mark: 'Zero drama', hue: 230 },
  { id: 'k9', name: 'Sofia Marchetti', role: 'Studio owner', text: 'Our site finally looks like us, not like a template.', mark: 'looks like us', hue: 0 },
]

function Card({ k, inert }: { k: Kudos; inert?: boolean }) {
  const [liked, setLiked] = React.useState(false)
  const hue = k.hue ?? 260
  const initials = k.name.split(' ').map((p) => p[0]).slice(0, 2).join('')
  const parts = k.mark && k.text.includes(k.mark) ? k.text.split(k.mark) : [k.text]
  return (
    <figure inert={inert} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 42%), hsl(${(hue + 50) % 360} 75% 34%))` }}>{initials}</span>
        <figcaption className="min-w-0"><p className="truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{k.name}</p><p className="truncate text-xs text-zinc-600 dark:text-zinc-400">{k.role}</p></figcaption>
        <button type="button" aria-pressed={liked} aria-label={`${liked ? 'Remove cheer from' : 'Cheer'} ${k.name}`} onClick={() => setLiked(!liked)} className="-mr-1.5 ml-auto grid size-11 shrink-0 place-items-center rounded-full text-zinc-600 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:focus-visible:ring-signal-300">
          <Heart className={cn('size-[18px] transition-transform duration-300', liked ? 'scale-125 fill-rose-500 text-rose-500' : 'scale-100')} aria-hidden />
        </button>
      </div>
      <blockquote className="mt-3 text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200">
        {parts.length === 2 ? <>{parts[0]}<mark className="rounded-sm bg-amber-200/80 px-0.5 text-inherit dark:bg-amber-400/25">{k.mark}</mark>{parts[1]}</> : k.text}
      </blockquote>
    </figure>
  )
}

/**
 * Kudos Wall — praise cards drift past in three columns running at different speeds and directions behind a soft
 * mask. Hover or focus pauses; a Pause button covers touch and WCAG 2.2.2. Reduced motion shows a static wall.
 */
export function KudosWall({ items = DEFAULT_ITEMS, height = 460, duration = 60, className }: KudosWallProps) {
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = React.useState(false)
  const [hold, setHold] = React.useState(false)
  const cols = [0, 1, 2].map((c) => items.filter((_, i) => i % 3 === c))
  const run = !reduced && !paused && !hold
  return (
    <section aria-label="Kind words" className={cn('w-full max-w-4xl', className)}>
      <style>{`@keyframes fk-kudos{to{transform:translate3d(0,-50%,0)}}`}</style>
      <div
        className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-stone-50 px-3 dark:border-zinc-800 dark:bg-zinc-950"
        style={{ height, maskImage: 'linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)' }}
        onPointerEnter={() => setHold(true)}
        onPointerLeave={() => setHold(false)}
        onFocusCapture={() => setHold(true)}
        onBlurCapture={() => setHold(false)}
      >
        <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-3">
          {cols.map((col, ci) => (
            <div key={ci} className={cn('relative overflow-hidden', ci > 0 && 'hidden sm:block')}>
              <div
                className="flex flex-col gap-3 will-change-transform"
                style={reduced ? undefined : { animation: `fk-kudos ${duration * (0.8 + ci * 0.22)}s linear infinite ${ci === 1 ? 'reverse' : 'normal'}`, animationPlayState: run ? 'running' : 'paused', animationDelay: `${-ci * 9}s` }}
              >
                {[0, 1].map((rep) => (
                  <div key={rep} className="flex flex-col gap-3" aria-hidden={rep === 1 || undefined}>
                    {(reduced && rep === 1 ? [] : col).map((k) => <Card key={k.id + rep} k={k} inert={rep === 1} />)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {!reduced && (
        <div className="mt-3 flex justify-end">
          <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-900 outline-none transition-colors hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-signal-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:ring-signal-300">
            {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}{paused ? 'Resume drift' : 'Pause drift'}
          </button>
        </div>
      )}
    </section>
  )
}
