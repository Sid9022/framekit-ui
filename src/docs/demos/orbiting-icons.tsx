import type * as React from 'react'
import { OrbitingIcons } from '@/components/ui/orbiting-icons'
import { Sparkles, Zap, Heart, Star, Terminal } from 'lucide-react'

const demo: React.ReactNode = (
    <OrbitingIcons
      icons={[
        <Sparkles key="1" className="h-4 w-4 text-framekit-500" />,
        <Zap key="2" className="h-4 w-4 text-amber-500" />,
        <Heart key="3" className="h-4 w-4 text-rose-500" />,
        <Star key="4" className="h-4 w-4 text-violet-500" />,
        <Terminal key="5" className="h-4 w-4 text-emerald-500" />,
      ]}
    />
  )

export default demo
