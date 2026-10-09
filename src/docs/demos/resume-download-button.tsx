import * as React from 'react'
import { ResumeDownloadButton } from '@/components/ui/resume-download-button'

function ResumeDownloadDemo() {
  const href = React.useMemo(() => URL.createObjectURL(new Blob(['Nova Reyes — Résumé\nDesign engineer & motion designer\n\nThis is a demo file generated in your browser.\n'], { type: 'text/plain' })), [])
  React.useEffect(() => () => URL.revokeObjectURL(href), [href])
  return <ResumeDownloadButton href={href} fileName="nova-reyes-resume.txt" meta="PDF · 184 KB" />
}

const demo: React.ReactNode = <ResumeDownloadDemo />

export default demo
