import type * as React from 'react'
import { MorphingText } from '@/components/ui/morphing-text'

const demo: React.ReactNode = (
    <p className="text-4xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
      Build{' '}
      <MorphingText className="text-framekit-600 dark:text-framekit-400" phrases={['faster', 'bolder', 'yours', 'animated']} />
    </p>
  )

export default demo
