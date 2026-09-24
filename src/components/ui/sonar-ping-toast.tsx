import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

type SonarToast = { id: string; title: string; description?: string }

const Ctx = React.createContext<{ push: (t: Omit<SonarToast, 'id'>) => void } | null>(null)

export function SonarPingToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<SonarToast[]>([])
  const push = React.useCallback((t: Omit<SonarToast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setItems((prev) => [...prev, { ...t, id }].slice(-4))
    window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3800)
  }, [])

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(100%,20rem)] flex-col gap-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="pointer-events-auto relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
                >
                  {[0, 1, 2].map((ring) => (
                    <motion.span
                      key={ring}
                      aria-hidden
                      className="pointer-events-none absolute left-4 top-4 h-3 w-3 rounded-full border border-framekit-400"
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 8 + ring * 2, opacity: 0 }}
                      transition={{ duration: 1.2, delay: ring * 0.18, ease: 'easeOut' }}
                    />
                  ))}
                  <div className="relative flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-framekit-500 shadow-[0_0_10px_rgba(249,115,22,0.7)]" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-zinc-500">{item.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className={cn('rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800')}
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

export function useSonarPingToast() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useSonarPingToast must be used within SonarPingToastProvider')
  return ctx
}

export function SonarPingToast({
  children,
}: {
  children?: (api: { push: (t: Omit<SonarToast, 'id'>) => void }) => React.ReactNode
}) {
  return (
    <SonarPingToastProvider>
      <SonarInner>{children}</SonarInner>
    </SonarPingToastProvider>
  )
}

function SonarInner({
  children,
}: {
  children?: (api: { push: (t: Omit<SonarToast, 'id'>) => void }) => React.ReactNode
}) {
  const { push } = useSonarPingToast()
  return <>{children?.({ push })}</>
}
