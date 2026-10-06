import { cn } from '@/lib/cn'

/** Frosted liquid-glass surface with a specular rim, for content over vivid imagery. */
export function GlassCard({
  children,
  className,
  variant = 'regular',
  tint,
}: {
  children: React.ReactNode
  className?: string
  /**
   * `regular` frosts and adapts for legibility (default).
   * `clear` stays more transparent — only use it over bold, simple backgrounds.
   */
  variant?: 'regular' | 'clear'
  /** Optional CSS colour mixed into the glass, e.g. `rgba(249,115,22,0.18)`. */
  tint?: string
}) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-[28px] p-6 text-white',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.08),0_20px_48px_-16px_rgba(10,10,30,0.45)]',
        'ring-1 ring-white/25 ring-inset dark:ring-white/15',
        variant === 'regular'
          ? 'bg-zinc-900/[0.14] backdrop-blur-2xl backdrop-saturate-[1.4] dark:bg-zinc-950/35'
          : 'bg-white/[0.06] backdrop-blur-md backdrop-saturate-150 dark:bg-white/[0.04]',
        '[@media(prefers-reduced-transparency:reduce)]:bg-zinc-900/90 [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none',
        className,
      )}
    >
      {tint && <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: tint }} />}
      {/* specular rim: bright top edge fading down the sides */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.04)_38%,transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
      />
      <div className="relative">{children}</div>
    </div>
  )
}
