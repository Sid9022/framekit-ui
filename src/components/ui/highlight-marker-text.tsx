import * as React from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type MarkKind = 'highlight' | 'underline' | 'circle' | 'box' | 'strike'
export type MarkTone = 'amber' | 'lilac' | 'mint' | 'rose'
export type MarkSegment = string | { text: string; mark?: MarkKind; tone?: MarkTone }

export type HighlightMarkerTextProps = {
  /** Plain strings and marked phrases, in reading order. */
  segments?: MarkSegment[]
  as?: 'p' | 'h2' | 'h3' | 'blockquote'
  /** ms between consecutive marks being drawn. */
  stagger?: number
  /** Draw only the first time it scrolls into view. */
  once?: boolean
  className?: string
}

export const DEFAULT_SEGMENTS: MarkSegment[] = [
  'Good software is ',
  { text: 'quiet', mark: 'highlight', tone: 'amber' },
  '. It ',
  { text: 'gets out of the way', mark: 'underline', tone: 'lilac' },
  ', remembers ',
  { text: 'what you meant', mark: 'circle', tone: 'rose' },
  ', and never makes you ',
  { text: 'wait for a spinner', mark: 'strike', tone: 'rose' },
  ' when it could ',
  { text: 'just answer', mark: 'box', tone: 'mint' },
  '.',
]

const TONE: Record<MarkTone, { fill: string; stroke: string }> = {
  amber: { fill: '[--mk:rgb(253_186_116/0.55)] dark:[--mk:rgb(194_65_12/0.5)]', stroke: 'text-orange-500 dark:text-orange-400' },
  lilac: { fill: '[--mk:rgb(185_170_208/0.75)] dark:[--mk:rgb(154_134_184/0.7)]', stroke: 'text-signal-600 dark:text-signal-300' },
  mint: { fill: '[--mk:rgb(110_231_183/0.5)] dark:[--mk:rgb(4_120_87/0.55)]', stroke: 'text-emerald-600 dark:text-emerald-400' },
  rose: { fill: '[--mk:rgb(253_164_175/0.55)] dark:[--mk:rgb(190_18_60/0.5)]', stroke: 'text-rose-600 dark:text-rose-400' },
}

const Ctx = React.createContext<{ on: boolean; reduced: boolean }>({ on: true, reduced: false })

export type MarkProps = { kind?: MarkKind; tone?: MarkTone; delay?: number; children: React.ReactNode }

/** A single hand-drawn mark. Inside `HighlightMarkerText` it draws on scroll-in; on its own it renders already drawn. */
export function Mark({ kind = 'highlight', tone = 'amber', delay = 0, children }: MarkProps) {
  const { on, reduced } = React.useContext(Ctx)
  const t = TONE[tone]
  const style = { transitionDelay: reduced ? '0ms' : `${delay}ms` }
  if (kind === 'highlight' || kind === 'underline') {
    return (
      <span
        className={cn(
          'rounded-[0.18em] bg-no-repeat [box-decoration-break:clone] [-webkit-box-decoration-break:clone]',
          'bg-[linear-gradient(var(--mk),var(--mk))] transition-[background-size] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none',
          t.fill,
          kind === 'highlight' ? 'px-[0.12em] [background-position:0_60%]' : '[background-position:0_95%]',
          kind === 'highlight' ? (on ? '[background-size:100%_78%]' : '[background-size:0%_78%]') : on ? '[background-size:100%_0.16em]' : '[background-size:0%_0.16em]',
        )}
        style={style}
      >
        {children}
      </span>
    )
  }
  return <DrawnMark kind={kind} stroke={t.stroke} delay={delay} on={on} reduced={reduced}>{children}</DrawnMark>
}

function DrawnMark({ kind, stroke, delay, on, reduced, children }: { kind: MarkKind; stroke: string; delay: number; on: boolean; reduced: boolean; children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [box, setBox] = React.useState({ w: 0, h: 0 })
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const m = () => setBox({ w: el.offsetWidth, h: el.offsetHeight })
    m()
    const ro = new ResizeObserver(m)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const pad = kind === 'strike' ? 2 : 8
  const W = box.w + pad * 2, H = box.h + pad * 2
  const d = React.useMemo(() => {
    if (!box.w) return ''
    if (kind === 'strike') {
      const y = H / 2 + 1
      return `M1 ${y + 1} C ${W * 0.3} ${y - 2}, ${W * 0.7} ${y + 2}, ${W - 1} ${y - 1.5}`
    }
    if (kind === 'box') return `M3 4 L${W - 2} 3 L${W - 3} ${H - 3} L2 ${H - 2} Z`
    const cx = W / 2, cy = H / 2, rx = W / 2 - 2, ry = H / 2 - 3, k = 0.5523
    return [
      `M${cx + rx * 0.12} ${cy - ry}`,
      `C${cx + rx * (0.12 + k)} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy}`,
      `C${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}`,
      `C${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}`,
      `C${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry * 1.04} ${cx - rx * 0.05} ${cy - ry * 1.02}`,
      `L${cx + rx * 0.3} ${cy - ry * 0.9}`,
    ].join(' ')
  }, [box.w, kind, W, H])
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      {d && (
        <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className={cn('pointer-events-none absolute overflow-visible', stroke)} style={{ left: -pad, top: -pad }}>
          <motion.path
            d={d}
            stroke="currentColor"
            strokeWidth={kind === 'box' ? 2 : 2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? 0 : 1 }}
            animate={on ? { pathLength: 1, opacity: 1 } : { pathLength: reduced ? 1 : 0, opacity: reduced ? 0 : 1 }}
            transition={reduced ? { duration: 0.2 } : { duration: kind === 'strike' ? 0.45 : 0.8, delay: delay / 1000, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>
      )}
    </span>
  )
}

/**
 * Highlight Marker Text — editorial copy annotated by hand. As the paragraph scrolls into view, a marker sweeps behind
 * one phrase, an underline draws under the next, a loose pen circle loops another, and a strike crosses out what you
 * don't mean, one after another. Wraps naturally across lines; reduced motion shows the marks already drawn.
 */
export function HighlightMarkerText({ segments = DEFAULT_SEGMENTS, as = 'p', stagger = 320, once = true, className }: HighlightMarkerTextProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { once, amount: 0.6 })
  const Tag = as as 'p'
  let n = 0
  return (
    <Ctx.Provider value={{ on: reduced || inView, reduced }}>
      <Tag
        ref={ref as React.RefObject<HTMLParagraphElement>}
        className={cn('max-w-[34ch] text-pretty text-2xl font-medium leading-[1.5] tracking-[-0.015em] text-zinc-900 sm:text-[2rem] dark:text-zinc-100', className)}
      >
        {segments.map((s, k) =>
          typeof s === 'string' || !s.mark ? (
            <React.Fragment key={k}>{typeof s === 'string' ? s : s.text}</React.Fragment>
          ) : (
            <Mark key={k} kind={s.mark} tone={s.tone} delay={150 + n++ * stagger}>
              {s.text}
            </Mark>
          ),
        )}
      </Tag>
    </Ctx.Provider>
  )
}
