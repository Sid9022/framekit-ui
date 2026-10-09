import * as React from 'react'
import { GhostGobblerSkull } from '@/components/ui/ghost-gobbler-skull'
import { demoChip } from './_shared/demo-chip'

type GobblerDemoMode = 'auto' | 'manual' | 'indeterminate' | 'failure'

function GhostGobblerDemo() {
  const [mode, setMode] = React.useState<GobblerDemoMode>('auto')
  const [progress, setProgress] = React.useState(0.5)
  const [runKey, setRunKey] = React.useState(0)
  const [busy, setBusy] = React.useState(false)
  const replayTimer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(replayTimer.current), [])
  const failingTask = React.useMemo(
    () => () => new Promise<void>((_, reject) => window.setTimeout(() => reject(new Error('Cursed network')), 5200)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runKey],
  )
  const pick = (m: GobblerDemoMode) => {
    window.clearTimeout(replayTimer.current)
    setMode(m)
    setRunKey((k) => k + 1)
  }
  const summon = () => {
    if (busy) return
    setBusy(true)
    window.setTimeout(() => setBusy(false), 4200)
  }
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5 rounded-2xl bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff,#eeecf3)] px-6 pb-6 pt-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_75%_at_50%_35%,#1b1726,#07060a)] dark:shadow-none dark:ring-white/5">
      <GhostGobblerSkull
        key={mode}
        mode={mode === 'indeterminate' ? 'indeterminate' : 'determinate'}
        progress={mode === 'manual' ? progress : undefined}
        task={mode === 'failure' ? failingTask : undefined}
        resetKey={runKey}
        label={mode === 'failure' ? 'Summoning report' : 'Loading spirits'}
        onComplete={() => {
          if (mode !== 'auto') return
          window.clearTimeout(replayTimer.current)
          replayTimer.current = window.setTimeout(() => setRunKey((k) => k + 1), 3400)
        }}
      />
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Skull loader controls">
        {([
          ['auto', 'Autoplay'],
          ['manual', 'Determinate'],
          ['indeterminate', 'Indeterminate'],
          ['failure', 'Simulate failure'],
        ] as const).map(([m, l]) => (
          <button key={m} type="button" aria-pressed={mode === m} className={demoChip(mode === m)} onClick={() => pick(m)}>
            {l}
          </button>
        ))}
        <button type="button" className={demoChip(false)} onClick={() => pick(mode)}>
          Replay
        </button>
      </div>
      {mode === 'manual' && (
        <label className="flex w-full max-w-xs items-center gap-3 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Progress
          <input type="range" min={0} max={1} step={0.125} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="flex-1 accent-violet-500" aria-label="Loading progress" />
          <span className="w-9 text-right tabular-nums">{Math.round(progress * 100)}%</span>
        </label>
      )}
      <div className="grid w-full gap-3 border-t border-black/5 pt-5 sm:grid-cols-3 dark:border-white/5">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/70 p-4 ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/5">
          <button
            type="button"
            onClick={summon}
            aria-busy={busy}
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-zinc-900 pl-3 pr-4 text-[13px] font-semibold text-white shadow-sm outline-none transition hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-violet-400 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {busy ? (
              <GhostGobblerSkull size={24} spread={1.3} mode="indeterminate" speed={1.4} interactive={false} showLabel={false} label="Exporting" />
            ) : (
              <span aria-hidden className="text-base leading-none">☠</span>
            )}
            {busy ? 'Exporting…' : 'Export CSV'}
          </button>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Inline button loader</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/70 p-3 ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/5">
          <GhostGobblerSkull size={78} spread={1.5} mode="idle" label="Nothing haunted here" showLabel={false} />
          <span className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300">Inbox exorcised</span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Mascot / empty state — hover & click me</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/70 p-3 ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/5">
          <GhostGobblerSkull size={78} spread={1.6} mode="indeterminate" speed={1.25} ghostColor="#2a1240" glowPalette={['#86efac', '#4ade80', '#22c55e', '#a3e635', '#bef264', '#d9f99d', '#6ee7b7', '#fef08a']} label="Syncing" showLabel={false} />
          <span className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300">Syncing vault…</span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Indeterminate · violet smoke</span>
        </div>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <GhostGobblerDemo />

export default demo
