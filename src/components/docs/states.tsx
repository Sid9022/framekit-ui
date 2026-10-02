import * as React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RotateCcw, SearchX } from 'lucide-react'
import { useCommandPalette } from '@/components/command-palette'
import { cn } from '@/lib/cn'

/** Skeleton for a docs page while its chunk / demo loads (shape matches the real layout: no shift). */
export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl" role="status" aria-live="polite" aria-label="Loading page">
      <div className="fk-skeleton h-5 w-40 rounded-full" />
      <div className="fk-skeleton mt-4 h-9 w-2/3 max-w-sm rounded-xl" />
      <div className="fk-skeleton mt-3 h-4 w-full max-w-xl rounded-md" />
      <div className="fk-skeleton mt-8 h-[420px] w-full rounded-2xl" />
      <div className="fk-skeleton mt-6 h-40 w-full rounded-2xl" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export function PreviewSkeleton({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading preview" className={cn('flex w-full flex-col items-center justify-center gap-3', className)}>
      <div className="fk-skeleton h-24 w-24 rounded-3xl" />
      <div className="fk-skeleton h-3 w-36 rounded-full" />
      <span className="sr-only">Loading preview…</span>
    </div>
  )
}

export function NotFound({ slug }: { slug: string }) {
  const { setOpen } = useCommandPalette()
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        <SearchX className="h-6 w-6" aria-hidden />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">We couldn’t find “{slug}”</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">The component may have been renamed, or the link is mistyped. Search the library or start from the beginning.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center rounded-xl bg-zinc-950 px-5 text-sm font-medium text-white transition-transform active:scale-95 dark:bg-white dark:text-zinc-950"
        >
          Search components
        </button>
        <Link to="/docs/introduction" className="inline-flex h-11 items-center rounded-xl border border-zinc-300 px-5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
          Go to Introduction
        </Link>
      </div>
    </div>
  )
}

type BoundaryProps = { children: React.ReactNode; resetKey?: unknown; label?: string }
export class PreviewBoundary extends React.Component<BoundaryProps, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  componentDidUpdate(prev: BoundaryProps) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="flex max-w-sm flex-col items-center gap-3 rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
        <AlertTriangle className="h-5 w-5" aria-hidden />
        <p className="text-sm font-medium">This preview hit a snag.</p>
        <p className="text-xs opacity-80">The component threw while rendering. Your page is fine — try again, or copy the source from the Code tab.</p>
        <button
          type="button"
          onClick={() => this.setState({ error: null })}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-900 px-4 text-sm font-medium text-white transition-transform active:scale-95 dark:bg-red-200 dark:text-red-950"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> Try again
        </button>
      </div>
    )
  }
}
