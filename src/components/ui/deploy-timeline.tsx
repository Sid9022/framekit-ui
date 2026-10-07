import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, Check, ChevronRight, Circle, GitBranch, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type DeployStep = { id: string; label: string; detail?: string; logs?: string[]; duration?: number }
export type DeployStatus = 'pending' | 'running' | 'done' | 'error'

export type DeployTimelineProps = {
  /** Pipeline steps in order. `duration` is the simulated ms for each step. */
  steps?: DeployStep[]
  /** Run the simulated pipeline on mount. */
  autoPlay?: boolean
  /** Index of a step that fails on the first run (-1 never fails). Retry always succeeds. */
  failAt?: number
  /** Commit message shown in the header. */
  commit?: string
  /** Branch shown in the header. */
  branch?: string
  /** Fires when the pipeline ends. */
  onComplete?: (result: 'ready' | 'error') => void
  className?: string
}

export const DEFAULT_DEPLOY_STEPS: DeployStep[] = [
  { id: 'queue', label: 'Queued', detail: 'Waiting for a build slot', duration: 700, logs: ['Build machine: 4 cores · 8 GB', 'Region: fra1'] },
  { id: 'install', label: 'Install dependencies', detail: '412 packages', duration: 1400, logs: ['Restored cache (184 MB)', 'added 412 packages in 3.1s'] },
  { id: 'build', label: 'Build', detail: 'vite build', duration: 2000, logs: ['transforming 2,418 modules…', 'dist/index.html 0.62 kB', 'dist/assets/index.js 214.8 kB │ gzip 68.1 kB', '✓ built in 6.42s'] },
  { id: 'checks', label: 'Checks', detail: 'Types · lint · 128 tests', duration: 1300, logs: ['tsc -b — 0 errors', 'oxlint — 0 warnings', '128 passed (2.7s)'] },
  { id: 'domains', label: 'Assign domains', detail: 'preview + production', duration: 800, logs: ['lantern-app.example.dev', 'lantern-app-git-main.example.dev'] },
]

function StatusIcon({ status, reduced }: { status: DeployStatus; reduced: boolean }) {
  const common = 'relative z-10 grid size-6 place-items-center rounded-full'
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={status}
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
        transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 480, damping: 28 }}
        className={cn(
          common,
          status === 'done' && 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950',
          status === 'error' && 'bg-rose-600 text-white dark:bg-rose-500 dark:text-rose-950',
          status === 'running' && 'bg-white text-sky-700 ring-1 ring-sky-600/40 dark:bg-zinc-900 dark:text-sky-300 dark:ring-sky-400/40',
          status === 'pending' && 'bg-white text-zinc-400 ring-1 ring-black/[0.1] dark:bg-zinc-900 dark:text-zinc-600 dark:ring-white/[0.12]',
        )}
      >
        {status === 'done' && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
        {status === 'error' && <AlertTriangle aria-hidden className="size-3.5" strokeWidth={2.5} />}
        {status === 'running' && <Loader2 aria-hidden className="size-3.5 animate-spin motion-reduce:animate-none" strokeWidth={2.5} />}
        {status === 'pending' && <Circle aria-hidden className="size-2 fill-current" />}
      </motion.span>
    </AnimatePresence>
  )
}

/**
 * Deploy Timeline — a build pipeline that reads like a calm, live status page:
 * each step resolves from a hollow dot to a spinner to a tick, the connecting
 * rail fills as work completes, elapsed times tick in tabular figures, and
 * every row expands into its log lines. Failures stop the rail in rose with a
 * one-click retry; the final state is announced to screen readers.
 */
export function DeployTimeline({
  steps = DEFAULT_DEPLOY_STEPS,
  autoPlay = true,
  failAt = 3,
  commit = 'Tighten cold-start budget for edge routes',
  branch = 'main',
  onComplete,
  className,
}: DeployTimelineProps) {
  const reduced = usePrefersReducedMotion()
  const [cursor, setCursor] = React.useState(autoPlay ? 0 : -1)
  const [failed, setFailed] = React.useState(false)
  const [attempt, setAttempt] = React.useState(0)
  const [times, setTimes] = React.useState<number[]>(() => steps.map(() => 0))
  const [open, setOpen] = React.useState<string | null>(null)
  const startRef = React.useRef(0)
  const done = cursor >= steps.length
  const completeRef = React.useRef(onComplete)
  completeRef.current = onComplete

  React.useEffect(() => {
    if (cursor < 0 || cursor >= steps.length || failed) return
    startRef.current = performance.now()
    const tick = window.setInterval(() => setTimes((t) => t.map((v, i) => (i === cursor ? performance.now() - startRef.current : v))), 100)
    const willFail = attempt === 0 && cursor === failAt
    const end = window.setTimeout(() => {
      window.clearInterval(tick)
      setTimes((t) => t.map((v, i) => (i === cursor ? performance.now() - startRef.current : v)))
      if (willFail) { setFailed(true); setOpen(steps[cursor].id); completeRef.current?.('error') }
      else { setCursor((c) => c + 1); if (cursor + 1 === steps.length) completeRef.current?.('ready') }
    }, (steps[cursor].duration ?? 1000) * (willFail ? 0.6 : 1))
    return () => { window.clearInterval(tick); window.clearTimeout(end) }
  }, [cursor, failed, attempt, failAt, steps])

  const statusOf = (i: number): DeployStatus => (i < cursor ? 'done' : i === cursor ? (failed ? 'error' : 'running') : 'pending')
  const fill = steps.length > 1 ? Math.min(1, Math.max(0, cursor) / (steps.length - 1)) : 0
  const total = times.reduce((a, b) => a + b, 0)
  const retry = () => { setFailed(false); setAttempt((a) => a + 1); setOpen(null) }
  const run = () => { setTimes(steps.map(() => 0)); setFailed(false); setAttempt((a) => a + 1); setOpen(null); setCursor(0) }

  const headline = failed ? 'Build failed' : done ? 'Ready' : cursor < 0 ? 'Not started' : 'Building'
  const live = failed ? `Deployment failed at ${steps[cursor]?.label}. Retry available.` : done ? 'Deployment ready' : ''

  return (
    <section
      aria-label="Deployment"
      className={cn(
        'w-full max-w-xl overflow-hidden rounded-[20px] bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)]',
        'dark:bg-zinc-900 dark:ring-white/[0.08] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]',
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-black/[0.06] px-5 py-4 dark:border-white/[0.08]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                failed ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200' : done ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100' : 'bg-sky-50 text-sky-900 dark:bg-sky-950/60 dark:text-sky-100',
              )}
            >
              <span aria-hidden className={cn('size-1.5 rounded-full', failed ? 'bg-rose-600' : done ? 'bg-emerald-600' : 'bg-sky-600 animate-pulse motion-reduce:animate-none')} />
              {headline}
            </span>
            <span className="font-mono text-xs tabular-nums text-zinc-600 dark:text-zinc-400">{(total / 1000).toFixed(1)}s</span>
          </div>
          <p className="mt-2 truncate text-sm font-medium text-zinc-950 dark:text-zinc-50">{commit}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400"><GitBranch aria-hidden className="size-3.5" /><span translate="no">{branch}</span> · <span className="font-mono" translate="no">a41c9e2</span></p>
        </div>
        {(failed || done || cursor < 0) && (
          <motion.button
            type="button"
            onClick={failed ? retry : run}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[10px] bg-zinc-950 px-3 text-[13px] font-medium text-white outline-none transition-colors duration-150 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 pointer-coarse:min-h-11 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-900"
          >
            <RotateCcw aria-hidden className="size-3.5" /> {failed ? 'Retry build' : done ? 'Redeploy' : 'Deploy'}
          </motion.button>
        )}
      </header>
      <ol className="relative px-5 py-4">
        <span aria-hidden className="absolute bottom-9 left-[31px] top-7 w-px bg-black/[0.08] dark:bg-white/[0.1]" />
        <motion.span
          aria-hidden
          className={cn('absolute bottom-9 left-[31px] top-7 w-px origin-top', failed ? 'bg-rose-500' : 'bg-emerald-500')}
          initial={false}
          animate={{ scaleY: fill }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 24 }}
        />
        {steps.map((s, i) => {
          const st = statusOf(i)
          const isOpen = open === s.id
          return (
            <li key={s.id} className="relative">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`log-${s.id}`}
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="group flex min-h-11 w-full items-center gap-3 rounded-[10px] py-1.5 pl-0.5 pr-2 text-left outline-none transition-colors duration-150 hover:bg-zinc-900/[0.03] focus-visible:ring-2 focus-visible:ring-signal-600 dark:hover:bg-white/[0.04] dark:focus-visible:ring-signal-300"
              >
                <StatusIcon status={st} reduced={reduced} />
                <span className="min-w-0 flex-1">
                  <span className={cn('block truncate text-sm font-medium', st === 'pending' ? 'text-zinc-600 dark:text-zinc-400' : st === 'error' ? 'text-rose-800 dark:text-rose-200' : 'text-zinc-950 dark:text-zinc-50')}>{s.label}</span>
                  {s.detail && <span className="block truncate text-xs text-zinc-600 dark:text-zinc-400">{st === 'error' ? 'Exited with code 1 — see logs' : s.detail}</span>}
                </span>
                <span className="font-mono text-xs tabular-nums text-zinc-600 dark:text-zinc-400">{st === 'pending' ? '—' : `${(times[i] / 1000).toFixed(1)}s`}</span>
                <ChevronRight aria-hidden className={cn('size-4 text-zinc-500 transition-transform duration-200', isOpen && 'rotate-90')} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`log-${s.id}`}
                    initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 36 }}
                    className="overflow-hidden"
                  >
                    <pre className="mb-2 ml-9 mt-1 overflow-x-auto rounded-[10px] bg-zinc-950 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-zinc-300 ring-1 ring-white/[0.06] dark:bg-black/60">
                      {(st === 'pending' ? ['Waiting…'] : s.logs ?? []).map((l, k) => <div key={k} className="whitespace-pre">{l}</div>)}
                      {st === 'error' && <div className="text-rose-300">✗ 2 tests failed in edge/cold-start.test.ts</div>}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
      <span role="status" aria-live="polite" className="sr-only">{live}</span>
    </section>
  )
}
