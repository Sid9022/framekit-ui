import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Eye, EyeOff, Wand2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type PasswordRule = { id: string; label: string; test: (v: string) => boolean }

export type CrystalStrengthPasswordProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Up to 5 rules; each satisfied rule grows one crystal shard. */
  rules?: PasswordRule[]
  onStrengthChange?: (score: number, label: string) => void
  label?: string
  placeholder?: string
  name?: string
  /** Show the “Suggest” button that forges a strong password. */
  showSuggest?: boolean
  className?: string
}

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { id: 'len', label: '8+ characters', test: (v) => v.length >= 8 },
  { id: 'case', label: 'Upper & lower case', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: 'num', label: 'A number', test: (v) => /\d/.test(v) },
  { id: 'sym', label: 'A symbol', test: (v) => /[^A-Za-z0-9]/.test(v) },
  { id: 'long', label: '14+ characters', test: (v) => v.length >= 14 },
]

const LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Unbreakable']
const HUES = [250, 4, 30, 150, 176, 200]

/* shard layout, back → front. i = which rule grows it (−1 = seed) */
const SHARDS = [
  { rule: 3, cx: 66, w: 18, h: 36, tilt: -44 },
  { rule: 4, cx: 134, w: 18, h: 44, tilt: 42 },
  { rule: 1, cx: 82, w: 26, h: 62, tilt: -22 },
  { rule: 2, cx: 118, w: 26, h: 70, tilt: 20 },
  { rule: 0, cx: 100, w: 34, h: 92, tilt: 0 },
  { rule: -1, cx: 100, w: 16, h: 18, tilt: 6 },
]
const FACETS = [
  { l: 34, pts: (w: number, h: number) => [[-w / 2, 0], [-w / 6, 4], [-w / 6, -h], [-w / 2, -h + 6]] },
  { l: 56, pts: (w: number, h: number) => [[-w / 6, 4], [w / 6, 4], [w / 6, -h], [-w / 6, -h]] },
  { l: 45, pts: (w: number, h: number) => [[w / 6, 4], [w / 2, 0], [w / 2, -h + 6], [w / 6, -h]] },
  { l: 62, pts: (w: number, h: number, t: number) => [[-w / 2, -h + 6], [-w / 6, -h], [0, -h - t]] },
  { l: 80, pts: (w: number, h: number, t: number) => [[-w / 6, -h], [w / 6, -h], [0, -h - t]] },
  { l: 70, pts: (w: number, h: number, t: number) => [[w / 6, -h], [w / 2, -h + 6], [0, -h - t]] },
]
const poly = (p: number[][]) => p.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' ')

function crackTime(v: string) {
  if (!v) return ''
  let pool = 0
  if (/[a-z]/.test(v)) pool += 26
  if (/[A-Z]/.test(v)) pool += 26
  if (/\d/.test(v)) pool += 10
  if (/[^A-Za-z0-9]/.test(v)) pool += 33
  const secs = Math.pow(pool, v.length) / 1e10 / 2
  const units: [number, string][] = [
    [3.15e9 * 1000, 'millennia'],
    [3.15e9, 'centuries'],
    [3.15e7, 'years'],
    [2.6e6, 'months'],
    [86400, 'days'],
    [3600, 'hours'],
    [60, 'minutes'],
    [1, 'seconds'],
  ]
  if (secs < 1) return 'instantly'
  for (const [s, name] of units) if (secs >= s) {
    const n = secs / s
    return n > 999 ? `1000+ ${name}` : `~${Math.round(n)} ${name}`
  }
  return 'instantly'
}

function forge(len = 18) {
  const sets = ['abcdefghjkmnpqrstuvwxyz', 'ABCDEFGHJKLMNPQRSTUVWXYZ', '23456789', '!@#$%&*?-+=']
  const all = sets.join('')
  const r = new Uint32Array(len)
  crypto.getRandomValues(r)
  const out = Array.from(r, (n, i) => (i < sets.length ? sets[i][n % sets[i].length] : all[n % all.length]))
  for (let i = out.length - 1; i > 0; i--) {
    const j = r[i] % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out.join('')
}

/**
 * Crystal Strength Password — a password field that grows an SVG crystal.
 * Each satisfied rule springs a new faceted shard out of the rock, the whole
 * cluster shifts hue from ember to glacier, and a perfect score turns it
 * iridescent with twinkling glints. Includes show/hide and a forged
 * suggestion that scrambles into place.
 */
export function CrystalStrengthPassword({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  rules = DEFAULT_PASSWORD_RULES,
  onStrengthChange,
  label = 'Create a password',
  placeholder = 'At least 8 characters',
  name = 'password',
  showSuggest = true,
  className,
}: CrystalStrengthPasswordProps) {
  const reduced = usePrefersReducedMotion()
  const [inner, setInner] = React.useState(defaultValue)
  const value = valueProp ?? inner
  const [visible, setVisible] = React.useState(false)
  const [forging, setForging] = React.useState(false)
  const id = React.useId()
  const set = (v: string) => {
    if (valueProp === undefined) setInner(v)
    onValueChange?.(v)
  }
  const list = rules.slice(0, 5)
  const passed = list.map((r) => r.test(value))
  const score = value ? passed.filter(Boolean).length : 0
  const labelText = value ? LABELS[Math.min(score, 5)] : 'Waiting for input'
  const hue = HUES[Math.min(score, 5)]
  const perfect = score >= list.length && list.length > 0

  React.useEffect(() => {
    onStrengthChange?.(score, labelText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  const suggest = async () => {
    const target = forge()
    setVisible(true)
    if (reduced) return set(target)
    setForging(true)
    const glyphs = '#%&*@$?!+=<>/'
    for (let f = 0; f <= target.length + 6; f++) {
      const shown = target
        .split('')
        .map((c, i) => (i < f - 6 ? c : i < f ? glyphs[(i * 7 + f) % glyphs.length] : ''))
        .join('')
      set(shown)
      await new Promise((r) => setTimeout(r, 28))
    }
    set(target)
    setForging(false)
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-xl flex-col items-stretch gap-6 rounded-[24px] p-5 sm:flex-row sm:items-center sm:p-6',
        'bg-white ring-1 ring-black/[0.06] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_24px_48px_-28px_rgb(24_24_27/0.3)]',
        'dark:bg-zinc-950 dark:ring-white/[0.07] dark:shadow-none',
        className,
      )}
    >
      {/* crystal */}
      <div className="relative mx-auto h-[190px] w-[190px] shrink-0 overflow-hidden rounded-[18px] bg-[radial-gradient(90%_80%_at_50%_30%,#f7f7fb,#eceef4)] ring-1 ring-black/[0.04] dark:bg-[radial-gradient(90%_80%_at_50%_30%,#14151c,#08090c)] dark:ring-white/[0.05]" aria-hidden>
        <motion.div
          className="absolute inset-x-6 bottom-6 h-10 rounded-[50%] blur-2xl"
          animate={{ backgroundColor: `hsl(${hue} 90% 60% / ${value ? 0.25 + score * 0.08 : 0.08})` }}
          transition={{ duration: 0.6 }}
        />
        <motion.svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full"
          animate={reduced ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* rock */}
          <path d="M40 176 L62 158 L92 150 L126 152 L150 160 L164 176 Z" className="fill-zinc-300 dark:fill-zinc-800" />
          <path d="M62 158 L92 150 L126 152 L150 160 L120 166 L84 166 Z" className="fill-zinc-200 dark:fill-zinc-700" />
          {SHARDS.map((s, k) => {
            const on = s.rule === -1 ? true : !!passed[s.rule] && !!value
            const shue = perfect ? 180 + k * 28 : hue
            const sat = value ? 78 : 12
            return (
              <g key={k} transform={`translate(${s.cx} 160) rotate(${s.tilt})`}>
                <motion.g
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                  initial={false}
                  animate={{ scaleY: on ? 1 : 0, scaleX: on ? 1 : 0.4, opacity: on ? 1 : 0 }}
                  transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: on ? 13 : 26, mass: 0.7 }}
                >
                  {FACETS.map((f, fi) => (
                    <polygon
                      key={fi}
                      points={poly(f.pts(s.w, s.h, s.w * 0.75))}
                      style={{ fill: `hsl(${shue} ${sat}% ${f.l + (value ? 0 : 20)}%)`, transition: 'fill 600ms ease' }}
                      stroke="white"
                      strokeOpacity={0.35}
                      strokeWidth={0.6}
                    />
                  ))}
                  <polygon points={poly([[-s.w / 6 + 2, -4], [-s.w / 6 + 5, -4], [-s.w / 6 + 5, -s.h + 4], [-s.w / 6 + 2, -s.h + 4]])} fill="white" opacity={0.35} />
                </motion.g>
              </g>
            )
          })}
          {/* glints */}
          {perfect && !reduced &&
            [
              [100, 44, 0],
              [70, 108, 0.7],
              [140, 96, 1.3],
              [118, 72, 2],
            ].map(([x, y, d], i) => (
              <motion.path
                key={i}
                d={`M${x} ${y - 7} L${x + 1.6} ${y - 1.6} L${x + 7} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 7} L${x - 1.6} ${y + 1.6} L${x - 7} ${y} L${x - 1.6} ${y - 1.6} Z`}
                fill="white"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.2, delay: d }}
              />
            ))}
        </motion.svg>
        <div className="absolute inset-x-0 top-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-400">
          {score}/{list.length}
        </div>
      </div>

      {/* field */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <label htmlFor={id} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {label}
        </label>
        <div className="group relative flex items-center rounded-xl bg-zinc-50 ring-1 ring-black/10 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[color:var(--c)] dark:bg-white/[0.03] dark:ring-white/10 dark:focus-within:bg-white/[0.05]" style={{ ['--c' as string]: `hsl(${hue} 80% 55%)` }}>
          <input
            id={id}
            name={name}
            type={visible ? 'text' : 'password'}
            value={value}
            readOnly={forging}
            onChange={(e) => set(e.target.value)}
            placeholder={placeholder}
            autoComplete="new-password"
            spellCheck={false}
            aria-describedby={id + '-strength ' + id + '-rules'}
            className="h-11 min-w-0 flex-1 bg-transparent pl-3.5 font-mono text-[14px] tracking-wide text-zinc-900 outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-400 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="mr-1 grid h-9 w-9 place-items-center rounded-lg text-zinc-500 dark:text-zinc-400 outline-none transition hover:bg-black/5 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-white/5 dark:hover:text-zinc-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={visible ? 'on' : 'off'}
                initial={reduced ? false : { rotate: -60, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { rotate: 60, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.16 }}
              >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* meter */}
        <div className="flex gap-1" aria-hidden>
          {list.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <motion.div
                className="h-full origin-left rounded-full"
                initial={false}
                animate={{ scaleX: i < score ? 1 : 0, backgroundColor: `hsl(${perfect ? 180 + i * 28 : hue} 80% 55%)` }}
                transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 26, delay: i * 0.03 }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-baseline justify-between gap-2 text-xs">
          <p id={id + '-strength'} aria-live="polite" className="font-medium" style={{ color: value ? `hsl(${hue} 65% 45%)` : undefined }}>
            <span className={cn(!value && 'text-zinc-500 dark:text-zinc-400', 'dark:brightness-150')}>{labelText}</span>
          </p>
          {value && <span className="text-zinc-500 dark:text-zinc-400">Crack time: {crackTime(value)}</span>}
        </div>

        <ul id={id + '-rules'} className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {list.map((r, i) => (
            <li key={r.id} className={cn('flex items-center gap-1.5 text-xs transition-colors', passed[i] && value ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-500 dark:text-zinc-400')}>
              <span className={cn('grid h-4 w-4 place-items-center rounded-full ring-1 transition-colors', passed[i] && value ? 'bg-emerald-700 text-white ring-emerald-500' : 'ring-zinc-300 dark:ring-zinc-700')}>
                <AnimatePresence>
                  {passed[i] && value && (
                    <motion.span initial={reduced ? false : { scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {r.label}
              <span className="sr-only">{passed[i] && value ? '(met)' : '(not met)'}</span>
            </li>
          ))}
        </ul>

        {showSuggest && (
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={suggest}
              disabled={forging}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-zinc-900 px-3.5 text-xs font-medium text-white outline-none transition active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:focus-visible:ring-offset-zinc-950"
            >
              <Wand2 className="h-3.5 w-3.5" /> {forging ? 'Forging…' : 'Suggest one'}
            </button>
            {value && (
              <button type="button" onClick={() => set('')} className="h-9 rounded-full px-3 text-xs text-zinc-500 dark:text-zinc-400 outline-none hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:text-zinc-200">
                Clear
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
