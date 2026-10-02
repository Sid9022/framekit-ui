import * as React from 'react'
import { cn } from '@/lib/cn'

/**
 * Mounts its children the first time they get near the viewport. The landing page hosts a couple of
 * dozen canvas / rAF-driven demos; deferring the ones below the fold keeps first paint light and the
 * main thread calm. A same-size skeleton holds the space so nothing shifts when they appear.
 */
export function LazyMount({
  children,
  minHeight = 240,
  rootMargin = '320px 0px',
  className,
}: {
  children: React.ReactNode
  minHeight?: number
  rootMargin?: string
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown, rootMargin])

  return (
    <div ref={ref} className={className} style={shown ? undefined : { minHeight }}>
      {shown ? children : <div aria-hidden className={cn('fk-skeleton rounded-2xl')} style={{ height: minHeight }} />}
    </div>
  )
}
