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

import { PrismTidalField } from '@/components/ui/prism-tidal-field'
import { ConstellationBreathingGrid } from '@/components/ui/constellation-breathing-grid'
import { PaperfoldGradientPlane } from '@/components/ui/paperfold-gradient-plane'
import { OrbitCommit } from '@/components/ui/orbit-commit'
import { InklineAction } from '@/components/ui/inkline-action'
import { FocusBloomButton } from '@/components/ui/focus-bloom-button'
import { TideDeck } from '@/components/ui/tide-deck'
import { WindowpaneStoryCard } from '@/components/ui/windowpane-story-card'
import { TopographicStack } from '@/components/ui/topographic-stack'
import { GlyphWeather } from '@/components/ui/glyph-weather'
import { Wordloom } from '@/components/ui/wordloom'
import { MomentumCaption } from '@/components/ui/momentum-caption'
import { CompassRail } from '@/components/ui/compass-rail'
import { HaloMenu } from '@/components/ui/halo-menu'
import { SignalPebble } from '@/components/ui/signal-pebble'

import { WatchfulEyeToggle } from '@/components/ui/watchful-eye-toggle'
import { DayNightCapsule } from '@/components/ui/day-night-capsule'
import { GlassOrbSwitch } from '@/components/ui/glass-orb-switch'
import { CosmicSparkleToggle } from '@/components/ui/cosmic-sparkle-toggle'
import { BlinkerSwitch } from '@/components/ui/blinker-switch'
import { MoodDialToggle } from '@/components/ui/mood-dial-toggle'
import { InkBloomToggle } from '@/components/ui/ink-bloom-toggle'
import { PulsebeatSwitch } from '@/components/ui/pulsebeat-switch'
import { FrameflipToggle } from '@/components/ui/frameflip-toggle'
import { GooglyGazeButton } from '@/components/ui/googly-gaze-button'
import { SlideConfirmButton } from '@/components/ui/slide-confirm-button'
import { ShimmerChromeButton } from '@/components/ui/shimmer-chrome-button'
import { PillTrailCursor } from '@/components/ui/pill-trail-cursor'
import { HalftoneBloomCursor } from '@/components/ui/halftone-bloom-cursor'
import { MorphSearchCapsule } from '@/components/ui/morph-search-capsule'

import { SilkShearField } from '@/components/ui/silk-shear-field'
import { VoidLatticeDrift } from '@/components/ui/void-lattice-drift'
import { EmberDrift } from '@/components/ui/ember-drift'
import { ChromaticMist } from '@/components/ui/chromatic-mist'
import { PulseRings } from '@/components/ui/pulse-rings'
import { CurtainDropNav } from '@/components/ui/curtain-drop-nav'
import { MorphPillHeader } from '@/components/ui/morph-pill-header'
import { RadialToolburst } from '@/components/ui/radial-toolburst'
import { MagneticDockNav } from '@/components/ui/magnetic-dock-nav'
import { RibbonTrailCursor } from '@/components/ui/ribbon-trail-cursor'
import { LensFlareCursor } from '@/components/ui/lens-flare-cursor'
import { InkStampCursor } from '@/components/ui/ink-stamp-cursor'
import { OrbitRingCursor } from '@/components/ui/orbit-ring-cursor'
import { LiquidFillButton } from '@/components/ui/liquid-fill-button'
import { SplitRevealButton } from '@/components/ui/split-reveal-button'
import { GravityDropButton } from '@/components/ui/gravity-drop-button'
import { NeonStrokeButton } from '@/components/ui/neon-stroke-button'
import { MothLanternToggle } from '@/components/ui/moth-lantern-toggle'
import { PetalCircuitToggle } from '@/components/ui/petal-circuit-toggle'
import { TideglassToggle } from '@/components/ui/tideglass-toggle'
import { WeatherVaneToggle } from '@/components/ui/weather-vane-toggle'

import { PrismSweepShimmer } from '@/components/ui/prism-sweep-shimmer'
import { MercuryVeinShimmer } from '@/components/ui/mercury-vein-shimmer'
import { GlyphAuroraShimmer } from '@/components/ui/glyph-aurora-shimmer'
import { EdgeFlareShimmer } from '@/components/ui/edge-flare-shimmer'
import { SkeletonWaveShimmer } from '@/components/ui/skeleton-wave-shimmer'
import { CardSheenLoader } from '@/components/ui/card-sheen-loader'
import { ListBloomShimmer } from '@/components/ui/list-bloom-shimmer'
import { OrbitalBeadLoader } from '@/components/ui/orbital-bead-loader'
import { InkDripLoader } from '@/components/ui/ink-drip-loader'
import { MorphGlyphLoader } from '@/components/ui/morph-glyph-loader'
import { LatticePulseLoader } from '@/components/ui/lattice-pulse-loader'
import { ConstellationLost404 } from '@/components/ui/constellation-lost-404'
import { PaperTear404 } from '@/components/ui/paper-tear-404'
import { GlitchPortal404 } from '@/components/ui/glitch-portal-404'
import { GravityStackToast } from '@/components/ui/gravity-stack-toast'
import { RibbonUnfurlToast } from '@/components/ui/ribbon-unfurl-toast'
import { SonarPingToast } from '@/components/ui/sonar-ping-toast'
import { ParallaxReelScroll } from '@/components/ui/parallax-reel-scroll'
import { SnapMagnetScroll } from '@/components/ui/snap-magnet-scroll'
import { VelocityFadeStack } from '@/components/ui/velocity-fade-stack'
import { HologramFlipCard } from '@/components/ui/hologram-flip-card'
import { LiquidMorphCard } from '@/components/ui/liquid-morph-card'
import { GravityExpandCard } from '@/components/ui/gravity-expand-card'

import { RailBloomSidebar } from '@/components/ui/rail-bloom-sidebar'
import { SectionAccordionSidebar } from '@/components/ui/section-accordion-sidebar'
import { ContextDrawerSidebar } from '@/components/ui/context-drawer-sidebar'
import { CommandTreeSidebar } from '@/components/ui/command-tree-sidebar'
import { ThreadBubbleStack } from '@/components/ui/thread-bubble-stack'
import { InboxPulseList } from '@/components/ui/inbox-pulse-list'
import { TemplateMessageCard } from '@/components/ui/template-message-card'
import { CampaignComposerStrip } from '@/components/ui/campaign-composer-strip'
import { TypingWaveIndicator } from '@/components/ui/typing-wave-indicator'
import { OptInConsentBanner } from '@/components/ui/opt-in-consent-banner'
import { NotificationOrbitCenter } from '@/components/ui/notification-orbit-center'
import { PriorityBannerAlert } from '@/components/ui/priority-banner-alert'
import { InboxRowNotifier } from '@/components/ui/inbox-row-notifier'
import { BadgeBloomCounter } from '@/components/ui/badge-bloom-counter'
import { PushPreviewCard } from '@/components/ui/push-preview-card'
import { KpiSparkWidget } from '@/components/ui/kpi-spark-widget'
import { LiveMeterDial } from '@/components/ui/live-meter-dial'
import { ActivityStreamWidget } from '@/components/ui/activity-stream-widget'
import { StatusHeatmapGrid } from '@/components/ui/status-heatmap-grid'
import { RingProgressCluster } from '@/components/ui/ring-progress-cluster'
import { CallControlBar } from '@/components/ui/call-control-bar'
import { LiveTranscriptPanel } from '@/components/ui/live-transcript-panel'
import { AgentStateOrb } from '@/components/ui/agent-state-orb'
import { VoiceWaveformLane } from '@/components/ui/voice-waveform-lane'
import { SoftphoneDialPad } from '@/components/ui/softphone-dial-pad'
import { QueueTicketCard } from '@/components/ui/queue-ticket-card'

import { PaperOrbit404 } from '@/components/ui/paper-orbit-404'
import { MarsTether404 } from '@/components/ui/mars-tether-404'
import { MeshOrb404 } from '@/components/ui/mesh-orb-404'
import { PrismMeshOrb } from '@/components/ui/prism-mesh-orb'
import { LiquidMetalOrb } from '@/components/ui/liquid-metal-orb'
import { AuroraCoreOrb } from '@/components/ui/aurora-core-orb'
import { ParticleHaloOrb } from '@/components/ui/particle-halo-orb'
import { RibbonHelixWave } from '@/components/ui/ribbon-helix-wave'
import { RadialSonarWave } from '@/components/ui/radial-sonar-wave'
import { MediaCarouselBubble } from '@/components/ui/media-carousel-bubble'
import { ReactionChipBar } from '@/components/ui/reaction-chip-bar'
import { WhatsappFlowForm } from '@/components/ui/whatsapp-flow-form'
import { CatalogProductCard } from '@/components/ui/catalog-product-card'
import { SessionWindowTimer } from '@/components/ui/session-window-timer'
import { AgentHandoffCard } from '@/components/ui/agent-handoff-card'
import { BroadcastStatusBoard } from '@/components/ui/broadcast-status-board'
import { QuickReplyChipCloud } from '@/components/ui/quick-reply-chip-cloud'
import { GlassWorkspaceSidebar } from '@/components/ui/glass-workspace-sidebar'
import { TimelineRailSidebar } from '@/components/ui/timeline-rail-sidebar'
import { MegaFlyoutSidebar } from '@/components/ui/mega-flyout-sidebar'
import { PriorityInboxSidebar } from '@/components/ui/priority-inbox-sidebar'
import { OrbitSwitcherSidebar } from '@/components/ui/orbit-switcher-sidebar'



function TogglePlay({ children }: { children: (on: boolean, set: (v: boolean) => void) => React.ReactNode }) {
  const [on, setOn] = React.useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      {children(on, setOn)}
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">{on ? 'On' : 'Off'}</p>
    </div>
  )
}

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
        toast({ title: 'Saved successfully', description: 'Your component was copied.', variant: 'success' })
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
      <Button variant="framekit">Framekit</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </div>
  ),
  badge: (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="framekit">Framekit</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
    </div>
  ),
  card: (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Framekit Card</CardTitle>
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
        { value: 'a', title: 'Is Framekit UI free?', content: 'Yes — MIT licensed. Copy what you need.' },
        { value: 'b', title: 'Do I install a package?', content: 'No. Copy components into your project and own them.' },
        { value: 'c', title: 'Dark mode?', content: 'Yes. Components use Tailwind dark: variants.' },
      ]}
    />
  ),
  dialog: (
    <Dialog
      title="Create project"
      description="Spin up a new Framekit-powered app."
      trigger={<Button variant="framekit">Open dialog</Button>}
    >
      <Input placeholder="Project name" />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" variant="framekit">Create</Button>
      </div>
    </Dialog>
  ),
  tooltip: (
    <Tooltip content="Crafted with care">
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
        <Sparkles key="1" className="h-4 w-4 text-framekit-500" />,
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
      <MorphingText className="text-framekit-500" phrases={['faster', 'bolder', 'yours', 'animated']} />
    </div>
  ),
  'spark-button': <SparkButton>Click for sparks</SparkButton>,
  'cursor-trail': <CursorTrail className="w-full max-w-lg" />,
  'glass-card': (
    <div className="rounded-3xl bg-gradient-to-br from-framekit-500 via-fuchsia-500 to-indigo-600 p-10">
      <GlassCard className="max-w-xs">
        <h3 className="text-lg font-semibold text-white">Liquid glass</h3>
        <p className="mt-2 text-sm text-white/80">Frosted surface over vivid color.</p>
      </GlassCard>
    </div>
  ),
  'swipe-cards': (
    <SwipeCards
      cards={[
        { id: '1', title: 'Ember', subtitle: 'Warm accent tones', color: '#ea580c' },
        { id: '2', title: 'Volt', subtitle: 'Electric accents', color: '#7c3aed' },
        { id: '3', title: 'Ion', subtitle: 'Cool contrast', color: '#2563eb' },
      ]}
    />
  ),
  typewriter: (
    <Typewriter
      className="text-xl font-medium"
      phrases={['Framekit UI', 'Own your components', 'Ship with motion']}
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

  'prism-tidal-field': (
    <PrismTidalField className="flex h-56 w-full max-w-xl items-center justify-center">
      <p className="text-sm font-medium tracking-[0.2em] text-white/80">PRISM TIDAL</p>
    </PrismTidalField>
  ),
  'constellation-breathing-grid': (
    <ConstellationBreathingGrid className="flex h-56 w-full max-w-xl items-center justify-center">
      <p className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/70 backdrop-blur">constellation</p>
    </ConstellationBreathingGrid>
  ),
  'paperfold-gradient-plane': (
    <PaperfoldGradientPlane className="flex h-56 w-full max-w-xl items-center justify-center">
      <p className="rounded-xl bg-white/50 px-4 py-2 text-sm font-medium text-zinc-800 backdrop-blur">Paperfold</p>
    </PaperfoldGradientPlane>
  ),
  'orbit-commit': <OrbitCommit />,
  'inkline-action': <InklineAction>Continue journey</InklineAction>,
  'focus-bloom-button': <FocusBloomButton>Bloom focus</FocusBloomButton>,
  'tide-deck': (
    <TideDeck
      cards={[
        { id: '1', title: 'North swell', body: 'Velocity softens the corners.', tone: '#f7f5fb' },
        { id: '2', title: 'Cross current', body: 'Drag to feel the tide.', tone: '#eef3f8' },
        { id: '3', title: 'Quiet cove', body: 'Snap mode for reduced motion.', tone: '#f6efe8' },
      ]}
    />
  ),
  'windowpane-story-card': (
    <WindowpaneStoryCard
      className="w-full max-w-sm"
      title="Field notes"
      summary="A frosted pane hides the evidence layer."
      evidence={<p>Signal peak at 14:02 · lilac pulse · contour mapped.</p>}
    />
  ),
  'topographic-stack': (
    <TopographicStack
      items={[
        { id: 'a', title: 'Ridge', note: 'Highest contour' },
        { id: 'b', title: 'Bench', note: 'Mid terrace' },
        { id: 'c', title: 'Basin', note: 'Collecting pool' },
      ]}
    />
  ),
  'glyph-weather': <GlyphWeather text="ALIVE TYPE" />,
  wordloom: <Wordloom words={['systems', 'rituals', 'signals', 'weather']} />,
  'momentum-caption': (
    <MomentumCaption>Sweep quickly — this line keeps a little inertia.</MomentumCaption>
  ),
  'compass-rail': (
    <CompassRail
      items={[
        { id: 'home', label: 'Overview' },
        { id: 'craft', label: 'Craft' },
        { id: 'motion', label: 'Motion' },
        { id: 'ship', label: 'Ship' },
      ]}
    />
  ),
  'halo-menu': (
    <HaloMenu
      items={[
        { id: '1', label: 'New' },
        { id: '2', label: 'Edit' },
        { id: '3', label: 'Share' },
        { id: '4', label: 'Dup' },
        { id: '5', label: 'Move' },
        { id: '6', label: 'Del' },
      ]}
    />
  ),
  'signal-pebble': (
    <div className="flex flex-col gap-3">
      <SignalPebble status="working" progress={62} />
      <SignalPebble status="mapping" />
      <SignalPebble status="done" progress={100} />
    </div>
  ),

  'watchful-eye-toggle': (
    <TogglePlay>{(on, set) => <WatchfulEyeToggle checked={on} onCheckedChange={set} aria-label="Watchful eye" />}</TogglePlay>
  ),
  'day-night-capsule': (
    <TogglePlay>{(on, set) => <DayNightCapsule checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'glass-orb-switch': (
    <TogglePlay>{(on, set) => <GlassOrbSwitch checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'cosmic-sparkle-toggle': (
    <TogglePlay>{(on, set) => <CosmicSparkleToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'blinker-switch': (
    <TogglePlay>{(on, set) => <BlinkerSwitch checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'mood-dial-toggle': (
    <TogglePlay>{(on, set) => <MoodDialToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'ink-bloom-toggle': (
    <TogglePlay>{(on, set) => <InkBloomToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'pulsebeat-switch': (
    <TogglePlay>{(on, set) => <PulsebeatSwitch checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'frameflip-toggle': (
    <TogglePlay>{(on, set) => <FrameflipToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'googly-gaze-button': <GooglyGazeButton />,
  'slide-confirm-button': <SlideConfirmButton />,
  'shimmer-chrome-button': <ShimmerChromeButton>Shimmer chrome</ShimmerChromeButton>,
  'pill-trail-cursor': <PillTrailCursor />,
  'halftone-bloom-cursor': <HalftoneBloomCursor />,
  'morph-search-capsule': <MorphSearchCapsule />,

  'silk-shear-field': (
    <SilkShearField className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-signal-200">SILK SHEAR</p>
    </SilkShearField>
  ),
  'void-lattice-drift': (
    <VoidLatticeDrift className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-white/50">VOID LATTICE</p>
    </VoidLatticeDrift>
  ),
  'ember-drift': (
    <EmberDrift className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-amber-100/70">EMBER DRIFT</p>
    </EmberDrift>
  ),
  'chromatic-mist': (
    <ChromaticMist className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-zinc-600">CHROMATIC MIST</p>
    </ChromaticMist>
  ),
  'pulse-rings': (
    <PulseRings className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-signal-200">PULSE RINGS</p>
    </PulseRings>
  ),
  'curtain-drop-nav': <CurtainDropNav />,
  'morph-pill-header': <MorphPillHeader />,
  'radial-toolburst': <RadialToolburst />,
  'magnetic-dock-nav': <MagneticDockNav />,
  'ribbon-trail-cursor': <RibbonTrailCursor />,
  'lens-flare-cursor': <LensFlareCursor />,
  'ink-stamp-cursor': <InkStampCursor />,
  'orbit-ring-cursor': <OrbitRingCursor />,
  'liquid-fill-button': <LiquidFillButton />,
  'split-reveal-button': <SplitRevealButton />,
  'gravity-drop-button': <GravityDropButton />,
  'neon-stroke-button': <NeonStrokeButton />,
  'moth-lantern-toggle': (
    <TogglePlay>{(on, set) => <MothLanternToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'petal-circuit-toggle': (
    <TogglePlay>{(on, set) => <PetalCircuitToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'tideglass-toggle': (
    <TogglePlay>{(on, set) => <TideglassToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  ),
  'weather-vane-toggle': (
    <TogglePlay>{(on, set) => <WeatherVaneToggle checked={on} onCheckedChange={set} />}</TogglePlay>
  ),




  'prism-sweep-shimmer': (
    <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl bg-zinc-950/80 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Stage · Prism</p>
      <PrismSweepShimmer className="w-full" />
    </div>
  ),
  'mercury-vein-shimmer': (
    <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 p-6 dark:bg-zinc-950/80">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Stage · Mercury</p>
      <MercuryVeinShimmer className="w-full" />
    </div>
  ),
  'glyph-aurora-shimmer': (
    <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl bg-zinc-950/80 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Stage · Aurora</p>
      <GlyphAuroraShimmer />
    </div>
  ),
  'edge-flare-shimmer': (
    <div className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl bg-zinc-950/80 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Stage · Edge flare</p>
      <EdgeFlareShimmer className="w-full" />
    </div>
  ),
  'skeleton-wave-shimmer': (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-2xl bg-[#121018] p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Loading · Skeleton wave</p>
      <SkeletonWaveShimmer className="w-full" />
    </div>
  ),
  'card-sheen-loader': (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-200 p-8 dark:from-[#121018] dark:to-zinc-950">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Loading · Card sheen</p>
      <CardSheenLoader />
    </div>
  ),
  'list-bloom-shimmer': (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-2xl bg-[#121018] p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Loading · List bloom</p>
      <ListBloomShimmer className="w-full" />
    </div>
  ),
  'orbital-bead-loader': <OrbitalBeadLoader />,
  'ink-drip-loader': <InkDripLoader />,
  'morph-glyph-loader': <MorphGlyphLoader />,
  'lattice-pulse-loader': <LatticePulseLoader />,
  'constellation-lost-404': (
    <ConstellationLost404 className="w-full max-w-lg" />
  ),
  'paper-tear-404': (
    <PaperTear404 className="w-full max-w-lg" />
  ),
  'glitch-portal-404': (
    <GlitchPortal404 className="w-full max-w-lg" />
  ),
  'gravity-stack-toast': (
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
  ),
  'ribbon-unfurl-toast': (
    <RibbonUnfurlToast>
      {({ push }) => (
        <Button
          variant="framekit"
          onClick={() => push({ title: 'Ribbon unfurled', description: 'A soft banner from the edge.' })}
        >
          Unfurl ribbon
        </Button>
      )}
    </RibbonUnfurlToast>
  ),
  'sonar-ping-toast': (
    <SonarPingToast>
      {({ push }) => (
        <Button
          variant="framekit"
          onClick={() => push({ title: 'Signal acquired', description: 'Sonar rings expanding.' })}
        >
          Ping sonar
        </Button>
      )}
    </SonarPingToast>
  ),
  'parallax-reel-scroll': (
    <div className="w-full max-w-md rounded-2xl bg-[#07060c] p-3">
      <ParallaxReelScroll className="w-full" />
    </div>
  ),
  'snap-magnet-scroll': (
    <div className="w-full max-w-md rounded-2xl bg-[#07060c] p-3">
      <SnapMagnetScroll className="w-full" />
    </div>
  ),
  'velocity-fade-stack': (
    <div className="w-full max-w-md rounded-2xl bg-[#07060c] p-3">
      <VelocityFadeStack className="w-full" />
    </div>
  ),
  'hologram-flip-card': <HologramFlipCard />,
  'liquid-morph-card': <LiquidMorphCard />,
  'gravity-expand-card': <GravityExpandCard />,

  'rail-bloom-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-[#121018] p-6">
      <RailBloomSidebar />
    </div>
  ),
  'section-accordion-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-zinc-100/80 p-4 dark:bg-[#121018]">
      <SectionAccordionSidebar />
    </div>
  ),
  'context-drawer-sidebar': (
    <div className="w-full max-w-lg">
      <ContextDrawerSidebar />
    </div>
  ),
  'command-tree-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-zinc-100/80 p-4 dark:bg-[#121018]">
      <CommandTreeSidebar />
    </div>
  ),

  'thread-bubble-stack': (
    <div className="flex w-full max-w-lg justify-center p-2">
      <ThreadBubbleStack />
    </div>
  ),
  'inbox-pulse-list': (
    <div className="w-full max-w-lg p-2">
      <InboxPulseList />
    </div>
  ),
  'template-message-card': (
    <div className="flex w-full max-w-lg justify-center p-2">
      <TemplateMessageCard />
    </div>
  ),
  'campaign-composer-strip': (
    <div className="w-full max-w-lg p-2">
      <CampaignComposerStrip />
    </div>
  ),
  'typing-wave-indicator': (
    <div className="flex w-full max-w-md flex-col items-start gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Agent handoff</p>
      <TypingWaveIndicator />
    </div>
  ),
  'opt-in-consent-banner': (
    <div className="w-full max-w-lg p-2">
      <OptInConsentBanner />
    </div>
  ),

  'notification-orbit-center': (
    <div className="w-full max-w-sm">
      <NotificationOrbitCenter />
    </div>
  ),
  'priority-banner-alert': (
    <div className="w-full max-w-lg p-2">
      <PriorityBannerAlert />
    </div>
  ),
  'inbox-row-notifier': (
    <div className="w-full max-w-lg p-2">
      <InboxRowNotifier />
    </div>
  ),
  'badge-bloom-counter': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-zinc-100/80 p-8 dark:bg-[#121018]">
      <BadgeBloomCounter />
    </div>
  ),
  'push-preview-card': (
    <div className="flex w-full max-w-sm justify-center p-2">
      <PushPreviewCard />
    </div>
  ),

  'kpi-spark-widget': (
    <div className="flex w-full max-w-sm justify-center p-2">
      <KpiSparkWidget />
    </div>
  ),
  'live-meter-dial': (
    <div className="flex w-full max-w-sm justify-center p-2">
      <LiveMeterDial />
    </div>
  ),
  'activity-stream-widget': (
    <div className="w-full max-w-lg p-2">
      <ActivityStreamWidget />
    </div>
  ),
  'status-heatmap-grid': (
    <div className="w-full max-w-lg p-2">
      <StatusHeatmapGrid />
    </div>
  ),
  'ring-progress-cluster': (
    <div className="w-full max-w-lg p-2">
      <RingProgressCluster />
    </div>
  ),

  'call-control-bar': (
    <div className="flex w-full max-w-lg justify-center p-2">
      <CallControlBar />
    </div>
  ),
  'live-transcript-panel': (
    <div className="w-full max-w-lg p-2">
      <LiveTranscriptPanel />
    </div>
  ),
  'agent-state-orb': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-[#0c0a12] p-10">
      <AgentStateOrb />
    </div>
  ),
  'voice-waveform-lane': (
    <div className="w-full max-w-lg p-2">
      <VoiceWaveformLane />
    </div>
  ),
  'softphone-dial-pad': (
    <div className="flex w-full max-w-sm justify-center p-2">
      <SoftphoneDialPad />
    </div>
  ),
  'queue-ticket-card': (
    <div className="flex w-full max-w-sm justify-center p-2">
      <QueueTicketCard />
    </div>
  ),



  'paper-orbit-404': (
    <PaperOrbit404 className="w-full max-w-lg" />
  ),
  'mars-tether-404': (
    <MarsTether404 className="w-full max-w-lg" />
  ),
  'mesh-orb-404': (
    <MeshOrb404 className="w-full max-w-lg" />
  ),
  'prism-mesh-orb': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-[#0c0a12] p-8">
      <PrismMeshOrb />
    </div>
  ),
  'liquid-metal-orb': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-[#0c0a12] p-8">
      <LiquidMetalOrb />
    </div>
  ),
  'aurora-core-orb': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-[#0c0a12] p-8">
      <AuroraCoreOrb />
    </div>
  ),
  'particle-halo-orb': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-[#0c0a12] p-8">
      <ParticleHaloOrb />
    </div>
  ),
  'ribbon-helix-wave': (
    <div className="w-full max-w-lg p-2">
      <RibbonHelixWave />
    </div>
  ),
  'radial-sonar-wave': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-[#0c0a12] p-6">
      <RadialSonarWave />
    </div>
  ),
  'media-carousel-bubble': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-[#121018] p-6">
      <MediaCarouselBubble />
    </div>
  ),
  'reaction-chip-bar': (
    <div className="w-full max-w-lg p-2">
      <ReactionChipBar />
    </div>
  ),
  'whatsapp-flow-form': (
    <div className="flex w-full max-w-lg justify-center p-2">
      <WhatsappFlowForm />
    </div>
  ),
  'catalog-product-card': (
    <div className="flex w-full max-w-lg justify-center p-2">
      <CatalogProductCard />
    </div>
  ),
  'session-window-timer': (
    <div className="flex w-full max-w-lg justify-center p-2">
      <SessionWindowTimer />
    </div>
  ),
  'agent-handoff-card': (
    <div className="flex w-full max-w-lg justify-center p-2">
      <AgentHandoffCard />
    </div>
  ),
  'broadcast-status-board': (
    <div className="flex w-full max-w-lg justify-center p-2">
      <BroadcastStatusBoard />
    </div>
  ),
  'quick-reply-chip-cloud': (
    <div className="w-full max-w-lg p-2">
      <QuickReplyChipCloud />
    </div>
  ),
  'glass-workspace-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-[#121018] p-6">
      <GlassWorkspaceSidebar />
    </div>
  ),
  'timeline-rail-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-[#121018] p-4">
      <TimelineRailSidebar />
    </div>
  ),
  'mega-flyout-sidebar': (
    <div className="w-full max-w-lg p-2">
      <MegaFlyoutSidebar />
    </div>
  ),
  'priority-inbox-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-zinc-100/80 p-4 dark:bg-[#121018]">
      <PriorityInboxSidebar />
    </div>
  ),
  'orbit-switcher-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-[#121018] p-4">
      <OrbitSwitcherSidebar />
    </div>
  ),

}
