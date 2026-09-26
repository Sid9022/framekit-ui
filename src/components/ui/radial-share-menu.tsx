import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AtSign, Link2, Mail, MessageCircle, RotateCcw, Send, Share2, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type ShareChannel = {
  id: string
  label: string
  icon: LucideIcon
  /** Circle fill. */
  color: string
  /** Icon colour on the circle. */
  ink?: string
  /** Copy shown after picking, e.g. “Link copied”. */
  feedback?: string
  /** `copy` writes `url` to the clipboard. */
  kind?: 'copy' | 'share'
  /** Opens in a new tab when picked (after the confirmation plays). */
  href?: string
}

export type RadialShareMenuProps = {
  /** URL used by copy channels. Defaults to the current page. */
  url?: string
  label?: string
  channels?: ShareChannel[]
  /** Arc radius in px. */
  radius?: number
  /** Async hook fired on pick; rejecting shows a retry chip. Copy channels copy before it runs. */
  onShare?: (channel: ShareChannel) => void | Promise<unknown>
  /** How long the confirmation stays before resetting, in ms. */
  resetAfter?: number
  className?: string
}

export const DEFAULT_SHARE_CHANNELS: ShareChannel[] = [
  { id: 'copy', label: 'Copy link', icon: Link2, color: '#c9623f', feedback: 'Link copied', kind: 'copy' },
  { id: 'mail', label: 'Email', icon: Mail, color: '#2f3a56', feedback: 'Draft ready' },
  { id: 'dm', label: 'Direct message', icon: Send, color: '#6f8f72', feedback: 'Sent to DMs' },
  { id: 'chat', label: 'Group chat', icon: MessageCircle, color: '#d6a23c', ink: '#2a1d05', feedback: 'Posted to chat' },
  { id: 'mention', label: 'Mention', icon: AtSign, color: '#8a5a83', feedback: 'Mention drafted' },
]

type Phase = 'closed' | 'open' | 'picking' | 'done' | 'error'

/**
 * Radial Share Menu — the Share pill folds into a close button while channel
 * bubbles spring out along an arc. Picking one clears the others, and the
 * chosen bubble glides to centre and turns into a check.
 */
export function RadialShareMenu({
  url,
  label = 'Share',
  channels = DEFAULT_SHARE_CHANNELS,
  radius = 104,
  onShare,
  resetAfter = 1700,
  className,
}: RadialShareMenuProps) {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = React.useState<Phase>('closed')
  const [chosen, setChosen] = React.useState<number | null>(null)
  const [active, setActive] = React.useState(0)
  const [hover, setHover] = React.useState<number | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const run = React.useRef(0)
  const menuId = React.useId()
  React.useEffect(() => () => void (run.current += 1), [])

  const open = phase === 'open'
  const expanded = phase !== 'closed'
  const n = channels.length

  const pos = React.useMemo(
    () =>
      channels.map((_, i) => {
        // spread along the upper semicircle, left → right, trimmed a little at the ends
        const a = Math.PI - (Math.PI * 0.84 * i) / Math.max(1, n - 1) - Math.PI * 0.08
        return { x: Math.cos(a) * radius, y: -Math.sin(a) * radius }
      }),
    [channels, n, radius],
  )

  const focusItem = (i: number) => {
    const k = ((i % n) + n) % n
    setActive(k)
    itemRefs.current[k]?.focus()
  }

  const openMenu = () => {
    run.current += 1
    setChosen(null)
    setPhase('open')
    setActive(0)
    window.setTimeout(() => itemRefs.current[0]?.focus(), reduced ? 0 : 120)
  }

  const close = (returnFocus = true) => {
    run.current += 1
    setPhase('closed')
    setChosen(null)
    setHover(null)
    if (returnFocus) triggerRef.current?.focus()
  }

  const pick = async (i: number) => {
    const ch = channels[i]
    const id = ++run.current
    const alive = () => id === run.current
    setChosen(i)
    setPhase('picking')
    triggerRef.current?.focus()
    let ok = true
    try {
      if (ch.kind === 'copy') {
        const text = url ?? window.location.href
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
        await navigator.clipboard.writeText(text)
      }
      await onShare?.(ch)
    } catch {
      ok = false
    }
    await new Promise((r) => window.setTimeout(r, reduced ? 0 : 260))
    if (!alive()) return
    setPhase(ok ? 'done' : 'error')
    if (!ok) return
    if (ch.href) window.open(ch.href, '_blank', 'noopener,noreferrer')
    await new Promise((r) => window.setTimeout(r, resetAfter))
    if (alive()) close(false)
  }

  const onItemKey = (e: React.KeyboardEvent, i: number) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        focusItem(i + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        focusItem(i - 1)
        break
      case 'Home':
        e.preventDefault()
        focusItem(0)
        break
      case 'End':
        e.preventDefault()
        focusItem(n - 1)
        break
      case 'Escape':
        e.preventDefault()
        close()
        break
      case 'Tab':
        close(false)
        break
    }
  }

  const ch = chosen != null ? channels[chosen] : null
  const status =
    phase === 'open'
      ? `Share menu open, ${n} options`
      : phase === 'done' && ch
        ? ch.feedback ?? `Shared via ${ch.label}`
        : phase === 'error' && ch
          ? `${ch.kind === 'copy' ? 'Could not copy the link' : `Could not share via ${ch.label}`}. Choose it again to retry.`
          : ''

  const springOut = (i: number) =>
    reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 22, mass: 0.7, delay: open ? i * 0.045 : (n - 1 - i) * 0.025 }

  return (
    <div
      className={cn('relative inline-grid h-[196px] w-[300px] place-items-end justify-items-center pb-3', className)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && expanded) close()
      }}
    >
      {/* channels */}
      <div id={menuId} role="menu" aria-label="Share via" aria-orientation="horizontal" className="pointer-events-none absolute bottom-3 left-1/2 h-14 w-14 -translate-x-1/2">
        {channels.map((c, i) => {
          const isChosen = chosen === i
          const shown = open || ((phase === 'picking' || phase === 'done' || phase === 'error') && isChosen)
          const settled = isChosen && (phase === 'done' || phase === 'error')
          const Icon = c.icon
          const target = isChosen && phase !== 'open' ? { x: 0, y: -radius * 0.72 } : pos[i]
          return (
            <motion.button
              key={c.id}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              type="button"
              role="menuitem"
              tabIndex={(open && active === i) || (phase === 'error' && isChosen) ? 0 : -1}
              aria-label={c.label}
              aria-hidden={!shown}
              disabled={!open && !(phase === 'error' && isChosen)}
              onClick={() => (phase === 'error' && isChosen ? pick(i) : open && pick(i))}
              onKeyDown={(e) => onItemKey(e, i)}
              onFocus={() => setActive(i)}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover((h) => (h === i ? null : h))}
              className={cn(
                'absolute left-1/2 top-1/2 -ml-6 -mt-6 grid h-12 w-12 place-items-center rounded-full outline-none',
                'focus-visible:ring-2 focus-visible:ring-[#3b2a1e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe4d2]',
                shown ? 'pointer-events-auto' : 'pointer-events-none',
              )}
              style={{ color: c.ink ?? '#fff7ee', zIndex: isChosen ? 3 : 1 }}
              initial={false}
              animate={{
                x: shown ? target.x : 0,
                y: shown ? target.y : 0,
                scale: !shown ? 0 : settled ? 1.55 : isChosen && phase === 'picking' ? 1.25 : 1,
                opacity: shown ? 1 : 0,
              }}
              transition={isChosen && phase !== 'open' ? (reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 24 }) : springOut(i)}
              whileHover={open && !reduced ? { scale: 1.12 } : undefined}
              whileTap={open && !reduced ? { scale: 0.92 } : undefined}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_1px_2px_rgb(60_40_20/0.3),0_10px_20px_-8px_rgb(60_40_20/0.55)]"
                initial={false}
                animate={{ backgroundColor: settled ? (phase === 'error' ? '#b4323f' : '#2f6b4f') : c.color }}
                transition={{ duration: 0.3 }}
              />
              <AnimatePresence mode="popLayout" initial={false}>
                {settled ? (
                  phase === 'error' ? (
                    <motion.span key="err" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} className="relative text-white">
                      <RotateCcw className="h-5 w-5" strokeWidth={2.4} />
                    </motion.span>
                  ) : (
                    <motion.svg key="ok" viewBox="0 0 24 24" className="relative h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.1 }} />
                    </motion.svg>
                  )
                ) : (
                  <motion.span key="icon" className="relative" exit={{ scale: 0, opacity: 0, transition: { duration: 0.12 } }}>
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </motion.span>
                )}
              </AnimatePresence>
              {/* tooltip */}
              <AnimatePresence>
                {open && (hover === i || active === i) && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute bottom-full mb-2 whitespace-nowrap rounded-md bg-[#2b211a] px-2 py-1 text-[11px] font-medium text-[#f6ecdf] shadow-lg"
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.95, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.16 }}
                  >
                    {c.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* feedback copy */}
      <AnimatePresence>
        {(phase === 'done' || phase === 'error') && ch && (
          <motion.p
            key={`${phase}-${ch.id}`}
            aria-hidden
            className={cn('absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold tracking-tight', phase === 'error' ? 'text-[#b4323f]' : 'text-[#2f4a3a]')}
            style={{ bottom: 12 + 28 + radius * 0.72 + 44 }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ delay: 0.12 }}
          >
            {phase === 'error' ? (ch.kind === 'copy' ? 'Couldn’t copy — tap to retry' : 'Didn’t go through — retry') : ch.feedback ?? `Shared via ${ch.label}`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* trigger */}
      <motion.button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={expanded ? 'Close share menu' : label}
        onClick={() => (expanded ? close() : openMenu())}
        onKeyDown={(e) => {
          if (!expanded && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            e.preventDefault()
            openMenu()
          }
        }}
        initial={false}
        animate={{ width: expanded ? 48 : 128, height: expanded ? 48 : 56, marginBottom: expanded ? 4 : 0 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 30 }}
        whileTap={reduced ? undefined : { scale: 0.95 }}
        className={cn(
          'relative z-10 grid place-items-center overflow-hidden rounded-full bg-white text-[15px] font-semibold tracking-tight text-[#2b211a] outline-none',
          'shadow-[inset_0_-1px_0_rgb(120_90_60/0.12),0_1px_2px_rgb(80_55_30/0.18),0_14px_28px_-12px_rgb(80_55_30/0.45)]',
          'focus-visible:ring-2 focus-visible:ring-[#c9623f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#efe4d2]',
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {expanded ? (
            <motion.span
              key="x"
              initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
            >
              <X className="h-5 w-5" strokeWidth={2.4} />
            </motion.span>
          ) : (
            <motion.span
              key="share"
              className="flex items-center gap-2 whitespace-nowrap"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
            >
              <Share2 className="h-[18px] w-[18px]" strokeWidth={2.3} />
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
    </div>
  )
}
