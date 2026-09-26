import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, CheckCheck, Send } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type BubbleStatus = 'sent' | 'delivered' | 'read'
export type ChatBubble = {
  id: string
  text: string
  direction: 'in' | 'out'
  time: string
  status?: BubbleStatus
}

const SEED: ChatBubble[] = [
  { id: '1', text: 'Hey — your delivery window opens at 4pm.', direction: 'in', time: '3:58 PM' },
  { id: '2', text: 'Perfect, I will be around.', direction: 'out', time: '3:59 PM', status: 'read' },
  { id: '3', text: 'Great. Reply STOP anytime to opt out.', direction: 'in', time: '4:00 PM' },
]

function Ticks({ status }: { status?: BubbleStatus }) {
  if (!status) return null
  if (status === 'sent') return <Check className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
  if (status === 'delivered') return <CheckCheck className="h-3 w-3 text-zinc-500 dark:text-zinc-400" />
  return <CheckCheck className="h-3 w-3 text-sky-400" />
}

/** Inbound/outbound chat bubbles with status ticks + soft enter; demo send button. */
export function ThreadBubbleStack({
  initial = SEED,
  className,
}: {
  initial?: ChatBubble[]
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [msgs, setMsgs] = React.useState(initial)
  const [draft, setDraft] = React.useState('On my way!')
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }, [msgs, reduced])

  const send = () => {
    const text = draft.trim() || 'Hello from Framekit'
    const id = Math.random().toString(36).slice(2)
    setMsgs((m) => [
      ...m,
      {
        id,
        text,
        direction: 'out',
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        status: 'sent',
      },
    ])
    setDraft('')
    window.setTimeout(() => {
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, status: 'delivered' } : x)))
    }, 600)
    window.setTimeout(() => {
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, status: 'read' } : x)))
    }, 1400)
  }

  return (
    <div
      className={cn(
        'flex h-[380px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white shadow-[0_24px_55px_-28px_rgba(53,43,66,0.45)] dark:border-zinc-800 dark:from-zinc-950 dark:to-[#121018]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-400/30 text-xs font-bold text-signal-800 dark:text-signal-200">
          AK
        </span>
        <div>
          <p className="text-sm font-semibold">Acme Support</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-500">Online · messaging</p>
        </div>
      </div>

      <div className="framekit-scroll flex-1 space-y-2 overflow-y-auto px-3 py-3">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={m.id}
              initial={reduced ? false : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className={cn('flex', m.direction === 'out' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm',
                  m.direction === 'out'
                    ? 'rounded-br-md bg-signal-500 text-white'
                    : 'rounded-bl-md border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100',
                )}
              >
                <p className="leading-relaxed">{m.text}</p>
                <div
                  className={cn(
                    'mt-1 flex items-center justify-end gap-1 text-[10px]',
                    m.direction === 'out' ? 'text-white/70' : 'text-zinc-400',
                  )}
                >
                  <span>{m.time}</span>
                  {m.direction === 'out' && <Ticks status={m.status} />}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-signal-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={send}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-signal-500 text-white shadow-lg shadow-signal-500/30 transition hover:bg-signal-600"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
