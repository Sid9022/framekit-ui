import type * as React from 'react'
import { ReadingProgressToc } from '@/components/ui/reading-progress-toc'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function ReadingTocDemo() {
  return <PfScrollFrame label="Blog post preview (scrollable)" height={520}>{(ref) => <ReadingProgressToc scrollContainer={ref} className="mx-auto" />}</PfScrollFrame>
}

const demo: React.ReactNode = <ReadingTocDemo />

export default demo
