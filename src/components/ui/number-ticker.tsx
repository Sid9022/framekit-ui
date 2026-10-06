import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Counts up (or down) to a target number when in view, with locale-aware grouping. */
export function NumberTicker({
  value,
  className,
  duration = 1400,
  decimals = 0,
  prefix = '',
  suffix = '',
  startValue = 0,
  locale,
  separator = true,
  delay = 0,
}: {
  value: number
  className?: string
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  /** Where the first count starts from. */
  startValue?: number
  /** BCP 47 locale for digit grouping, e.g. `de-DE`. Defaults to the browser locale. */
  locale?: string
  /** Group thousands (12,840). */
  separator?: boolean
  /** Delay before the first count, in ms. */
  delay?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = React.useState(startValue)
  const reduced = usePrefersReducedMotion()
  const current = React.useRef(startValue)
  const [visible, setVisible] = React.useState(false)
  const first = React.useRef(true)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  React.useEffect(() => {
    if (!visible) return
    if (reduced) {
      current.current = value
      setDisplay(value)
      return
    }
    const from = current.current
    const wait = first.current ? delay : 0
    first.current = false
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      // expo-out: fast start, long settle
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      const v = from + (value - from) * eased
      current.current = v
      setDisplay(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    const timer = window.setTimeout(() => (raf = requestAnimationFrame(tick)), wait)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [visible, value, duration, reduced, delay])

  const fmt = React.useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: separator,
      }),
    [locale, decimals, separator],
  )
  const final = `${prefix}${fmt.format(value)}${suffix}`

  return (
    <span ref={ref} className={cn('relative inline-block tabular-nums', className)}>
      <span aria-hidden>
        {prefix}
        {fmt.format(display)}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
