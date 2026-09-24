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
          There is no npm package to lock you in. Copy a file into your project, install its tiny dependencies,
          and customize freely.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Core primitives for everyday UI</li>
          <li>Animated signature components for landing pages and delight</li>
          <li>Dark mode via Tailwind <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">dark:</code> variants</li>
          <li>Respect for <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">prefers-reduced-motion</code></li>
        </ul>
        <Link to="/docs/installation"><Button variant="framekit">Install guide</Button></Link>
      </div>
    )
  }
  if (slug === 'installation') {
    return (
      <div className="max-w-2xl space-y-6 text-sm text-zinc-600 dark:text-zinc-400">
        <ol className="list-decimal space-y-4 pl-5">
          <li>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">Install peer dependencies</p>
            <CodeBlock language="bash" code={`npm install motion clsx tailwind-merge lucide-react`} />
          </li>
          <li>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">Add the <code>cn</code> helper</p>
            <CodeBlock language="tsx" code={sources.cn} />
          </li>
          <li>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">Copy a component</p>
            <p>Open any component page, switch to the Code tab, and paste into <code>components/ui/</code>.</p>
          </li>
        </ol>
        <div className="rounded-2xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">CLI · coming soon</p>
          <p className="mt-1">A future <code>npx framekit-ui add magnetic-button</code> flow is planned. For now, copy-paste wins.</p>
        </div>
      </div>
    )
  }
  if (slug === 'theming') {
    return (
      <div className="max-w-2xl space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          {SITE.name} uses Tailwind CSS v4 theme tokens. Signal lilac tokens live under{' '}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">signal-*</code>. Toggle dark mode by adding{' '}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">class="dark"</code> on <code>&lt;html&gt;</code>.
        </p>
        <CodeBlock
          language="css"
          code={`@theme {\n  --color-signal-300: #d4cbe5;\n  --color-signal-600: #7d6899;\n}`}
        />
      </div>
    )
  }
  return null
}

export function DocPage() {
  const { slug = 'introduction' } = useParams()
  const doc = getDoc(slug)
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview')

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

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{doc.category}</Badge>
        {doc.isNew && <Badge className="bg-signal-200 text-signal-800 dark:bg-signal-800 dark:text-signal-100">NEW</Badge>}
        {doc.unique && !doc.isNew && <Badge variant="secondary">Unique</Badge>}
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
            </div>
            {tab === 'preview' ? (
              <div className="framekit-stage flex min-h-[340px] flex-col items-center justify-center gap-4 p-10">
                <div className="flex w-full flex-1 items-center justify-center">{demo}</div>
                {doc.gesture && (
                  <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                    {doc.gesture}
                  </p>
                )}
              </div>
            ) : (
              <CodeBlock code={code || '// Source unavailable'} />
            )}
          </div>

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
              Copy the component source from the Code tab into <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">src/components/ui/{slug}.tsx</code>, then import it in your app.
            </p>
          </section>
        </>
      )}
    </article>
  )
}
