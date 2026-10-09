import type * as React from 'react'
import { TideDeck } from '@/components/ui/tide-deck'

const demo: React.ReactNode = (
    <TideDeck
      cards={[
        { id: '1', title: 'North swell', body: 'Velocity softens the corners.', tone: '#f7f5fb' },
        { id: '2', title: 'Cross current', body: 'Drag to feel the tide.', tone: '#eef3f8' },
        { id: '3', title: 'Quiet cove', body: 'Snap mode for reduced motion.', tone: '#f6efe8' },
      ]}
    />
  )

export default demo
