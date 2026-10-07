import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Mic, Pause, Play, Timer, UploadCloud } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type IslandState = 'idle' | 'recording' | 'timer' | 'uploading' | 'success'

export type DynamicStatusIslandProps = {
  /** Controlled state. */
  state?: IslandState
  /** Uncontrolled initial state. */
  defaultState?: IslandState
  /** Fires when the island changes state (from its own controls or the demo picker). */
  onStateChange?: (state: IslandState) => void
  /** Upload progress 0–1 shown in the `uploading` state (auto-advances when uncontrolled). */
  progress?: number
  /** Label shown while idle. */
  idleLabel?: string
  /** File name shown while uploading. */
  fileName?: string
  /** Render the state picker under the island. */
  showControls?: boolean
  className?: string
}

const STATES: { id: IslandState; label: string }[] = [
  { id: 'idle', label: 'Idle' },
  { id: 'recording', label: 'Recording' },
  { id: 'timer', label: 'Timer' },
  { id: 'uploading', label: 'Upload' },
  { id: 'success', label: 'Done' },
]

const SIZE: Record<IslandState, { w: number; h: number; r: number }> = {
  idle: { w: 132, h: 36, r: 18 },
  recording: { w: 236, h: 40, r: 20 },
  timer: { w: 268, h: 64, r: 32 },
  uploading: { w: 320, h: 84, r: 30 },
  success: { w: 200, h: 44, r: 22 },
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function Bars({ reduced }: { reduced: boolean }) {
  return (
    <span aria-hidden className="flex h-4 items-center gap-[3px]">
      {[0.5, 1, 0.7, 0.9, 0.4].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-rose-400"
          style={{ height: 16, originY: 0.5 }}
          initial={{ scaleY: h }}
          animate={reduced ? { scaleY: h } : { scaleY: [h, 0.25, 1, h] }}
          transition={reduced ? { duration: 0 } : { duration: 1.1 + i * 0.13, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
        />
      ))}
    </span>
  )
}

/**
 * Dynamic Status Island — a pitch-black capsule that lives at the top of a
 * screen and morphs its silhouette between live activities: recording with a
 * level meter, a countdown with pause, an upload with a progress hairline and
 * a success tick. Size and corner radius ride one crisp spring while content
 * cross-fades with a small blur, so every change reads as the same object
 * reshaping. Every state change is announced politely.
 */
export function DynamicStatusIsland({
  state,
  defaultState = 'idle',
  onStateChange,
  progress,
  idleLabel = 'Framekit',
  fileName = 'brand-guidelines.pdf',
  showControls = true,
  className,
}: DynamicStatusIslandProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState<IslandState>(defaultState)
  const current = state ?? inner
  const set = React.useCallback((s: IslandState) => { if (state === undefined) setInner(s); onStateChange?.(s) }, [state, onStateChange])

  const [elapsed, setElapsed] = React.useState(0)
  const [remain, setRemain] = React.useState(300)
  const [paused, setPaused] = React.useState(false)
  const [auto, setAuto] = React.useState(0)
  React.useEffect(() => {
    setElapsed(0); setAuto(0)
    if (current === 'timer') { setRemain(300); setPaused(false) }
  }, [current])
  React.useEffect(() => {
    if (current !== 'recording' && current !== 'timer') return
    const t = window.setInterval(() => {
      if (current === 'recording') setElapsed((e) => e + 1)
      else if (!paused) setRemain((r) => Math.max(0, r - 1))
    }, 1000)
    return () => window.clearInterval(t)
  }, [current, paused])
  React.useEffect(() => {
    if (current !== 'uploading' || progress !== undefined) return
    const t = window.setInterval(() => setAuto((p) => Math.min(1, p + 0.04)), 120)
    return () => window.clearInterval(t)
  }, [current, progress])
  const pct = progress ?? auto
  React.useEffect(() => {
    if (current === 'uploading' && progress === undefined && auto >= 1) {
      const t = window.setTimeout(() => set('success'), 300)
      return () => window.clearTimeout(t)
    }
  }, [auto, current, progress, set])

  const s = SIZE[current]
  const spring = reduced ? { duration: 0.15 } : { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.9 }
  const fade = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(4px)', scale: 0.92 },
    animate: { opacity: 1, filter: 'blur(0px)', scale: 1 },
    exit: reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(4px)', scale: 0.92 },
    transition: reduced ? { duration: 0.15 } : { type: 'spring' as const, stiffness: 480, damping: 32, delay: 0.04 },
  }
  const status = {
    idle: '', recording: 'Recording started', timer: 'Timer running, 5 minutes', uploading: `Uploading ${fileName}`, success: 'Upload complete',
  }[current]

  return (
    <div className={cn('flex w-full flex-col items-center gap-6', className)}>
      <motion.div
        className="relative flex max-w-full items-center justify-center overflow-hidden bg-black text-white shadow-[0_2px_6px_rgb(0_0_0/0.2),0_20px_40px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/[0.06]"
        initial={false}
        animate={{ width: s.w, height: s.h, borderRadius: s.r }}
        transition={spring}
        style={{ maxWidth: '100%' }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {current === 'idle' && (
            <motion.div key="idle" {...fade} className="flex items-center gap-2 px-4 text-[13px] font-medium">
              <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
              <span translate="no">{idleLabel}</span>
            </motion.div>
          )}
          {current === 'recording' && (
            <motion.div key="rec" {...fade} className="flex w-full items-center justify-between gap-3 px-3">
              <span className="flex items-center gap-2 text-[13px] font-medium">
                <span className="grid size-6 place-items-center rounded-full bg-rose-500/20"><Mic aria-hidden className="size-3.5 text-rose-400" /></span>
                Recording
              </span>
              <span className="flex items-center gap-2"><Bars reduced={reduced} /><span className="font-mono text-[13px] tabular-nums text-rose-300">{fmt(elapsed)}</span></span>
            </motion.div>
          )}
          {current === 'timer' && (
            <motion.div key="timer" {...fade} className="flex w-full items-center justify-between gap-3 px-3">
              <span className="flex items-center gap-2.5">
                <span className="grid size-10 place-items-center rounded-full bg-amber-400/15"><Timer aria-hidden className="size-5 text-amber-300" /></span>
                <span className="flex flex-col leading-tight"><span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">Focus</span><span className="font-mono text-2xl font-medium tabular-nums text-amber-200">{fmt(remain)}</span></span>
              </span>
              <motion.button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Resume timer' : 'Pause timer'}
                whileTap={reduced ? undefined : { scale: 0.92 }}
                className="grid size-11 place-items-center rounded-full bg-amber-400/20 text-amber-200 outline-none transition-colors duration-150 hover:bg-amber-400/30 focus-visible:ring-2 focus-visible:ring-amber-200"
              >
                {paused ? <Play aria-hidden className="size-4 translate-x-px" /> : <Pause aria-hidden className="size-4" />}
              </motion.button>
            </motion.div>
          )}
          {current === 'uploading' && (
            <motion.div key="up" {...fade} className="flex w-full flex-col gap-2.5 px-4">
              <span className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-400/15"><UploadCloud aria-hidden className="size-4.5 text-sky-300" /></span>
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate text-[13px] font-medium">{fileName}</span>
                  <span className="text-xs text-zinc-400">Uploading…</span>
                </span>
                <span className="font-mono text-[13px] tabular-nums text-sky-200">{Math.round(pct * 100)}%</span>
              </span>
              <span role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} className="relative h-1 overflow-hidden rounded-full bg-white/10">
                <motion.span className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-sky-400" initial={false} animate={{ scaleX: pct }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 30 }} />
              </span>
            </motion.div>
          )}
          {current === 'success' && (
            <motion.div key="ok" {...fade} className="flex items-center gap-2 px-4 text-[13px] font-medium">
              <motion.span
                className="grid size-6 place-items-center rounded-full bg-emerald-500"
                initial={reduced ? false : { scale: 0.4, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 520, damping: 22 }}
              >
                <Check aria-hidden className="size-3.5 text-black" strokeWidth={3} />
              </motion.span>
              Uploaded
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <span role="status" aria-live="polite" className="sr-only">{status}</span>
      {showControls && (
        <div role="group" aria-label="Island state" className="flex max-w-full flex-wrap justify-center gap-1.5">
          {STATES.map((st) => (
            <button
              key={st.id}
              type="button"
              aria-pressed={current === st.id}
              onClick={() => set(st.id)}
              className={cn(
                'min-h-9 rounded-full px-3 text-[13px] font-medium outline-none transition-[color,background-color,box-shadow] duration-150 pointer-coarse:min-h-11',
                'focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
                'active:scale-[0.97]',
                current === st.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                  : 'bg-white text-zinc-700 ring-1 ring-black/[0.08] hover:text-zinc-950 hover:ring-black/[0.14] dark:bg-zinc-900 dark:text-zinc-300 dark:ring-white/[0.1] dark:hover:text-white',
              )}
            >
              {st.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
