import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Classic typewriter that types, pauses, then deletes through phrases. */
export function Typewriter({
  phrases,
  className,
  typingSpeed = 55,
  deleteSpeed = 35,
  pause = 1400,
}: {
  phrases: string[]
  className?: string
  typingSpeed?: number
  deleteSpeed?: number
  pause?: number
}) {
  const [index, setIndex] = React.useState(0)
  const [text, setText] = React.useState('')
  const [deleting, setDeleting] = React.useState(false)
  const reduced = usePrefersReducedMotion()

  React.useEffect(() => {
    if (reduced) {
      setText(phrases[0] ?? '')
      return
    }
    const current = phrases[index % phrases.length]
    if (!deleting && text === current) {
      const t = window.setTimeout(() => setDeleting(true), pause)
      return () => clearTimeout(t)
    }
    if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => i + 1)
      return
    }
    const t = window.setTimeout(
      () => {
        setText((prev) =>
          deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
        )
      },
      deleting ? deleteSpeed : typingSpeed,
    )
    return () => clearTimeout(t)
  }, [text, deleting, index, phrases, typingSpeed, deleteSpeed, pause, reduced])

  return (
    <span className={cn('font-mono', className)}>
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-current" />
    </span>
  )
}
