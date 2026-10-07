import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

export type LitProductCard3DProps = {
  name?: string
  tagline?: string
  price?: string
  colors?: { name: string; value: string }[]
  onAdd?: (color: string) => void
  className?: string
}

const DEFAULT_COLORS = [{ name: 'Midnight', value: '#1e1b4b' }, { name: 'Sunset', value: '#c2410c' }, { name: 'Sage', value: '#3f6212' }]

/**
 * Lit Product Card 3D — a product card with real lighting: tilt follows the
 * pointer, a specular highlight and a cast shadow move opposite the light,
 * the product floats on its own Z layer and swatches recolour it on a spring.
 */
export function LitProductCard3D({ name = 'Aero Headphones', tagline = 'Spatial audio · 40 h battery', price = '$349', colors = DEFAULT_COLORS, onAdd, className }: LitProductCard3DProps) {
  const reduced = usePrefersReducedMotion()
  const [c, setC] = React.useState(0)
  const mx = useMotionValue(0.5), my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 180, damping: 20 }), sy = useSpring(my, { stiffness: 180, damping: 20 })
  const rY = useTransform(sx, [0, 1], reduced ? [0, 0] : [-16, 16]), rX = useTransform(sy, [0, 1], reduced ? [0, 0] : [14, -14])
  const lx = useTransform(sx, [0, 1], ['10%', '90%']), ly = useTransform(sy, [0, 1], ['10%', '90%'])
  const spec = useMotionTemplate`radial-gradient(60% 50% at ${lx} ${ly}, rgb(255 255 255 / 0.35), transparent 70%)`
  const shX = useTransform(sx, [0, 1], [18, -18]), shY = useTransform(sy, [0, 1], [10, 30])
  const shadow = useMotionTemplate`${shX}px ${shY}px 40px -10px rgb(0 0 0 / 0.45)`
  const col = colors[c].value
  return (
    <div className={cn('grid w-full place-items-center py-6 [perspective:1000px]', className)}>
      <motion.article onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height) }} onPointerLeave={() => { mx.set(0.5); my.set(0.5) }}
        style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d', boxShadow: shadow }}
        className="relative w-[300px] rounded-[28px] bg-white p-5 ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]">
        <motion.div animate={{ backgroundColor: col }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} className="relative grid h-[220px] place-items-center overflow-hidden rounded-[20px]" style={{ transformStyle: 'preserve-3d' }}>
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_30%,rgb(255_255_255/0.25),transparent)]" />
          <motion.svg style={{ translateZ: 50 }} animate={reduced ? undefined : { y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} viewBox="0 0 120 120" className="relative size-[140px] drop-shadow-[0_18px_18px_rgb(0_0_0/0.4)]" aria-hidden>
            <path d="M22 70 C22 30 98 30 98 70" fill="none" stroke="rgb(255 255 255 / 0.9)" strokeWidth="8" strokeLinecap="round" />
            <rect x="12" y="62" width="26" height="40" rx="12" fill="rgb(255 255 255 / 0.95)" />
            <rect x="82" y="62" width="26" height="40" rx="12" fill="rgb(255 255 255 / 0.95)" />
            <rect x="18" y="70" width="14" height="24" rx="7" fill={col} opacity="0.6" />
            <rect x="88" y="70" width="14" height="24" rx="7" fill={col} opacity="0.6" />
          </motion.svg>
          <motion.div aria-hidden style={{ background: spec }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
        </motion.div>
        <div style={{ transform: 'translateZ(24px)' }} className="mt-4">
          <div className="flex items-baseline justify-between gap-3"><h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">{name}</h3><span className="text-base font-semibold tabular-nums text-zinc-950 dark:text-white">{price}</span></div>
          <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{tagline}</p>
          <div className="mt-4 flex items-center justify-between">
            <div role="radiogroup" aria-label="Colour" className="flex gap-2">
              {colors.map((k, i) => (
                <button key={k.name} role="radio" aria-checked={i === c} aria-label={k.name} onClick={() => setC(i)} className="relative grid size-7 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
                  {i === c && <motion.span layoutId="lpc-ring" className="absolute inset-0 rounded-full ring-2 ring-zinc-900 dark:ring-white" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                  <span className="size-5 rounded-full ring-1 ring-black/10 dark:ring-white/20" style={{ background: k.value }} />
                </button>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => onAdd?.(colors[c].name)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-zinc-950 px-4 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-white dark:text-zinc-950"><ShoppingBag className="size-4" />Add</motion.button>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
