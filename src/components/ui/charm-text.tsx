import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type CharmGlyph = 'spark' | 'drop' | 'bird' | 'leaf' | 'heart' | 'bolt' | 'star' | 'moon'
export type CharmTone = 'rose' | 'amber' | 'sky' | 'emerald' | 'violet'
export type CharmWord = { text: string; glyph: CharmGlyph; tone: CharmTone; /** Spoken / tooltip hint. */ hint?: string }
export type CharmSegment = string | CharmWord

export type CharmTextProps = {
  segments?: CharmSegment[]
  /** ink: the word recolours and a glyph sprouts above it. chip: a glyph pill sits in the sentence and wiggles. */
  variant?: 'ink' | 'chip'
  as?: 'p' | 'h1' | 'h2' | 'h3'
  className?: string
}

const TONES: Record<CharmTone, { text: string; chip: string; fill: string }> = {
  rose: { text: 'text-rose-700 dark:text-rose-300', chip: 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-500/50 dark:bg-rose-950/60 dark:text-rose-100', fill: 'fill-rose-500' },
  amber: { text: 'text-amber-700 dark:text-amber-300', chip: 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-500/50 dark:bg-amber-950/60 dark:text-amber-100', fill: 'fill-amber-500' },
  sky: { text: 'text-sky-700 dark:text-sky-300', chip: 'border-sky-300 bg-sky-50 text-sky-950 dark:border-sky-500/50 dark:bg-sky-950/60 dark:text-sky-100', fill: 'fill-sky-500' },
  emerald: { text: 'text-emerald-700 dark:text-emerald-300', chip: 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-500/50 dark:bg-emerald-950/60 dark:text-emerald-100', fill: 'fill-emerald-500' },
  violet: { text: 'text-violet-700 dark:text-violet-300', chip: 'border-violet-300 bg-violet-50 text-violet-950 dark:border-violet-500/50 dark:bg-violet-950/60 dark:text-violet-100', fill: 'fill-violet-500' },
}

const PATHS: Record<CharmGlyph, string> = {
  spark: 'M12 2 L14 9 L21 11 L14 13 L12 21 L10 13 L3 11 L10 9Z',
  drop: 'M12 2 C12 2 5 10 5 15 A7 7 0 0 0 19 15 C19 10 12 2 12 2Z',
  bird: 'M3 14 C6 13 8 10 10 6 C12 9 14 11 16 11 L21 9 L17 14 C16 18 12 21 7 20 C9 19 10 17 10 16 C7 16 4 15 3 14Z',
  leaf: 'M5 19 C5 9 11 4 20 4 C20 13 15 19 6 19 L3 22 L5 19Z',
  heart: 'M12 21 C4 14 3 10 3 8 A5 5 0 0 1 12 6 A5 5 0 0 1 21 8 C21 10 20 14 12 21Z',
  bolt: 'M13 2 L4 14 H11 L10 22 L20 9 H13Z',
  star: 'M12 2 L15 9 L22 9.5 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9.5 L9 9Z',
  moon: 'M20 14 A8 8 0 1 1 10 4 A6.5 6.5 0 0 0 20 14Z',
}

const Glyph = ({ g, className }: { g: CharmGlyph; className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><path d={PATHS[g]} /></svg>
)

const DEFAULT_SEGMENTS: CharmSegment[] = [
  'I make interfaces that ', { text: 'glow', glyph: 'spark', tone: 'amber', hint: 'micro-interactions' }, ' a little when you touch them — quiet like ',
  { text: 'water', glyph: 'drop', tone: 'sky', hint: 'calm motion' }, ', playful like a ', { text: 'songbird', glyph: 'bird', tone: 'violet', hint: 'delight' },
  ', and grown with ', { text: 'care', glyph: 'heart', tone: 'rose', hint: 'accessibility first' }, ' rather than assembled in a hurry.',
]

function Charm({ w, variant, reduced }: { w: CharmWord; variant: 'ink' | 'chip'; reduced: boolean }) {
  const [on, setOn] = React.useState(false)
  const [stuck, setStuck] = React.useState(false)
  const lit = on || stuck
  const tone = TONES[w.tone]
  if (variant === 'chip') {
    return (
      <motion.button type="button" aria-label={w.hint ? `${w.text}: ${w.hint}` : w.text} onClick={() => setStuck(!stuck)} aria-pressed={stuck}
        className={cn('mx-0.5 inline-flex min-h-11 items-center gap-[0.35em] rounded-full border px-[0.55em] py-[0.05em] align-middle text-[0.62em] font-sans font-medium leading-none outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white', tone.chip)}
        whileHover={reduced ? undefined : { y: -3, rotate: -3 }} whileTap={reduced ? undefined : { scale: 0.94 }} transition={{ type: 'spring', stiffness: 500, damping: 16 }}>
        <motion.span animate={stuck && !reduced ? { rotate: 360, scale: [1, 1.4, 1] } : { rotate: 0 }} transition={{ duration: 0.6 }} className="grid"><Glyph g={w.glyph} className={cn('size-[1.1em]', tone.fill)} /></motion.span>
        {w.text}
      </motion.button>
    )
  }
  return (
    <button type="button" aria-label={w.hint ? `${w.text}: ${w.hint}` : w.text} aria-pressed={stuck}
      onPointerEnter={() => setOn(true)} onPointerLeave={() => setOn(false)} onFocus={() => setOn(true)} onBlur={() => setOn(false)} onClick={() => setStuck(!stuck)}
      className={cn('relative inline cursor-pointer rounded-md bg-transparent p-0 align-baseline font-[inherit] text-[1em] leading-[inherit] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950', lit ? tone.text : 'text-inherit')}>
      <span className="relative">
        {w.text}
        <motion.span aria-hidden className="absolute inset-x-0 -bottom-0.5 h-[0.07em] origin-left rounded-full bg-current" initial={false} animate={{ scaleX: lit ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }} />
      </span>
      <AnimatePresence>
        {lit && (
          <motion.span aria-hidden className="pointer-events-none absolute -right-[0.3em] -top-[0.55em] grid" initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0, rotate: -40, y: 8 }} animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0, y: 6 }} transition={{ type: 'spring', stiffness: 520, damping: 16 }}>
            <Glyph g={w.glyph} className={cn('size-[0.6em] drop-shadow-sm', tone.fill)} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/**
 * Charm Text — a sentence with a few enchanted words. Hover, focus or tap one and it recolours, draws an underline and a tiny
 * glyph pops out on a spring; click pins it on. `chip` variant sets glyph pills inline that hop on hover. Hints are exposed to assistive tech.
 */
export function CharmText({ segments = DEFAULT_SEGMENTS, variant = 'ink', as: Tag = 'p', className }: CharmTextProps) {
  const reduced = usePrefersReducedMotion()
  return (
    <Tag className={cn('max-w-2xl font-display text-[2rem] leading-[1.25] tracking-tight text-zinc-950 sm:text-[2.7rem] dark:text-zinc-50', className)}>
      {segments.map((s, i) => (typeof s === 'string' ? <React.Fragment key={i}>{s}</React.Fragment> : <Charm key={i} w={s} variant={variant} reduced={reduced} />))}
    </Tag>
  )
}
