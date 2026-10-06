import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Pause, Play, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type VideoLightboxDialogProps = {
  /** Your video file. Without it, a generated preview “plays” with captions. */
  videoSrc?: string
  /** Poster image for the thumbnail. Falls back to generated art. */
  posterSrc?: string
  title?: string
  /** Shown on the thumbnail chip, e.g. “2:14”. Defaults to the generated preview's length. */
  duration?: string
  /** Caption lines for the generated preview (one every ~2.5 s). */
  captions?: string[]
  onOpenChange?: (open: boolean) => void
  className?: string
}

const DEFAULT_CAPTIONS = [
  'Every release starts as a branch and a preview link.',
  'Reviewers comment right on the page, pinned to the pixel.',
  'Merge, and it is live in 38 regions within a minute.',
  'Roll back with one click if anything looks off.',
]

function Poster({ playing, reduced }: { playing?: boolean; reduced: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      animate={playing && !reduced ? { scale: [1, 1.08] } : { scale: 1 }}
      transition={playing && !reduced ? { duration: 12, ease: 'linear', repeat: Infinity, repeatType: 'reverse' } : { duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#2b2142_0%,#6b3e5e_45%,#f08a4b_78%,#ffd2a6_100%)]" />
      <div className="absolute left-[62%] top-[46%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fff3e0_0%,#ffc58a_45%,transparent_70%)] sm:h-40 sm:w-40" />
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-1/2 w-full">
        <path d="M0 60 L60 38 L110 56 L170 22 L230 52 L290 30 L350 50 L400 36 L400 100 L0 100Z" fill="#3a2440" opacity="0.75" />
        <path d="M0 78 L70 58 L140 74 L210 50 L280 72 L340 60 L400 70 L400 100 L0 100Z" fill="#1d1426" />
      </svg>
    </motion.div>
  )
}

/**
 * Video Lightbox Dialog — a cinematic thumbnail that opens into a focused player. The poster has a clear-glass play
 * button over a dimming layer; pressing it grows the frame into a modal on a shared-layout spring while the page
 * blurs back. Bring your own video, or enjoy the generated preview with captions. Esc, focus trap and focus return
 * included.
 */
export function VideoLightboxDialog({
  videoSrc,
  posterSrc,
  title = 'Ship a release in 90 seconds',
  duration,
  captions = DEFAULT_CAPTIONS,
  onOpenChange,
  className,
}: VideoLightboxDialogProps) {
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = React.useState(false)
  const [playing, setPlaying] = React.useState(true)
  const [t, setT] = React.useState(0)
  const trigger = React.useRef<HTMLButtonElement>(null)
  const dialog = React.useRef<HTMLDivElement>(null)
  const closeBtn = React.useRef<HTMLButtonElement>(null)
  const [host, setHost] = React.useState<Element | null>(null)
  const id = React.useId()
  const layout = `${id}-frame`
  const total = captions.length * 2.5

  const set = (v: boolean) => {
    setOpen(v)
    onOpenChange?.(v)
    if (v) {
      setT(0)
      setPlaying(true)
    }
  }

  React.useEffect(() => {
    setHost(trigger.current?.closest('.dark, .light') ?? document.body)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const f = window.setTimeout(() => closeBtn.current?.focus(), 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        set(false)
      }
      if (e.key === 'Tab' && dialog.current) {
        const els = Array.from(dialog.current.querySelectorAll<HTMLElement>('button, video, [href], [tabindex]:not([tabindex="-1"])'))
        if (!els.length) return
        const first = els[0], last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.clearTimeout(f)
      document.removeEventListener('keydown', onKey)
      trigger.current?.focus()
    }
  }, [open])

  React.useEffect(() => {
    if (!open || !playing || videoSrc) return
    const iv = window.setInterval(() => setT((v) => (v + 0.25 >= total ? 0 : v + 0.25)), 250)
    return () => window.clearInterval(iv)
  }, [open, playing, videoSrc, total])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const cap = captions[Math.min(captions.length - 1, Math.floor(t / 2.5))]
  const spring = { type: 'spring' as const, stiffness: 300, damping: 34 }

  return (
    <>
      <div className={cn('relative aspect-video w-full max-w-xl', className)}>
      {(!open || reduced) && (
      <motion.button
        ref={trigger}
        type="button"
        onClick={() => set(true)}
        layoutId={reduced ? undefined : layout}
        transition={spring}
        aria-haspopup="dialog"
        aria-label={`Play video: ${title}`}
        className={cn(
          'group absolute inset-0 block overflow-hidden rounded-[24px] text-left ring-1 ring-black/[0.08]',
          'shadow-[0_1px_2px_rgb(0_0_0/0.06),0_32px_64px_-32px_rgb(24_24_27/0.5)] dark:ring-white/[0.1] dark:shadow-[0_32px_64px_-32px_rgb(0_0_0/0.9)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
        )}
      >
        {posterSrc ? <img src={posterSrc} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <Poster reduced={reduced} />}
        <span aria-hidden className="absolute inset-0 bg-black/[0.28] transition-colors duration-300 group-hover:bg-black/[0.18]" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/20 text-white ring-1 ring-white/40 backdrop-blur-md backdrop-saturate-150 shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_12px_32px_-8px_rgb(0_0_0/0.5)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-active:scale-95 motion-reduce:transform-none sm:h-20 sm:w-20">
            <Play className="ml-1 h-7 w-7 fill-current" aria-hidden />
          </span>
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-5">
          <span className="text-pretty text-[15px] font-semibold tracking-tight text-white sm:text-lg">{title}</span>
          <span className="shrink-0 rounded-full bg-black/40 px-2 py-0.5 text-xs font-medium tabular-nums text-white ring-1 ring-white/20 backdrop-blur-md">{duration ?? fmt(total)}</span>
        </span>
        <span className="sr-only">Play video</span>
      </motion.button>
      )}
      </div>

      {host &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="fixed inset-0 z-[90] grid place-items-center p-3 sm:p-8">
                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => set(false)}
                />
                <motion.div
                  ref={dialog}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`${id}-title`}
                  layoutId={reduced ? undefined : layout}
                  initial={reduced ? { opacity: 0 } : undefined}
                  animate={reduced ? { opacity: 1 } : undefined}
                  exit={reduced ? { opacity: 0 } : undefined}
                  transition={spring}
                  className="relative w-full max-w-4xl overflow-hidden rounded-[28px] bg-black shadow-[0_40px_120px_-30px_rgb(0_0_0/0.8)] ring-1 ring-white/10 [overscroll-behavior:contain]"
                >
                  <div className="relative aspect-video w-full">
                    {videoSrc ? (
                      <video src={videoSrc} poster={posterSrc} controls autoPlay playsInline className="absolute inset-0 h-full w-full bg-black object-contain" />
                    ) : (
                      <>
                        <Poster playing={playing} reduced={reduced} />
                        <p aria-live="polite" className="absolute inset-x-4 bottom-16 mx-auto w-fit max-w-[90%] text-balance rounded-lg bg-black/65 px-3 py-1.5 text-center text-sm text-white sm:bottom-20 sm:text-base">{cap}</p>
                        <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-full bg-black/35 py-1 pl-1 pr-4 ring-1 ring-white/15 backdrop-blur-xl sm:inset-x-5 sm:bottom-5">
                          <button
                            type="button"
                            onClick={() => setPlaying((p) => !p)}
                            aria-label={playing ? 'Pause' : 'Play'}
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition-[background-color,transform] duration-150 hover:bg-white/15 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            {playing ? <Pause className="h-5 w-5 fill-current" aria-hidden /> : <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden />}
                          </button>
                          <span
                            role="progressbar"
                            aria-label="Playback position"
                            aria-valuemin={0}
                            aria-valuemax={Math.round(total)}
                            aria-valuenow={Math.round(t)}
                            aria-valuetext={`${fmt(t)} of ${fmt(total)}`}
                            className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                          >
                            <span className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-200 ease-linear" style={{ width: `${(t / total) * 100}%` }} />
                          </span>
                          <span className="text-xs tabular-nums text-white/90">{fmt(t)} / {fmt(total)}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-zinc-950 px-4 py-3 sm:px-5">
                    <h2 id={`${id}-title`} className="truncate text-sm font-semibold text-white sm:text-base">{title}</h2>
                    <button
                      ref={closeBtn}
                      type="button"
                      onClick={() => set(false)}
                      aria-label="Close video"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-[background-color,transform] duration-150 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          host,
        )}
    </>
  )
}
