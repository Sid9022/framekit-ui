import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Heading glyphs drift like weather with scroll direction; DOM text stays readable. */
export function GlyphWeather({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [dir, setDir] = React.useState(0)
  const lastY = React.useRef(0)

  React.useEffect(() => {
    if (reduced) return
    const onScroll = () => {
      const y = window.scrollY
      setDir(Math.max(-1, Math.min(1, (y - lastY.current) * 0.08)))
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced])

  return (
    <span className={cn('inline-flex flex-wrap justify-center gap-[0.02em] text-4xl font-semibold tracking-tight sm:text-5xl', className)} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block will-change-transform"
          style={{
            transform: reduced
              ? undefined
              : `translateY(${Math.sin(i * 0.7) * dir * 10}px) rotate(${dir * (i % 3 - 1) * 2}deg)`,
            transition: 'transform 220ms ease-out',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}
