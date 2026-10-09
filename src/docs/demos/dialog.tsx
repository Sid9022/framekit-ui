import type * as React from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const demo: React.ReactNode = (
    <Dialog
      title="Create project"
      description="Spin up a new Framekit-powered app."
      trigger={<Button variant="framekit">Open dialog</Button>}
    >
      <Input placeholder="Project name" />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" variant="framekit">Create</Button>
      </div>
    </Dialog>
  )

export default demo
