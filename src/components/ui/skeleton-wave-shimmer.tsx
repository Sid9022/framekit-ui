import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Premium content-block skeleton with a diagonal liquid wave — not a basic pulse. */
export function SkeletonWaveShimmer({
  className,
}: {
  className?: string
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={cn(
        'relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-signal-50 p-5 shadow-[0_20px_50px_-24px_rgba(53,43,66,0.35)] dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-[#1a1524]',
        className,
      )}
      role="status"
      aria-label="Loading content"
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-framekit-500/10 blur-3xl dark:bg-framekit-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-signal-400/15 blur-3xl"
      />

      {/* header row */}
      <div className="relative flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          {!reduced && <WaveOverlay rounded="full" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Bone className="h-3 w-[55%]" reduced={reduced} />
          <Bone className="h-2.5 w-[38%]" reduced={reduced} />
        </div>
        <Bone className="h-7 w-16 rounded-full" reduced={reduced} />
      </div>

      {/* media block */}
      <div className="relative mt-5 overflow-hidden rounded-xl bg-zinc-200/90 dark:bg-zinc-800/90" style={{ aspectRatio: '16/9' }}>
        {!reduced && <WaveOverlay />}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(249,115,22,0.12),transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(154,134,184,0.14),transparent_55%)]"
        />
        {/* fake play glyph */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-sm dark:border-white/10 dark:bg-white/10">
            <span className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white/70" />
          </span>
        </div>
      </div>

      {/* body lines */}
      <div className="relative mt-5 space-y-2.5">
        <Bone className="h-3 w-full" reduced={reduced} />
        <Bone className="h-3 w-[92%]" reduced={reduced} />
        <Bone className="h-3 w-[68%]" reduced={reduced} />
      </div>

      {/* footer chips */}
      <div className="relative mt-5 flex gap-2">
        <Bone className="h-8 w-20 rounded-lg" reduced={reduced} />
        <Bone className="h-8 w-24 rounded-lg" reduced={reduced} />
        <Bone className="ml-auto h-8 w-8 rounded-lg" reduced={reduced} />
      </div>

      <style>{`
        @keyframes fk-skeleton-wave {
          0% { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(220%) skewX(-18deg); }
        }
      `}</style>
    </div>
  )
}

function Bone({
  className,
  reduced,
}: {
  className?: string
  reduced: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800',
        className,
      )}
    >
      {!reduced && <WaveOverlay />}
    </div>
  )
}

function WaveOverlay({ rounded }: { rounded?: 'full' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        rounded === 'full' && 'rounded-full',
      )}
    >
      <span
        className="absolute inset-y-0 w-[55%] bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/25"
        style={{
          animation: 'fk-skeleton-wave 1.85s cubic-bezier(0.4,0,0.2,1) infinite',
          filter: 'blur(2px)',
        }}
      />
      <span
        className="absolute inset-y-0 w-[35%] bg-gradient-to-r from-transparent via-framekit-300/40 to-transparent dark:via-framekit-400/30"
        style={{
          animation: 'fk-skeleton-wave 1.85s cubic-bezier(0.4,0,0.2,1) infinite',
          animationDelay: '0.35s',
          filter: 'blur(6px)',
        }}
      />
    </span>
  )
}
