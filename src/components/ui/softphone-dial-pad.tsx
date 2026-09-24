import * as React from 'react'
import { motion } from 'motion/react'
import { Delete, Phone } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

const KEYS = [
  { digit: '1', sub: '' },
  { digit: '2', sub: 'ABC' },
  { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' },
  { digit: '5', sub: 'JKL' },
  { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' },
  { digit: '8', sub: 'TUV' },
  { digit: '9', sub: 'WXYZ' },
  { digit: '*', sub: '' },
  { digit: '0', sub: '+' },
  { digit: '#', sub: '' },
]

/** Stylish dial pad with ripple keys, number display, ringing call button. */
export function SoftphoneDialPad({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [number, setNumber] = React.useState('')
  const [calling, setCalling] = React.useState(false)
  const [ripples, setRipples] = React.useState<{ id: string; x: number; y: number }[]>([])

  const press = (digit: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setNumber((n) => (n + digit).slice(0, 16))
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Math.random().toString(36).slice(2)
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    window.setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 500)
  }

  return (
    <div
      className={cn(
        'w-full max-w-[260px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_24px_55px_-28px_rgba(53,43,66,0.45)] dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="mb-3 min-h-[2.5rem] rounded-xl bg-zinc-50 px-3 py-2 text-center font-mono text-lg tracking-widest dark:bg-zinc-900">
        {number || <span className="text-zinc-400">Enter number</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {KEYS.map((k) => (
          <button
            key={k.digit}
            type="button"
            onClick={(e) => press(k.digit, e)}
            className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 py-3 transition hover:bg-signal-400/15 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="block text-lg font-semibold">{k.digit}</span>
            {k.sub && <span className="block font-mono text-[8px] tracking-widest text-zinc-400">{k.sub}</span>}
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-400/40"
                style={{ left: r.x, top: r.y }}
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            ))}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setNumber((n) => n.slice(0, -1))}
          className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-700"
          aria-label="Delete"
        >
          <Delete className="h-4 w-4" />
        </button>
        <motion.button
          type="button"
          onClick={() => setCalling((c) => !c)}
          className={cn(
            'flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white',
            calling ? 'bg-rose-500' : 'bg-emerald-500',
          )}
          animate={calling && !reduced ? { boxShadow: ['0 0 0 0 rgba(52,211,153,0.5)', '0 0 0 14px rgba(52,211,153,0)'] } : undefined}
          transition={calling ? { repeat: Infinity, duration: 1.2 } : undefined}
        >
          <Phone className="h-4 w-4" />
          {calling ? 'Hang up' : 'Call'}
        </motion.button>
      </div>
    </div>
  )
}
