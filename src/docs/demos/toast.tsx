import type * as React from 'react'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

function ToastDemoInner() {
  const { toast } = useToast()
  return (
    <Button
      onClick={() =>
        toast({ title: 'Saved successfully', description: 'Your component was copied.', variant: 'success' })
      }
    >
      Show toast
    </Button>
  )
}

const demo: React.ReactNode = (
    <ToastProvider>
      <ToastDemoInner />
    </ToastProvider>
  )

export default demo
