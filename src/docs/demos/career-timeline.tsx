import type * as React from 'react'
import { CareerTimeline } from '@/components/ui/career-timeline'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function CareerTimelineDemo() {
  return <PfScrollFrame label="Career timeline preview (scrollable)" height={520}>{(ref) => <CareerTimeline scrollContainer={ref} titleAs="h2" className="mx-auto" />}</PfScrollFrame>
}

const demo: React.ReactNode = <CareerTimelineDemo />

export default demo
