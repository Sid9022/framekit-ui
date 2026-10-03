import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type TerminalStep = { type: 'cmd'; text: string } | { type: 'out'; text: string; tone?: 'ok' | 'dim' | 'key' | 'warn' } | { type: 'progress'; text: string }

export type TerminalDevHeroProps = {
  eyebrow?: string
  title?: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  /** The terminal session that is typed out. */
  script?: TerminalStep[]
  prompt?: string
  /** Start over when finished. */
  loop?: boolean
  className?: string
}

const SCRIPT: TerminalStep[] = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'sam.okoye — design engineer', tone: 'key' },
  { type: 'cmd', text: 'cat stack.json' },
  { type: 'out', text: '{ "ui": ["react", "tailwind", "motion"],', tone: 'dim' },
  { type: 'out', text: '  "ships": "weekly", "a11y": "AA+" }', tone: 'dim' },
  { type: 'cmd', text: 'npm run ship' },
  { type: 'progress', text: 'building portfolio' },
  { type: 'out', text: '✔ deployed in 1.8s — 100 / 100 lighthouse', tone: 'ok' },
  { type: 'cmd', text: 'open ./hire-me' },
]

type Line = { kind: 'cmd' | 'out' | 'progress'; text: string; tone?: string; pct?: number }

const toneCls: Record<string, string> = { ok: 'text-emerald-300', dim: 'text-zinc-300', key: 'text-amber-200', warn: 'text-rose-300' }

/**
 * Terminal Dev Hero — a developer intro whose right half is a live terminal: commands type with human rhythm, outputs
 * stream in, a progress bar builds and a caret blinks. The window floats in 3D with the pointer. Pause / replay
 * controls included; a static transcript is exposed to screen readers while the animation stays aria-hidden.
 */
export function TerminalDevHero({ eyebrow = 'Design engineer · Open to roles', title = 'I ship interfaces the way I write code: clean, fast, a little bit fun.', description = 'Ten years building products across design and engineering. Currently crafting design systems and motion for ambitious product teams.', ctaLabel = 'Read the README', onCta, script = SCRIPT, prompt = '~/portfolio', loop = true, className }: TerminalDevHeroProps) {
  const reduced = usePrefersReducedMotion()
  const [lines, setLines] = React.useState<Line[]>([])
  const [typing, setTyping] = React.useState('')
  const [paused, setPaused] = React.useState(false)
  const [run, setRun] = React.useState(0)
  const pausedRef = React.useRef(false)
  pausedRef.current = paused
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 120, damping: 18 }), sry = useSpring(ry, { stiffness: 120, damping: 18 })
  const shine = useTransform(sry, [-8, 8], ['0%', '100%'])

  React.useEffect(() => {
    if (reduced) {
      setLines(script.map((s) => ({ kind: s.type, text: s.text, tone: s.type === 'out' ? s.tone : undefined, pct: s.type === 'progress' ? 100 : undefined })))
      setTyping('')
      return
    }
    let dead = false
    const sleep = async (ms: number) => { await new Promise((r) => setTimeout(r, ms)); while (pausedRef.current && !dead) await new Promise((r) => setTimeout(r, 120)) }
    ;(async () => {
      setLines([]); setTyping('')
      await sleep(500)
      for (const step of script) {
        if (dead) return
        if (step.type === 'cmd') {
          for (let i = 1; i <= step.text.length; i++) {
            if (dead) return
            setTyping(step.text.slice(0, i))
            await sleep(36 + Math.random() * 60 + (step.text[i - 1] === ' ' ? 60 : 0))
          }
          await sleep(320)
          setLines((l) => [...l, { kind: 'cmd', text: step.text }]); setTyping('')
          await sleep(260)
        } else if (step.type === 'out') {
          setLines((l) => [...l, { kind: 'out', text: step.text, tone: step.tone }])
          await sleep(190)
        } else {
          setLines((l) => [...l, { kind: 'progress', text: step.text, pct: 0 }])
          for (let p = 0; p <= 100; p += 4) {
            if (dead) return
            setLines((l) => l.map((x, k) => (k === l.length - 1 ? { ...x, pct: p } : x)))
            await sleep(34)
          }
          await sleep(200)
        }
      }
      if (loop && !dead) { await sleep(3200); if (!dead) setRun((r) => r + 1) }
    })()
    return () => { dead = true }
  }, [script, reduced, loop, run])

  const visible = lines.slice(-9)
  return (
    <section aria-label="Introduction" className={cn('relative isolate grid min-h-[540px] w-full max-w-4xl items-center gap-8 overflow-hidden rounded-3xl bg-stone-100 p-6 ring-1 ring-black/5 sm:p-10 md:grid-cols-[1fr_1.1fr] dark:bg-zinc-950 dark:ring-white/10', className)}>
      <div aria-hidden className="pointer-events-none absolute -left-20 top-1/3 -z-10 h-72 w-72 rounded-full bg-signal-300/40 blur-3xl dark:bg-signal-600/25" />
      <div>
        <motion.p initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-mono text-xs font-medium text-zinc-800 ring-1 ring-zinc-300 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />{eyebrow}</motion.p>
        <motion.h2 initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="mt-4 font-display text-[clamp(36px,5.4vw,58px)] leading-[1.02] tracking-[-0.02em] text-zinc-950 dark:text-zinc-50">{title}</motion.h2>
        <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{description}</p>
        <button type="button" onClick={onCta} className="group mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition-transform hover:bg-zinc-800 active:scale-95 motion-reduce:active:scale-100 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">{ctaLabel}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden /></button>
      </div>

      <div className="[perspective:1200px]" onPointerMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - b.left) / b.width - 0.5) * 12); rx.set(-((e.clientY - b.top) / b.height - 0.5) * 9) }} onPointerLeave={() => { rx.set(0); ry.set(0) }}>
        <motion.div style={{ rotateX: reduced ? 0 : srx, rotateY: reduced ? 0 : sry }} className="relative overflow-hidden rounded-2xl bg-[#0e0e14] text-[13px] shadow-[0_2px_4px_rgb(0_0_0/0.2),0_30px_60px_-20px_rgb(0_0_0/0.55)] ring-1 ring-white/10 [transform-style:preserve-3d]">
          <motion.span aria-hidden className="pointer-events-none absolute inset-0 opacity-30" style={{ background: 'linear-gradient(110deg, transparent 35%, rgb(255 255 255 / 0.12) 50%, transparent 65%)', backgroundPositionX: shine }} />
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
            <span className="mx-auto font-mono text-xs text-zinc-300">{prompt} — zsh</span>
            <span className="flex">
              {!reduced && <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Resume terminal' : 'Pause terminal'} className="grid h-11 w-9 place-items-center text-zinc-300 hover:text-white">{paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}</button>}
              {!reduced && <button type="button" onClick={() => { setPaused(false); setRun((r) => r + 1) }} aria-label="Replay terminal" className="grid h-11 w-9 place-items-center text-zinc-300 hover:text-white"><RotateCcw className="h-3.5 w-3.5" aria-hidden /></button>}
            </span>
          </div>
          <div aria-hidden className="flex h-[300px] flex-col justify-end gap-1 overflow-hidden px-4 py-4 font-mono leading-6">
            {visible.map((l, i) => (
              <motion.div key={lines.length - visible.length + i} initial={reduced ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="whitespace-pre-wrap break-words">
                {l.kind === 'cmd' ? <><span className="text-violet-300">{prompt}</span> <span className="text-orange-300">❯</span> <span className="text-zinc-50">{l.text}</span></> : l.kind === 'progress' ? (
                  <span className="flex items-center gap-3 text-zinc-300"><span>{l.text}</span><span className="relative h-1.5 w-28 overflow-hidden rounded-full bg-white/15"><span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-400 to-orange-300" style={{ width: `${l.pct}%` }} /></span><span className="tabular-nums">{l.pct}%</span></span>
                ) : <span className={toneCls[l.tone ?? 'dim']}>{l.text}</span>}
              </motion.div>
            ))}
            {!reduced && (
              <div className="whitespace-pre"><span className="text-violet-300">{prompt}</span> <span className="text-orange-300">❯</span> <span className="text-zinc-50">{typing}</span><motion.span className="ml-px inline-block h-4 w-2 translate-y-0.5 bg-zinc-100" animate={{ opacity: paused ? 1 : [1, 1, 0, 0] }} transition={{ duration: 1.05, repeat: Infinity, times: [0, 0.5, 0.5, 1] }} /></div>
            )}
          </div>
          <div className="sr-only">{script.map((s, i) => <p key={i}>{s.type === 'cmd' ? `$ ${s.text}` : s.text}</p>)}</div>
        </motion.div>
      </div>
    </section>
  )
}
