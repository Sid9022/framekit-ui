import * as React from 'react'
import { type SnakeLoaderSkin, SnakeLoader } from '@/components/ui/snake-loader'
import { demoChip } from './_shared/demo-chip'
import { wait } from './_shared/wait'

const SNAKE_STEPS = ['Fetching 36 projects', 'Syncing 1,284 files', 'Rendering previews', 'Warming up the editor']

const SNAKE_ACCENTS = [
  { name: 'Emerald', value: undefined, swatch: '#10b981' },
  { name: 'Violet', value: '#8b5cf6', swatch: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b', swatch: '#f59e0b' },
]

function SnakeLoaderDemo() {
  const [progress, setProgress] = React.useState(0)
  const [run, setRun] = React.useState(0)
  const [failed, setFailed] = React.useState(false)
  const [skin, setSkin] = React.useState<SnakeLoaderSkin>('tiles')
  const [determinate, setDeterminate] = React.useState(true)
  const [accent, setAccent] = React.useState<string | undefined>(undefined)
  React.useEffect(() => {
    if (failed) return
    let alive = true
    setProgress(0)
    const go = async () => {
      await wait(700)
      let p = 0
      while (alive && p < 100) {
        p = Math.min(100, p + 0.6 + Math.random() * 3.4)
        setProgress(Math.round(p))
        await wait(p > 84 ? 480 : 220 + Math.random() * 280)
      }
    }
    void go()
    return () => {
      alive = false
    }
  }, [run, failed])
  const done = progress >= 100
  const restart = () => {
    setFailed(false)
    setRun((r) => r + 1)
  }
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5">
      <SnakeLoader
        progress={determinate ? progress : undefined}
        state={failed ? 'error' : done ? 'done' : 'loading'}
        label="Importing your workspace"
        description={failed ? `Connection dropped at ${progress}%` : done ? '36 projects · 1,284 files' : `${SNAKE_STEPS[Math.min(3, Math.floor(progress / 25))]}…`}
        readyLabel="Workspace imported"
        errorLabel="Import interrupted"
        onContinue={restart}
        onRetry={restart}
        skin={skin}
        color={accent}
      />
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Snake loader options">
        {(['tiles', 'lcd'] as const).map((s) => (
          <button key={s} type="button" aria-pressed={skin === s} className={demoChip(skin === s)} onClick={() => setSkin(s)}>
            {s === 'lcd' ? 'LCD' : 'Tiles'}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        <button type="button" role="switch" aria-checked={determinate} className={demoChip(determinate)} onClick={() => setDeterminate((d) => !d)}>
          {determinate ? 'Progress' : 'Indeterminate'}
        </button>
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {SNAKE_ACCENTS.map((a) => (
          <button
            key={a.name}
            type="button"
            aria-label={`${a.name} accent`}
            aria-pressed={accent === a.value}
            onClick={() => setAccent(a.value)}
            className="grid h-7 w-7 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
          >
            <span className={`h-3.5 w-3.5 rounded-full ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 ${accent === a.value ? 'ring-2 ring-zinc-900/70 dark:ring-white/70' : ''}`} style={{ backgroundColor: a.swatch }} />
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        <button type="button" className={demoChip(failed)} disabled={failed || done} onClick={() => setFailed(true)}>
          Fail
        </button>
        <button type="button" className={demoChip(false)} onClick={restart}>
          Reload
        </button>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <SnakeLoaderDemo />

export default demo
