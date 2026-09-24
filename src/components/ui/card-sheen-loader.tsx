import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Full product-card placeholder with traveling chrome sheen + subtle breathing. */
export function CardSheenLoader({
  className,
}: {
  className?: string
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={cn(
        'relative w-full max-w-[280px] overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_24px_60px_-28px_rgba(53,43,66,0.45)] dark:border-zinc-800 dark:bg-zinc-950',
        !reduced && 'fk-card-breathe',
        className,
      )}
      role="status"
      aria-label="Loading card"
      style={reduced ? undefined : { animation: 'fk-card-breathe 3.6s ease-in-out infinite' }}
    >
      {/* hero image placeholder */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-zinc-100 via-signal-100 to-framekit-100 dark:from-zinc-900 dark:via-[#221a30] dark:to-[#2a1810]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(249,115,22,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(154,134,184,0.3), transparent 45%)',
          }}
        />
        {/* fake product silhouette */}
        <div
          aria-hidden
          className="absolute bottom-3 left-1/2 h-24 w-28 -translate-x-1/2 rounded-2xl bg-white/35 shadow-inner backdrop-blur-[2px] dark:bg-white/10"
          style={{
            clipPath: 'polygon(15% 100%, 0% 45%, 30% 10%, 70% 0%, 100% 40%, 85% 100%)',
          }}
        />
        {!reduced && <ChromeSheen delay={0} />}
      </div>

      <div className="relative space-y-3 p-4">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-14" reduced={reduced} />
          <Pill className="h-5 w-10" reduced={reduced} />
        </div>
        <Pill className="h-4 w-[78%]" reduced={reduced} />
        <Pill className="h-3 w-[92%]" reduced={reduced} />
        <Pill className="h-3 w-[55%]" reduced={reduced} />

        <div className="flex items-end justify-between pt-2">
          <div className="space-y-2">
            <Pill className="h-5 w-16" reduced={reduced} />
            <Pill className="h-2.5 w-20" reduced={reduced} />
          </div>
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-framekit-400 to-framekit-600 shadow-lg shadow-framekit-500/30">
            {!reduced && <ChromeSheen delay={0.4} bright />}
          </div>
        </div>
      </div>

      {/* global sheen pass across whole card */}
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        >
          <div
            className="absolute -inset-y-8 w-24 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20"
            style={{
              animation: 'fk-sheen-travel 2.8s cubic-bezier(0.45,0,0.2,1) infinite',
              filter: 'blur(4px)',
            }}
          />
          <div
            className="absolute -inset-y-8 w-10 -skew-x-[20deg] bg-gradient-to-r from-transparent via-signal-200/60 to-transparent dark:via-signal-300/30"
            style={{
              animation: 'fk-sheen-travel 2.8s cubic-bezier(0.45,0,0.2,1) infinite',
              animationDelay: '0.12s',
              filter: 'blur(1px)',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes fk-sheen-travel {
          0% { left: -40%; opacity: 0; }
          12% { opacity: 1; }
          55% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        @keyframes fk-card-breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 24px 60px -28px rgba(53,43,66,0.45); }
          50% { transform: scale(1.012); box-shadow: 0 28px 70px -24px rgba(249,115,22,0.28); }
        }
      `}</style>
    </div>
  )
}

function Pill({
  className,
  reduced,
}: {
  className?: string
  reduced: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800/90',
        className,
      )}
    >
      {!reduced && <ChromeSheen delay={0.2} />}
    </div>
  )
}

function ChromeSheen({ delay = 0, bright }: { delay?: number; bright?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-transparent',
        bright ? 'via-white/70' : 'via-white/55 dark:via-white/20',
      )}
      style={{
        animation: 'fk-sheen-travel 2.8s cubic-bezier(0.45,0,0.2,1) infinite',
        animationDelay: `${delay}s`,
      }}
    />
  )
}
