import type * as React from 'react'
import { Typewriter } from '@/components/ui/typewriter'

const demo: React.ReactNode = (
    <Typewriter
      className="text-xl font-medium"
      phrases={['Framekit UI', 'Own your components', 'Ship with motion']}
    />
  )

export default demo
