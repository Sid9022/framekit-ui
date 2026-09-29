import * as React from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDoc } from '@/docs/registry'
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
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">npx shadcn@latest add @framekit/&lt;name&gt;</code>) or copy the
          file by hand — either way the source lives in your repo and you customize freely.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Core primitives for everyday UI</li>
          <li>Animated signature components for landing pages and delight</li>
          <li>Works on light and dark pages: <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">dark:</code> variants scoped to the nearest <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">.dark</code> / <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">.light</code> wrapper</li>
          <li>Respect for <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">prefers-reduced-motion</code></li>
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
                <a className="text-signal-700 underline-offset-2 hover:underline dark:text-signal-300" href={`${REGISTRY_URL}/registry.json`} target="_blank" rel="noreferrer">
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
              <p className="mb-2">Add this once to your global CSS (Tailwind v4). See <Link className="text-signal-700 underline-offset-2 hover:underline dark:text-signal-300" to="/docs/theming">Theming</Link>.</p>
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

export function DocPage() {
  const { slug = 'introduction' } = useParams()
  const doc = getDoc(slug)
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview')
  const [previewTheme, setPreviewTheme] = usePreviewTheme()

  React.useEffect(() => setTab('preview'), [slug])

  if (!doc) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="mt-2 text-zinc-500">No doc for “{slug}”.</p>
        <Link to="/docs/introduction" className="mt-4 inline-block text-signal-700 dark:text-signal-300 hover:underline">
          Back to docs
        </Link>
      </div>
    )
  }

  const isGuide = doc.category === 'Getting Started'
  const demo = demos[slug]
  const code = sources[slug]
  const deps = React.useMemo(() => detectDeps(code ?? ''), [code])

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{doc.category}</Badge>
        {doc.isNew && <Badge className="bg-signal-200 text-signal-800 dark:bg-signal-800 dark:text-signal-100">NEW</Badge>}
        {doc.unique && !doc.isNew && <Badge variant="secondary">Unique</Badge>}
        {doc.ownBackground && (
          <Badge
            variant="outline"
            title="This component paints its own backdrop. Override it with className / props, or pick a light variant where available."
          >
            Brings its own background
          </Badge>
        )}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{doc.description}</p>

      {isGuide ? (
        <div className="mt-8"><Guide slug={slug} /></div>
      ) : (
        <>
          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-1 border-b border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50">
              {(['preview', 'code'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-sm font-medium capitalize',
                    tab === t
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200',
                  )}
                >
                  {t}
                </button>
              ))}
              {tab === 'preview' && (
                <PreviewThemeToggle value={previewTheme} onChange={setPreviewTheme} className="ml-auto" />
              )}
            </div>
            {tab === 'preview' ? (
              <div
                data-preview-stage
                data-theme={previewTheme}
                className={cn(
                  'framekit-stage flex min-h-[340px] flex-col items-center justify-center gap-4 p-10 transition-colors duration-300',
                  previewTheme,
                )}
              >
                <div className="flex w-full flex-1 items-center justify-center">{demo}</div>
                {doc.gesture && (
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                    {doc.gesture}
                  </p>
                )}
              </div>
            ) : (
              <CodeBlock code={code || '// Source unavailable'} trackMeta={{ slug, kind: 'source' }} />
            )}
          </div>

          <InstallBlock slug={slug} deps={deps} onShowCode={() => setTab('code')} />

          {doc.ownBackground && (
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-xs leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-500" aria-hidden />
              <span>
                <strong className="font-medium text-zinc-900 dark:text-zinc-100">Brings its own background.</strong>{' '}
                {doc.backgroundNote ?? 'This is a full-scene component that paints its own backdrop, so it looks the same on light and dark pages. Override the backdrop with className.'}
              </span>
            </p>
          )}

          {doc.dependencies && doc.dependencies.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold">Dependencies</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {doc.dependencies.map((d) => (
                  <Badge key={d} variant="outline">{d}</Badge>
                ))}
              </div>
            </section>
          )}

          {doc.props && doc.props.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold">Props</h2>
              <div className="mt-3 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                    <tr>
                      <th className="px-4 py-3 font-medium">Prop</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Default</th>
                      <th className="px-4 py-3 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doc.props.map((p) => (
                      <tr key={p.name} className="border-t border-zinc-200 dark:border-zinc-800">
                        <td className="px-4 py-3 font-mono text-xs text-signal-700 dark:text-signal-300">{p.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{p.type}</td>
                        <td className="px-4 py-3 font-mono text-xs">{p.default ?? '—'}</td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-lg font-semibold">Usage</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Install with the CLI above (or copy the source from the Code tab into{' '}
              <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">components/ui/{slug}.tsx</code>), then import it:
            </p>
            <CodeBlock
              className="mt-3"
              language="tsx"
              code={`import { ${exportName(code, slug)} } from '@/components/ui/${slug}'`}
              trackMeta={{ slug, kind: 'import' }}
            />
          </section>
        </>
      )}
    </article>
  )
}
