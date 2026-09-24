import * as React from 'react'
import { cn } from '@/lib/cn'

/** Frosted pane slides to reveal an evidence layer — semantic disclosure. */
export function WindowpaneStoryCard({
  title,
  summary,
  evidence,
  className,
}: {
  title: string
  summary: string
  evidence: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#d4cbe5,transparent_45%),radial-gradient(circle_at_80%_70%,#c9dff2,transparent_40%)] opacity-70" />
      <div
        id={`${id}-evidence`}
        role="region"
        aria-label="Evidence layer"
        className="relative z-0 min-h-[180px] p-5 pt-14 text-sm text-zinc-700 dark:text-zinc-200"
      >
        {evidence}
      </div>
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-10 border-t border-white/40 bg-white/70 p-5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] dark:border-white/10 dark:bg-zinc-950/70',
          open ? 'translate-y-[62%]' : 'translate-y-0',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{summary}</p>
          </div>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${id}-evidence`}
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium dark:border-zinc-600 dark:bg-zinc-900"
          >
            {open ? 'Hide' : 'Reveal'}
          </button>
        </div>
      </div>
    </div>
  )
}
