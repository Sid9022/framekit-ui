import * as React from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ScrollTextFillProps = {
  /** The statement. Wrap words in [[double brackets]] to give them the accent treatment. */
  text?: string
  scrollContainer?: React.RefObject<HTMLElement | null>
  className?: string
}

const DEFAULT_TEXT = 'I design and build [[interfaces]] that feel calm on the surface and obsessive underneath — [[small states]] sweated over, motion that explains, and type that never fights the reader.'

function Word({ children, i, n, progress, accent, reduced }: { children: string; i: number; n: number; progress: MotionValue<number>; accent: boolean; reduced: boolean }) {
  const a = (i / n) * 0.85, b = a + 0.85 / n + 0.04
  const opacity = useTransform(progress, [a, b], [0.16, 1])
  const y = useTransform(progress, [a, b], [6, 0])
  const sweep = useTransform(progress, [a, b + 0.04], ['0%', '100%'])
  return (
    <motion.span className={cn('relative inline-block', accent && 'text-signal-800 dark:text-signal-200')} style={reduced ? undefined : { opacity, y }}>
      {children}
      {accent && <motion.span aria-hidden className="absolute inset-x-0 bottom-[0.06em] h-[0.07em] origin-left rounded-full bg-framekit-500" style={{ width: reduced ? '100%' : sweep }} />}
    </motion.span>
  )
}

/**
 * Scroll Text Fill — a large editorial statement whose words light up one by one as you scroll, each rising a few pixels
 * into place; accent words get a sweeping underline. The whole sentence stays readable to screen readers from the start.
 */
export function ScrollTextFill({ text = DEFAULT_TEXT, scrollContainer, className }: ScrollTextFillProps) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, container: scrollContainer, offset: ['start 0.9', 'end 0.45'] })
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 })
  const words = React.useMemo(() => {
    const out: { w: string; accent: boolean }[] = []
    text.split(/(\[\[.*?\]\])/g).forEach((chunk) => {
      const accent = chunk.startsWith('[[')
      const clean = accent ? chunk.slice(2, -2) : chunk
      clean.split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, accent }))
    })
    return out
  }, [text])
  const plain = text.replace(/\[\[|\]\]/g, '')
  return (
    <p ref={ref} aria-label={plain} className={cn('max-w-3xl font-display text-[2.1rem] leading-[1.12] tracking-tight text-zinc-950 sm:text-[3.4rem] dark:text-zinc-50', className)}>
      <span aria-hidden>
        {words.map((x, i) => <React.Fragment key={i}><Word i={i} n={words.length} progress={progress} accent={x.accent} reduced={reduced}>{x.w}</Word>{' '}</React.Fragment>)}
      </span>
    </p>
  )
}
