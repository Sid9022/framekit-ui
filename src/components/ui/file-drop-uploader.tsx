import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Check, FileText, Image as ImageIcon, RotateCcw, UploadCloud, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type UploadItem = { id: string; name: string; size: number; progress: number; status: 'uploading' | 'done' | 'error'; error?: string }

export type FileDropUploaderProps = {
  /** Max size per file in bytes. */
  maxSize?: number
  /** `accept` attribute for the file input. */
  accept?: string
  /** Real upload; call `onProgress(0–1)`; reject to mark the file as failed. Defaults to a simulation. */
  upload?: (file: File | null, onProgress: (p: number) => void) => Promise<void>
  /** Seed rows (handy for docs and tests). */
  defaultItems?: UploadItem[]
  /** Fires when the list changes. */
  onItemsChange?: (items: UploadItem[]) => void
  disabled?: boolean
  className?: string
}

export const SAMPLE_UPLOADS: UploadItem[] = [
  { id: 's1', name: 'launch-keynote-final.pdf', size: 4_820_000, progress: 1, status: 'done' },
  { id: 's2', name: 'hero-dusk@2x.png', size: 2_310_000, progress: 0.42, status: 'uploading' },
  { id: 's3', name: 'raw-footage-take-3.mov', size: 48_200_000, progress: 0, status: 'error', error: 'Larger than 25 MB' },
]

const fmtSize = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)}\u00a0MB` : `${Math.max(1, Math.round(b / 1e3))}\u00a0KB`)
const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300'

const simulate = (_f: File | null, onP: (p: number) => void) =>
  new Promise<void>((res) => {
    let p = 0
    const t = window.setInterval(() => { p = Math.min(1, p + 0.06 + Math.random() * 0.08); onP(p); if (p >= 1) { window.clearInterval(t); res() } }, 160)
  })

/**
 * File Drop Uploader — a calm dropzone that lifts and tints when a file is
 * dragged over it, then hands each file to its own row: a hairline progress
 * bar on a gentle spring, a tick that pops on completion, and errors that
 * say what went wrong with a one-tap retry. Works with click-to-browse and
 * keyboard; every result is announced.
 */
export function FileDropUploader({ maxSize = 25_000_000, accept, upload = simulate, defaultItems = SAMPLE_UPLOADS, onItemsChange, disabled = false, className }: FileDropUploaderProps) {
  const reduced = usePrefersReducedMotion()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [items, setItems] = React.useState<UploadItem[]>(defaultItems)
  const [over, setOver] = React.useState(false)
  const [msg, setMsg] = React.useState('')
  const files = React.useRef<Record<string, File | null>>({})
  const depth = React.useRef(0)
  const cb = React.useRef(onItemsChange)
  cb.current = onItemsChange
  React.useEffect(() => { cb.current?.(items) }, [items])

  const patch = (id: string, p: Partial<UploadItem>) => setItems((list) => list.map((i) => (i.id === id ? { ...i, ...p } : i)))
  const run = React.useCallback((id: string, name: string) => {
    patch(id, { status: 'uploading', progress: 0, error: undefined })
    upload(files.current[id] ?? null, (p) => patch(id, { progress: p }))
      .then(() => { patch(id, { status: 'done', progress: 1 }); setMsg(`${name} uploaded`) })
      .catch(() => { patch(id, { status: 'error', error: 'Upload failed — check your connection' }); setMsg(`${name} failed to upload`) })
  }, [upload])

  React.useEffect(() => {
    const seeded = defaultItems.find((i) => i.status === 'uploading')
    if (!seeded) return
    let p = seeded.progress
    const t = window.setInterval(() => { p = Math.min(1, p + 0.05); patch(seeded.id, { progress: p, status: p >= 1 ? 'done' : 'uploading' }); if (p >= 1) window.clearInterval(t) }, 180)
    return () => window.clearInterval(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const add = (list: FileList | null) => {
    if (!list || disabled) return
    const fresh = Array.from(list).map((f) => {
      const id = `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`
      files.current[id] = f
      const tooBig = f.size > maxSize
      return { f, item: { id, name: f.name, size: f.size, progress: 0, status: tooBig ? 'error' : 'uploading', error: tooBig ? `Larger than ${fmtSize(maxSize).replace('\u00a0', ' ')}` : undefined } as UploadItem }
    })
    setItems((l) => [...fresh.map((x) => x.item), ...l])
    fresh.forEach(({ item }) => { if (item.status === 'uploading') run(item.id, item.name) })
    setMsg(`${fresh.length} file${fresh.length > 1 ? 's' : ''} added`)
  }
  const remove = (it: UploadItem) => { setItems((l) => l.filter((i) => i.id !== it.id)); setMsg(`${it.name} removed`) }

  return (
    <div className={cn('w-full max-w-md', className)}>
      <motion.div
        onDragEnter={(e) => { e.preventDefault(); depth.current++; setOver(true) }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => { depth.current = Math.max(0, depth.current - 1); if (!depth.current) setOver(false) }}
        onDrop={(e) => { e.preventDefault(); depth.current = 0; setOver(false); add(e.dataTransfer.files) }}
        animate={reduced ? undefined : { scale: over ? 1.015 : 1, y: over ? -2 : 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className={cn(
          'relative rounded-[20px] border border-dashed transition-[background-color,border-color,box-shadow] duration-150',
          over ? 'border-signal-600 bg-signal-50 shadow-[0_1px_2px_rgb(0_0_0/0.05),0_16px_40px_-20px_rgb(100_82_122/0.5)] dark:border-signal-300 dark:bg-signal-300/[0.08]' : 'border-black/[0.14] bg-white dark:border-white/[0.16] dark:bg-zinc-900',
          disabled && 'opacity-50',
        )}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn('flex w-full flex-col items-center gap-3 rounded-[20px] px-6 py-8 text-center', FOCUS, 'focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950')}
        >
          <motion.span
            animate={reduced ? undefined : { y: over ? -4 : 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="grid size-12 place-items-center rounded-[14px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_16px_-8px_rgb(0_0_0/0.2),inset_0_1px_0_rgb(255_255_255/0.9)] ring-1 ring-black/[0.06] dark:bg-zinc-800 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] dark:ring-white/[0.1]"
          >
            <UploadCloud aria-hidden className={cn('size-5 transition-colors duration-150', over ? 'text-signal-700 dark:text-signal-200' : 'text-zinc-700 dark:text-zinc-300')} />
          </motion.span>
          <span>
            <span className="block text-sm font-medium text-zinc-950 dark:text-white">{over ? 'Drop to upload' : 'Drop files here or browse'}</span>
            <span className="mt-1 block text-[13px] text-zinc-600 dark:text-zinc-400">PDF, PNG, JPG or MOV · up to {fmtSize(maxSize)}</span>
          </span>
        </button>
        <input ref={inputRef} type="file" multiple accept={accept} className="sr-only" tabIndex={-1} aria-hidden onChange={(e) => { add(e.target.files); e.target.value = '' }} />
      </motion.div>

      <ul className="mt-3 space-y-2" aria-label="Uploads">
        <AnimatePresence initial={false}>
          {items.map((it) => {
            const Icon = /\.(png|jpe?g|gif|webp|avif)$/i.test(it.name) ? ImageIcon : FileText
            const err = it.status === 'error'
            return (
              <motion.li
                key={it.id}
                layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className={cn('flex items-center gap-3 rounded-[14px] bg-white p-3 ring-1 shadow-[0_1px_2px_rgb(0_0_0/0.04)] dark:bg-zinc-900', err ? 'ring-rose-600/25 dark:ring-rose-400/30' : 'ring-black/[0.06] dark:ring-white/[0.08]')}
              >
                <span aria-hidden className={cn('grid size-9 shrink-0 place-items-center rounded-[10px]', err ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-zinc-900/[0.05] text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-300')}><Icon className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-zinc-950 dark:text-white">{it.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-zinc-600 dark:text-zinc-400">{it.status === 'uploading' ? `${Math.round(it.progress * 100)}%` : fmtSize(it.size)}</span>
                  </div>
                  {err ? (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-rose-700 dark:text-rose-300"><AlertCircle aria-hidden className="size-3.5" />{it.error}</p>
                  ) : (
                    <div role="progressbar" aria-label={`${it.name} upload`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(it.progress * 100)} className="relative mt-2 h-1 overflow-hidden rounded-full bg-zinc-900/[0.07] dark:bg-white/[0.1]">
                      <motion.span className={cn('absolute inset-0 origin-left rounded-full', it.status === 'done' ? 'bg-emerald-500' : 'bg-signal-600 dark:bg-signal-300')} initial={false} animate={{ scaleX: it.progress }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 26 }} />
                    </div>
                  )}
                </div>
                <AnimatePresence mode="popLayout" initial={false}>
                  {it.status === 'done' ? (
                    <motion.span key="ok" initial={reduced ? { opacity: 0 } : { scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 560, damping: 22 }} className="grid size-6 place-items-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950">
                      <Check aria-hidden className="size-3.5" strokeWidth={3} />
                      <span className="sr-only">Uploaded</span>
                    </motion.span>
                  ) : err && files.current[it.id] !== undefined && it.size <= maxSize ? (
                    <motion.button key="retry" type="button" onClick={() => run(it.id, it.name)} aria-label={`Retry ${it.name}`} className={cn('grid size-8 place-items-center rounded-full text-zinc-700 hover:bg-zinc-900/[0.06] pointer-coarse:size-11 dark:text-zinc-300 dark:hover:bg-white/[0.08]', FOCUS)}><RotateCcw aria-hidden className="size-4" /></motion.button>
                  ) : null}
                </AnimatePresence>
                <button type="button" onClick={() => remove(it)} aria-label={`Remove ${it.name}`} className={cn('grid size-8 shrink-0 place-items-center rounded-full text-zinc-600 transition-colors duration-150 hover:bg-zinc-900/[0.06] hover:text-zinc-950 pointer-coarse:size-11 dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white', FOCUS)}><X aria-hidden className="size-4" /></button>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
      {items.length === 0 && <p className="mt-3 text-center text-[13px] text-zinc-600 dark:text-zinc-400">No files yet. Uploads appear here with their progress.</p>}
      <span role="status" aria-live="polite" className="sr-only">{msg}</span>
    </div>
  )
}
