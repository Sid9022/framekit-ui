import * as React from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ScrubMarker = { at: number; label: string }

export type TimelineScrubberProps = {
  /** Total length in seconds. */
  duration?: number
  markers?: ScrubMarker[]
  onTimeChange?: (t: number) => void
  className?: string
}

export const DEFAULT_SCRUB_MARKERS: ScrubMarker[] = [{ at: 0, label: 'Intro' }, { at: 18, label: 'Build' }, { at: 41, label: 'Drop' }, { at: 66, label: 'Outro' }]

const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`

/**
 * Timeline Scrubber — a media-style scrubber: a waveform that brightens as the
 * playhead passes, a thumb that grows while dragging, chapter markers that
 * snap within 1.5 s, a floating time bubble and full slider keyboard support.
 */
export function TimelineScrubber({ duration = 84, markers = DEFAULT_SCRUB_MARKERS, onTimeChange, className }: TimelineScrubberProps) {
  const reduced = usePrefersReducedMotion()
  const t = useMotionValue(12)
  const [now, setNow] = React.useState(12)
  const [drag, setDrag] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)
  const track = React.useRef<HTMLDivElement>(null)
  const pct = useTransform(t, (v) => `${(v / duration) * 100}%`)
  useMotionValueEvent(t, 'change', (v) => { setNow(v); onTimeChange?.(v) })
  React.useEffect(() => {
    if (!playing) return
    const c = animate(t, duration, { duration: duration - t.get(), ease: 'linear', onComplete: () => setPlaying(false) })
    return () => c.stop()
  }, [playing, duration, t])
  const bars = React.useMemo(() => Array.from({ length: 64 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23))), [])
  const seek = (v: number, snap = false) => {
    let n = Math.max(0, Math.min(duration, v))
    if (snap) { const m = markers.find((m) => Math.abs(m.at - n) < 1.5); if (m) n = m.at }
    t.set(n)
  }
  const fromX = (x: number) => { const r = track.current!.getBoundingClientRect(); return ((x - r.left) / r.width) * duration }
  const onKey = (e: React.KeyboardEvent) => {
    const k: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
    if (e.key in k) { e.preventDefault(); setPlaying(false); seek(t.get() + k[e.key] * (e.shiftKey ? 5 : 1)) }
    else if (e.key === 'Home') { e.preventDefault(); seek(0) } else if (e.key === 'End') { e.preventDefault(); seek(duration) }
    else if (e.key === ' ' || e.key === 'k') { e.preventDefault(); setPlaying((p) => !p) }
  }
  const chapter = [...markers].reverse().find((m) => m.at <= now)
  return (
    <div className={cn('w-full max-w-[640px] rounded-[24px] bg-white p-5 ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]', className)}>
      <div className="mb-4 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'} className="grid size-10 place-items-center rounded-full bg-zinc-950 text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-white dark:text-zinc-950">
          {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-[1px]" />}
        </motion.button>
        <div><p className="text-sm font-semibold text-zinc-950 dark:text-white">Night Drive</p><p className="text-xs text-zinc-600 dark:text-zinc-400">{chapter?.label ?? '—'}</p></div>
        <p className="ml-auto font-mono text-xs tabular-nums text-zinc-600 dark:text-zinc-400">{fmt(now)} / {fmt(duration)}</p>
      </div>
      <div ref={track} role="slider" tabIndex={0} aria-label="Seek" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={Math.round(now)} aria-valuetext={`${fmt(now)} of ${fmt(duration)}${chapter ? `, ${chapter.label}` : ''}`} onKeyDown={onKey}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); setPlaying(false); seek(fromX(e.clientX)) }}
        onPointerMove={(e) => drag && seek(fromX(e.clientX), true)} onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}
        className="relative h-16 cursor-pointer touch-none select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-4 dark:ring-offset-zinc-900">
        <div className="absolute inset-0 flex items-center gap-[2px]">
          {bars.map((b, i) => <div key={i} className={cn('flex-1 rounded-full transition-colors duration-150', (i / bars.length) * duration <= now ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-zinc-200 dark:bg-zinc-700')} style={{ height: `${b * 100}%` }} />)}
        </div>
        {markers.map((m) => <span key={m.at} aria-hidden className="absolute -bottom-3 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-zinc-400 dark:bg-zinc-500" style={{ left: `${(m.at / duration) * 100}%` }} />)}
        <motion.div aria-hidden style={{ left: pct }} className="absolute inset-y-[-6px] w-0">
          <motion.div animate={{ scaleX: drag ? 1.6 : 1, scaleY: drag ? 1.08 : 1 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 28 }} className="absolute inset-y-0 -left-[1.5px] w-[3px] rounded-full bg-zinc-950 shadow-[0_0_0_3px_rgb(255_255_255)] dark:bg-white dark:shadow-[0_0_0_3px_rgb(24_24_27)]" />
          <motion.span initial={false} animate={{ opacity: drag ? 1 : 0, y: drag ? 0 : 6, scale: drag ? 1 : 0.9 }} className="absolute -top-8 -translate-x-1/2 rounded-md bg-zinc-950 px-1.5 py-0.5 font-mono text-[11px] tabular-nums text-white dark:bg-white dark:text-zinc-950">{fmt(now)}</motion.span>
        </motion.div>
      </div>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {markers.map((m) => <button key={m.at} onClick={() => { setPlaying(false); seek(m.at) }} className={cn('rounded-full px-2.5 py-1 text-xs font-medium outline-none ring-1 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500', chapter?.at === m.at ? 'bg-indigo-50 text-indigo-800 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-400/30' : 'text-zinc-600 ring-black/10 hover:text-zinc-950 dark:text-zinc-400 dark:ring-white/10 dark:hover:text-white')}>{m.label} <span className="tabular-nums">{fmt(m.at)}</span></button>)}
      </div>
    </div>
  )
}
