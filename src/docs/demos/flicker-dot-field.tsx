import * as React from 'react'
import { FlickerDotField } from '@/components/ui/flicker-dot-field'
import { handleTablistKeys } from '@/lib/roving'

function FlickerDotDemo() {
  const [shape, setShape] = React.useState<'square' | 'dot'>('square')
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3">
      <FlickerDotField shape={shape} flicker={shape === 'dot' ? 0.25 : 0.5}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-signal-700 dark:text-signal-300">Status</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-5xl dark:text-white">All systems normal</h3>
        <p className="mt-2 text-sm tabular-nums text-zinc-700 dark:text-zinc-300">99.99% uptime · last incident 41 days ago</p>
      </FlickerDotField>
      <div role="radiogroup" aria-label="Mark shape" onKeyDown={handleTablistKeys} className="inline-flex rounded-full bg-black/[0.04] p-1 dark:bg-white/[0.06]">
        {(['square', 'dot'] as const).map((s) => (
          <button key={s} type="button" role="radio" aria-checked={shape === s} tabIndex={shape === s ? 0 : -1} onClick={() => setShape(s)} className={'min-h-11 rounded-full px-4 text-xs font-medium capitalize transition-colors ' + (shape === s ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-700 dark:text-zinc-300')}>
            {s === 'square' ? 'LED squares' : 'Dot pattern'}
          </button>
        ))}
      </div>
    </div>
  )
}

const demo: React.ReactNode = <FlickerDotDemo />

export default demo
