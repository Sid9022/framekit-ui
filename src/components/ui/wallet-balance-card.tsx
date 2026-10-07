import * as React from 'react'
import { motion } from 'motion/react'
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { RollNumber, focusRing } from '@/lib/widget-kit'

export type WalletCard = { id: string; name: string; last4: string; balance: number; from: string; to: string }

export type WalletBalanceCardProps = {
  cards?: WalletCard[]
  currency?: string
  defaultIndex?: number
  className?: string
}

export const DEFAULT_WALLET: WalletCard[] = [
  { id: 'main', name: 'Everyday', last4: '4821', balance: 12840.5, from: '#1e1b4b', to: '#6d28d9' },
  { id: 'save', name: 'Savings', last4: '0937', balance: 48210, from: '#064e3b', to: '#10b981' },
  { id: 'trip', name: 'Travel', last4: '7710', balance: 2365.25, from: '#7c2d12', to: '#f97316' },
]

/**
 * Wallet Balance Card — a fanned stack of payment cards. Choosing one springs it to the front while the rest tuck
 * behind, the balance rolls to the new amount, and an eye toggle blurs the figures for privacy.
 */
export function WalletBalanceCard({ cards = DEFAULT_WALLET, currency = '$', defaultIndex = 0, className }: WalletBalanceCardProps) {
  const reduced = usePrefersReducedMotion()
  const [i, setI] = React.useState(defaultIndex)
  const [hidden, setHidden] = React.useState(false)
  const card = cards[i]
  const order = cards.map((_, k) => (k - i + cards.length) % cards.length)
  return (
    <div className={cn('w-full max-w-[380px] rounded-[28px] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_24px_48px_-24px_rgb(24_24_27/0.35)] ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{card.name} balance</p>
          <p className={cn('mt-1 text-[34px] font-semibold leading-none tracking-[-0.04em] text-zinc-950 transition-[filter] duration-200 dark:text-white', hidden && 'blur-md')} aria-hidden={hidden || undefined}>
            <RollNumber value={card.balance} decimals={2} prefix={currency} duration={0.7} />
          </p>
          {hidden && <span className="sr-only">Balance hidden</span>}
        </div>
        <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={() => setHidden((h) => !h)} aria-pressed={hidden} aria-label={hidden ? 'Show balance' : 'Hide balance'} className={cn('grid size-11 place-items-center rounded-full text-zinc-700 transition-colors duration-150 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10', focusRing)}>
          {hidden ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
        </motion.button>
      </div>
      <div className="relative mt-6 h-[196px]">
        {cards.map((c, k) => {
          const o = order[k]
          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => setI(k)}
              aria-label={`${c.name} card ending ${c.last4}`}
              aria-current={o === 0 || undefined}
              className={cn('absolute inset-x-0 top-0 mx-auto aspect-[1.586] w-[92%] overflow-hidden rounded-[20px] p-4 text-left text-white shadow-[0_2px_6px_rgb(0_0_0/0.15),0_24px_40px_-20px_rgb(0_0_0/0.55)] ring-1 ring-white/10', focusRing)}
              style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})`, transformOrigin: 'top center' }}
              initial={false}
              animate={{ y: o * 14, scale: 1 - o * 0.06, zIndex: cards.length - o, filter: `brightness(${1 - o * 0.15})` }}
              whileHover={o === 0 || reduced ? undefined : { y: o * 14 - 6 }}
              transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_90%_0%,rgb(255_255_255/0.25),transparent_60%)]" aria-hidden="true" />
              <span className="relative flex items-center justify-between text-[13px] font-medium text-white/90"><span>{c.name}</span><span className="h-6 w-9 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 shadow-[inset_0_1px_0_white]" aria-hidden="true" /></span>
              <span className="absolute bottom-4 left-4 font-mono text-[15px] tracking-[0.12em] text-white/90">•••• {c.last4}</span>
            </motion.button>
          )
        })}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[{ l: 'Receive', I: ArrowDownLeft }, { l: 'Send', I: ArrowUpRight }].map(({ l, I }) => (
          <motion.button key={l} type="button" whileTap={{ scale: 0.97 }} className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] text-sm font-medium', l === 'Send' ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'bg-zinc-100 text-zinc-900 dark:bg-white/[0.08] dark:text-white', focusRing)}>
            <I className="size-4" aria-hidden="true" />{l}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
