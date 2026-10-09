import * as React from 'react'
import { ImageLens } from '@/components/ui/image-lens'
import { demoChip } from './_shared/demo-chip'

const UNSPLASH_VALLEY = 'https://images.unsplash.com/photo-1768409234914-96f61529b7e2?auto=format&fit=crop&q=80'

const VALLEY_NOTES = [
  { x: 0.872, y: 0.861, label: 'Lone cabin by the pass road' },
  { x: 0.647, y: 0.792, label: 'Switchbacks into the valley' },
  { x: 0.779, y: 0.449, label: 'Cloud-capped massif' },
]

const UTM = '?utm_source=framekit-ui&utm_medium=referral'

function ImageLensDemo() {
  const [source, setSource] = React.useState<'illustration' | 'photo'>('photo')
  const [shape, setShape] = React.useState<'circle' | 'rounded'>('circle')
  const [appearance, setAppearance] = React.useState<'glass' | 'minimal' | 'seamless'>('glass')
  const [dim, setDim] = React.useState(true)
  const photo = source === 'photo'
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5">
      <ImageLens
        key={source}
        src={photo ? `${UNSPLASH_VALLEY}&w=1600` : undefined}
        zoomSrc={photo ? `${UNSPLASH_VALLEY}&w=3200` : undefined}
        alt={photo ? 'Jagged limestone peaks above a green valley, a winding road leading to a small cabin under a stormy sky.' : undefined}
        annotations={photo ? VALLEY_NOTES : undefined}
        shape={shape}
        appearance={appearance}
        dim={dim}
        caption={
          photo ? (
            <>
              Photo by{' '}
              <a className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:hover:decoration-zinc-100" href={`https://unsplash.com/@intricateexplorer${UTM}`} target="_blank" rel="noreferrer">
                Intricate Explorer
              </a>{' '}
              on{' '}
              <a className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-900 dark:text-zinc-100 dark:hover:decoration-zinc-100" href={`https://unsplash.com/photos/dramatic-mountain-valley-with-a-winding-road-and-cabin-L6-l45Y_om0${UTM}`} target="_blank" rel="noreferrer">
                Unsplash
              </a>
            </>
          ) : (
            'Base camp at dusk — an original vector scene with tiny details to find.'
          )
        }
      />
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Image lens options">
        {(['photo', 'illustration'] as const).map((s) => (
          <button key={s} type="button" aria-pressed={source === s} className={demoChip(source === s)} onClick={() => setSource(s)}>
            {s}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {(['glass', 'minimal', 'seamless'] as const).map((a) => (
          <button key={a} type="button" aria-pressed={appearance === a} className={demoChip(appearance === a)} onClick={() => setAppearance(a)}>
            {a}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {(['circle', 'rounded'] as const).map((s) => (
          <button key={s} type="button" aria-pressed={shape === s} className={demoChip(shape === s)} onClick={() => setShape(s)}>
            {s}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        <button type="button" role="switch" aria-checked={dim} className={demoChip(dim)} onClick={() => setDim((d) => !d)}>
          Focus dim
        </button>
      </div>
    </div>
  )
}

const demo: React.ReactNode = <ImageLensDemo />

export default demo
