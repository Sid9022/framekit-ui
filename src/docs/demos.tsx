import * as React from 'react'
import {
  Home, Search, Settings, Mail, Music, Terminal, Sparkles, Zap, Heart, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion } from '@/components/ui/accordion'
import { Dialog } from '@/components/ui/dialog'
import { Tooltip } from '@/components/ui/tooltip'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { ScrambleText } from '@/components/ui/scramble-text'
import { MagnifyDock } from '@/components/ui/magnify-dock'
import { TiltCard } from '@/components/ui/tilt-card'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { InfiniteMarquee } from '@/components/ui/infinite-marquee'
import { NumberTicker } from '@/components/ui/number-ticker'
import { OrbitingIcons } from '@/components/ui/orbiting-icons'
import { BorderBeam } from '@/components/ui/border-beam'
import { MorphingText } from '@/components/ui/morphing-text'
import { SparkButton } from '@/components/ui/spark-button'
import { CursorTrail } from '@/components/ui/cursor-trail'
import { GlassCard } from '@/components/ui/glass-card'
import { SwipeCards } from '@/components/ui/swipe-cards'
import { Typewriter } from '@/components/ui/typewriter'
import { PixelReveal } from '@/components/ui/pixel-reveal'
import { ElasticSlider } from '@/components/ui/elastic-slider'
import { BreathingDot } from '@/components/ui/breathing-dot'
import { InkRippleGrid } from '@/components/ui/ink-ripple-grid'

function SwitchDemo() {
  const [on, setOn] = React.useState(true)
  return (
    <div className="flex items-center gap-3">
      <Switch checked={on} onCheckedChange={setOn} aria-label="Toggle demo" />
      <span className="text-sm text-zinc-500">{on ? 'Enabled' : 'Disabled'}</span>
    </div>
  )
}

function CheckboxDemo() {
  const [a, setA] = React.useState(true)
  const [b, setB] = React.useState(false)
  return (
    <div className="flex flex-col gap-2">
      <Checkbox id="c1" checked={a} onCheckedChange={setA} label="Accept terms" />
      <Checkbox id="c2" checked={b} onCheckedChange={setB} label="Subscribe to updates" />
    </div>
  )
}

function ProgressDemo() {
  const [v, setV] = React.useState(35)
  React.useEffect(() => {
    const id = window.setInterval(() => setV((x) => (x >= 100 ? 10 : x + 8)), 900)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="w-full max-w-sm space-y-2">
      <Progress value={v} />
      <p className="text-xs text-zinc-500">{v}%</p>
    </div>
  )
}

function ToastDemoInner() {
  const { toast } = useToast()
  return (
    <Button
      onClick={() =>
        toast({ title: 'Forged successfully', description: 'Your component was copied.', variant: 'success' })
      }
    >
      Show toast
    </Button>
  )
}

export const demos: Record<string, React.ReactNode> = {
  button: (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="forge">Forge</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </div>
  ),
  badge: (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="forge">Forge</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
  card: (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Forge Card</CardTitle>
        <CardDescription>Composable surfaces for any layout.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Drop content inside. Own the markup.</p>
      </CardContent>
    </Card>
  ),
  input: <Input className="max-w-sm" placeholder="Enter your email…" />,
  textarea: <Textarea className="max-w-sm" placeholder="Write a message…" />,
  switch: <SwitchDemo />,
  checkbox: <CheckboxDemo />,
  tabs: (
    <Tabs defaultValue="one" className="max-w-md">
      <TabsList>
        <TabsTrigger value="one">Overview</TabsTrigger>
        <TabsTrigger value="two">Code</TabsTrigger>
        <TabsTrigger value="three">Deploy</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Ship polished UI faster.</TabsContent>
      <TabsContent value="two">Copy the source into your repo.</TabsContent>
      <TabsContent value="three">No runtime lock-in.</TabsContent>
    </Tabs>
  ),
  accordion: (
    <Accordion
      className="max-w-md"
      items={[
        { value: 'a', title: 'Is Forge UI free?', content: 'Yes — MIT licensed. Copy what you need.' },
        { value: 'b', title: 'Do I install a package?', content: 'No. Copy components into your project and own them.' },
        { value: 'c', title: 'Dark mode?', content: 'Yes. Components use Tailwind dark: variants.' },
      ]}
    />
  ),
  dialog: (
    <Dialog
      title="Create project"
      description="Spin up a new Forge-powered app."
      trigger={<Button variant="forge">Open dialog</Button>}
    >
      <Input placeholder="Project name" />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" variant="forge">Create</Button>
      </div>
    </Dialog>
  ),
  tooltip: (
    <Tooltip content="Forged with care">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
  'dropdown-menu': (
    <DropdownMenu
      trigger={<Button variant="outline">Actions</Button>}
      items={[
        { label: 'Edit' },
        { label: 'Duplicate' },
        { separator: true, label: '' },
        { label: 'Delete', destructive: true },
      ]}
    />
  ),
  toast: (
    <ToastProvider>
      <ToastDemoInner />
    </ToastProvider>
  ),
  avatar: (
    <div className="flex items-center gap-3">
      <Avatar fallback="FU" />
      <Avatar fallback="Ada" className="h-12 w-12" />
      <Avatar fallback="OK" className="h-8 w-8" />
    </div>
  ),
  skeleton: (
    <div className="flex w-full max-w-sm items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[75%]" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
  progress: <ProgressDemo />,
  'magnetic-button': <MagneticButton>Pull me closer</MagneticButton>,
  'spotlight-card': (
    <SpotlightCard className="max-w-sm">
      <h3 className="text-lg font-semibold">Spotlight</h3>
      <p className="mt-2 text-sm text-zinc-500">Move your cursor — the glow follows.</p>
    </SpotlightCard>
  ),
  'scramble-text': (
    <ScrambleText text="FORGE THE INTERFACE" className="text-2xl font-bold" trigger="hover" />
  ),
  'magnify-dock': (
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
  ),
  'tilt-card': (
    <TiltCard className="max-w-xs">
      <p className="text-sm font-medium text-zinc-500">Perspective</p>
      <h3 className="mt-1 text-xl font-semibold">Tilt Card</h3>
      <p className="mt-2 text-sm text-zinc-500">Hover to feel the depth.</p>
    </TiltCard>
  ),
  'aurora-background': (
    <AuroraBackground className="flex h-40 w-full max-w-lg items-center justify-center">
      <p className="text-lg font-semibold text-white">Aurora skies</p>
    </AuroraBackground>
  ),
  'infinite-marquee': (
    <InfiniteMarquee className="w-full max-w-lg py-2" speed={20}>
      {['Motion', 'Tailwind', 'React', 'Accessible', 'Copy-paste', 'MIT'].map((t) => (
        <span
          key={t}
          className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          {t}
        </span>
      ))}
    </InfiniteMarquee>
  ),
  'number-ticker': (
    <div className="text-center">
      <NumberTicker value={12840} className="text-5xl font-bold tracking-tight" />
      <p className="mt-2 text-sm text-zinc-500">components shipped</p>
    </div>
  ),
  'orbiting-icons': (
    <OrbitingIcons
      icons={[
        <Sparkles key="1" className="h-4 w-4 text-forge-500" />,
        <Zap key="2" className="h-4 w-4 text-amber-500" />,
        <Heart key="3" className="h-4 w-4 text-rose-500" />,
        <Star key="4" className="h-4 w-4 text-violet-500" />,
        <Terminal key="5" className="h-4 w-4 text-emerald-500" />,
      ]}
    />
  ),
  'border-beam': (
    <BorderBeam className="max-w-sm">
      <div className="p-6">
        <h3 className="font-semibold">Border Beam</h3>
        <p className="mt-1 text-sm text-zinc-500">Watch the light travel the edge.</p>
      </div>
    </BorderBeam>
  ),
  'morphing-text': (
    <div className="text-3xl font-semibold">
      Build{' '}
      <MorphingText className="text-forge-500" phrases={['faster', 'bolder', 'yours', 'animated']} />
    </div>
  ),
  'spark-button': <SparkButton>Click for sparks</SparkButton>,
  'cursor-trail': <CursorTrail className="w-full max-w-lg" />,
  'glass-card': (
    <div className="rounded-3xl bg-gradient-to-br from-forge-500 via-fuchsia-500 to-indigo-600 p-10">
      <GlassCard className="max-w-xs">
        <h3 className="text-lg font-semibold text-white">Liquid glass</h3>
        <p className="mt-2 text-sm text-white/80">Frosted surface over vivid color.</p>
      </GlassCard>
    </div>
  ),
  'swipe-cards': (
    <SwipeCards
      cards={[
        { id: '1', title: 'Ember', subtitle: 'Warm forge tones', color: '#ea580c' },
        { id: '2', title: 'Volt', subtitle: 'Electric accents', color: '#7c3aed' },
        { id: '3', title: 'Ion', subtitle: 'Cool contrast', color: '#2563eb' },
      ]}
    />
  ),
  typewriter: (
    <Typewriter
      className="text-xl font-medium"
      phrases={['Forge UI', 'Own your components', 'Ship with motion']}
    />
  ),
  'pixel-reveal': <PixelReveal className="w-full max-w-md" />,
  'elastic-slider': <ElasticSlider defaultValue={55} />,
  'breathing-dot': (
    <div className="flex flex-col gap-3">
      <BreathingDot status="online" />
      <BreathingDot status="away" />
      <BreathingDot status="busy" />
      <BreathingDot status="offline" />
    </div>
  ),
  'ink-ripple-grid': <InkRippleGrid className="w-full max-w-lg" />,
}

