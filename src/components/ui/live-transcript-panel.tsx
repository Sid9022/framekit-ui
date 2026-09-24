import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Line = { id: string; speaker: 'user' | 'agent'; text: string }

const SEED: Line[] = [
  { id: '1', speaker: 'agent', text: 'Thanks for calling Framekit Support — how can I help today?' },
  { id: '2', speaker: 'user', text: 'I need to reschedule my delivery window.' },
  { id: '3', speaker: 'agent', text: 'Of course. I can move that to Thursday between 4 and 6.' },
]

const MORE = [
  'That works for me.',
  'Great — I have updated your slot and sent a confirmation.',
  'One more thing — can I add a gate code?',
  'Absolutely. What is the code?',
  'It is 4821.',
  'Saved. Anything else before we wrap up?',
]

/** Scrolling dual-speaker transcript with auto-scroll; demo appends lines. */
export function LiveTranscriptPanel({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [lines, setLines] = React.useState(SEED)
  const endRef = React.useRef<HTMLDivElement>(null)
  const idx = React.useRef(0)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }, [lines, reduced])

  React.useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => {
      const text = MORE[idx.current % MORE.length]
      const speaker: 'user' | 'agent' = idx.current % 2 === 0 ? 'user' : 'agent'
      idx.current++
      setLines((ls) => [...ls, { id: `l-${idx.current}`, speaker, text }].slice(-12))
    }, 2400)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <div
      className={cn(
        'flex h-[360px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <p className="text-sm font-semibold">Live transcript</p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-400">Dual speaker · auto-scroll</p>
      </div>
      <div className="framekit-scroll flex-1 space-y-2 overflow-y-auto p-3">
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <motion.div
              key={line.id}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex flex-col gap-1', line.speaker === 'agent' ? 'items-start' : 'items-end')}
            >
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider',
                  line.speaker === 'agent'
                    ? 'bg-signal-400/20 text-signal-800 dark:text-signal-200'
                    : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
                )}
              >
                {line.speaker === 'agent' ? 'Agent' : 'Caller'}
              </span>
              <p
                className={cn(
                  'max-w-[85%] rounded-2xl px-3 py-2 text-sm',
                  line.speaker === 'agent'
                    ? 'rounded-tl-md bg-signal-500/15 text-zinc-800 dark:text-zinc-100'
                    : 'rounded-tr-md bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100',
                )}
              >
                {line.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  )
}
