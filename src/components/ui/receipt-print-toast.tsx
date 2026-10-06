import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Printer, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ReceiptLine = { label: string; qty?: number; amount: string }
export type Receipt = {
  id?: string
  title: string
  subtitle?: string
  lines: ReceiptLine[]
  total?: string
  footer?: string
}

export type ReceiptPrintToastProps = {
  /** Print this receipt whenever its `id` (or object) changes. Omit to use the built-in trigger with sample orders. */
  receipt?: Receipt | null
  /** Sample receipts cycled by the built-in trigger. */
  samples?: Receipt[]
  triggerLabel?: string
  /** Show the trigger button. */
  showTrigger?: boolean
  /** ms before the receipt tears off (0 = stays until dismissed). Paused on hover / focus. */
  duration?: number
  onDismiss?: (receipt: Receipt) => void
  className?: string
}

export const DEFAULT_RECEIPTS: Receipt[] = [
  { title: 'Corner Roastery', subtitle: 'Order #4821 · Table 6', lines: [{ label: 'Flat white', qty: 2, amount: '€7.40' }, { label: 'Cardamom bun', qty: 1, amount: '€3.80' }, { label: 'Oat milk', qty: 2, amount: '€0.80' }], total: '€12.00', footer: 'Paid · Visa •• 4821' },
  { title: 'Paperline Books', subtitle: 'Order #1177 · Pickup', lines: [{ label: 'The Slow Studio', qty: 1, amount: '€24.00' }, { label: 'Linen bookmark', qty: 2, amount: '€6.00' }], total: '€30.00', footer: 'Paid · Apple Pay' },
  { title: 'Northside Florist', subtitle: 'Order #0932 · Delivery 16:00', lines: [{ label: 'Ranunculus bunch', qty: 1, amount: '€28.00' }, { label: 'Card + ribbon', qty: 1, amount: '€3.50' }, { label: 'Delivery', amount: '€5.00' }], total: '€36.50', footer: 'Paid · Mastercard •• 1190' },
]

type Job = Receipt & { key: number; serial: string }

/**
 * Receipt Print Toast — order confirmations that print. A thermal printer slot
 * blinks, then a strip of receipt paper feeds out line by line in little
 * stepped jolts, with a torn zig-zag edge. After a few seconds it tears off
 * and drops away; hover or focus holds it.
 */
export function ReceiptPrintToast({
  receipt,
  samples = DEFAULT_RECEIPTS,
  triggerLabel = 'Place order',
  showTrigger = true,
  duration = 6000,
  onDismiss,
  className,
}: ReceiptPrintToastProps) {
  const reduced = usePrefersReducedMotion()
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [hold, setHold] = React.useState(false)
  const seq = React.useRef(0)
  const sampleIdx = React.useRef(0)

  const print = React.useCallback((r: Receipt) => {
    seq.current += 1
    const key = seq.current
    const serial = `${new Date().toTimeString().slice(0, 5)} · #${String(1000 + ((key * 7919) % 9000))}`
    setJobs([{ ...r, key, serial }])
  }, [])

  React.useEffect(() => {
    if (receipt) print(receipt)
  }, [receipt, print])

  const current = jobs[0]
  const dismiss = React.useCallback(() => {
    setJobs((j) => {
      if (j[0]) onDismiss?.(j[0])
      return []
    })
  }, [onDismiss])

  React.useEffect(() => {
    if (!current || !duration || hold) return
    const t = window.setTimeout(dismiss, duration)
    return () => window.clearTimeout(t)
  }, [current, duration, hold, dismiss])

  const rows = current ? current.lines.length + 4 : 0
  const feedStep = 0.11

  return (
    <div className={cn('flex w-full max-w-sm flex-col items-center', className)}>
      {showTrigger && (
        <motion.button
          type="button"
          onClick={() => {
            print(samples[sampleIdx.current % samples.length])
            sampleIdx.current += 1
          }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-zinc-950 px-5 text-[13px] font-medium text-white shadow-[0_8px_20px_-10px_rgb(0_0_0/0.5)] outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-950 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-950"
        >
          <Printer aria-hidden className="size-4" /> {triggerLabel}
        </motion.button>
      )}

      {/* printer slot */}
      <div className="relative z-10 w-full max-w-[300px]">
        <div className="relative flex h-11 items-center justify-between rounded-2xl bg-[linear-gradient(180deg,#3f3f46,#18181b)] px-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_10px_24px_-12px_rgb(0_0_0/0.6)] ring-1 ring-black/40 dark:bg-[linear-gradient(180deg,#3f3f46,#202024)] dark:ring-white/10">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">Receipts</span>
          <span className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-zinc-300">{current ? 'Printing' : 'Ready'}</span>
            <motion.span
              aria-hidden
              className={cn('size-2 rounded-full', current ? 'bg-emerald-400' : 'bg-zinc-500')}
              animate={current && !reduced ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
              transition={current && !reduced ? { duration: 0.6, repeat: 3 } : { duration: 0.2 }}
            />
          </span>
          <span aria-hidden className="absolute inset-x-6 -bottom-[3px] h-[6px] rounded-full bg-black shadow-[0_1px_0_rgb(255_255_255/0.08)]" />
        </div>

        {/* paper */}
        <div className="relative -mt-[3px] min-h-[24px] overflow-hidden px-[18px] pb-10" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
          <AnimatePresence mode="popLayout">
            {current && (
              <motion.div
                key={current.key}
                className="relative origin-top [filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.12))_drop-shadow(0_16px_18px_rgb(0_0_0/0.18))]"
                initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)', y: -14 }}
                animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)', y: 0 }}
                exit={reduced ? { opacity: 0, transition: { duration: 0.2 } } : { y: 220, rotate: 7, opacity: 0, transition: { duration: 0.7, ease: [0.55, 0, 0.9, 0.4] } }}
                transition={{ duration: rows * feedStep + 0.2, ease: reduced ? 'easeOut' : (t: number) => Math.round(t * rows * 2) / (rows * 2) }}
              >
                <div
                  className="relative bg-[#fffdf8] px-5 pb-7 pt-5 text-[#26221d] shadow-[0_1px_2px_rgb(0_0_0/0.08),0_18px_30px_-18px_rgb(0_0_0/0.45)]"
                  style={{
                    fontFamily: "var(--font-mono, ui-monospace), 'SFMono-Regular', Menlo, monospace",
                    WebkitMaskImage: 'linear-gradient(#000,#000), conic-gradient(from -45deg at 50% 100%, #000 90deg, transparent 0)',
                    WebkitMaskSize: '100% calc(100% - 6px), 12px 7px',
                    WebkitMaskPosition: 'top, bottom',
                    WebkitMaskRepeat: 'no-repeat, repeat-x',
                    maskImage: 'linear-gradient(#000,#000), conic-gradient(from -45deg at 50% 100%, #000 90deg, transparent 0)',
                    maskSize: '100% calc(100% - 6px), 12px 7px',
                    maskPosition: 'top, bottom',
                    maskRepeat: 'no-repeat, repeat-x',
                  }}
                >
                  <button
                    type="button"
                    onClick={dismiss}
                    aria-label="Dismiss receipt"
                    className="absolute right-1 top-1 grid size-11 place-items-center rounded-full text-[#5d554b] outline-none hover:text-[#26221d] focus-visible:ring-2 focus-visible:ring-[#26221d]"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                  <p className="pr-8 text-[13px] font-semibold uppercase tracking-[0.12em]">{current.title}</p>
                  {current.subtitle && <p className="mt-0.5 text-[11px] text-[#5d554b]">{current.subtitle}</p>}
                  <p aria-hidden className="mt-3 overflow-hidden whitespace-nowrap text-[11px] leading-none text-[#6f665b]">{'- '.repeat(40)}</p>
                  <ul className="mt-2 space-y-1.5 text-[12px]">
                    {current.lines.map((l) => (
                      <li key={l.label} className="flex items-baseline gap-2">
                        {l.qty !== undefined && <span className="w-5 shrink-0 tabular-nums text-[#5d554b]">{l.qty}×</span>}
                        <span className="min-w-0 flex-1 truncate">{l.label}</span>
                        <span className="tabular-nums">{l.amount}</span>
                      </li>
                    ))}
                  </ul>
                  {current.total && (
                    <>
                      <p aria-hidden className="mt-2 overflow-hidden whitespace-nowrap text-[11px] leading-none text-[#6f665b]">{'= '.repeat(40)}</p>
                      <p className="mt-2 flex items-baseline justify-between text-[14px] font-semibold"><span>Total</span><span className="tabular-nums">{current.total}</span></p>
                    </>
                  )}
                  {current.footer && <p className="mt-1 text-[11px] text-[#5d554b]">{current.footer}</p>}
                  <div aria-hidden className="mt-4 h-8 w-full" style={{ background: 'repeating-linear-gradient(90deg, #26221d 0 1px, transparent 1px 3px, #26221d 3px 5px, transparent 5px 6px, #26221d 6px 7px, transparent 7px 10px)' }} />
                  <p className="mt-1.5 text-center text-[10px] tracking-[0.18em] text-[#5d554b]">{current.serial} · THANK YOU</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!current && <p className="pt-4 text-center text-[12px] text-zinc-600 dark:text-zinc-400">Receipts print here.</p>}
        </div>
        <p role="status" aria-live="polite" className="sr-only">{current ? `Receipt printed: ${current.title}${current.total ? `, total ${current.total}` : ''}. ${current.footer ?? ''}` : ''}</p>
      </div>
    </div>
  )
}
