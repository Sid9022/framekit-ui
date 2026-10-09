import type * as React from 'react'
import { HaloMenu } from '@/components/ui/halo-menu'

const demo: React.ReactNode = (
    <HaloMenu
      items={[
        { id: '1', label: 'New' },
        { id: '2', label: 'Edit' },
        { id: '3', label: 'Share' },
        { id: '4', label: 'Dup' },
        { id: '5', label: 'Move' },
        { id: '6', label: 'Del' },
      ]}
    />
  )

export default demo
