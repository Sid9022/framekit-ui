import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const ROWS = [
  { titleW: '42%', metaW: '28%', tone: 'from-framekit-400/30 to-framekit-600/10' },
  { titleW: '58%', metaW: '22%', tone: 'from-signal-400/35 to-signal-600/10' },
  { titleW: '36%', metaW: '34%', tone: 'from-amber-300/30 to-orange-500/10' },
  { titleW: '50%', metaW: '26%', tone: 'from-violet-400/30 to-signal-500/10' },
  { titleW: '44%', metaW: '30%', tone: 'from-framekit-300/25 to-rose-400/10' },
]

/** Stacked list rows that bloom/reveal with staggered shimmer. */
export function ListBloomShimmer({
  className,
}: {
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [cycle, setCycle] = React.useState(0)

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setCycle((c) => c + 1), 4200)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div
      className={cn(
        'relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50 p-3 shadow-[0_22px_55px_-30px_rgba(53,43,66,0.4)] dark:border-zinc-800 dark:from-zinc-950 dark:to-[#141018]',
        className,
      )}
      role="status"
      aria-label="Loading list"
    >
      <div className="mb-3 flex items-center justify-between px-2 pt-1">
        <div className="h-2.5 w-24 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
          {!reduced && <ShimmerBar />}
        </div>
        <div className="h-2 w-10 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
          {!reduced && <ShimmerBar delay={0.2} />}
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {ROWS.map((row, i) => {
          const delay = i * 0.12
          const bloomKey = `${cycle}-${i}`
          return (
            <li
              key={bloomKey}
              className={cn(
                'relative flex items-center gap-3 overflow-hidden rounded-xl border border-zinc-100 bg-white/90 p-3 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)] dark:border-zinc-800/80 dark:bg-zinc-900/80',
              )}
              style={
                reduced
                  ? undefined
                  : {
                      animation: `fk-list-bloom 0.7s cubic-bezier(0.22,1,0.36,1) both`,
                      animationDelay: `${delay}s`,
                    }
              }
            >
              <div
                className={cn(
                  'relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br',
                  row.tone,
                  'bg-zinc-200 dark:bg-zinc-800',
                )}
              >
                {!reduced && <ShimmerBar delay={delay} />}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <div
                  className="h-3 overflow-hidden rounded-md bg-zinc-150 bg-zinc-200 dark:bg-zinc-800"
                  style={{ width: row.titleW }}
                >
                  {!reduced && <ShimmerBar delay={delay + 0.05} />}
                </div>
                <div
                  className="h-2 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800/80"
                  style={{ width: row.metaW }}
                >
                  {!reduced && <ShimmerBar delay={delay + 0.1} />}
                </div>
              </div>
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                {!reduced && <ShimmerBar delay={delay + 0.15} />}
              </div>

              {/* bloom highlight rim */}
              {!reduced && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(249,115,22,0.0)',
                    animation: `fk-list-rim 0.9s ease-out both`,
                    animationDelay: `${delay}s`,
                  }}
                />
              )}
            </li>
          )
        })}
      </ul>

      <style>{`
        @keyframes fk-list-bloom {
          0% { opacity: 0; transform: translateY(14px) scale(0.96); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes fk-list-rim {
          0% { box-shadow: inset 0 0 0 1px rgba(249,115,22,0.55), 0 0 24px rgba(154,134,184,0.25); }
          100% { box-shadow: inset 0 0 0 1px rgba(249,115,22,0), 0 0 0 transparent; }
        }
        @keyframes fk-list-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

function ShimmerBar({ delay = 0 }: { delay?: number }) {
  return (
    <span
      aria-hidden
      className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/25"
      style={{
        animation: 'fk-list-shimmer 1.6s ease-in-out infinite',
        animationDelay: `${delay}s`,
      }}
    />
  )
}
