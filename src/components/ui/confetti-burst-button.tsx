import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Check, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ConfettiBurstButtonProps = {
  label?: string
  /** Label shown after the burst. */
  doneLabel?: string
  /** Confetti colours. */
  colors?: string[]
  /** Particles per burst. Clamped 12–220. */
  count?: number
  /** Cone width in degrees. Clamped 20–360. */
  spread?: number
  /** Emoji / glyphs to throw instead of paper (e.g. ['✦', '❤']). */
  glyphs?: string[]
  /** ms before returning to the idle label. 0 stays done. */
  resetAfter?: number
  icon?: React.ReactNode
  onBurst?: () => void
  className?: string
}

type P = { x: number; y: number; vx: number; vy: number; r: number; vr: number; w: number; h: number; c: string; shape: 0 | 1 | 2; g?: string; life: number; wob: number }

/**
 * Confetti Burst Button — a celebratory primary action. Press it and the label rolls to a check while a cone of paper
 * confetti (or your own glyphs) bursts from the button, tumbling, drifting and fading with real drag and gravity.
 * The canvas lives only while particles do. Reduced motion keeps the state change and skips the particles.
 */
export function ConfettiBurstButton({
  label = 'Mark as shipped',
  doneLabel = 'Shipped',
  colors = ['#8b74b5', '#c4b5fd', '#f97316', '#fdba74', '#10b981', '#f472b6'],
  count = 110,
  spread = 70,
  glyphs,
  resetAfter = 2600,
  icon,
  onBurst,
  className,
}: ConfettiBurstButtonProps) {
  const reduced = usePrefersReducedMotion()
  const btn = React.useRef<HTMLButtonElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const parts = React.useRef<P[]>([])
  const raf = React.useRef(0)
  const timer = React.useRef(0)
  const [done, setDone] = React.useState(false)
  const [active, setActive] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => {
      cancelAnimationFrame(raf.current)
      window.clearTimeout(timer.current)
    }
  }, [])

  const run = React.useCallback(() => {
    const cv = canvas.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = window.innerWidth, H = window.innerHeight
    cv.width = W * dpr
    cv.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, W, H)
      const arr = parts.current
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i]
        p.vx *= 1 - 1.6 * dt
        p.vy = p.vy * (1 - 1.2 * dt) + 1100 * dt
        p.wob += dt * 8
        p.x += (p.vx + Math.sin(p.wob) * 30) * dt
        p.y += p.vy * dt
        p.r += p.vr * dt
        p.life -= dt
        if (p.life <= 0 || p.y > H + 40) {
          arr.splice(i, 1)
          continue
        }
        ctx.save()
        ctx.globalAlpha = Math.min(1, p.life / 0.6)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.r)
        if (p.g) {
          ctx.font = `${p.w * 2.2}px system-ui, sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillStyle = p.c
          ctx.fillText(p.g, 0, 0)
        } else {
          ctx.fillStyle = p.c
          ctx.scale(1, Math.cos(p.wob))
          if (p.shape === 1) {
            ctx.beginPath()
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
            ctx.fill()
          } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        }
        ctx.restore()
      }
      if (arr.length) raf.current = requestAnimationFrame(tick)
      else {
        raf.current = 0
        setActive(false)
      }
    }
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(tick)
  }, [])

  const burst = () => {
    const b = btn.current?.getBoundingClientRect()
    if (!b) return
    const n = Math.min(220, Math.max(12, count))
    const cone = (Math.min(360, Math.max(20, spread)) * Math.PI) / 180
    const ox = b.left + b.width / 2, oy = b.top + b.height / 2
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * cone
      const v = 520 + Math.random() * 620
      const shape = (Math.random() < 0.55 ? 0 : Math.random() < 0.6 ? 2 : 1) as 0 | 1 | 2
      const w = shape === 2 ? 4 : 6 + Math.random() * 5
      parts.current.push({
        x: ox + (Math.random() - 0.5) * b.width * 0.6,
        y: oy,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 14,
        w,
        h: shape === 2 ? 12 + Math.random() * 6 : w * 0.6,
        c: colors[i % colors.length],
        shape,
        g: glyphs?.length ? glyphs[i % glyphs.length] : undefined,
        life: 1.8 + Math.random() * 1.2,
        wob: Math.random() * Math.PI * 2,
      })
    }
    if (raf.current) return
    setActive(true)
  }

  React.useEffect(() => {
    if (active) run()
  }, [active, run])

  const click = () => {
    setDone(true)
    onBurst?.()
    if (!reduced) burst()
    window.clearTimeout(timer.current)
    if (resetAfter > 0) timer.current = window.setTimeout(() => setDone(false), resetAfter)
  }

  const swap = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: reduced ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(4px)' },
  }

  return (
    <>
      <motion.button
        ref={btn}
        type="button"
        onClick={click}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 560, damping: 28 }}
        className={cn(
          'relative inline-flex min-h-12 items-center gap-2.5 overflow-hidden rounded-full px-6 text-[15px] font-medium [touch-action:manipulation]',
          'shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(0_0_0/0.12),0_12px_28px_-12px_rgb(100_82_122/0.6)] transition-colors duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
          done ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950' : 'bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200',
          className,
        )}
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/15 to-transparent" />
        <span className="relative grid h-5 w-5 place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span key={done ? 'd' : 'i'} initial={reduced ? { opacity: 0 } : { scale: 0.3, rotate: -60, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { scale: 0.3, opacity: 0 }} transition={{ type: 'spring', stiffness: 520, damping: 24 }} className="grid">
              {done ? <Check className="h-5 w-5" strokeWidth={2.75} aria-hidden /> : icon ?? <PartyPopper className="h-5 w-5" aria-hidden />}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="relative inline-grid overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span key={done ? 'd' : 'i'} {...swap} transition={{ type: 'spring', stiffness: 460, damping: 30 }}>
              {done ? doneLabel : label}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
      <span role="status" aria-live="polite" className="sr-only">{done ? doneLabel : ''}</span>
      {mounted && active && createPortal(<canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[100] h-screen w-screen" />, document.body)}
    </>
  )
}
