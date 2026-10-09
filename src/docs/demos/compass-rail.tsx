import type * as React from 'react'
import { CompassRail } from '@/components/ui/compass-rail'

const demo: React.ReactNode = (
    <CompassRail
      items={[
        { id: 'home', label: 'Overview' },
        { id: 'craft', label: 'Craft' },
        { id: 'motion', label: 'Motion' },
        { id: 'ship', label: 'Ship' },
      ]}
    />
  )

export default demo
