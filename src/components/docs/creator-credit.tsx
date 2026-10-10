import { Link } from 'react-router-dom'
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/icons'
import { SITE } from '@/config/site'
import { cn } from '@/lib/cn'

/**
 * Creator credit + social links, shared by the landing footer and the docs footer.
 * External links open in a new tab (rel="noopener noreferrer"), have an explicit aria-label and are 44px on touch / small screens.
 */
const SOCIAL_LINKS = [
  { label: `${SITE.creator.name} on LinkedIn`, href: SITE.creator.linkedin, Icon: LinkedinIcon },
  { label: `${SITE.creator.name} on X`, href: SITE.creator.x, Icon: XIcon },
  { label: `${SITE.name} source code on GitHub`, href: SITE.github, Icon: GithubIcon },
] as const

const ring =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B5BFF] dark:focus-visible:outline-[#8FA8FF]'

// Inline links grow their hit area with vertical padding (inline boxes don't change line height) → 44px on touch.
const textLink = cn(
  'rounded-sm font-medium text-zinc-950 underline decoration-zinc-950/25 decoration-1 underline-offset-[3px] transition-colors hover:decoration-zinc-950 max-sm:py-[13px] pointer-coarse:py-[13px] dark:text-white dark:decoration-white/30 dark:hover:decoration-white',
  ring,
)

const newTab = { target: '_blank', rel: 'noopener noreferrer' } as const

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <li key={href}>
          <a
            href={href}
            {...newTab}
            aria-label={`${label} (opens in a new tab)`}
            title={label}
            className={cn(
              'grid h-11 w-11 place-items-center rounded-full text-zinc-600 transition-[background-color,color,transform] duration-150 ease-out hover:bg-zinc-950/[0.05] hover:text-zinc-950 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 sm:h-9 sm:w-9 pointer-coarse:h-11 pointer-coarse:w-11 dark:text-zinc-400 dark:hover:bg-white/[0.07] dark:hover:text-white',
              ring,
            )}
          >
            <Icon className="h-[17px] w-[17px]" />
          </a>
        </li>
      ))}
    </ul>
  )
}

/** "Built by Siddhant Pal. The source code is on GitHub." */
export function CreatorCredit({ className }: { className?: string }) {
  return (
    <p className={cn('text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-400', className)}>
      Built by{' '}
      <a href={SITE.creator.linkedin} {...newTab} aria-label={`${SITE.creator.name} on LinkedIn (opens in a new tab)`} className={textLink}>
        {SITE.creator.name}
      </a>
      . The source code is available on{' '}
      <a href={SITE.github} {...newTab} aria-label={`${SITE.name} on GitHub (opens in a new tab)`} className={textLink}>
        GitHub
      </a>
      .
    </p>
  )
}

/** © line + Privacy and License links. */
export function LegalLinks({ className }: { className?: string }) {
  const item = cn(
    'rounded-sm transition-colors hover:text-zinc-950 max-sm:inline-flex max-sm:min-h-11 max-sm:items-center pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:items-center dark:hover:text-white',
    ring,
  )
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-0 text-xs text-zinc-600 dark:text-zinc-400', className)}>
      <li>
        © {new Date().getFullYear()} {SITE.name} · <span className="tabular-nums">v{SITE.version}</span>
      </li>
      <li>
        <Link to="/privacy" className={item}>Privacy</Link>
      </li>
      <li>
        <a href={SITE.licenseUrl} {...newTab} className={item}>
          License (MIT)<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  )
}
