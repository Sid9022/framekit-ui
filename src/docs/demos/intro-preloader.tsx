import * as React from 'react'
import { IntroPreloader } from '@/components/ui/intro-preloader'
import { PortfolioArt } from '@/lib/portfolio-art'
import { RotateCcw } from 'lucide-react'

function IntroPreloaderDemo() {
  const [k, setK] = React.useState(0)
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3">
      <IntroPreloader runKey={k} className="h-[440px]">
        <div className="flex h-full flex-col justify-between bg-stone-100 p-8 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nova Reyes — portfolio</p>
          <h2 className="font-display text-[clamp(56px,11vw,120px)] leading-[0.9] tracking-tight text-zinc-950 dark:text-zinc-50">Design that<br />moves with you.</h2>
          <div className="flex gap-2">{[3, 11, 19].map((s) => <div key={s} className="h-20 flex-1 overflow-hidden rounded-xl"><PortfolioArt seed={s} /></div>)}</div>
        </div>
      </IntroPreloader>
      <button type="button" onClick={() => setK((x) => x + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-800 hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"><RotateCcw className="h-4 w-4" aria-hidden />Replay intro</button>
    </div>
  )
}

const demo: React.ReactNode = <IntroPreloaderDemo />

export default demo
