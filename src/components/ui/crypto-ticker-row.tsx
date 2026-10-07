import * as React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { useLiveTick, focusRing } from '@/lib/widget-kit'

export type TickerAsset = { symbol: string; name: string; price: number; change: number; color: string; history?: number[] }

export type CryptoTickerRowProps = {
  assets?: TickerAsset[]
  /** Price update interval (0 = off). */
  liveMs?: number
  onSelect?: (a: TickerAsset) => void
  className?: string
}

export const DEFAULT_ASSETS: TickerAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67420.12, change: 2.41, color: '#f7931a' },
  { symbol: 'ETH', name: 'Ethereum', price: 3288.4, change: -0.84, color: '#7b8cff' },
  { symbol: 'SOL', name: 'Solana', price: 168.92, change: 5.12, color: '#14f195' },
  { symbol: 'ADA', name: 'Cardano', price: 0.4521, change: -1.9, color: '#3c8cff' },
]

const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: v < 1 ? 4 : 2, maximumFractionDigits: v < 1 ? 4 : 2 })

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const min = Math.min(...data), max = Math.max(...data)
  const d = data.map((v, i) => `${i ? 'L' : 'M'} ${(i / (data.length - 1)) * 64} ${22 - ((v - min) / Math.max(1e-9, max - min)) * 20}`).join(' ')
  return <svg viewBox="0 0 64 24" className={cn('h-6 w-16', up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')} aria-hidden="true"><motion.path d={d} animate={{ d }} transition={{ duration: 0.4 }} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Row({ a, onSelect }: { a: TickerAsset & { history: number[]; dir: 0 | 1 | -1; n: number }; onSelect?: (a: TickerAsset) => void }) {
  const reduced = usePrefersReducedMotion()
  const up = a.change >= 0
  return (
    <li>
      <button type="button" onClick={() => onSelect?.(a)} aria-label={`${a.name} ${a.symbol}, $${fmt(a.price)}, ${up ? 'up' : 'down'} ${Math.abs(a.change).toFixed(2)}%`} className={cn('relative flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-left transition-colors duration-150 hover:bg-zinc-100 dark:hover:bg-white/[0.05]', focusRing)}>
        <span className="grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]" style={{ background: a.color }} aria-hidden="true">{a.symbol[0]}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-zinc-950 dark:text-white">{a.symbol}</span>
          <span className="block truncate text-[12px] text-zinc-600 dark:text-zinc-400">{a.name}</span>
        </span>
        <Spark data={a.history} up={up} />
        <span className="w-[104px] text-right">
          <motion.span
            key={a.n}
            className="block rounded-md px-1 text-sm font-medium tabular-nums text-zinc-950 dark:text-white"
            initial={reduced || a.dir === 0 ? false : { backgroundColor: a.dir > 0 ? 'rgba(16,185,129,0.22)' : 'rgba(244,63,94,0.22)' }}
            animate={{ backgroundColor: 'rgba(0,0,0,0)' }}
            transition={{ duration: 0.9 }}
            aria-hidden="true"
          >
            ${fmt(a.price)}
          </motion.span>
          <span className={cn('block text-[12px] font-medium tabular-nums', up ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400')} aria-hidden="true">{up ? '+' : '−'}{Math.abs(a.change).toFixed(2)}%</span>
        </span>
      </button>
    </li>
  )
}

/**
 * Crypto Ticker Row — a watchlist of assets with live prices. Each tick flashes the price green or red and fades
 * back, the mini sparkline morphs to the new history, and rows are full-width buttons with descriptive labels.
 */
export function CryptoTickerRow({ assets = DEFAULT_ASSETS, liveMs = 1800, onSelect, className }: CryptoTickerRowProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [state, setState] = React.useState(() => assets.map((a) => ({ ...a, history: a.history ?? Array.from({ length: 16 }, (_, i) => a.price * (1 + Math.sin(i / 2 + a.price) * 0.01 + (i / 16) * a.change / 100)), dir: 0 as 0 | 1 | -1, n: 0 })))
  useLiveTick(ref, () => setState((s) => s.map((a) => {
    if (Math.random() < 0.35) return a
    const m = 1 + (Math.random() - 0.48) * 0.006
    const price = a.price * m
    return { ...a, price, change: a.change + (m - 1) * 100, dir: m >= 1 ? 1 : -1, n: a.n + 1, history: [...a.history.slice(1), price] }
  })), liveMs)
  return (
    <div ref={ref} className={cn('w-full max-w-[440px] rounded-[24px] bg-white p-2 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]', className)}>
      <div className="flex items-center justify-between px-3 pb-1 pt-2">
        <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">Watchlist</p>
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600 dark:text-zinc-400">24h</p>
      </div>
      <ul className="grid">{state.map((a) => <Row key={a.symbol} a={a} onSelect={onSelect} />)}</ul>
    </div>
  )
}
