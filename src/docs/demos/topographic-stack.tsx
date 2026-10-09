import type * as React from 'react'
import { TopographicStack } from '@/components/ui/topographic-stack'

const demo: React.ReactNode = (
    <TopographicStack
      items={[
        { id: 'a', title: 'Ridge', note: 'Highest contour' },
        { id: 'b', title: 'Bench', note: 'Mid terrace' },
        { id: 'c', title: 'Basin', note: 'Collecting pool' },
      ]}
    />
  )

export default demo
