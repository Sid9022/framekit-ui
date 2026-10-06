import * as React from 'react'
import { animate, motion, useInView } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type InkBleedTextProps = {
  text?: string
  /** Word(s) inside `text` printed in the accent ink. */
  highlight?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  /** Start when scrolled into view or straight away. */
  trigger?: 'inView' | 'mount'
  /** ms between words (30–200). */
  stagger?: number
  /** ms for each word to dry (600–3000). */
  duration?: number
  /** Ink colour for the highlight and the bleeding blots. */
  accent?: string
  /** Show a small "Replay" button under the text. */
  showReplay?: boolean
  onComplete?: () => void
  className?: string
}

/**
 * Ink Bleed Text — a headline that soaks into the page. Each word lands as a
 * wet blot of ink that spreads through the paper fibres (an SVG turbulence
 * displacement that relaxes to zero), then dries crisp from a soft blur, word
 * by word. Screen readers get the whole sentence at once.
 */
export function InkBleedText({
  text = 'Good ideas spread slowly, then all at once.',
  highlight = 'spread slowly',
  as: Tag = 'h2',
  trigger = 'inView',
  stagger = 90,
  duration = 1400,
  accent = '#9f1239',
  showReplay = true,
  onComplete,
  className,
}: InkBleedTextProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const dispRef = React.useRef<SVGFEDisplacementMapElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const fid = React.useId().replace(/:/g, '')
  const [run, setRun] = React.useState(0)
  const [wet, setWet] = React.useState(false)
  const started = trigger === 'mount' || inView
  const st = Math.min(200, Math.max(30, stagger)) / 1000
  const dur = Math.min(3000, Math.max(600, duration)) / 1000

  const hl = highlight && text.includes(highlight) ? highlight : ''
  const tokens = React.useMemo(() => {
    const out: { w: string; hl: boolean }[] = []
    if (!hl) return text.split(/\s+/).map((w) => ({ w, hl: false }))
    const [pre, ...rest] = text.split(hl)
    pre.split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, hl: false }))
    hl.split(/\s+/).forEach((w) => out.push({ w, hl: true }))
    rest.join(hl).split(/\s+/).filter(Boolean).forEach((w, i) => {
      // glue punctuation directly after the highlight
      if (i === 0 && /^[.,;:!?]/.test(w) && out.length) out[out.length - 1] = { ...out[out.length - 1], w: out[out.length - 1].w + w }
      else out.push({ w, hl: false })
    })
    return out
  }, [text, hl])

  const total = dur + st * tokens.length

  React.useEffect(() => {
    if (!started || reduced) return
    setWet(true)
    const c = animate(34, 0, {
      duration: total,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => dispRef.current?.setAttribute('scale', v.toFixed(2)),
      onComplete: () => {
        setWet(false)
        onComplete?.()
      },
    })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, reduced, run, total])

  const show = started || reduced

  return (
    <div ref={ref} className={cn('relative', className)} style={{ ['--ink' as string]: accent }}>
      <svg aria-hidden className="absolute size-0">
        <filter id={fid} x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022 0.05" numOctaves="2" seed="7" result="t" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="t" scale="34" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Tag
        className="text-balance text-[clamp(34px,6.4vw,64px)] font-normal leading-[1.02] tracking-[-0.025em] text-zinc-950 dark:text-zinc-50"
        style={{ fontFamily: "var(--font-display, 'Instrument Serif'), 'Iowan Old Style', Georgia, serif" }}
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden key={run} className="inline" style={{ filter: wet ? `url(#${fid})` : undefined }}>
          {tokens.map((t, i) => (
            <span key={`${t.w}-${i}`} className="relative mr-[0.24em] inline-block last:mr-0">
              {!reduced && (
                <motion.span
                  className="pointer-events-none absolute -inset-x-[0.3em] -inset-y-[0.1em] rounded-[45%]"
                  style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--ink) 55%, transparent), transparent)' }}
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={show ? { opacity: [0, 0.6, 0], scale: [0.2, 1.15, 1.45] } : undefined}
                  transition={{ duration: dur * 0.9, delay: i * st, times: [0, 0.35, 1], ease: 'easeOut' }}
                />
              )}
              <motion.span
                className={cn('relative inline-block', t.hl && 'italic text-[var(--ink)] dark:text-[color-mix(in_oklab,var(--ink)_45%,#fff)]')}
                initial={reduced ? false : { opacity: 0, filter: 'blur(14px)', scale: 1.06 }}
                animate={show ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : undefined}
                transition={{ duration: dur, delay: i * st, ease: [0.16, 1, 0.3, 1] }}
              >
                {t.w}
              </motion.span>
            </span>
          ))}
        </span>
      </Tag>
      {showReplay && !reduced && (
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[13px] font-medium text-zinc-700 outline-none ring-1 ring-zinc-900/10 transition-colors hover:bg-zinc-900/[0.04] focus-visible:ring-2 focus-visible:ring-zinc-900 dark:text-zinc-300 dark:ring-white/15 dark:hover:bg-white/[0.06] dark:focus-visible:ring-white"
        >
          <RotateCcw aria-hidden className="size-4" /> Replay ink
        </button>
      )}
    </div>
  )
}
