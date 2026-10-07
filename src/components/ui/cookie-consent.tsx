import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Cookie, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ConsentCategory = { id: string; label: string; description: string; required?: boolean; defaultOn?: boolean }
export type ConsentChoice = Record<string, boolean>

export type CookieConsentProps = {
  categories?: ConsentCategory[]
  open?: boolean
  defaultOpen?: boolean
  onDecision?: (choice: ConsentChoice) => void
  /** Show a “Cookie settings” reopen chip after deciding. */
  showReopen?: boolean
  className?: string
}

export const DEFAULT_CONSENT_CATEGORIES: ConsentCategory[] = [
  { id: 'necessary', label: 'Strictly necessary', description: 'Sign-in, security and load balancing. Always on.', required: true },
  { id: 'analytics', label: 'Analytics', description: 'Anonymous usage that helps us improve the product.', defaultOn: true },
  { id: 'marketing', label: 'Marketing', description: 'Personalised ads on other sites.' },
]

function Switch({ checked, disabled, onChange, label }: { checked: boolean; disabled?: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2 disabled:opacity-60 dark:focus-visible:ring-offset-zinc-900', checked ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700')}>
      <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.25)]', checked ? 'right-0.5' : 'left-0.5')} />
    </button>
  )
}

/**
 * Cookie Consent — a floating glass card that springs up from the corner with
 * equal-weight Accept / Reject buttons (no dark patterns) and a Customise
 * drawer of per-category switches that expands in place. Non-modal region,
 * Esc collapses, and a small chip lets visitors reopen their settings.
 */
export function CookieConsent({ categories = DEFAULT_CONSENT_CATEGORIES, open, defaultOpen = true, onDecision, showReopen = true, className }: CookieConsentProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const [inner, setInner] = React.useState(defaultOpen)
  const isOpen = open ?? inner
  const [custom, setCustom] = React.useState(false)
  const [choice, setChoice] = React.useState<ConsentChoice>(() => Object.fromEntries(categories.map((c) => [c.id, !!(c.required || c.defaultOn)])))
  const [saved, setSaved] = React.useState<string | null>(null)
  const decide = (c: ConsentChoice, note: string) => { setChoice(c); onDecision?.(c); setSaved(note); setCustom(false); if (open === undefined) setInner(false) }
  const all = (v: boolean) => Object.fromEntries(categories.map((c) => [c.id, c.required ? true : v]))
  const btn = 'h-10 flex-1 rounded-[12px] text-sm font-medium transition-[background-color,transform] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900'
  return (
    <div className={cn('relative flex min-h-[380px] w-full items-end justify-start p-4', className)}>
      <p role="status" className="absolute left-4 top-4 text-[13px] text-zinc-600 dark:text-zinc-400">{saved}</p>
      <AnimatePresence>
        {isOpen ? (
          <motion.section key="card" role="region" aria-labelledby={`${id}-t`} onKeyDown={(e) => e.key === 'Escape' && setCustom(false)}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }} layout={!reduced}
            className="w-full max-w-[400px] rounded-[22px] border border-black/[0.08] bg-white/85 p-5 shadow-[0_2px_6px_rgb(0_0_0/0.08),0_32px_80px_-32px_rgb(0_0_0/0.45)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/85 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] [@media(prefers-reduced-transparency:reduce)]:bg-white [@media(prefers-reduced-transparency:reduce)]:dark:bg-zinc-900">
            <motion.div layout="position" className="flex gap-3">
              <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300"><Cookie className="size-4" /></span>
              <div>
                <h2 id={`${id}-t`} className="text-[15px] font-semibold text-zinc-950 dark:text-white">We value your privacy</h2>
                <p className="mt-1 text-pretty text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">We use cookies to run the site and, with your permission, to understand how it’s used. <a href="#" className="font-medium text-zinc-900 underline underline-offset-2 dark:text-white">Policy</a></p>
              </div>
            </motion.div>
            <AnimatePresence initial={false}>
              {custom && (
                <motion.div key="c" initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 34 }} className="overflow-hidden">
                  <ul className="mt-4 grid gap-1 rounded-[14px] border border-black/[0.06] bg-zinc-50/80 p-1 dark:border-white/[0.08] dark:bg-white/[0.03]">
                    {categories.map((c) => (
                      <li key={c.id} className="flex items-center gap-3 rounded-[10px] p-3">
                        <div className="flex-1"><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{c.label}</p><p className="text-xs text-zinc-600 dark:text-zinc-400">{c.description}</p></div>
                        <Switch label={c.label} checked={choice[c.id]} disabled={c.required} onChange={(v) => setChoice((s) => ({ ...s, [c.id]: v }))} />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div layout="position" className="mt-4 flex flex-wrap gap-2">
              {custom ? (
                <button type="button" onClick={() => decide(choice, 'Preferences saved.')} className={cn(btn, 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100')}>Save preferences</button>
              ) : (
                <>
                  <button type="button" onClick={() => decide(all(false), 'Optional cookies rejected.')} className={cn(btn, 'border border-black/[0.1] bg-white text-zinc-900 hover:bg-zinc-50 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]')}>Reject all</button>
                  <button type="button" onClick={() => decide(all(true), 'All cookies accepted.')} className={cn(btn, 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100')}>Accept all</button>
                </>
              )}
              <button type="button" aria-expanded={custom} onClick={() => setCustom((c) => !c)} className="inline-flex h-10 w-full items-center justify-center gap-1 rounded-[12px] text-[13px] font-medium text-zinc-700 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:text-zinc-300 dark:hover:bg-white/[0.06]">
                {custom ? 'Back' : 'Customise'}<ChevronDown aria-hidden className={cn('size-3.5 transition-transform', custom && 'rotate-180')} />
              </button>
            </motion.div>
          </motion.section>
        ) : showReopen ? (
          <motion.button key="chip" type="button" onClick={() => { setInner(true); setSaved(null) }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 text-sm font-medium text-zinc-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
            <Cookie aria-hidden className="size-4" />Cookie settings
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
