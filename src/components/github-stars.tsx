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

/** Visual pill colours. They sit on the inner span and react to the outer link's hover/focus (group). */
const TONE = {
  /** Docs header: zinc hairline, lilac focus ring (the docs accent). */
  docs: cn(
    'border-zinc-200 bg-white/70 text-zinc-700 group-hover:border-zinc-300 group-hover:bg-white group-hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:group-hover:border-zinc-700 dark:group-hover:bg-zinc-900 dark:group-hover:text-white',
    'group-focus-visible:ring-2 group-focus-visible:ring-signal-600 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white dark:group-focus-visible:ring-signal-300 dark:group-focus-visible:ring-offset-zinc-950',
  ),
  /** Landing nav: the landing pill hairlines and its blue focus outline. */
  landing: cn(
    'border-black/[0.08] bg-white/60 text-zinc-700 group-hover:border-black/[0.14] group-hover:bg-white group-hover:text-zinc-950 dark:border-white/[0.10] dark:bg-white/[0.04] dark:text-zinc-300 dark:group-hover:border-white/[0.16] dark:group-hover:bg-white/[0.08] dark:group-hover:text-white',
    'group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[#2B5BFF] dark:group-focus-visible:outline-[#8FA8FF]',
  ),
} as const

/**
 * Header pill: GitHub glyph · star · count (or "Star" while the repo has no stars yet).
 * Below `sm` it's the compact mobile-bar variant: a 34px hairline pill inside a 44px-tall hit area, glyph + star + count,
 * or glyph + "Star" at zero. Below `sm` both bars show only the logo mark, which leaves room for the pill, search, theme and menu.
 */
export function GithubStarsPill({ tone, className }: { tone: keyof typeof TONE; className?: string }) {
  const stars = useGithubStars()
  const has = !!stars
  return (
    <a
      href={SITE.github}
      {...newTab}
      title={`Star ${SITE.name} on GitHub`}
      data-gh-stars-pill=""
      className={cn(
        'group inline-flex h-11 min-w-11 shrink-0 touch-manipulation items-center justify-center rounded-full outline-none sm:h-9 pointer-coarse:h-11',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex h-[34px] min-w-[34px] items-center justify-center gap-1.5 rounded-full border px-2.5 text-[13px] font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 ease-out group-active:scale-[0.97] motion-reduce:transition-none motion-reduce:group-active:scale-100 sm:h-9 sm:px-3',
          has && 'max-sm:gap-1',
          TONE[tone],
        )}
      >
        <GithubIcon className="h-4 w-4 shrink-0" />
        <span aria-hidden className="hidden h-3.5 w-px bg-current opacity-20 sm:block" />
        <Star
          aria-hidden
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-colors duration-150 group-hover:fill-amber-400 group-hover:text-amber-500 dark:group-hover:fill-amber-300 dark:group-hover:text-amber-300',
            has ? 'max-sm:ml-0.5 max-sm:h-3 max-sm:w-3' : 'hidden sm:block',
          )}
        />
        {/* Accessible name: "Star Framekit UI on GitHub, 1.2k stars (opens in a new tab)". No aria-label, so it always contains the visible text. */}
        <span className="sr-only">Star {SITE.name} on GitHub{has ? ', ' : ' '}</span>
        {has ? (
          <StarCount n={stars} className="min-w-[1ch]" />
        ) : (
          <span aria-hidden>Star</span>
        )}
        <span className="sr-only">{has ? (stars === 1 ? ' star ' : ' stars ') : ''}(opens in a new tab)</span>
      </span>
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
