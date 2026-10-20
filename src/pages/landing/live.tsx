import * as React from 'react'
import { cn } from '@/lib/cn'

/** Mounts children only once the box is near the viewport, so heavy canvas demos cost nothing until you scroll to them. */
export function Live({ children, className, margin = '400px' }: { children: React.ReactNode; className?: string; margin?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [on, setOn] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || on) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [on, margin])
  return <div ref={ref} className={cn('relative', className)}>{on ? <React.Suspense fallback={null}>{children}</React.Suspense> : null}</div>
}

/** Width of an element, tracked. */
export function useBoxWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [w, setW] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    setW(el.clientWidth)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export const mono = 'font-mono text-[11px] font-medium uppercase tracking-[0.14em]'
