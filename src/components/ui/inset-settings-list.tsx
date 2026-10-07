import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, Check, ChevronLeft, ChevronRight, Globe, Moon, Shield, Smartphone, Wifi } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type SettingsRow =
  | { kind: 'toggle'; id: string; label: string; icon?: React.ReactNode; tint?: string; defaultOn?: boolean; disabled?: boolean }
  | { kind: 'choice'; id: string; label: string; icon?: React.ReactNode; tint?: string; options: string[]; defaultValue?: string }
  | { kind: 'info'; id: string; label: string; icon?: React.ReactNode; tint?: string; value: string }
export type SettingsSection = { id: string; header?: string; footer?: string; rows: SettingsRow[] }

export type InsetSettingsListProps = {
  sections?: SettingsSection[]
  /** Fires whenever a toggle or choice changes. */
  onChange?: (id: string, value: boolean | string) => void
  /** Title of the root page. */
  title?: string
  className?: string
}

export const DEFAULT_SETTINGS: SettingsSection[] = [
  { id: 'net', rows: [
    { kind: 'toggle', id: 'wifi', label: 'Wi-Fi sync', icon: <Wifi />, tint: 'bg-sky-600', defaultOn: true },
    { kind: 'choice', id: 'appearance', label: 'Appearance', icon: <Moon />, tint: 'bg-indigo-600', options: ['Automatic', 'Light', 'Dark'], defaultValue: 'Automatic' },
    { kind: 'choice', id: 'region', label: 'Region', icon: <Globe />, tint: 'bg-teal-700', options: ['Europe (Frankfurt)', 'US East (Virginia)', 'Asia (Singapore)'], defaultValue: 'Europe (Frankfurt)' },
  ] },
  { id: 'notif', header: 'Notifications', footer: 'Quiet hours silence alerts from 22:00 to 07:00 on every device.', rows: [
    { kind: 'toggle', id: 'push', label: 'Deploy alerts', icon: <Bell />, tint: 'bg-rose-600', defaultOn: true },
    { kind: 'toggle', id: 'quiet', label: 'Quiet hours', icon: <Moon />, tint: 'bg-violet-600' },
    { kind: 'toggle', id: 'sms', label: 'SMS fallback', icon: <Smartphone />, tint: 'bg-emerald-700', disabled: true },
  ] },
  { id: 'sec', header: 'Security', rows: [
    { kind: 'info', id: 'tfa', label: 'Two-factor', icon: <Shield />, tint: 'bg-zinc-700', value: 'On' },
  ] },
]

function Switch({ on, onToggle, label, disabled, reduced }: { on: boolean; onToggle: () => void; label: string; disabled?: boolean; reduced: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'relative h-[31px] w-[51px] shrink-0 rounded-full p-0.5 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-signal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-signal-300 dark:focus-visible:ring-offset-zinc-900',
        on ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <motion.span
        className="block h-[27px] rounded-full bg-white shadow-[0_3px_8px_rgb(0_0_0/0.15),0_1px_1px_rgb(0_0_0/0.16)]"
        initial={false}
        animate={{ x: on ? 20 : 0, width: 27 }}
        whileTap={reduced || disabled ? undefined : { width: 33, x: on ? 14 : 0 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 34 }}
      />
    </button>
  )
}

/**
 * Inset Settings List — an iOS-style grouped inset list with coloured icon
 * tiles, hairline separators inset to the label edge, switches whose knob
 * stretches as you press, and choice rows that push a detail page with a
 * parallax slide and a back button that returns focus where you left it.
 * Rows are real buttons and switches, with section headers and footers wired
 * up for screen readers.
 */
export function InsetSettingsList({ sections = DEFAULT_SETTINGS, onChange, title = 'Settings', className }: InsetSettingsListProps) {
  const reduced = usePrefersReducedMotion()
  const [vals, setVals] = React.useState<Record<string, boolean | string>>(() => {
    const o: Record<string, boolean | string> = {}
    sections.forEach((s) => s.rows.forEach((r) => { if (r.kind === 'toggle') o[r.id] = !!r.defaultOn; if (r.kind === 'choice') o[r.id] = r.defaultValue ?? r.options[0] }))
    return o
  })
  const [page, setPage] = React.useState<string | null>(null)
  const [msg, setMsg] = React.useState('')
  const backRef = React.useRef<HTMLButtonElement>(null)
  const lastRow = React.useRef<string | null>(null)
  const rowRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})

  const set = (id: string, v: boolean | string, label: string) => {
    setVals((p) => ({ ...p, [id]: v }))
    onChange?.(id, v)
    setMsg(typeof v === 'boolean' ? `${label} ${v ? 'on' : 'off'}` : `${label}: ${v}`)
  }
  React.useEffect(() => {
    if (page) backRef.current?.focus({ preventScroll: true })
    else if (lastRow.current) rowRefs.current[lastRow.current]?.focus({ preventScroll: true })
  }, [page])

  const detail = sections.flatMap((s) => s.rows).find((r) => r.id === page && r.kind === 'choice') as Extract<SettingsRow, { kind: 'choice' }> | undefined
  const spring = reduced ? { duration: 0.15 } : { type: 'spring' as const, stiffness: 380, damping: 38 }

  const Tile = ({ r }: { r: SettingsRow }) => r.icon ? <span aria-hidden className={cn('grid size-[29px] shrink-0 place-items-center rounded-[7px] text-white [&>svg]:size-[17px]', r.tint ?? 'bg-zinc-600')}>{r.icon}</span> : null

  return (
    <div className={cn('relative w-full max-w-md overflow-hidden rounded-[28px] bg-zinc-100 ring-1 ring-black/[0.06] dark:bg-black dark:ring-white/[0.1]', className)} style={{ minHeight: 520 }}>
      <AnimatePresence initial={false} mode="popLayout">
        {!detail ? (
          <motion.div key="root" className="p-4 pb-6" initial={reduced ? { opacity: 0 } : { x: '-30%', opacity: 0.6 }} animate={{ x: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { x: '-30%', opacity: 0 }} transition={spring}>
            <h3 className="px-2 pb-3 pt-2 text-[28px] font-bold tracking-tight text-zinc-950 dark:text-white">{title}</h3>
            {sections.map((s) => {
              const hid = `${s.id}-h`, fid = `${s.id}-f`
              return (
                <section key={s.id} aria-labelledby={s.header ? hid : undefined} aria-describedby={s.footer ? fid : undefined} className="mb-6">
                  {s.header && <h4 id={hid} className="px-4 pb-1.5 text-[13px] uppercase tracking-[0.04em] text-zinc-600 dark:text-zinc-400">{s.header}</h4>}
                  <ul className="overflow-hidden rounded-[12px] bg-white dark:bg-zinc-900">
                    {s.rows.map((r, i) => {
                      const sep = i < s.rows.length - 1
                      const inner = (
                        <>
                          <Tile r={r} />
                          <span className={cn('flex min-h-11 min-w-0 flex-1 items-center justify-between gap-3 self-stretch py-2 pr-4', sep && 'shadow-[inset_0_-0.5px_0_rgb(0_0_0/0.12)] dark:shadow-[inset_0_-0.5px_0_rgb(255_255_255/0.16)]')}>
                            <span className={cn('truncate text-[16px] text-zinc-950 dark:text-white sm:text-[15px]', r.kind === 'toggle' && r.disabled && 'text-zinc-500 dark:text-zinc-500')}>{r.label}</span>
                            {r.kind === 'toggle' && <Switch on={vals[r.id] as boolean} onToggle={() => set(r.id, !vals[r.id], r.label)} label={r.label} disabled={r.disabled} reduced={reduced} />}
                            {r.kind === 'choice' && <span className="flex min-w-0 items-center gap-1 text-[15px] text-zinc-600 dark:text-zinc-400"><span className="truncate">{vals[r.id] as string}</span><ChevronRight aria-hidden className="size-4 shrink-0 opacity-70" /></span>}
                            {r.kind === 'info' && <span className="text-[15px] text-zinc-600 dark:text-zinc-400">{r.value}</span>}
                          </span>
                        </>
                      )
                      return (
                        <li key={r.id}>
                          {r.kind === 'choice' ? (
                            <button
                              ref={(el) => { rowRefs.current[r.id] = el }}
                              type="button"
                              onClick={() => { lastRow.current = r.id; setPage(r.id) }}
                              aria-label={`${r.label}, ${vals[r.id]}`}
                              className="flex w-full items-center gap-3 pl-4 text-left outline-none transition-colors duration-100 hover:bg-zinc-900/[0.03] focus-visible:bg-signal-50 active:bg-zinc-900/[0.08] dark:hover:bg-white/[0.04] dark:focus-visible:bg-signal-300/[0.12] dark:active:bg-white/[0.1]"
                            >
                              {inner}
                            </button>
                          ) : (
                            <div className="flex items-center gap-3 pl-4">{inner}</div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                  {s.footer && <p id={fid} className="px-4 pt-1.5 text-[13px] leading-snug text-zinc-600 dark:text-zinc-400">{s.footer}</p>}
                </section>
              )
            })}
          </motion.div>
        ) : (
          <motion.div key="detail" className="p-4 pb-6" initial={reduced ? { opacity: 0 } : { x: '100%' }} animate={{ x: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { x: '100%' }} transition={spring}>
            <button ref={backRef} type="button" onClick={() => setPage(null)} className="-ml-1 flex min-h-11 items-center gap-0.5 rounded-[10px] pr-2 text-[16px] text-signal-700 outline-none focus-visible:ring-2 focus-visible:ring-signal-600 active:opacity-60 dark:text-signal-200 dark:focus-visible:ring-signal-300">
              <ChevronLeft aria-hidden className="size-6" /> {title}
            </button>
            <h3 className="px-2 pb-4 pt-1 text-[28px] font-bold tracking-tight text-zinc-950 dark:text-white">{detail.label}</h3>
            <ul role="radiogroup" aria-label={detail.label} className="overflow-hidden rounded-[12px] bg-white dark:bg-zinc-900">
              {detail.options.map((o, i) => {
                const sel = vals[detail.id] === o
                return (
                  <li key={o}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={sel}
                      onClick={() => set(detail.id, o, detail.label)}
                      className="flex w-full items-center pl-4 text-left outline-none transition-colors duration-100 hover:bg-zinc-900/[0.03] focus-visible:bg-signal-50 active:bg-zinc-900/[0.08] dark:hover:bg-white/[0.04] dark:focus-visible:bg-signal-300/[0.12]"
                    >
                      <span className={cn('flex min-h-11 flex-1 items-center justify-between py-2 pr-4 text-[16px] text-zinc-950 dark:text-white sm:text-[15px]', i < detail.options.length - 1 && 'shadow-[inset_0_-0.5px_0_rgb(0_0_0/0.12)] dark:shadow-[inset_0_-0.5px_0_rgb(255_255_255/0.16)]')}>
                        {o}
                        <AnimatePresence>{sel && <motion.span initial={reduced ? { opacity: 0 } : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 600, damping: 30 }}><Check aria-hidden className="size-5 text-signal-700 dark:text-signal-200" strokeWidth={2.5} /></motion.span>}</AnimatePresence>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">{msg}</span>
    </div>
  )
}
