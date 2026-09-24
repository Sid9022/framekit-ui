import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*'

/** Characters decode from noise into the final text. */
export function ScrambleText({
  text,
  className,
  duration = 900,
  trigger = 'mount',
}: {
  text: string
  className?: string
  duration?: number
  trigger?: 'mount' | 'hover'
}) {
  const [display, setDisplay] = React.useState(text)
  const reduced = usePrefersReducedMotion()
  const frame = React.useRef(0)

  const run = React.useCallback(() => {
    if (reduced) {
      setDisplay(text)
      return
    }
    const start = performance.now()
    cancelAnimationFrame(frame.current)
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const reveal = Math.floor(t * text.length)
      const next = text
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < reveal) return text[i]
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')
      setDisplay(next)
      if (t < 1) frame.current = requestAnimationFrame(tick)
      else setDisplay(text)
    }
    frame.current = requestAnimationFrame(tick)
  }, [text, duration, reduced])

  React.useEffect(() => {
    if (trigger === 'mount') run()
    return () => cancelAnimationFrame(frame.current)
  }, [run, trigger])

  return (
    <span
      className={cn('font-mono tracking-wide', className)}
      onMouseEnter={() => trigger === 'hover' && run()}
      aria-label={text}
    >
      {display}
    </span>
  )
}
