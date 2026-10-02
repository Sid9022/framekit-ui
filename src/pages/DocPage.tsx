import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { ArrowLeft, ArrowRight, ChevronRight, Hand, RotateCcw } from 'lucide-react'
import { categorySlug, getDoc, getPrevNext } from '@/docs/registry'
import { NotFound, PreviewBoundary, PreviewSkeleton } from '@/components/docs/states'
import { handleTablistKeys } from '@/lib/roving'
import { demos } from '@/docs/demos'
import { sources } from '@/docs/sources'
import { CodeBlock } from '@/components/code-block'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SITE } from '@/config/site'
import { cn } from '@/lib/cn'
import { PreviewThemeToggle, usePreviewTheme } from '@/components/docs/preview-theme-toggle'
import { CommandTabs, InstallBlock, REGISTRY_URL, detectDeps, dlx, pmInstall, registryItemUrl } from '@/components/docs/install-block'

const DARK_VARIANT_LINE = `/* dark: follows the nearest .dark / .light ancestor */\n@custom-variant dark (&:where(.dark, .dark *):not(:where(.light, .light *):not(:where(.light .dark, .light .dark *))));`
const DARK_VARIANT_CSS = `@import "tailwindcss";\n\n${DARK_VARIANT_LINE}`

const REGISTRIES_JSON = `{\n  "registries": {\n    "@framekit": "${REGISTRY_URL}/{name}.json"\n  }\n}`

const THEME_TOKENS_CSS = `@theme {
  /* Framekit signal lilac */
  --color-signal-50: #f7f5fb;
  --color-signal-100: #efeaf6;
  --color-signal-200: #e4dcf0;
  --color-signal-300: #d4cbe5;
  --color-signal-400: #b9aad0;
  --color-signal-500: #9a86b8;
  --color-signal-600: #7d6899;
  --color-signal-700: #64527a;
  --color-signal-800: #4d3f5e;
  --color-signal-900: #352b42;
  /* Framekit signal orange */
  --color-framekit-50: #fff7ed;
  --color-framekit-100: #ffedd5;
  --color-framekit-200: #fed7aa;
  --color-framekit-300: #fdba74;
  --color-framekit-400: #fb923c;
  --color-framekit-500: #f97316;
  --color-framekit-600: #ea580c;
  --color-framekit-700: #c2410c;
  --color-framekit-800: #9a3412;
  --color-framekit-900: #7c2d12;
  --color-framekit-950: #431407;
  --font-display: "Instrument Serif", Georgia, serif;
}`

function Guide({ slug }: { slug: string }) {
  if (slug === 'introduction') {
    return (
      <div className="prose-zinc max-w-2xl space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>
          <strong className="text-zinc-900 dark:text-zinc-100">{SITE.name}</strong> is an open-source library of
          animated React components styled with Tailwind CSS and Motion. Inspired by the ergonomics of modern
          copy-paste kits — but every component here is original code you own.
        </p>
        <p>
          There is no npm package to lock you in. Add a component with the shadcn CLI (
          <code className="rounded bg-zinc-100 px-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">npx shadcn@latest add @framekit/&lt;name&gt;</code>) or copy the
          file by hand — either way the source lives in your repo and you customize freely.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Core primitives for everyday UI</li>
          <li>Animated signature components for landing pages and delight</li>
          <li>Works on light and dark pages: <code className="rounded bg-zinc-100 px-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">dark:</code> variants scoped to the nearest <code className="rounded bg-zinc-100 px-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">.dark</code> / <code className="rounded bg-zinc-100 px-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">.light</code> wrapper</li>
          <li>Respect for <code className="rounded bg-zinc-100 px-1 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">prefers-reduced-motion</code></li>
        </ul>
        <Link to="/docs/installation"><Button variant="framekit">Install guide</Button></Link>
      </div>
    )
  }
  if (slug === 'installation') {
    const c = 'rounded bg-zinc-100 px-1 py-px font-mono text-[12.5px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
    const step = 'font-medium text-zinc-900 dark:text-zinc-100'
    return (
      <div className="max-w-2xl space-y-10 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>
          Framekit UI ships as a <strong className="text-zinc-900 dark:text-zinc-100">shadcn registry</strong>: the
          shadcn CLI copies a component&apos;s source (plus the tiny shared helpers, theme tokens and npm deps it needs)
          straight into your project. Prefer to do it by hand? Every file is also available to copy-paste.
        </p>

        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Option A — shadcn CLI</h2>
            <Badge className="bg-signal-200 text-signal-800 dark:bg-signal-800 dark:text-signal-100">Recommended</Badge>
          </div>
          <ol className="list-decimal space-y-6 pl-5">
            <li className="space-y-2">
              <p className={step}>Prerequisites</p>
              <p>
                A React project on <strong className="text-zinc-900 dark:text-zinc-100">Tailwind CSS v4</strong> (Vite,
                Next.js, React Router…) with a <code className={c}>components.json</code> and an <code className={c}>@/*</code>{' '}
                path alias. If you don&apos;t have one yet, run <code className={c}>shadcn init</code> once:
              </p>
              <CommandTabs id="guide-init" build={(pm) => dlx(pm, 'init')} meta={{ kind: 'guide-init' }} />
            </li>
            <li className="space-y-2">
              <p className={step}>Dark mode (one-time, optional)</p>
              <p>
                <code className={c}>shadcn init</code> already adds <code className={c}>@custom-variant dark (&amp;:is(.dark *));</code>, which
                works out of the box. To also get Framekit&apos;s scoped behaviour (a <code className={c}>.light</code> wrapper forces light inside a
                dark page), replace that line in your global CSS with:
              </p>
              <CodeBlock language="css" code={DARK_VARIANT_LINE} trackMeta={{ kind: 'guide-dark-variant' }} />
            </li>
            <li className="space-y-2">
              <p className={step}>Add a component</p>
              <p>Every component page has an Install block with its exact command. For example:</p>
              <CommandTabs
                id="guide-add"
                build={(pm) => dlx(pm, `add ${registryItemUrl('loop-flight-send-button')}`)}
                meta={{ kind: 'guide-add-url' }}
              />
              <p>
                The CLI writes <code className={c}>components/ui/loop-flight-send-button.tsx</code>, adds the helpers it imports
                (<code className={c}>lib/cn.ts</code>, <code className={c}>lib/use-reduced-motion.ts</code>…) to your <code className={c}>lib</code>{' '}
                alias, installs npm deps such as <code className={c}>motion</code> / <code className={c}>lucide-react</code>, and merges the
                Framekit color tokens (<code className={c}>signal-*</code>, <code className={c}>framekit-*</code>) into your CSS when a component uses them.
              </p>
            </li>
            <li className="space-y-2">
              <p className={step}>Register the <code className={c}>@framekit</code> namespace (optional)</p>
              <p>
                Add the registry to <code className={c}>components.json</code> once, then install by name — several at a time if you like:
              </p>
              <CodeBlock language="json" code={REGISTRIES_JSON} trackMeta={{ kind: 'guide-registries-json' }} />
              <CommandTabs
                id="guide-ns"
                build={(pm) => dlx(pm, 'add @framekit/ghost-gobbler-skull @framekit/magnetic-button')}
                meta={{ kind: 'guide-add-namespace' }}
              />
              <p>
                The full index lives at{' '}
                <a className="text-signal-700 underline underline-offset-2 hover:text-signal-900 dark:text-signal-300 dark:hover:text-signal-100" href={`${REGISTRY_URL}/registry.json`} target="_blank" rel="noreferrer">
                  /r/registry.json
                </a>
                .
              </p>
            </li>
          </ol>
          <p className="rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-xs dark:border-zinc-700">
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">Heads-up:</strong> the Core items (
            <code className={c}>button</code>, <code className={c}>badge</code>, <code className={c}>card</code>, <code className={c}>input</code>,{' '}
            <code className={c}>dialog</code>…) share file names with shadcn/ui primitives. If a file already exists the CLI asks before
            overwriting it.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Option B — Manual copy-paste</h2>
          <ol className="list-decimal space-y-4 pl-5">
            <li className="space-y-2">
              <p className={step}>Install peer dependencies</p>
              <CommandTabs
                id="guide-deps"
                build={(pm) => pmInstall(pm, ['motion', 'clsx', 'tailwind-merge', 'lucide-react'])}
                meta={{ kind: 'guide-manual-deps' }}
              />
            </li>
            <li>
              <p className={step}>Add the <code className={c}>cn</code> helper → <code className={c}>lib/cn.ts</code></p>
              <CodeBlock language="tsx" code={sources.cn} trackMeta={{ slug: 'cn', kind: 'lib' }} />
            </li>
            <li>
              <p className={step}>Add the shared hooks (only if a component imports them)</p>
              <p className="mb-2">
                Animated components import <code className={c}>@/lib/use-reduced-motion</code>; canvas scenes that switch palettes also import{' '}
                <code className={c}>@/lib/use-resolved-theme</code>; the Toggles use <code className={c}>@/lib/toggle</code>.
              </p>
              <CodeBlock language="tsx" code={sources['use-reduced-motion']} trackMeta={{ slug: 'use-reduced-motion', kind: 'lib' }} />
              <div className="mt-3"><CodeBlock language="tsx" code={sources['use-resolved-theme']} trackMeta={{ slug: 'use-resolved-theme', kind: 'lib' }} /></div>
              <div className="mt-3"><CodeBlock language="tsx" code={sources.toggle} trackMeta={{ slug: 'toggle', kind: 'lib' }} /></div>
            </li>
            <li>
              <p className={step}>Enable class-based dark mode and the Framekit tokens</p>
              <p className="mb-2">Add this once to your global CSS (Tailwind v4). See <Link className="text-signal-700 underline underline-offset-2 hover:text-signal-900 dark:text-signal-300 dark:hover:text-signal-100" to="/docs/theming">Theming</Link>.</p>
              <CodeBlock language="css" code={DARK_VARIANT_CSS + '\n\n' + THEME_TOKENS_CSS} trackMeta={{ kind: 'guide-manual-css' }} />
            </li>
            <li>
              <p className={step}>Copy a component</p>
              <p>Open any component page, switch to the Code tab, and paste into <code className={c}>components/ui/</code>.</p>
            </li>
          </ol>
        </section>
      </div>
    )
  }
  if (slug === 'theming') {
    const c = 'rounded bg-zinc-100 px-1 dark:bg-zinc-800'
    return (
      <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>
          Every component is drop-in on both light and dark pages. Colors come from Tailwind{' '}
          <code className={c}>dark:</code> variants, and the variant is <strong className="text-zinc-900 dark:text-zinc-100">class-based</strong>:
          a <code className={c}>dark</code> class on any ancestor (usually <code>&lt;html&gt;</code>) switches components inside it to
          their dark look, and no class means light. To force light inside a dark page, wrap a section in{' '}
          <code className={c}>class="light"</code>; a nested <code className={c}>dark</code> flips it back.
        </p>
        <CodeBlock language="css" code={DARK_VARIANT_CSS} trackMeta={{ kind: 'theming-dark-variant' }} />
        <CodeBlock
          language="tsx"
          code={`<html className="dark">          {/* whole app dark */}\n  <section className="light">   {/* this area light again */}\n    <FaceScanPayButton />\n  </section>\n</html>`}
        />
        <p>
          Canvas-drawn scenes (Prism Tidal Field, Silk Shear, Ember Drift…) read the same rule through{' '}
          <code className={c}>useResolvedTheme</code> and accept <code className={c}>theme="auto" | "light" | "dark"</code>.
          Components marked <em>Brings its own background</em> are full scenes (404 pages, reels) that intentionally paint their
          own backdrop; override it with <code className={c}>className</code> (or <code className={c}>viewportClassName</code> on the reels).
          A few solid controls, like the Face Scan Pay or Dispatch Truck pills, are dark-branded by design and read well on white.
        </p>
        <p>
          Brand tokens: signal lilac lives under <code className={c}>signal-*</code>, the orange accent under{' '}
          <code className={c}>framekit-*</code>, plus a <code className={c}>font-display</code> serif. The shadcn CLI adds them for you
          (via the <code className={c}>framekit-theme</code> registry item); for manual installs paste this block into your global CSS:
        </p>
        <CodeBlock language="css" code={THEME_TOKENS_CSS} trackMeta={{ kind: 'theme-tokens' }} />
      </div>
    )
  }
  return null
}

/** Main component export: PascalCase(slug) when exported, else the first exported PascalCase function/const. */
function exportName(code: string | undefined, slug: string) {
  const pascal = slug.replace(/(^|-)([a-z0-9])/g, (_, __, ch: string) => ch.toUpperCase())
  if (code && new RegExp(`export\\s+(?:function|const)\\s+${pascal}\\b`).test(code)) return pascal
  const m =
    code?.match(/export\s+function\s+([A-Z][a-z]\w*)/) ?? code?.match(/export\s+const\s+([A-Z][a-z]\w*)/)
  return m?.[1] ?? pascal
}

const reveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } } }

function Breadcrumb({ category, title }: { category: string; title: string }) {
  const isGuide = category === 'Getting Started'
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
        <li>
          <Link to="/docs/introduction" className="rounded-md px-1 py-0.5 underline-offset-2 hover:text-zinc-950 hover:underline dark:hover:text-white">
            Docs
          </Link>
        </li>
        <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
        <li>
          {isGuide ? (
            <span>{category}</span>
          ) : (
            <Link to={`/docs/category/${categorySlug(category)}`} className="rounded-md px-1 py-0.5 underline-offset-2 hover:text-zinc-950 hover:underline dark:hover:text-white">
              {category}
            </Link>
          )}
        </li>
        <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>
        <li aria-current="page" className="font-medium text-zinc-950 dark:text-white">{title}</li>
      </ol>
    </nav>
  )
}

function PropsTable({ props }: { props: NonNullable<ReturnType<typeof getDoc>>['props'] }) {
  if (!props?.length) return null
  return (
    <section className="mt-12" aria-labelledby="props-h">
      <h2 id="props-h" className="text-xl font-semibold tracking-tight">Props</h2>
      {/* ≥ md: dense table */}
      <div
        role="region"
        aria-label="Props table"
        tabIndex={0}
        className="framekit-scroll mt-4 hidden overflow-x-auto rounded-2xl border border-zinc-200 md:block dark:border-zinc-800"
      >
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">Component props</caption>
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Prop</th>
              <th scope="col" className="px-4 py-3 font-medium">Type</th>
              <th scope="col" className="px-4 py-3 font-medium">Default</th>
              <th scope="col" className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {props.map((p) => (
              <tr key={p.name} className="border-t border-zinc-200 align-top transition-colors hover:bg-zinc-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/40">
                <th scope="row" className="px-4 py-3 text-left font-mono text-xs font-medium text-signal-700 dark:text-signal-300">{p.name}</th>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">{p.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">{p.default ?? '—'}</td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-400">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* < md: stacked cards — no sideways scrolling on phones */}
      <ul className="mt-4 space-y-3 md:hidden">
        {props.map((p) => (
          <li key={p.name} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="break-words font-mono text-sm font-medium text-signal-700 dark:text-signal-300">{p.name}</p>
            <p className="mt-1 break-words font-mono text-xs text-zinc-700 dark:text-zinc-300">{p.type}</p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-400">{p.description}</p>
            {p.default && (
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                Default <code className="rounded bg-zinc-100 px-1 py-px font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">{p.default}</code>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function PrevNext({ slug }: { slug: string }) {
  const { prev, next } = getPrevNext(slug)
  if (!prev && !next) return null
  const card =
    'group flex min-h-[72px] flex-1 flex-col justify-center rounded-2xl border border-zinc-200 p-4 transition-[border-color,background-color,transform] duration-200 hover:border-signal-400 hover:bg-white active:scale-[0.99] motion-reduce:transition-none dark:border-zinc-800 dark:hover:border-signal-500 dark:hover:bg-zinc-900/60'
  return (
    <nav aria-label="Previous and next" className="mt-16 flex flex-col gap-3 border-t border-zinc-200 pt-8 sm:flex-row dark:border-zinc-800">
      {prev ? (
        <Link to={`/docs/${prev.slug}`} rel="prev" className={card}>
          <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden /> Previous
          </span>
          <span className="mt-1 text-sm font-medium">{prev.title}</span>
        </Link>
      ) : <span className="hidden flex-1 sm:block" />}
      {next ? (
        <Link to={`/docs/${next.slug}`} rel="next" className={cn(card, 'sm:items-end sm:text-right')}>
          <span className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            Next <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </span>
          <span className="mt-1 text-sm font-medium">{next.title}</span>
        </Link>
      ) : <span className="hidden flex-1 sm:block" />}
    </nav>
  )
}

export function DocPage() {
  const { slug = 'introduction' } = useParams()
  const doc = getDoc(slug)
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview')
  const [previewTheme, setPreviewTheme] = usePreviewTheme()
  const [replay, setReplay] = React.useState(0)
  const [spin, setSpin] = React.useState(0)

  React.useEffect(() => {
    setTab('preview')
    setReplay(0)
  }, [slug])

  React.useEffect(() => {
    document.title = doc ? `${doc.title} — Framekit UI` : 'Not found — Framekit UI'
  }, [doc])

  const code = sources[slug]
  const deps = React.useMemo(() => detectDeps(code ?? ''), [code])

  if (!doc) return <NotFound slug={slug} />

  const isGuide = doc.category === 'Getting Started'
  const demo = demos[slug]

  return (
    <motion.article key={slug} className="mx-auto max-w-4xl" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={reveal}>
        <Breadcrumb category={doc.category} title={doc.title} />
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{doc.title}</h1>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-zinc-700 dark:text-zinc-400">{doc.description}</p>
        {(doc.isNew || doc.unique || doc.ownBackground) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {doc.isNew && <Badge className="bg-signal-200 text-signal-900 dark:bg-signal-800 dark:text-signal-100">NEW</Badge>}
            {doc.unique && !doc.isNew && <Badge variant="secondary">Original</Badge>}
            {doc.ownBackground && (
              <Badge variant="outline" title="This component paints its own backdrop. Override it with className / props.">
                Brings its own background
              </Badge>
            )}
          </div>
        )}
      </motion.header>

      {isGuide ? (
        <motion.div variants={reveal} className="mt-8"><Guide slug={slug} /></motion.div>
      ) : (
        <>
          <motion.section variants={reveal} aria-label="Component preview" className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_0_rgb(0_0_0/0.02),0_16px_40px_-24px_rgb(0_0_0/0.25)] dark:border-zinc-800 dark:bg-zinc-900/30 dark:shadow-none">
            <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 bg-zinc-50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div role="tablist" aria-label="Preview or code" onKeyDown={handleTablistKeys} className="relative flex items-center gap-0.5">
                {(['preview', 'code'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    id={`tab-${t}`}
                    aria-selected={tab === t}
                    aria-controls="doc-panel"
                    tabIndex={tab === t ? 0 : -1}
                    onClick={() => setTab(t)}
                    className={cn(
                      'fk-touch relative rounded-xl px-3.5 py-2 text-sm font-medium capitalize transition-colors duration-150',
                      tab === t ? 'text-zinc-950 dark:text-zinc-50' : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100',
                    )}
                  >
                    {tab === t && (
                      <motion.span
                        layoutId="doc-tab-pill"
                        className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800"
                        transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                      />
                    )}
                    <span className="relative">{t}</span>
                  </button>
                ))}
              </div>
              {tab === 'preview' && (
                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setReplay((r) => r + 1)
                      setSpin((s) => s + 1)
                    }}
                    aria-label="Replay preview"
                    title="Replay preview"
                    className="fk-touch inline-flex h-9 items-center gap-1.5 rounded-full border border-zinc-300 bg-white/80 px-3 text-xs font-medium text-zinc-700 transition-[background-color,color,transform] duration-150 hover:bg-white hover:text-zinc-950 active:scale-95 motion-reduce:active:scale-100 dark:border-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:text-white"
                  >
                    <motion.span key={spin} initial={{ rotate: 0 }} animate={{ rotate: spin ? -360 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="inline-flex">
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    </motion.span>
                    <span className="hidden sm:inline">Replay</span>
                  </button>
                  <PreviewThemeToggle value={previewTheme} onChange={setPreviewTheme} />
                </div>
              )}
            </div>
            <div id="doc-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
              {tab === 'preview' ? (
                <div
                  data-preview-stage
                  data-theme={previewTheme}
                  className={cn(
                    'framekit-stage flex min-h-[340px] flex-col items-center justify-center gap-4 overflow-x-clip p-4 transition-colors duration-300 sm:min-h-[380px] sm:p-10',
                    previewTheme,
                  )}
                >
                  <div className="flex w-full min-w-0 flex-1 items-center justify-center">
                    <PreviewBoundary resetKey={`${slug}-${replay}`}>
                      <React.Suspense fallback={<PreviewSkeleton />}>
                        <React.Fragment key={replay}>{demo ?? <p className="text-sm text-zinc-600">No live preview for this entry.</p>}</React.Fragment>
                      </React.Suspense>
                    </PreviewBoundary>
                  </div>
                  {doc.gesture && (
                    <p className="flex max-w-prose items-start justify-center gap-2 text-center text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                      <Hand className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span>{doc.gesture}</span>
                    </p>
                  )}
                </div>
              ) : (
                <CodeBlock code={code || '// Source unavailable'} label={`${doc.title} source`} trackMeta={{ slug, kind: 'source' }} className="rounded-none border-0" />
              )}
            </div>
          </motion.section>

          <motion.div variants={reveal}>
            <InstallBlock slug={slug} deps={deps} onShowCode={() => setTab('code')} />
          </motion.div>

          {doc.ownBackground && (
            <motion.p variants={reveal} className="mt-3 flex items-start gap-2 rounded-xl border border-dashed border-zinc-300 px-3 py-2.5 text-xs leading-relaxed text-zinc-700 dark:border-zinc-700 dark:text-zinc-400">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-600" aria-hidden />
              <span>
                <strong className="font-medium text-zinc-950 dark:text-zinc-100">Brings its own background.</strong>{' '}
                {doc.backgroundNote ?? 'This is a full-scene component that paints its own backdrop, so it looks the same on light and dark pages. Override the backdrop with className.'}
              </span>
            </motion.p>
          )}

          <motion.section variants={reveal} className="mt-12" aria-labelledby="usage-h">
            <h2 id="usage-h" className="text-xl font-semibold tracking-tight">Usage</h2>
            <p className="mt-2 max-w-[65ch] text-sm text-zinc-700 dark:text-zinc-400">
              Install with the CLI above (or copy the source from the Code tab into{' '}
              <code className="rounded bg-zinc-100 px-1 py-px font-mono text-[12.5px] dark:bg-zinc-800">components/ui/{slug}.tsx</code>), then import it:
            </p>
            <CodeBlock
              className="mt-3"
              language="tsx"
              label="Import statement"
              code={`import { ${exportName(code, slug)} } from '@/components/ui/${slug}'`}
              trackMeta={{ slug, kind: 'import' }}
            />
          </motion.section>

          <motion.div variants={reveal}>
            <PropsTable props={doc.props} />
          </motion.div>

          {doc.dependencies && doc.dependencies.length > 0 && (
            <motion.section variants={reveal} className="mt-12" aria-labelledby="deps-h">
              <h2 id="deps-h" className="text-xl font-semibold tracking-tight">Dependencies</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {doc.dependencies.map((d) => (
                  <li key={d}><Badge variant="outline">{d}</Badge></li>
                ))}
              </ul>
            </motion.section>
          )}
        </>
      )}

      <PrevNext slug={slug} />
    </motion.article>
  )
}
