import * as React from 'react'
import { type CookLoadingState, CookLoading } from '@/components/ui/cook-loading'
import { cn } from '@/lib/cn'

function CookLoadingDemo() {
  const [state, setState] = React.useState<CookLoadingState>('loading')
  const [determinate, setDeterminate] = React.useState(false)
  const [progress, setProgress] = React.useState(42)
  const id = React.useId()
  const controls = 'min-h-11 rounded-full px-4 text-xs font-medium transition-colors hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:hover:bg-zinc-800 dark:active:bg-zinc-700 dark:focus-visible:ring-signal-300'
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 py-4">
      <CookLoading state={state} progress={determinate ? progress : undefined} onRetry={() => { setState('loading'); setProgress(0) }} />
      <div className="w-full border-t border-black/[0.08] pt-4 dark:border-white/[0.1]">
        <div role="group" aria-label="Preview loading state" className="flex flex-wrap justify-center gap-1 text-zinc-700 dark:text-zinc-300">
          {(['loading', 'done', 'error'] as const).map(value => <button key={value} type="button" aria-pressed={state === value} onClick={() => setState(value)} className={cn(controls, state === value && 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white')}>{value === 'loading' ? 'Cooking' : value === 'done' ? 'Ready' : 'Error'}</button>)}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          <label htmlFor={`${id}-show`} className="flex min-h-11 cursor-pointer items-center gap-2"><input id={`${id}-show`} type="checkbox" checked={determinate} onChange={event => setDeterminate(event.target.checked)} className="size-4 accent-zinc-800 dark:accent-zinc-200" />Show real progress</label>
          {determinate && <label htmlFor={`${id}-progress`} className="flex min-h-11 items-center gap-2"><span className="sr-only">Preview progress</span><input id={`${id}-progress`} type="range" min={0} max={100} value={progress} onChange={event => { setProgress(Number(event.target.value)); setState('loading') }} className="h-11 w-28 accent-zinc-800 dark:accent-zinc-200" /><span className="w-8 tabular-nums">{progress}%</span></label>}
        </div>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <CookLoadingDemo />

export default demo
