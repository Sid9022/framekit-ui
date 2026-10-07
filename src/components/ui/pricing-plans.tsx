import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type Plan = { id: string; name: string; tagline: string; monthly: number | null; yearly: number | null; features: string[]; cta: string; highlighted?: boolean; badge?: string }

export type PricingPlansProps = {
  plans?: Plan[]
  /** Uncontrolled initial billing period. */
  defaultBilling?: 'monthly' | 'yearly'
  billing?: 'monthly' | 'yearly'
  onBillingChange?: (b: 'monthly' | 'yearly') => void
  currency?: string
  /** Label on the yearly toggle, e.g. “Save 20%”. */
  yearlyNote?: string
  onSelect?: (plan: Plan) => void
  className?: string
}

export const DEFAULT_PLANS: Plan[] = [
  { id: 'hobby', name: 'Hobby', tagline: 'For side projects and learning.', monthly: 0, yearly: 0, cta: 'Start free', features: ['1 project', 'Community support', '100 GB bandwidth', 'Preview deployments'] },
  { id: 'pro', name: 'Pro', tagline: 'For teams shipping every day.', monthly: 24, yearly: 19, cta: 'Start 14‑day trial', highlighted: true, badge: 'Most popular', features: ['Unlimited projects', 'Email support', '1 TB bandwidth', 'Team roles', 'Analytics'] },
  { id: 'enterprise', name: 'Enterprise', tagline: 'For orgs with security needs.', monthly: null, yearly: null, cta: 'Contact sales', features: ['SSO and SCIM', '99.99% SLA', 'Dedicated support', 'Audit logs', 'Custom contracts'] },
]

function Digit({ d, reduced }: { d: string; reduced: boolean }) {
  return (
    <span className="relative inline-block overflow-hidden tabular-nums" style={{ height: '1em', lineHeight: 1 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={d} className="inline-block"
          initial={reduced ? { opacity: 0 } : { y: '-100%', opacity: 0, filter: 'blur(3px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={reduced ? { opacity: 0 } : { y: '100%', opacity: 0, filter: 'blur(3px)' }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}>{d}</motion.span>
      </AnimatePresence>
    </span>
  )
}

/**
 * Pricing Plans — three-tier pricing with a sliding monthly/yearly switch whose
 * numerals roll digit-by-digit, a highlighted plan with a soft gradient rim,
 * and a “saved per year” chip that springs in on yearly billing.
 */
export function PricingPlans({ plans = DEFAULT_PLANS, defaultBilling = 'yearly', billing, onBillingChange, currency = '$', yearlyNote = 'Save 20%', onSelect, className }: PricingPlansProps) {
  const reduced = usePrefersReducedMotion()
  const id = React.useId()
  const [inner, setInner] = React.useState(defaultBilling)
  const b = billing ?? inner
  const set = (v: 'monthly' | 'yearly') => { if (billing === undefined) setInner(v); onBillingChange?.(v) }
  return (
    <section aria-labelledby={`${id}-h`} className={cn('w-full', className)}>
      <div className="flex flex-col items-center text-center">
        <h2 id={`${id}-h`} className="text-balance text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl dark:text-white">Simple pricing that scales</h2>
        <p className="mt-2 max-w-[48ch] text-pretty text-[15px] text-zinc-600 dark:text-zinc-400">Start free. Upgrade when your team needs more.</p>
        <div role="radiogroup" aria-label="Billing period" className="mt-6 inline-flex rounded-full border border-black/[0.08] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.05]"
          onKeyDown={(e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); const n = b === 'monthly' ? 'yearly' : 'monthly'; set(n); (e.currentTarget.querySelector(`[data-v="${n}"]`) as HTMLElement)?.focus() } }}>
          {(['monthly', 'yearly'] as const).map((v) => (
            <button key={v} data-v={v} type="button" role="radio" aria-checked={b === v} tabIndex={b === v ? 0 : -1} onClick={() => set(v)}
              className="relative flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium capitalize text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 aria-checked:text-zinc-950 dark:text-zinc-300 dark:aria-checked:text-white">
              {b === v && <motion.span layoutId={`${id}-thumb`} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 36 }} className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_4px_12px_-6px_rgb(0_0_0/0.2)] dark:bg-zinc-800 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]" />}
              <span className="relative">{v}</span>
              {v === 'yearly' && <span className="relative rounded-full bg-emerald-600/10 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">{yearlyNote}</span>}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((p, i) => {
          const price = b === 'monthly' ? p.monthly : p.yearly
          const saved = p.monthly && p.yearly ? (p.monthly - p.yearly) * 12 : 0
          return (
            <motion.li key={p.id} initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn('relative flex flex-col rounded-[24px] p-6',
                p.highlighted
                  ? 'bg-zinc-950 text-white shadow-[0_1px_2px_rgb(0_0_0/0.1),0_32px_64px_-32px_rgb(24_24_27/0.6)] ring-1 ring-white/10 dark:bg-zinc-900 dark:ring-signal-500/40 lg:-my-2 lg:py-8'
                  : 'border border-black/[0.08] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-12px_rgb(0_0_0/0.18)] dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]')}>
              {p.highlighted && <span aria-hidden className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-signal-500 to-transparent" />}
              {p.highlighted && <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(120%_60%_at_50%_0%,rgb(154_134_184/0.28),transparent_60%)]" />}
              <div className="relative flex items-center justify-between">
                <h3 className={cn('text-base font-semibold', p.highlighted ? 'text-white' : 'text-zinc-950 dark:text-white')}>{p.name}</h3>
                {p.badge && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white ring-1 ring-white/15">{p.badge}</span>}
              </div>
              <p className={cn('relative mt-1 text-sm', p.highlighted ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-400')}>{p.tagline}</p>
              <div className="relative mt-6 flex h-14 items-end gap-1" aria-live="polite">
                {price === null ? <span className="text-4xl font-semibold tracking-[-0.03em]">Custom</span> : (
                  <>
                    <span className="sr-only">{`${currency}${price} per user per month, billed ${b}`}</span>
                    <span aria-hidden className="flex text-5xl font-semibold tracking-[-0.04em]"><span>{currency}</span>{String(price).split('').map((d, k, arr) => <Digit key={arr.length - k} d={d} reduced={reduced} />)}</span>
                    <span aria-hidden className={cn('mb-1 text-sm', p.highlighted ? 'text-zinc-400' : 'text-zinc-600 dark:text-zinc-400')}>/user/mo</span>
                  </>
                )}
              </div>
              <div className="relative h-6">
                <AnimatePresence>
                  {b === 'yearly' && saved > 0 && (
                    <motion.span initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                      className={cn('inline-block text-xs font-medium', p.highlighted ? 'text-emerald-400' : 'text-emerald-700 dark:text-emerald-400')}>You save {currency}{saved} per user / year</motion.span>
                  )}
                </AnimatePresence>
              </div>
              <button type="button" onClick={() => onSelect?.(p)}
                className={cn('relative mt-4 h-11 rounded-[12px] text-sm font-medium transition-[transform,background-color] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2',
                  p.highlighted ? 'bg-white text-zinc-950 hover:bg-zinc-100 focus-visible:ring-offset-zinc-950' : 'border border-black/[0.1] bg-white text-zinc-900 hover:bg-zinc-50 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:focus-visible:ring-offset-zinc-900')}>{p.cta}</button>
              <ul className="relative mt-6 grid gap-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className={cn('flex items-center gap-2.5', p.highlighted ? 'text-zinc-200' : 'text-zinc-700 dark:text-zinc-300')}>
                    <Check aria-hidden className={cn('size-4 shrink-0', p.highlighted ? 'text-signal-500' : 'text-zinc-900 dark:text-zinc-200')} />{f}
                  </li>
                ))}
              </ul>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}

