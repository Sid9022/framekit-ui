import * as React from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Compass, Home, Lock, Plus, RotateCw, Search, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type DeviceFrameProps = {
  /** Generic browser window or generic phone. */
  variant?: 'browser' | 'phone'
  /** Address shown in the browser URL field. */
  url?: string
  /** Screenshot to place inside the frame (object-cover, top aligned). */
  src?: string
  alt?: string
  /** Custom screen content. Takes priority over `src`. */
  children?: React.ReactNode
  /** Clock text in the phone status bar. */
  time?: string
  /** Fade + rise into view on first scroll-in. */
  animateIn?: boolean
  className?: string
}

function DemoPage() {
  return (
    <div className="flex h-full flex-col bg-white p-4 sm:p-6 dark:bg-zinc-950" aria-hidden>
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-md bg-zinc-900 dark:bg-white" />
        <span className="h-2 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <span className="ml-auto h-2 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <span className="h-2 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <span className="h-6 w-16 rounded-full bg-zinc-900 dark:bg-white" />
      </div>
      <div className="mt-6 grid flex-1 grid-cols-5 gap-4 sm:mt-8">
        <div className="col-span-3 flex flex-col justify-center gap-2.5">
          <span className="h-2 w-20 rounded-full bg-signal-300 dark:bg-signal-700" />
          <span className="h-4 w-[90%] rounded-md bg-zinc-900 sm:h-5 dark:bg-zinc-100" />
          <span className="h-4 w-[70%] rounded-md bg-zinc-900 sm:h-5 dark:bg-zinc-100" />
          <span className="mt-1 h-2 w-[80%] rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <span className="h-2 w-[60%] rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 flex gap-2">
            <span className="h-7 w-20 rounded-full bg-framekit-500" />
            <span className="h-7 w-16 rounded-full ring-1 ring-zinc-300 dark:ring-zinc-700" />
          </div>
        </div>
        <div className="relative col-span-2 overflow-hidden rounded-2xl ring-1 ring-black/[0.05] dark:ring-white/[0.06]" style={{ background: 'radial-gradient(120% 90% at 20% 10%, #d9cdf0, transparent 60%), radial-gradient(90% 80% at 90% 90%, #fed7aa, transparent 60%), #f4f1fa' }}>
          <div className="absolute inset-0 hidden dark:block" style={{ background: 'radial-gradient(120% 90% at 20% 10%, #4d3f5e, transparent 60%), radial-gradient(90% 80% at 90% 90%, #7c2d12, transparent 60%), #141218' }} />
          <div className="absolute inset-x-[18%] bottom-[16%] top-[22%] rounded-xl bg-white/60 ring-1 ring-black/[0.05] backdrop-blur-md dark:bg-white/[0.08] dark:ring-white/[0.08]" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-10 rounded-xl bg-zinc-100 ring-1 ring-black/[0.04] dark:bg-zinc-900 dark:ring-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}

function DemoApp() {
  return (
    <div className="relative h-full overflow-hidden bg-[#f3f1f8] dark:bg-[#0e0d12]" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-[58%] bg-[radial-gradient(90%_70%_at_30%_20%,#c9b8ea,transparent_65%),radial-gradient(80%_60%_at_85%_60%,#fdba74,transparent_60%)] opacity-90 dark:bg-[radial-gradient(90%_70%_at_30%_20%,#4d3f5e,transparent_65%),radial-gradient(80%_60%_at_85%_60%,#9a3412,transparent_60%)]" />
      <div className="relative px-5 pt-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-700 dark:text-zinc-300">Today</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Good morning</p>
        <div className="mt-5 rounded-[22px] bg-white/70 p-4 ring-1 ring-black/[0.05] backdrop-blur-xl dark:bg-white/[0.08] dark:ring-white/[0.08]">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300">Focus time</p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-950 dark:text-white">3h 20m</p>
          <div className="mt-3 flex h-10 items-end gap-1">
            {[40, 65, 35, 80, 55, 90, 60].map((h, i) => (
              <span key={i} className={cn('flex-1 rounded-sm', i === 5 ? 'bg-framekit-500' : 'bg-zinc-900/15 dark:bg-white/20')} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {['Reading', 'Walk'].map((t, i) => (
            <div key={t} className="rounded-[18px] bg-white p-3 ring-1 ring-black/[0.05] dark:bg-zinc-900 dark:ring-white/[0.06]">
              <span className={cn('block h-6 w-6 rounded-full', i ? 'bg-emerald-400' : 'bg-signal-400')} />
              <p className="mt-6 text-xs font-medium text-zinc-900 dark:text-zinc-100">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Device Frame — generic, logo-free device chrome for product shots. The browser has a frosted toolbar with a
 * centred address field and hairline edges; the phone has a machined two-tone rim, a punch-hole camera, a status bar
 * and a floating glass tab bar. Drop in a screenshot via `src` or any live UI as children; both themes are tuned.
 */
export function DeviceFrame({
  variant = 'browser',
  url = 'acme.studio/launch',
  src,
  alt = '',
  children,
  time = '10:24',
  animateIn = true,
  className,
}: DeviceFrameProps) {
  const reduced = usePrefersReducedMotion()
  const screen = children ?? (src ? <img src={src} alt={alt} className="h-full w-full object-cover object-top" /> : variant === 'browser' ? <DemoPage /> : <DemoApp />)
  const enter = animateIn
    ? {
        initial: reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
      }
    : {}

  if (variant === 'phone') {
    return (
      <motion.figure
        {...enter}
        className={cn(
          'relative aspect-[9/19.2] w-[260px] max-w-full shrink-0 rounded-[46px] p-[10px]',
          'bg-[linear-gradient(145deg,#f4f4f5,#d4d4d8_40%,#a1a1aa_60%,#e4e4e7)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12),inset_0_1px_1px_rgb(255_255_255/0.9),0_2px_4px_rgb(0_0_0/0.08),0_40px_80px_-32px_rgb(24_24_27/0.55)]',
          'dark:bg-[linear-gradient(145deg,#52525b,#27272a_40%,#18181b_60%,#3f3f46)] dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08),inset_0_1px_1px_rgb(255_255_255/0.15),0_40px_80px_-32px_rgb(0_0_0/0.9)]',
          className,
        )}
      >
        <span aria-hidden className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l bg-zinc-400 dark:bg-zinc-600" />
        <span aria-hidden className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r bg-zinc-400 dark:bg-zinc-600" />
        <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-black ring-1 ring-black/80">
          {screen}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex h-11 items-center justify-between px-7 text-[12px] font-semibold tabular-nums text-zinc-950 dark:text-white">
            <span>{time}</span>
            <span className="h-[18px] w-[18px] rounded-full bg-black ring-[3px] ring-zinc-900/70" />
            <span className="flex items-center gap-1">
              <span className="flex items-end gap-px">{[4, 6, 8, 10].map((h) => <span key={h} className="w-[3px] rounded-sm bg-current" style={{ height: h }} />)}</span>
              <span className="ml-1 h-[10px] w-5 rounded-[3px] border border-current p-px"><span className="block h-full w-3/4 rounded-[1px] bg-current" /></span>
            </span>
          </div>
          {!children && !src && (
            <div aria-hidden className="absolute inset-x-4 bottom-6 flex items-center justify-around rounded-full bg-white/60 py-2.5 ring-1 ring-black/[0.06] backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_8px_24px_-12px_rgb(0_0_0/0.3)] dark:bg-zinc-800/55 dark:ring-white/[0.1] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]">
              {[Home, Compass, Search, User].map((I, i) => (
                <I key={i} className={cn('h-5 w-5', i === 0 ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 dark:text-zinc-400')} />
              ))}
            </div>
          )}
          <span aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-zinc-950/80 dark:bg-white/80" />
        </div>
        {alt && !src && <figcaption className="sr-only">{alt}</figcaption>}
      </motion.figure>
    )
  }

  return (
    <motion.figure
      {...enter}
      className={cn(
        'w-full max-w-3xl overflow-hidden rounded-[14px] bg-white ring-1 ring-black/[0.08]',
        'shadow-[0_1px_2px_rgb(0_0_0/0.06),0_32px_64px_-32px_rgb(24_24_27/0.45)]',
        'dark:bg-zinc-950 dark:ring-white/[0.1] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_32px_64px_-32px_rgb(0_0_0/0.9)]',
        className,
      )}
    >
      <div className="flex h-11 items-center gap-2 border-b border-black/[0.06] bg-zinc-50/80 px-3 backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-900/80" aria-hidden>
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => <span key={i} className="h-3 w-3 rounded-full bg-zinc-300 ring-1 ring-inset ring-black/[0.06] dark:bg-zinc-700 dark:ring-white/[0.06]" />)}
        </span>
        <span className="ml-2 hidden items-center gap-1 text-zinc-500 sm:flex dark:text-zinc-400">
          <ChevronLeft className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 opacity-50" />
        </span>
        <span className="mx-auto flex h-7 w-full max-w-sm min-w-0 items-center justify-center gap-1.5 rounded-lg bg-white px-3 text-[12px] text-zinc-700 ring-1 ring-black/[0.06] shadow-[0_1px_1px_rgb(0_0_0/0.03)] dark:bg-zinc-800 dark:text-zinc-300 dark:ring-white/[0.08]">
          <Lock className="h-3 w-3 shrink-0 text-zinc-500 dark:text-zinc-400" />
          <span className="truncate" translate="no">{url}</span>
          <RotateCw className="ml-auto hidden h-3 w-3 shrink-0 text-zinc-500 sm:block dark:text-zinc-400" />
        </span>
        <Plus className="hidden h-4 w-4 text-zinc-500 sm:block dark:text-zinc-400" />
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden">{screen}</div>
      {alt && !src && <figcaption className="sr-only">{alt}</figcaption>}
    </motion.figure>
  )
}
