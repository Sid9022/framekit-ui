import type * as React from 'react'
import { PixelReveal } from '@/components/ui/pixel-reveal'

const demo: React.ReactNode = (
    <PixelReveal className="w-full max-w-md" pattern="diagonal" showReplay>
      <div className="flex h-full flex-col justify-end p-5 text-white">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase opacity-85">Collection</p>
        <p className="text-xl font-semibold tracking-[-0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,0.3)]">Golden hour, generated</p>
      </div>
    </PixelReveal>
  )

export default demo
