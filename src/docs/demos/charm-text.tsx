import type * as React from 'react'
import { CharmText } from '@/components/ui/charm-text'

function CharmDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <CharmText as="h2" />
      <CharmText variant="chip" className="text-[1.9rem] sm:text-[2.4rem]" segments={[
        'Currently building with ', { text: 'Motion', glyph: 'bolt', tone: 'amber', hint: 'animation library' }, ' and ', { text: 'Tailwind', glyph: 'drop', tone: 'sky', hint: 'styling' },
        ', shipping to ', { text: 'Postgres', glyph: 'leaf', tone: 'emerald', hint: 'database' }, ' by day and writing for the ', { text: 'night', glyph: 'moon', tone: 'violet', hint: 'side projects' }, ' crowd.',
      ]} />
    </div>
  )
}

const demo: React.ReactNode = <CharmDemo />

export default demo
