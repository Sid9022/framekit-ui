import * as React from 'react'
import { GlassSegmentedControl } from '@/components/ui/glass-segmented-control'
import { LayoutGrid, BarChart3, CalendarDays } from 'lucide-react'

function SegmentedDemo() {
  const [v, setV] = React.useState('week')
  const [view, setView] = React.useState('grid')
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <GlassSegmentedControl value={v} onValueChange={setV} />
      <GlassSegmentedControl size="sm" label="View" value={view} onValueChange={setView} options={[{ value: 'grid', label: 'Grid', icon: <LayoutGrid /> }, { value: 'chart', label: 'Chart', icon: <BarChart3 /> }, { value: 'cal', label: 'Calendar', icon: <CalendarDays /> }]} />
      <p className="text-[13px] text-zinc-600 dark:text-zinc-400">Showing <span className="font-medium text-zinc-900 dark:text-zinc-100">{v}</span> · {view} view</p>
    </div>
  )
}

const demo: React.ReactNode = <SegmentedDemo />

export default demo
