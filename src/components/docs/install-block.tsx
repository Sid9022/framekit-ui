import { Link } from 'react-router-dom'
import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, Terminal } from 'lucide-react'
import { track } from '@vercel/analytics'
import { cn } from '@/lib/cn'
import { handleTablistKeys } from '@/lib/roving'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { REGISTRY_BASE } from '@/docs/site-url'

export const REGISTRY_URL = REGISTRY_BASE
export const registryItemUrl = (name: string) => `${REGISTRY_URL}/${name}.json`

/* ── package manager preference (persisted + shared across blocks) ───────── */

export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

const PM_KEY = 'framekit-package-manager'
const pmListeners = new Set<(pm: PackageManager) => void>()

function readPm(): PackageManager {
  if (typeof window === 'undefined') return 'npm'
  const v = localStorage.getItem(PM_KEY)
  return (PACKAGE_MANAGERS as readonly string[]).includes(v ?? '') ? (v as PackageManager) : 'npm'
}

export function usePackageManager() {
  const [pm, setPmState] = React.useState<PackageManager>(readPm)
  React.useEffect(() => {
    pmListeners.add(setPmState)
    return () => {
      pmListeners.delete(setPmState)
    }
  }, [])
  const setPm = React.useCallback((next: PackageManager) => {
    localStorage.setItem(PM_KEY, next)
    pmListeners.forEach((l) => l(next))
  }, [])
  return [pm, setPm] as const
}

/** `shadcn` runner per package manager. */
export function dlx(pm: PackageManager, args: string) {
  switch (pm) {
    case 'pnpm':
      return `pnpm dlx shadcn@latest ${args}`
    case 'yarn':
      return `yarn dlx shadcn@latest ${args}`
    case 'bun':
      return `bunx --bun shadcn@latest ${args}`
    default:
      return `npx shadcn@latest ${args}`
  }
}

/** Package install command per package manager. */
export function pmInstall(pm: PackageManager, pkgs: string[]) {
  const list = pkgs.join(' ')
  switch (pm) {
    case 'pnpm':
      return `pnpm add ${list}`
    case 'yarn':
      return `yarn add ${list}`
    case 'bun':
      return `bun add ${list}`
    default:
      return `npm install ${list}`
  }
}

/* ── copy button with a small check-morph + ring burst ──────────────────── */

export function CopyButton({
  value,
  meta,
  className,
  label = 'Copy',
}: {
  value: string
  meta?: { slug?: string; kind: string; pm?: string }
  className?: string
  label?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const [burst, setBurst] = React.useState(0)
  const reduced = usePrefersReducedMotion()
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /* clipboard blocked – still show feedback */
    }
    setCopied(true)
    setBurst((b) => b + 1)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1700)
    if (meta) track('copy', { slug: meta.slug ?? 'site', kind: meta.kind, ...(meta.pm ? { pm: meta.pm } : {}) })
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : label}
      className={cn(
        'fk-touch relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-zinc-600 transition-colors',
        'border-zinc-200 bg-white dark:border-zinc-700/80 dark:bg-zinc-900 dark:text-zinc-400',
        copied
          ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-400'
          : 'hover:border-zinc-300 hover:text-zinc-900 dark:hover:border-zinc-600 dark:hover:text-zinc-100',
        className,
      )}
    >
      {!reduced && burst > 0 && (
        <motion.span
          key={burst}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg border border-emerald-400/70"
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={reduced ? false : { scale: 0.4, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 22 }}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={reduced ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.4, rotate: 45, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 26 }}
          >
            <Copy className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/* ── one-line terminal command with package-manager tabs ────────────────── */

export function CommandTabs({
  build,
  meta,
  className,
  id,
}: {
  /** Returns the command for a package manager. */
  build: (pm: PackageManager) => string
  meta?: { slug?: string; kind: string }
  className?: string
  /** Unique id for the animated tab indicator. */
  id: string
}) {
  const [pm, setPm] = usePackageManager()
  const command = build(pm)
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-950/60',
        className,
      )}
    >
      <div className="flex items-center gap-1 border-b border-zinc-200 px-2 py-1.5 dark:border-zinc-800">
        <Terminal className="ml-1 mr-1.5 h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" aria-hidden />
        <div role="tablist" aria-label="Package manager" onKeyDown={handleTablistKeys} className="flex items-center gap-0.5">
          {PACKAGE_MANAGERS.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={pm === p}
              tabIndex={pm === p ? 0 : -1}
              onClick={() => setPm(p)}
              className={cn(
                'fk-touch relative rounded-md px-2.5 py-1 font-mono text-[12px] transition-colors',
                pm === p
                  ? 'text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              )}
            >
              {pm === p && (
                <motion.span
                  layoutId={`pm-pill-${id}`}
                  className="absolute inset-0 rounded-md bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{p}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 py-2.5 pl-4 pr-2.5">
        <code tabIndex={0} aria-label="Command" className="framekit-scroll min-w-0 flex-1 overflow-x-auto rounded-sm whitespace-nowrap font-mono text-[13px] leading-6 text-zinc-800 dark:text-zinc-200">
          <span className="select-none text-signal-600 dark:text-signal-400">$ </span>
          {command}
        </code>
        <CopyButton value={command} meta={meta ? { ...meta, pm } : undefined} label="Copy command" />
      </div>
    </div>
  )
}

/* ── dependency detection for the manual path (mirrors build-registry) ──── */

export type ManualDeps = { packages: string[]; helpers: string[]; theme: boolean }

export function detectDeps(code: string): ManualDeps {
  const packages = new Set<string>()
  const helpers = new Set<string>()
  const re = /from\s*['"]([^'"]+)['"]/g
  for (const m of code.matchAll(re)) {
    const spec = m[1]
    const lib = spec.match(/^@\/lib\/([\w-]+)$/)
    if (lib) {
      helpers.add(lib[1])
      continue
    }
    if (spec.startsWith('.') || spec.startsWith('@/')) continue
    const parts = spec.split('/')
    const pkg = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
    if (pkg !== 'react' && pkg !== 'react-dom') packages.add(pkg)
  }
  if (helpers.has('cn')) {
    packages.add('clsx')
    packages.add('tailwind-merge')
  }
  const theme = /\b(?:framekit|signal)-\d{2,3}\b|\bfont-display\b|\bframekit-scroll\b/.test(code)
  return { packages: [...packages].sort(), helpers: [...helpers].sort(), theme }
}

/* ── the per-component Install block ────────────────────────────────────── */

export function InstallBlock({
  slug,
  deps,
  onShowCode,
}: {
  slug: string
  deps: ManualDeps
  onShowCode?: () => void
}) {
  const [mode, setMode] = React.useState<'cli' | 'manual'>('cli')
  const [form, setForm] = React.useState<'url' | 'namespace'>('url')
  const target = form === 'url' ? registryItemUrl(slug) : `@framekit/${slug}`
  const c = 'rounded bg-zinc-100 px-1 py-px font-mono text-[12px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'

  return (
    <section
      id="install"
      data-install-block
      className="relative mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_1px_0_rgb(0_0_0/0.02),0_12px_32px_-18px_rgb(0_0_0/0.18)] dark:border-zinc-800 dark:bg-zinc-900/40 dark:shadow-none sm:p-5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-signal-400/70 to-transparent"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Install</h2>
          <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
            Adds the source, helpers and npm deps to your project — you own the code.
          </p>
        </div>
        <div role="tablist" aria-label="Install method" onKeyDown={handleTablistKeys} className="flex rounded-lg bg-zinc-100 p-0.5 text-xs dark:bg-zinc-800/80">
          {(
            [
              ['cli', 'CLI'],
              ['manual', 'Manual'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={mode === k}
              tabIndex={mode === k ? 0 : -1}
              onClick={() => setMode(k)}
              className={cn(
                'fk-touch relative rounded-md px-3 py-1 font-medium transition-colors',
                mode === k ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
              )}
            >
              {mode === k && (
                <motion.span
                  layoutId="install-mode-pill"
                  className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-zinc-950"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {mode === 'cli' ? (
        <div className="mt-4 space-y-3">
          <CommandTabs id="install" build={(pm) => dlx(pm, `add ${target}`)} meta={{ slug, kind: `install-${form}` }} />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <span>Address:</span>
              {(
                [
                  ['url', 'URL'],
                  ['namespace', '@framekit'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setForm(k)}
                  className={cn(
                    'fk-touch rounded-md px-2 py-0.5 font-mono transition-colors',
                    form === k
                      ? 'bg-signal-100 text-signal-800 dark:bg-signal-900/50 dark:text-signal-200'
                      : 'hover:text-zinc-800 dark:hover:text-zinc-200',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link to="/docs/installation" className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100">
              {form === 'namespace' ? 'Register @framekit in components.json →' : 'Setup & prerequisites →'}
            </Link>
          </div>
        </div>
      ) : (
        <ol className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          {deps.packages.length > 0 && (
            <li className="space-y-2">
              <p>
                <span className="mr-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">01</span>Install dependencies
              </p>
              <CommandTabs id="manual-deps" build={(pm) => pmInstall(pm, deps.packages)} meta={{ slug, kind: 'manual-deps' }} />
            </li>
          )}
          {deps.helpers.length > 0 && (
            <li>
              <span className="mr-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">{deps.packages.length ? '02' : '01'}</span>
              Add the shared helpers{' '}
              {deps.helpers.map((h, i) => (
                <React.Fragment key={h}>
                  {i > 0 && ', '}
                  <code className={c}>lib/{h}.ts</code>
                </React.Fragment>
              ))}{' '}
              — sources on the <Link className="text-signal-700 underline underline-offset-2 hover:text-signal-900 dark:text-signal-300 dark:hover:text-signal-100" to="/docs/installation">Installation</Link> page.
            </li>
          )}
          {deps.theme && (
            <li>
              <span className="mr-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">··</span>
              Uses Framekit tokens (<code className={c}>signal-*</code> / <code className={c}>framekit-*</code>); copy the{' '}
              <code className={c}>@theme</code> block from{' '}
              <Link className="text-signal-700 underline underline-offset-2 hover:text-signal-900 dark:text-signal-300 dark:hover:text-signal-100" to="/docs/theming">Theming</Link>.
            </li>
          )}
          <li>
            <span className="mr-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">→</span>
            Copy the source into <code className={c}>components/ui/{slug}.tsx</code>
            {onShowCode && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={onShowCode}
                  className="text-signal-700 underline underline-offset-2 hover:text-signal-900 dark:text-signal-300 dark:hover:text-signal-100"
                >
                  (open Code tab)
                </button>
              </>
            )}
            .
          </li>
        </ol>
      )}
    </section>
  )
}
