import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const WORDS = ['forge', 'alive', 'signal', 'motion', 'craft']

/** Pointer leaves a springing trail of word pills. */
export function PillTrailCursor({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const [pills, setPills] = React.useState<{ id: number; x: number; y: number; word: string }[]>([])
  const id = React.useRef(0)

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-[#f3f2ef] dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
      onPointerMove={(e) => {
        if (reduced) return
        const r = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        const next = {
          id: id.current++,
          x,
          y,
          word: WORDS[id.current % WORDS.length],
        }
        setPills((prev) => [...prev.slice(-10), next])
      }}
    >
      <p className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        Move inside
      </p>
      {pills.map((p, i) => (
        <span
          key={p.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-medium text-signal-200 dark:bg-zinc-100 dark:text-zinc-900"
          style={{
            left: p.x,
            top: p.y,
            opacity: 0.35 + (i / pills.length) * 0.65,
            transform: `translate(-50%, -50%) scale(${0.75 + (i / pills.length) * 0.35})`,
          }}
        >
          {p.word}
        </span>
      ))}
    </div>
  )
}
