import type * as React from 'react'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const demo: React.ReactNode = (
    <DropdownMenu
      trigger={<Button variant="outline">Actions</Button>}
      items={[
        { label: 'Edit' },
        { label: 'Duplicate' },
        { separator: true, label: '' },
        { label: 'Delete', destructive: true },
      ]}
    />
  )

export default demo
