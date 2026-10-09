import type * as React from 'react'
import { SwipeCards } from '@/components/ui/swipe-cards'

const demo: React.ReactNode = (
    <SwipeCards
      cards={[
        { id: '1', title: 'Ember', subtitle: 'Warm accent tones', color: 'linear-gradient(160deg, #fb923c, #c2410c)' },
        { id: '2', title: 'Volt', subtitle: 'Electric accents', color: 'linear-gradient(160deg, #a78bfa, #6d28d9)' },
        { id: '3', title: 'Ion', subtitle: 'Cool contrast', color: 'linear-gradient(160deg, #60a5fa, #1d4ed8)' },
        { id: '4', title: 'Moss', subtitle: 'Grounded neutrals', color: 'linear-gradient(160deg, #6ee7b7, #047857)' },
      ]}
    />
  )

export default demo
