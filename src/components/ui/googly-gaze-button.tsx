import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string
}

/** Black pill with two eyes that track the cursor; click makes them smirk. */
export function GooglyGazeButton({
  label = 'Get in touch',
  className,
  children,
  onClick,
  ...props
}: Props) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLButtonElement>(null)
  const [gaze, setGaze] = React.useState({ x: 0, y: 0 })
  const [smirk, setSmirk] = React.useState(false)

  React.useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width * 0.78
      const cy = r.top + r.height / 2
      setGaze({
        x: Math.max(-1, Math.min(1, (e.clientX - cx) / 60)),
        y: Math.max(-1, Math.min(1, (e.clientY - cy) / 40)),
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        setSmirk(true)
        window.setTimeout(() => setSmirk(false), 420)
        onClick?.(e)
      }}
      className={cn(
        'inline-flex items-center gap-3 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-900/25 transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white',
        className,
      )}
      {...props}
    >
      <span>{children ?? label}</span>
      <span className="relative flex items-center gap-1.5" aria-hidden>
        {[0, 1].map((i) => (
          <span
            key={i}
            className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white"
          >
            <span
              className="absolute h-3 w-3 rounded-full bg-zinc-950"
              style={{
                transform: `translate(${gaze.x * 5}px, ${gaze.y * 4 + (smirk ? 2 : 0)}px) scaleY(${smirk ? 0.55 : 1})`,
                transition: reduced ? undefined : 'transform 90ms linear',
              }}
            />
          </span>
        ))}
      </span>
    </button>
  )
}
