import * as React from 'react'
import { cn } from '@/lib/cn'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'

/** Aurora shimmer travels letter-by-letter on text. */
export function GlyphAuroraShimmer({
  text = 'FRAMEKIT AURORA',
  className,
}: {
  text?: string
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const chars = Array.from(text)

  return (
    <p
      className={cn(
        'flex flex-wrap justify-center gap-[0.05em] font-semibold tracking-tight text-3xl md:text-4xl',
        '[--glyph-base:#52525b] [--glyph-hi:#7d6899] dark:[--glyph-base:#71717a] dark:[--glyph-hi:#efeaf6]',
        className,
      )}
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="relative inline-block"
          style={{
            backgroundImage: reduced
              ? 'linear-gradient(90deg,#9a86b8,#f97316,#d4cbe5)'
              : 'linear-gradient(100deg,var(--glyph-base,#71717a) 0%,var(--glyph-base,#71717a) 35%,#f97316 45%,var(--glyph-hi,#efeaf6) 50%,#9a86b8 55%,var(--glyph-base,#71717a) 65%,var(--glyph-base,#71717a) 100%)',
            backgroundSize: reduced ? '100% 100%' : '220% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: reduced ? undefined : `glyph-aurora 2.8s ease-in-out ${i * 0.08}s infinite`,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
      <style>{`@keyframes glyph-aurora{0%,100%{background-position:100% 50%}50%{background-position:0% 50%}}`}</style>
    </p>
  )
}
