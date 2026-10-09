import type * as React from 'react'
import { WindowpaneStoryCard } from '@/components/ui/windowpane-story-card'

const demo: React.ReactNode = (
    <WindowpaneStoryCard
      className="w-full max-w-sm"
      title="Field notes"
      summary="A frosted pane hides the evidence layer."
      evidence={<p>Signal peak at 14:02 · lilac pulse · contour mapped.</p>}
    />
  )

export default demo
