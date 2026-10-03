import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { PortfolioArt } from '@/lib/portfolio-art'

export type NowPlayingTrack = {
  title: string
  artist: string
  /** Seconds. */
  duration: number
  /** Drives the generated sleeve art. */
  seed?: number
  /** Optional real cover image. */
  src?: string
}

export type NowPlayingWidgetProps = {
  tracks?: NowPlayingTrack[]
  /** Label above the title while playing / paused. */
  playingLabel?: string
  pausedLabel?: string
  playing?: boolean
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  onTrackChange?: (track: NowPlayingTrack, index: number) => void
  className?: string
}

const DEFAULT_TRACKS: NowPlayingTrack[] = [
  { title: 'Slow Light on Concrete', artist: 'Marlow Quay', duration: 214, seed: 5 },
  { title: 'Paper Lanterns', artist: 'The Tidewater Set', duration: 187, seed: 14 },
  { title: 'Night Bus to Nowhere', artist: 'Ilse Varga', duration: 242, seed: 22 },
  { title: 'Soft Focus', artist: 'Quiet Harbour', duration: 168, seed: 9 },
]

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function Eq({ on, reduced }: { on: boolean; reduced: boolean }) {
  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] origin-bottom rounded-full bg-signal-600 dark:bg-signal-300"
          style={{ height: 16 }}
          initial={false}
          animate={on && !reduced ? { scaleY: [0.25, 1, 0.45, 0.85, 0.3] } : { scaleY: [0.35, 0.7, 0.5, 0.9, 0.4][i] }}
          transition={on && !reduced ? { duration: 1.1 + i * 0.17, repeat: Infinity, ease: 'easeInOut', delay: i * 0.11 } : { duration: 0.3 }}
        />
      ))}
    </span>
  )
}

/**
 * Now Playing Widget — a vinyl slides out of a generated sleeve and spins while a tonearm settles on it; an EQ
 * breathes beside live-ticking progress you can scrub. Purely visual (no audio) — wire `onPlayingChange` to your player.
 */
export function NowPlayingWidget({ tracks = DEFAULT_TRACKS, playingLabel = 'Now playing', pausedLabel = 'Paused', playing, defaultPlaying = true, onPlayingChange, onTrackChange, className }: NowPlayingWidgetProps) {
  const reduced = usePrefersReducedMotion()
  const [idx, setIdx] = React.useState(0)
  const [inner, setInner] = React.useState(defaultPlaying)
  const isPlaying = playing ?? inner
  const [pos, setPos] = React.useState(38)
  const track = tracks[idx] ?? tracks[0]
  const id = React.useId()

  const setPlaying = (v: boolean) => { if (playing === undefined) setInner(v); onPlayingChange?.(v) }
  const go = (n: number, auto = false) => {
    const next = (n + tracks.length) % tracks.length
    setIdx(next); setPos(0); onTrackChange?.(tracks[next], next)
    if (!auto && !isPlaying) setPlaying(true)
  }

  React.useEffect(() => {
    if (!isPlaying) return
    const t = window.setInterval(() => setPos((p) => p + 0.25), 250)
    return () => window.clearInterval(t)
  }, [isPlaying])
  React.useEffect(() => { if (pos >= track.duration) go(idx + 1, true) }) // eslint-disable-line react-hooks/exhaustive-deps

  const pct = Math.min(100, (pos / track.duration) * 100)
  const btn = 'grid size-11 place-items-center rounded-full text-zinc-700 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:ring-2 focus-visible:ring-signal-600 active:scale-95 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white dark:focus-visible:ring-signal-300'

  return (
    <section aria-label="Music player" className={cn('w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white p-4 shadow-[0_18px_50px_-30px_rgb(0_0_0/0.35)] sm:p-5 dark:border-zinc-800 dark:bg-zinc-900', className)}>
      <div className="flex items-center gap-4 sm:gap-5">
        {/* sleeve + vinyl + tonearm */}
        <div className="relative h-28 w-[8.5rem] shrink-0 sm:h-32 sm:w-40" aria-hidden>
          <motion.div
            className="absolute right-0 top-1/2 size-[78%] -translate-y-1/2 rounded-full shadow-[0_6px_18px_rgb(0_0_0/0.35)]"
            style={{ background: 'repeating-radial-gradient(circle at 50% 50%, #151517 0 2px, #222226 2px 3px)' }}
            initial={false}
            animate={{ x: isPlaying ? '30%' : '8%', rotate: isPlaying && !reduced ? 360 : 0 }}
            transition={{ x: { type: 'spring', stiffness: 160, damping: 20 }, rotate: isPlaying && !reduced ? { duration: 3.6, repeat: Infinity, ease: 'linear' } : { duration: 0.6 } }}
          >
            <span className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 20deg, transparent 0 20%, rgb(255 255 255/0.12) 25%, transparent 32% 70%, rgb(255 255 255/0.1) 75%, transparent 82%)' }} />
            <span className="absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-2 ring-black/40">
              <AnimatePresence initial={false}>
                <motion.span key={idx} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PortfolioArt seed={(track.seed ?? idx) + 3} motif="arcs" />
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-100" />
          </motion.div>
          <div className="absolute left-0 top-1/2 size-[78%] -translate-y-1/2 overflow-hidden rounded-xl shadow-[0_10px_26px_-8px_rgb(0_0_0/0.5)] ring-1 ring-black/10">
            <AnimatePresence initial={false}>
              <motion.div key={idx} className="absolute inset-0" initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <PortfolioArt seed={track.seed ?? idx} src={track.src} alt="" />
              </motion.div>
            </AnimatePresence>
            <span className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/25" />
          </div>
          <svg viewBox="0 0 60 80" className="absolute -right-1 -top-1 h-[62%] w-auto overflow-visible">
            <motion.g style={{ originX: '50px', originY: '8px' }} initial={false} animate={{ rotate: isPlaying ? 0 : -24 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
              <circle cx="50" cy="8" r="5" className="fill-zinc-400 dark:fill-zinc-500" />
              <path d="M50 8 L50 44 L30 66" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-zinc-500 dark:stroke-zinc-300" />
              <rect x="22" y="62" width="14" height="8" rx="2" transform="rotate(-38 29 66)" className="fill-zinc-700 dark:fill-zinc-100" />
            </motion.g>
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400">
            <Eq on={isPlaying} reduced={reduced} />
            <span>{isPlaying ? playingLabel : pausedLabel}</span>
          </p>
          <div className="relative mt-1.5 h-[4.4rem] overflow-hidden" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={idx} initial={reduced ? { opacity: 0 } : { y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { y: -22, opacity: 0 }} transition={{ type: 'spring', stiffness: 360, damping: 30 }}>
                <p className="line-clamp-2 font-display text-[1.5rem] leading-[1.6rem] tracking-tight text-zinc-950 dark:text-zinc-50">{track.title}</p>
                <p className="truncate text-sm text-zinc-700 dark:text-zinc-300">{track.artist}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="group relative flex h-6 items-center">
          <input
            id={id}
            type="range"
            min={0}
            max={track.duration}
            step={1}
            value={Math.floor(pos)}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Seek"
            aria-valuetext={`${mmss(pos)} of ${mmss(track.duration)}`}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          <div aria-hidden className="relative h-1.5 w-full rounded-full bg-zinc-200 ring-signal-600 ring-offset-4 ring-offset-white peer-focus-visible:ring-2 dark:bg-zinc-800 dark:ring-signal-300 dark:ring-offset-zinc-900">
            <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-signal-500 to-framekit-500" style={{ width: `${pct}%` }} />
            <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-1 ring-black/15 transition-transform group-hover:scale-125 dark:bg-zinc-100" style={{ left: `${pct}%` }} />
          </div>
        </div>
        <div className="mt-1 flex justify-between font-mono text-[11px] tabular-nums text-zinc-600 dark:text-zinc-400">
          <span>{mmss(pos)}</span>
          <span>−{mmss(Math.max(0, track.duration - pos))}</span>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-center gap-2">
        <button type="button" aria-label="Previous track" onClick={() => go(idx - 1)} className={btn}><SkipBack className="size-5" fill="currentColor" /></button>
        <button type="button" aria-label={isPlaying ? 'Pause' : 'Play'} aria-pressed={isPlaying} onClick={() => setPlaying(!isPlaying)} className="grid size-12 place-items-center rounded-full bg-zinc-950 text-white outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 active:scale-95 dark:bg-zinc-50 dark:text-zinc-950 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-900">
          {isPlaying ? <Pause className="size-5" fill="currentColor" /> : <Play className="size-5 translate-x-px" fill="currentColor" />}
        </button>
        <button type="button" aria-label="Next track" onClick={() => go(idx + 1)} className={btn}><SkipForward className="size-5" fill="currentColor" /></button>
      </div>
    </section>
  )
}
