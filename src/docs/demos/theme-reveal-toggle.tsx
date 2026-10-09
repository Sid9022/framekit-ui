import * as React from 'react'
import { ThemeRevealToggle } from '@/components/ui/theme-reveal-toggle'

function ThemeRevealToggleDemo() {
  const [dark, setDark] = React.useState(false)
  return (
    <div className={(dark ? 'dark' : 'light') + ' w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800'}>
      <div className="bg-stone-50 p-6 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">Preview / {dark ? 'night' : 'day'}</p>
          <ThemeRevealToggle checked={dark} onCheckedChange={setDark} aria-label="Dark mode for this preview" />
        </div>
        <h3 className="mt-6 font-display text-4xl leading-[1.05] sm:text-5xl">{dark ? 'Lights down, work up.' : 'Morning, everyone.'}</h3>
        <p className="mt-3 max-w-md text-sm text-zinc-700 dark:text-zinc-300">The change blooms out of the switch as a circle. With reduced motion it simply swaps.</p>
        <div className="mt-6 flex gap-2">
          <span className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950">Primary</span>
          <span className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700">Secondary</span>
        </div>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <ThemeRevealToggleDemo />

export default demo
