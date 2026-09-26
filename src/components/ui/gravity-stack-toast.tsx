import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

type GravityToast = {
  id: string
  title: string
  description?: string
  tone?: 'default' | 'lilac' | 'ember'
}

const Ctx = React.createContext<{
  push: (t: Omit<GravityToast, 'id'>) => void
} | null>(null)

/** Gravity-bounce stack toast provider + hook. */
export function GravityStackToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<GravityToast[]>([])

  const push = React.useCallback((t: Omit<GravityToast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setItems((prev) => [...prev, { ...t, id }].slice(-5))
    window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 4200)
  }, [])

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-[min(100%,22rem)] -translate-x-1/2 flex-col-reverse gap-2">
            <AnimatePresence mode="popLayout">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -80, scale: 0.92 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1 - idx * 0.02,
                    transition: { type: 'spring', stiffness: 420, damping: 18, mass: 0.9 },
                  }}
                  exit={{ opacity: 0, y: 24, transition: { duration: 0.2 } }}
                  className={cn(
                    'pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_20px_44px_-20px_rgba(24,24,27,0.35)] backdrop-blur dark:shadow-2xl',
                    item.tone === 'lilac' && 'border-signal-200 bg-signal-50/95 text-signal-900 dark:border-signal-300/40 dark:bg-signal-900/90 dark:text-signal-50',
                    item.tone === 'ember' && 'border-framekit-200 bg-framekit-50/95 text-framekit-900 dark:border-framekit-400/40 dark:bg-zinc-950 dark:text-framekit-100',
                    (!item.tone || item.tone === 'default') &&
                      'border-zinc-200 bg-white/95 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950/95 dark:text-zinc-50',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs opacity-70">{item.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-1 opacity-50 hover:opacity-100"
                      onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  )
}

export function useGravityStackToast() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useGravityStackToast must be used within GravityStackToastProvider')
  return ctx
}

/** Demo-friendly wrapper that exposes push via children render prop. */
export function GravityStackToast({
  children,
}: {
  children?: (api: { push: (t: Omit<GravityToast, 'id'>) => void }) => React.ReactNode
}) {
  return (
    <GravityStackToastProvider>
      <GravityInner>{children}</GravityInner>
    </GravityStackToastProvider>
  )
}

function GravityInner({
  children,
}: {
  children?: (api: { push: (t: Omit<GravityToast, 'id'>) => void }) => React.ReactNode
}) {
  const { push } = useGravityStackToast()
  return <>{children?.({ push })}</>
}
