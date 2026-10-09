import type * as React from 'react'
import { CaseStudyScroll } from '@/components/ui/case-study-scroll'
import { PfScrollFrame } from './_shared/pf-scroll-frame'

function CaseStudyDemo() {
  return <PfScrollFrame label="Case study preview (scrollable)" height={560}>{(ref) => <CaseStudyScroll scrollContainer={ref} titleAs="h2" className="mx-auto" />}</PfScrollFrame>
}

const demo: React.ReactNode = <CaseStudyDemo />

export default demo
