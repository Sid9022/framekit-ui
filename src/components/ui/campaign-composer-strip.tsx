import * as React from 'react'
import { motion } from 'motion/react'
import { Calendar, Radio, Send, Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

type Channel = 'WA' | 'SMS' | 'RCS'

/** Mini broadcast composer: audience, channel, schedule, send progress ribbon. */
export function CampaignComposerStrip({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [channel, setChannel] = React.useState<Channel>('WA')
  const [sending, setSending] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const start = () => {
    if (sending) return
    setSending(true)
    setProgress(0)
    let p = 0
    const id = window.setInterval(() => {
      p += reduced ? 25 : 8 + Math.random() * 10
      if (p >= 100) {
        p = 100
        clearInterval(id)
        window.setTimeout(() => {
          setSending(false)
          setProgress(0)
        }, 800)
      }
      setProgress(Math.min(100, Math.round(p)))
    }, 160)
  }

  return (
    <div
      className={cn(
        'w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_22px_50px_-28px_rgba(53,43,66,0.4)] dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div>
          <p className="text-sm font-semibold">Broadcast composer</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-400">Campaign strip</p>
        </div>
        <Radio className="h-4 w-4 text-signal-500" />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900">
          <Users className="h-3.5 w-3.5 text-signal-500" />
          Audience · <strong>12.4k</strong> opted-in
        </span>
        <div className="flex rounded-full border border-zinc-200 p-0.5 dark:border-zinc-700">
          {(['WA', 'SMS', 'RCS'] as Channel[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setChannel(c)}
              className={cn(
                'rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold transition',
                channel === c
                  ? 'bg-signal-500 text-white'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          Schedule · Today 4:00 PM
        </span>
      </div>

      <div className="px-4 pb-2">
        <textarea
          defaultValue="Spring drop is live — tap Track to follow your parcel. Reply STOP to opt out."
          className="h-20 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-signal-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </div>

      <div className="relative mx-4 mb-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-signal-400 to-signal-600"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.15 }}
          style={{ boxShadow: progress > 0 ? '0 0 12px rgba(154,134,184,0.7)' : undefined }}
        />
      </div>

      <div className="flex items-center justify-between px-4 pb-4">
        <p className="font-mono text-[10px] text-zinc-400">
          {sending ? `Sending… ${progress}%` : `Ready · ${channel} channel`}
        </p>
        <button
          type="button"
          onClick={start}
          disabled={sending}
          className="inline-flex items-center gap-1.5 rounded-full bg-signal-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-signal-500/30 disabled:opacity-60"
        >
          <Send className="h-3.5 w-3.5" />
          {sending ? 'Broadcasting' : 'Send now'}
        </button>
      </div>
    </div>
  )
}
