import * as React from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastItem = { id: string; title: string; description?: string; variant?: 'default' | 'success' | 'error' }

const ToastCtx = React.createContext<{
  toast: (t: Omit<ToastItem, 'id'>) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const toast = React.useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setItems((prev) => [...prev, { ...t, id }])
    window.setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 3500)
  }, [])

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={cn(
                    'pointer-events-auto rounded-2xl border bg-white p-4 shadow-xl dark:bg-zinc-950',
                    item.variant === 'success' && 'border-emerald-200 dark:border-emerald-900',
                    item.variant === 'error' && 'border-red-200 dark:border-red-900',
                    (!item.variant || item.variant === 'default') && 'border-zinc-200 dark:border-zinc-800',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-zinc-500">{item.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
