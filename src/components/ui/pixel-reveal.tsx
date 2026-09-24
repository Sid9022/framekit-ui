import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Image (or solid) reveals through a cascading pixel grid dissolve. */
export function PixelReveal({
  src,
  alt = '',
  className,
  cols = 12,
  rows = 8,
}: {
  src?: string
  alt?: string
  className?: string
  cols?: number
  rows?: number
}) {
  const [revealed, setRevealed] = React.useState(false)
  const reduced = usePrefersReducedMotion()
  const cells = React.useMemo(
    () =>
      Array.from({ length: cols * rows }, (_, i) => ({
        i,
        delay: reduced ? 0 : Math.random() * 0.7,
      })),
    [cols, rows, reduced],
  )

  React.useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={cn('relative overflow-hidden rounded-2xl', className)} style={{ aspectRatio: '3/2' }}>
      {src ? (
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-framekit-500 via-fuchsia-500 to-indigo-600" />
      )}
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {cells.map((c) => (
          <span
            key={c.i}
            className="bg-zinc-950 transition-opacity duration-500"
            style={{
              opacity: revealed ? 0 : 1,
              transitionDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
