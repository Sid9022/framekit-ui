import type * as React from 'react'
import { Accordion } from '@/components/ui/accordion'

const demo: React.ReactNode = (
    <Accordion
      className="max-w-md"
      items={[
        { value: 'a', title: 'Is Framekit UI free?', content: 'Yes — MIT licensed. Copy what you need.' },
        { value: 'b', title: 'Do I install a package?', content: 'No. Copy components into your project and own them.' },
        { value: 'c', title: 'Dark mode?', content: 'Yes. Components use Tailwind dark: variants.' },
      ]}
    />
  )

export default demo
