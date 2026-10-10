import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { docText } from './prose-styles'
import { cn } from '@/lib/cn'

type Part = { kind: 'text' | 'code' | 'strong'; text: string } | { kind: 'link'; text: string; href: string }

/** Renders the tiny `code` / **bold** / [label](href) markup shared by guides.ts and privacy.ts. */
export function InlineText({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === 'code') return <code key={i} className={docText.code}>{p.text}</code>
        if (p.kind === 'strong') return <strong key={i} className={docText.strong}>{p.text}</strong>
        if (p.kind === 'link')
          return p.href.startsWith('/') ? (
            <Link key={i} to={p.href} className={docText.link}>{p.text}</Link>
          ) : (
            <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className={docText.link}>
              {p.text}<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )
        return <React.Fragment key={i}>{p.text}</React.Fragment>
      })}
    </>
  )
}

/** The docs breadcrumb (DocPage / CategoryPage markup). The last crumb is the current page. */
export function DocBreadcrumb({ trail }: { trail: { name: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
        {trail.map((c, i) => (
          <React.Fragment key={c.name}>
            {i > 0 && <li aria-hidden><ChevronRight className="h-3.5 w-3.5" /></li>}
            {c.to ? (
              <li>
                <Link to={c.to} className="rounded-md px-1 py-0.5 underline-offset-2 hover:text-zinc-950 hover:underline dark:hover:text-white">{c.name}</Link>
              </li>
            ) : (
              <li aria-current="page" className="font-medium text-zinc-950 dark:text-white">{c.name}</li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Data table with the props-table look (DocPage → PropsTable): hairline 2xl frame, uppercase zinc-50 header,
 * mono signal first column when `mono`. Below md it becomes the same stacked cards, so phones never scroll sideways.
 */
export function DocTable({
  caption,
  head,
  rows,
  mono,
  className,
}: {
  caption: string
  head: React.ReactNode[]
  rows: React.ReactNode[][]
  mono?: boolean
  className?: string
}) {
  const first = mono ? 'font-mono text-xs font-medium text-signal-700 dark:text-signal-300' : 'font-medium text-zinc-950 dark:text-zinc-100'
  return (
    <div className={className}>
      <div
        role="region"
        aria-label={caption}
        tabIndex={0}
        className="framekit-scroll hidden overflow-x-auto rounded-2xl border border-zinc-950/[0.08] md:block dark:border-white/[0.08]"
      >
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              {head.map((h, i) => (
                <th key={i} scope="col" className="whitespace-nowrap px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-zinc-950/[0.08] align-top transition-colors hover:bg-zinc-50/70 dark:border-white/[0.08] dark:hover:bg-zinc-900/40">
                {r.map((c, ci) =>
                  ci === 0 ? (
                    <th key={ci} scope="row" className={cn('px-4 py-3 text-left', first)}>{c}</th>
                  ) : (
                    <td key={ci} className="px-4 py-3 text-zinc-700 dark:text-zinc-400">{c}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul aria-label={caption} className="space-y-3 md:hidden">
        {rows.map((r, ri) => (
          <li key={ri} className="rounded-2xl border border-zinc-950/[0.08] p-4 dark:border-white/[0.08]">
            <p className={cn('break-words', mono ? 'font-mono text-sm font-medium text-signal-700 dark:text-signal-300' : 'text-sm font-medium text-zinc-950 dark:text-zinc-100')}>{r[0]}</p>
            {r.slice(1).map((c, ci) => (
              <p key={ci} className="mt-1.5 break-words text-sm text-zinc-700 dark:text-zinc-400">
                <span className="mr-1.5 text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">{head[ci + 1]}</span>
                {c}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  )
}
