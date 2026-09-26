import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

type RibbonToast = { id: string; title: string; description?: string }

const Ctx = React.createContext<{ push: (t: Omit<RibbonToast, 'id'>) => void } | null>(null)

export function RibbonUnfurlToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<RibbonToast[]>([])
  const push = React.useCallback((t: Omit<RibbonToast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setItems((prev) => [...prev, { ...t, id }].slice(-4))
    window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 4000)
  }, [])

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(100%,20rem)] flex-col gap-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scaleX: 0.15, originX: 1 }}
                  animate={{
                    opacity: 1,
                    scaleX: 1,
                    transition: { type: 'spring', stiffness: 260, damping: 22 },
                  }}
                  exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                  className="pointer-events-auto relative overflow-hidden rounded-xl border border-signal-200 bg-gradient-to-r from-signal-100 via-white to-white p-4 text-signal-900 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-20px_rgba(53,43,66,0.35)] dark:border-signal-300/30 dark:from-signal-800 dark:via-zinc-900 dark:to-zinc-950 dark:text-signal-50 dark:shadow-xl"
                >
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-framekit-400 via-signal-300 to-signal-500"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rotate-12 rounded-sm bg-signal-400/20"
                    style={{ clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)' }}
                  />
                  <div className="flex items-start justify-between gap-3 pl-2">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-signal-700/80 dark:text-signal-200/80">{item.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-1 text-signal-600/60 hover:text-signal-900 dark:text-signal-200/60 dark:hover:text-white"
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

export function useRibbonUnfurlToast() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useRibbonUnfurlToast must be used within RibbonUnfurlToastProvider')
  return ctx
}

export function RibbonUnfurlToast({
  children,
}: {
  children?: (api: { push: (t: Omit<RibbonToast, 'id'>) => void }) => React.ReactNode
}) {
  return (
    <RibbonUnfurlToastProvider>
      <RibbonInner>{children}</RibbonInner>
    </RibbonUnfurlToastProvider>
  )
}

function RibbonInner({
  children,
}: {
  children?: (api: { push: (t: Omit<RibbonToast, 'id'>) => void }) => React.ReactNode
}) {
  const { push } = useRibbonUnfurlToast()
  return <>{children?.({ push })}</>
}
