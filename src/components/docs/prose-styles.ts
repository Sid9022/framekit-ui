import type { Variants } from 'motion/react'

/*
 * Text styles for long-form pages in the docs shell (guides, privacy). They are the exact classes the docs pages use
 * (DocPage header + Getting Started guides, CategoryPage), collected here so the long-form pages can't drift.
 */
export const docText = {
  h1: 'text-3xl font-semibold tracking-tight sm:text-4xl',
  lede: 'mt-3 max-w-[65ch] text-base leading-relaxed text-zinc-700 dark:text-zinc-400',
  h2: 'text-xl font-semibold tracking-tight',
  h3: 'text-sm font-semibold text-zinc-900 dark:text-zinc-100',
  body: 'max-w-[65ch] text-sm leading-relaxed text-zinc-700 dark:text-zinc-400',
  meta: 'text-xs text-zinc-600 dark:text-zinc-400',
  code: 'rounded bg-zinc-100 px-1 py-px font-mono text-[12.5px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
  strong: 'font-semibold text-zinc-900 dark:text-zinc-100',
  link: 'rounded-sm text-signal-700 underline underline-offset-2 hover:text-signal-900 dark:text-signal-300 dark:hover:text-signal-100',
  /** Hairline-dashed note, as on /docs/installation ("Heads-up") and the "Brings its own background" note. */
  note: 'flex max-w-[65ch] items-start gap-2 rounded-xl border border-dashed border-zinc-300 px-3 py-2.5 text-xs leading-relaxed text-zinc-700 dark:border-zinc-700 dark:text-zinc-400',
  /** Category card (CategoryPage). */
  card: 'group relative flex h-full min-h-[116px] flex-col rounded-2xl border border-zinc-950/[0.08] bg-white p-4 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-signal-400 hover:shadow-[0_12px_28px_-16px_rgb(100_82_122/0.45)] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-white/[0.08] dark:bg-zinc-900/40 dark:hover:border-signal-500',
  /** Chip link ("Other categories" on CategoryPage). */
  chip: 'fk-touch inline-flex items-center rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-[background-color,border-color,transform] duration-150 hover:border-signal-400 hover:bg-white active:scale-95 motion-reduce:transition-none dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900',
}

/** DocPage's entrance (same values). */
export const docReveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
}
export const docStagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } } }
