import type * as React from 'react'
import { GravityStackToast } from '@/components/ui/gravity-stack-toast'
import { Button } from '@/components/ui/button'

const demo: React.ReactNode = (
    <GravityStackToast>
      {({ push }) => (
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="framekit"
            onClick={() => push({ title: 'Dropped in', description: 'Gravity stack bounce.', tone: 'ember' })}
          >
            Ember drop
          </Button>
          <Button
            variant="outline"
            onClick={() => push({ title: 'Lilac stack', description: 'Soft gravity settle.', tone: 'lilac' })}
          >
            Lilac drop
          </Button>
        </div>
      )}
    </GravityStackToast>
  )

export default demo
