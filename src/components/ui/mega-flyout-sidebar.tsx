import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import {
  BarChart3, BookOpen, Boxes, MessageSquare, Phone, Settings, Sparkles, type LucideIcon,
} from 'lucide-react'

type RailItem = {
  id: string
  label: string
  icon: LucideIcon
  panel: { title: string; blurb: string; links: { label: string; href?: string }[][] }
}

const ITEMS: RailItem[] = [
  {
    id: 'product',
    label: 'Product',
    icon: Boxes,
    panel: {
      title: 'Product suite',
      blurb: 'Compose channels that feel native on every surface.',
      links: [
        [{ label: 'Messaging API' }, { label: 'Voice agent' }, { label: 'Verify' }],
        [{ label: 'Flows' }, { label: 'Templates' }, { label: 'Insights' }],
      ],
    },
  },
  {
    id: 'engage',
    label: 'Engage',
    icon: MessageSquare,
    panel: {
      title: 'Engagement',
      blurb: 'Orchestrate conversations across WhatsApp, SMS, and voice.',
      links: [
        [{ label: 'Campaigns' }, { label: 'Journeys' }, { label: 'Audiences' }],
        [{ label: 'Opt-in center' }, { label: 'Quiet hours' }],
      ],
    },
  },
  {
    id: 'voice',
    label: 'Voice',
    icon: Phone,
    panel: {
      title: 'Voice cloud',
      blurb: 'Softphone, queues, and AI agents with crystal latency.',
      links: [
        [{ label: 'Queues' }, { label: 'IVR studio' }, { label: 'Recordings' }],
        [{ label: 'Agent desktop' }, { label: 'SIP trunks' }],
      ],
    },
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: BarChart3,
    panel: {
      title: 'Insights',
      blurb: 'Live delivery health and conversation quality.',
      links: [[{ label: 'Dashboards' }, { label: 'Exports' }], [{ label: 'Anomaly alerts' }]],
    },
  },
  {
    id: 'docs',
    label: 'Docs',
    icon: BookOpen,
    panel: {
      title: 'Documentation',
      blurb: 'Guides, API reference, and copy-paste UI kits.',
      links: [[{ label: 'Quickstart' }, { label: 'API ref' }], [{ label: 'Changelog' }, { label: 'Status' }]],
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    panel: {
      title: 'Settings',
      blurb: 'Workspace, billing, and security controls.',
      links: [[{ label: 'General' }, { label: 'Members' }], [{ label: 'API keys' }, { label: 'SSO' }]],
    },
  },
]

/** Icon rail that opens rich 2-col flyout panels with curtain slide — enterprise feel. */
export function MegaFlyoutSidebar({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = React.useState<string | null>('product')
  const current = ITEMS.find((i) => i.id === active) ?? null

  return (
    <div className={cn('relative flex h-[400px] w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0910]', className)}>
      <aside className="flex w-16 flex-col items-center gap-1 border-r border-zinc-800 py-3">
        <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-signal-500/25 text-signal-200">
          <Sparkles className="h-4 w-4" />
        </span>
        {ITEMS.map((item) => {
          const Icon = item.icon
          const on = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => setActive(item.id)}
              onFocus={() => setActive(item.id)}
              onClick={() => setActive(item.id)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition',
                on ? 'bg-signal-500/30 text-white shadow-[0_0_20px_rgba(154,134,184,0.35)]' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-200',
              )}
              aria-label={item.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </aside>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={reduced ? false : { x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="absolute inset-0 flex flex-col p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">{current.panel.title}</p>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-400">{current.panel.blurb}</p>
                </div>
                <div className="h-16 w-20 shrink-0 rounded-xl bg-gradient-to-br from-signal-500/40 via-violet-500/30 to-framekit-500/40 shadow-inner" />
              </div>
              <div className="grid flex-1 grid-cols-2 gap-4">
                {current.panel.links.map((col, ci) => (
                  <ul key={ci} className="space-y-1">
                    {col.map((link) => (
                      <li key={link.label}>
                        <button
                          type="button"
                          className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
