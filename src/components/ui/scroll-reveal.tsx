import * as React from 'react'
import { motion, type Variant, type Variants } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ScrollRevealEffect = 'rise' | 'fade' | 'blur' | 'scale' | 'clip' | 'slide-left' | 'slide-right'

export type ScrollRevealProps = {
  children: React.ReactNode
  effect?: ScrollRevealEffect
  /** Seconds between each direct child when `stagger` is on. */
  stagger?: number
  delay?: number
  /** Travel distance in px for rise / slide effects. */
  distance?: number
  /** Animate only the first time it enters (default). */
  once?: boolean
  /** Fraction (0–1) of the element that must be visible. */
  amount?: number
  scrollContainer?: React.RefObject<HTMLElement | null>
  as?: 'div' | 'section' | 'article' | 'header' | 'footer'
  className?: string
}

const make = (effect: ScrollRevealEffect, d: number): Variants => {
  const base = { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0% 0% 0% 0%)' }
  const hidden: Record<ScrollRevealEffect, Variant> = {
    rise: { opacity: 0, y: d },
    fade: { opacity: 0 },
    blur: { opacity: 0, filter: 'blur(14px)', y: d / 3 },
    scale: { opacity: 0, scale: 0.86 },
    clip: { opacity: 1, clipPath: 'inset(0% 0% 100% 0%)', y: d / 2 },
    'slide-left': { opacity: 0, x: -d },
    'slide-right': { opacity: 0, x: d },
  }
  return { hidden: hidden[effect], show: base }
}

/**
 * Scroll Reveal — a wrapper that animates its content in when it scrolls into view. Seven effects (rise, fade, blur,
 * scale, clip, slide-left/right), optional staggering across direct children, any scroll container, and a no-motion
 * fallback that simply shows the content.
 */
export function ScrollReveal({ children, effect = 'rise', stagger = 0, delay = 0, distance = 40, once = true, amount = 0.25, scrollContainer, as = 'div', className }: ScrollRevealProps) {
  const reduced = usePrefersReducedMotion()
  const v = React.useMemo(() => make(effect, distance), [effect, distance])
  const Tag = motion[as] as typeof motion.div
  const t = { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }
  if (reduced) return React.createElement(as, { className }, children)
  if (stagger > 0) {
    const kids = React.Children.toArray(children)
    return (
      <Tag className={className} initial="hidden" whileInView="show" viewport={{ once, amount: Math.min(amount, 0.15), root: scrollContainer }} transition={{ staggerChildren: stagger, delayChildren: delay }}>
        {kids.map((k, i) => <motion.div key={i} variants={v} transition={t}>{k}</motion.div>)}
      </Tag>
    )
  }
  return (
    <Tag className={className} variants={v} initial="hidden" whileInView="show" viewport={{ once, amount, root: scrollContainer }} transition={{ ...t, delay }}>
      {children}
    </Tag>
  )
}
