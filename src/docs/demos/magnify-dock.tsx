import type * as React from 'react'
import { MagnifyDock } from '@/components/ui/magnify-dock'
import { Home, Search, Mail, Music, Settings, Terminal } from 'lucide-react'

const demo: React.ReactNode = (
    <MagnifyDock
      items={[
        { label: 'Home', icon: <Home className="h-5 w-5" /> },
        { label: 'Search', icon: <Search className="h-5 w-5" /> },
        { label: 'Mail', icon: <Mail className="h-5 w-5" /> },
        { label: 'Music', icon: <Music className="h-5 w-5" /> },
        { label: 'Settings', icon: <Settings className="h-5 w-5" /> },
        { label: 'Terminal', icon: <Terminal className="h-5 w-5" /> },
      ]}
    />
  )

export default demo
