import type * as React from 'react'
import { XrayLensCursor } from '@/components/ui/xray-lens-cursor'
import { PortfolioArt } from '@/lib/portfolio-art'

function XrayPoster({ bp }: { bp: boolean }) {
  const label = bp ? 'text-sky-300' : 'text-zinc-600 dark:text-zinc-400'
  return (
    <div className={`relative grid min-h-[400px] gap-6 p-6 sm:grid-cols-2 sm:p-10 ${bp ? 'bg-[#0a2540] text-sky-100 [background-image:linear-gradient(rgba(125,211,252,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.2)_1px,transparent_1px)] [background-size:24px_24px]' : 'bg-white text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50'}`}>
      <div className="flex flex-col justify-center gap-4">
        <p className={`font-mono text-xs uppercase tracking-[0.2em] ${label}`}>{bp ? '[ label · 12px · +0.2em ]' : 'Studio notes — volume 04'}</p>
        <h2 className={`font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl ${bp ? 'text-transparent [-webkit-text-stroke:1px_#7dd3fc]' : ''}`}>Design is how it works.</h2>
        <p className={`max-w-sm text-base leading-relaxed ${bp ? 'text-sky-200' : 'text-zinc-700 dark:text-zinc-300'}`}>Every surface here is drawn twice — once for people, once for the people who build it. Move the lens to see the bones.</p>
        <div className="flex gap-3">
          <span className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium ${bp ? 'border border-dashed border-sky-300 text-sky-200' : 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950'}`}>Read the notes</span>
          <span className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-medium ${bp ? 'border-dashed border-sky-300 text-sky-200' : 'border-zinc-300 dark:border-zinc-600'}`}>Archive</span>
        </div>
      </div>
      <div className={`relative min-h-48 overflow-hidden rounded-3xl ${bp ? 'border border-dashed border-sky-300' : ''}`}>
        <div className={bp ? 'opacity-0' : ''}><PortfolioArt seed={14} /></div>
        {bp && <><span className="absolute inset-0 [background:linear-gradient(to_top_right,transparent_calc(50%-1px),#7dd3fc_50%,transparent_calc(50%+1px)),linear-gradient(to_bottom_right,transparent_calc(50%-1px),#7dd3fc_50%,transparent_calc(50%+1px))] opacity-50" /><span className="absolute bottom-3 left-3 rounded bg-[#0a2540] px-2 py-1 font-mono text-[10px] text-sky-200">image · 4:3 · radius 24</span></>}
      </div>
    </div>
  )
}

function XrayDemo() {
  return <XrayLensCursor reveal={<XrayPoster bp />}><XrayPoster bp={false} /></XrayLensCursor>
}

const demo: React.ReactNode = <XrayDemo />

export default demo
