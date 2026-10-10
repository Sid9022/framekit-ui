import { AnimatePresence, motion } from 'motion/react'
import { Star } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { SITE } from '@/config/site'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { formatStars, useGithubStars } from '@/hooks/use-github-stars'

/** "Star on GitHub" pills with a live star count (site chrome, not a registry component). Data: hooks/use-github-stars.ts. */

/** The number, rolled up once when it changes after mount. Reduced motion cross-fades instead. */
function StarCount({ n, className }: { n: number; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const text = formatStars(n)
  return (
    <span className={cn('relative inline-flex overflow-hidden tabular-nums', className)}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={text}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: '70%', filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: '-70%', filter: 'blur(3px)' }}
          transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 460, damping: 32 }}
          className="inline-block"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const newTab = { target: '_blank', rel: 'noopener noreferrer' } as const

const TONE = {
  /** Docs header: zinc hairline, lilac focus ring (the docs accent). */
  docs: cn(
    'border-zinc-200 bg-white/70 text-zinc-700 hover:border-zinc-300 hover:bg-white hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-white',
    'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-950',
  ),
  /** Landing nav: the landing pill hairlines and its blue focus outline. */
  landing: cn(
    'border-black/[0.08] bg-white/60 text-zinc-700 hover:border-black/[0.14] hover:bg-white hover:text-zinc-950 dark:border-white/[0.10] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:border-white/[0.16] dark:hover:bg-white/[0.08] dark:hover:text-white',
    'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF] dark:focus-visible:outline-[#8FA8FF]',
  ),
} as const

/**
 * Compact header pill: GitHub glyph · star · count. Below `sm` it collapses to the glyph plus the count
 * (or the glyph alone when there's no count) so it keeps the old icon button's 44px footprint.
 */
export function GithubStarsPill({ tone, className }: { tone: keyof typeof TONE; className?: string }) {
  const stars = useGithubStars()
  const has = !!stars
  return (
    <a
      href={SITE.github}
      {...newTab}
      title={`Star ${SITE.name} on GitHub`}
      className={cn(
        'group inline-flex h-11 shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-full border text-[13px] font-medium transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100',
        'sm:h-9 sm:px-3 pointer-coarse:h-11',
        has ? 'px-3' : 'w-11 sm:w-auto',
        TONE[tone],
        className,
      )}
    >
      <GithubIcon className="h-4 w-4 shrink-0" />
      <span aria-hidden className="hidden h-3.5 w-px bg-current opacity-20 sm:block" />
      <Star aria-hidden className="hidden h-3.5 w-3.5 shrink-0 transition-colors duration-150 group-hover:fill-amber-400 group-hover:text-amber-500 sm:block dark:group-hover:fill-amber-300 dark:group-hover:text-amber-300" />
      {/* Accessible name: "Star Framekit UI on GitHub, 1.2k stars (opens in a new tab)". No aria-label, so it always contains the visible text. */}
      <span className="sr-only">Star {SITE.name} on GitHub{has ? ', ' : ' '}</span>
      {has ? <StarCount n={stars} className="min-w-[1ch]" /> : <span aria-hidden className="hidden sm:inline">Star</span>}
      <span className="sr-only">{has ? (stars === 1 ? ' star ' : ' stars ') : ''}(opens in a new tab)</span>
    </a>
  )
}

/** Secondary hero link: a quiet text line under the CTAs. */
export function GithubStarsLink({ className, focusClassName }: { className?: string; focusClassName?: string }) {
  const stars = useGithubStars()
  return (
    <a
      href={SITE.github}
      {...newTab}
      className={cn(
        'group inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-full px-3 text-[13px] font-medium text-zinc-600 transition-[color,transform] duration-150 hover:text-zinc-950 active:scale-[0.97] motion-reduce:active:scale-100 dark:text-zinc-400 dark:hover:text-white',
        focusClassName,
        className,
      )}
    >
      <GithubIcon className="h-4 w-4 shrink-0" />
      <span className="underline decoration-zinc-950/25 decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-150 group-hover:decoration-zinc-950 dark:decoration-white/30 dark:group-hover:decoration-white">Star on GitHub</span>
      {stars ? (
        <span aria-hidden className="inline-flex items-center gap-1 rounded-full bg-black/[0.05] px-2 py-0.5 text-[12px] text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-300">
          <Star className="h-3 w-3 fill-current" />
          <StarCount n={stars} />
        </span>
      ) : null}
      <span className="sr-only"> ({stars ? `${stars.toLocaleString('en-US')} ${stars === 1 ? 'star' : 'stars'}, ` : ''}opens in a new tab)</span>
    </a>
  )
}

/** Count chip for full-width menu buttons ("Star on GitHub  ★ 1.2k"). */
export function GithubStarsChip({ className }: { className?: string }) {
  const stars = useGithubStars()
  if (!stars) return null
  return (
    <span aria-hidden className={cn('inline-flex items-center gap-1 tabular-nums', className)}>
      <Star className="h-3 w-3 fill-current" />
      <StarCount n={stars} />
    </span>
  )
}
