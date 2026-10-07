import * as React from 'react'
import {
  Home, Search, Settings, Mail, Music, Terminal, Sparkles, Zap, Heart, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
import { DispatchTruckButton } from '@/components/ui/dispatch-truck-button'
import { DropInCartButton } from '@/components/ui/drop-in-cart-button'
import { FillProgressDownloadButton } from '@/components/ui/fill-progress-download-button'
import { SwallowDeleteButton } from '@/components/ui/swallow-delete-button'
import { LensReveal404 } from '@/components/ui/lens-reveal-404'
import { FlipCheckoutCard } from '@/components/ui/flip-checkout-card'
import { ParticleMorphLoader, type ParticleShape, type ParticleMorphState } from '@/components/ui/particle-morph-loader'
import { SnakeLoader, type SnakeLoaderSkin } from '@/components/ui/snake-loader'
// batch-folder:imports
import { FolderFanShowcase } from '@/components/ui/folder-fan-showcase'
import { SwipeCarouselPost } from '@/components/ui/swipe-carousel-post'
import { EditorialSpreadCard } from '@/components/ui/editorial-spread-card'
import { TearStubBoardingPass } from '@/components/ui/tear-stub-boarding-pass'
import { WaxSealButton } from '@/components/ui/wax-seal-button'
import { InkBleedText } from '@/components/ui/ink-bleed-text'
import { PaperFoldAccordion } from '@/components/ui/paper-fold-accordion'
import { DealerDeckTestimonials } from '@/components/ui/dealer-deck-testimonials'
import { SwingPriceTag } from '@/components/ui/swing-price-tag'
import { HourglassLoader } from '@/components/ui/hourglass-loader'
import { SignaturePadField } from '@/components/ui/signature-pad-field'
import { ReceiptPrintToast, DEFAULT_RECEIPTS } from '@/components/ui/receipt-print-toast'
// batch-folder:imports-end
import { SignalBeamDiagram } from '@/components/ui/signal-beam-diagram'
import { FeatureBentoGrid } from '@/components/ui/feature-bento-grid'
import { LiveFeedStack } from '@/components/ui/live-feed-stack'
import { FileTreeExplorer } from '@/components/ui/file-tree-explorer'
import { DeviceFrame } from '@/components/ui/device-frame'
import { AvatarStack } from '@/components/ui/avatar-stack'
import { NeonHaloCard } from '@/components/ui/neon-halo-card'
import { HorizonGridField } from '@/components/ui/horizon-grid-field'
import { FlickerDotField } from '@/components/ui/flicker-dot-field'
import { ConfettiBurstButton } from '@/components/ui/confetti-burst-button'
import { VideoLightboxDialog } from '@/components/ui/video-lightbox-dialog'
import { WordCycleText } from '@/components/ui/word-cycle-text'
import { HighlightMarkerText } from '@/components/ui/highlight-marker-text'
import { VelocityMarquee } from '@/components/ui/velocity-marquee'
import { SparkleText } from '@/components/ui/sparkle-text'
// magic-batch:imports-end
import { ArrowRight as UpArrow, Gauge as UpGauge, Timer as UpTimer, Pause as UpPause, SkipForward as UpSkip, GitBranch as UpBranch, Check as UpCheck } from 'lucide-react'
// polish-pass:imports-end
import { FaceScanPayButton } from '@/components/ui/face-scan-pay-button'
import { OrbitDotExportButton } from '@/components/ui/orbit-dot-export-button'
import { ShredderDeleteButton } from '@/components/ui/shredder-delete-button'
import { CloudLaunchPublishButton } from '@/components/ui/cloud-launch-publish-button'
import { RadialShareMenu } from '@/components/ui/radial-share-menu'
import { GlowArcHero } from '@/components/ui/glow-arc-hero'
import { GlowLeaderboardList } from '@/components/ui/glow-leaderboard-list'
import { PodiumStackLeaderboard } from '@/components/ui/podium-stack-leaderboard'
import { CurvedTileWall } from '@/components/ui/curved-tile-wall'
import { FanDeckCarousel } from '@/components/ui/fan-deck-carousel'
import { GlassBubbleBuddy, type BubbleBuddyState } from '@/components/ui/glass-bubble-buddy'
import { MeshPillOrb, MESH_PILL_ORB_PALETTES, type MeshPillOrbState } from '@/components/ui/mesh-pill-orb'
import { StarMorphBuddy } from '@/components/ui/star-morph-buddy'
import { LoopFlightSendButton } from '@/components/ui/loop-flight-send-button'
import { LiquidChargeCapsule } from '@/components/ui/liquid-charge-capsule'
import { GhostGobblerSkull } from '@/components/ui/ghost-gobbler-skull'
import { SplitFlapHero } from '@/components/ui/split-flap-hero'
import { RidgelineHorizonHero } from '@/components/ui/ridgeline-horizon-hero'
import { KineticNameHero } from '@/components/ui/kinetic-name-hero'
import { SpotlightRevealHero } from '@/components/ui/spotlight-reveal-hero'
import { DepthParallaxHero } from '@/components/ui/depth-parallax-hero'
import { RoleMorphHero } from '@/components/ui/role-morph-hero'
import { PhotoStripHero } from '@/components/ui/photo-strip-hero'
import { TerminalDevHero } from '@/components/ui/terminal-dev-hero'
import { ProjectRevealList } from '@/components/ui/project-reveal-list'
import { ProjectFilterGallery } from '@/components/ui/project-filter-gallery'
import { CaseStudyScroll } from '@/components/ui/case-study-scroll'
import { BeforeAfterSlider } from '@/components/ui/before-after-slider'
import { CareerTimeline } from '@/components/ui/career-timeline'
import { SkillsMarquee } from '@/components/ui/skills-marquee'
import { SkillMeters } from '@/components/ui/skill-meters'
import { ImpactStats } from '@/components/ui/impact-stats'
import { TestimonialCarousel } from '@/components/ui/testimonial-carousel'
import { ClientLogoStrip } from '@/components/ui/client-logo-strip'
import { ContactFormCard } from '@/components/ui/contact-form-card'
import { SocialDock } from '@/components/ui/social-dock'
import { CopyEmailButton } from '@/components/ui/copy-email-button'
import { AvailabilityBadge } from '@/components/ui/availability-badge'
import { PortfolioFooter } from '@/components/ui/portfolio-footer'
import { SectionSpyNav } from '@/components/ui/section-spy-nav'
import { ProjectLightbox } from '@/components/ui/project-lightbox'
import { IntroPreloader } from '@/components/ui/intro-preloader'
import { ReadingProgressToc } from '@/components/ui/reading-progress-toc'
import { ResumeDownloadButton } from '@/components/ui/resume-download-button'
import { ServicesCards } from '@/components/ui/services-cards'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { PortfolioStudioTemplate } from '@/components/ui/portfolio-studio-template'
import { PortfolioDeveloperTemplate } from '@/components/ui/portfolio-developer-template'
import { RotateCcw } from 'lucide-react'
import { handleTablistKeys } from '@/lib/roving'
import { PortfolioArt, SAMPLE_PROJECTS } from '@/lib/portfolio-art'
import { TumblerLockOtp } from '@/components/ui/tumbler-lock-otp'
import { CrystalStrengthPassword } from '@/components/ui/crystal-strength-password'
import { OrigamiUnfoldCard } from '@/components/ui/origami-unfold-card'
import { LenticularShiftCard } from '@/components/ui/lenticular-shift-card'
import { TumbleLetters } from '@/components/ui/tumble-letters'
import { PluckedStringTabs } from '@/components/ui/plucked-string-tabs'
import { IronFilingsField } from '@/components/ui/iron-filings-field'
import { PullCordLampToggle } from '@/components/ui/pull-cord-lamp-toggle'
import { SeatScalePricing } from '@/components/ui/seat-scale-pricing'
import { PolarBloomChart, DEFAULT_POLAR_SERIES } from '@/components/ui/polar-bloom-chart'
// p2-imports:start
import { YearActivityGrid } from '@/components/ui/year-activity-grid'
import { NowPlayingWidget } from '@/components/ui/now-playing-widget'
import { WorldClockGlobe } from '@/components/ui/world-clock-globe'
import { BentoProfileBoard } from '@/components/ui/bento-profile-board'
import { ScatterDeskCollage } from '@/components/ui/scatter-desk-collage'
import { KudosWall } from '@/components/ui/kudos-wall'
import { BookSpineShelf } from '@/components/ui/book-spine-shelf'
import { MeshProjectCards } from '@/components/ui/mesh-project-cards'
import { CommandMenu } from '@/components/ui/command-menu'
import { Home as P2Home, Briefcase as P2Briefcase, User as P2User, PenLine as P2Pen, FolderOpen as P2Folder, Mail as P2Mail, Moon as P2Moon, FileDown as P2FileDown, ExternalLink as P2Ext, Layers as P2Layers, MessageCircle as P2Chat } from 'lucide-react'
import { IslandSectionNav } from '@/components/ui/island-section-nav'
import { StickyCardStack } from '@/components/ui/sticky-card-stack'
import { PinnedProjectReel } from '@/components/ui/pinned-project-reel'
import { ScrollTextFill } from '@/components/ui/scroll-text-fill'
import { XrayLensCursor } from '@/components/ui/xray-lens-cursor'
import { CharmText } from '@/components/ui/charm-text'
import { BigTypeFooter } from '@/components/ui/big-type-footer'
import { GrainGradientField } from '@/components/ui/grain-gradient-field'
import { ThemeRevealToggle } from '@/components/ui/theme-reveal-toggle'
import { MiniDesktopOS } from '@/components/ui/mini-desktop-os'
import { LoginGateIntro } from '@/components/ui/login-gate-intro'
import { RouteChooserHero } from '@/components/ui/route-chooser-hero'
import { DiscoveryScene } from '@/components/ui/discovery-scene'
import { GlassSegmentedControl } from '@/components/ui/glass-segmented-control'
import { DynamicStatusIsland } from '@/components/ui/dynamic-status-island'
import { DetentSheet } from '@/components/ui/detent-sheet'
import { VibrancyContextMenu } from '@/components/ui/vibrancy-context-menu'
import { DeployTimeline } from '@/components/ui/deploy-timeline'
import { UsageQuotaMeter } from '@/components/ui/usage-quota-meter'
import { OnboardingStepper } from '@/components/ui/onboarding-stepper'
import { SortableDataTable } from '@/components/ui/sortable-data-table'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { FeedbackStatePanel } from '@/components/ui/feedback-state-panel'
import { KbdShortcutHint } from '@/components/ui/kbd-shortcut-hint'
import { InsetSettingsList } from '@/components/ui/inset-settings-list'
import { RollingNumberStepper } from '@/components/ui/rolling-number-stepper'
import { FileDropUploader } from '@/components/ui/file-drop-uploader'
import { BarChart3, CalendarDays, LayoutGrid } from 'lucide-react'
// p2-imports:end



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
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{on ? 'Enabled' : 'Disabled'}</span>
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
    <div className="w-full max-w-sm space-y-6">
      <Progress value={v} label="Uploading assets" showValue />
      <Progress value={100} tone="success" label="Build complete" showValue size="sm" />
      <Progress value={0} indeterminate tone="neutral" label="Deploying to edge" size="sm" />
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

/* ---------- batch 2 reel demos ---------- */

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

function FailSwitch({ on, onChange, label = 'Simulate failure', light = false }: { on: boolean; onChange: (v: boolean) => void; label?: string; light?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={
        'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-300 ' +
        (light ? 'text-[#5b4636] hover:bg-black/5' : 'text-zinc-500 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/5')
      }
    >
      <span className={'relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors ' + (on ? 'bg-rose-500' : light ? 'bg-black/15' : 'bg-black/15 dark:bg-white/15')}>
        <span className={'absolute left-0 top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ' + (on ? 'translate-x-3.5' : 'translate-x-0.5')} />
      </span>
      {label}
    </button>
  )
}

const PM_SHAPES: ParticleShape[] = ['sphere', 'ribbon', 'shell', 'tetra', 'ring', 'helix']
const PM_TINTS = [
  { name: 'Iris', hex: '#a78bfa' },
  { name: 'Glacier', hex: '#7dd3fc' },
  { name: 'Ember', hex: '#fdba74' },
  { name: 'Bloom', hex: '#f9a8d4' },
]

function ParticleMorphLoaderDemo() {
  const [shape, setShape] = React.useState<ParticleShape | 'all'>('all')
  const [tint, setTint] = React.useState(PM_TINTS[0].hex)
  const [state, setState] = React.useState<ParticleMorphState>('loading')
  const run = React.useRef(0)
  const finish = async (to: ParticleMorphState) => {
    const id = ++run.current
    setState(to)
    if (to === 'done') {
      await wait(2400)
      if (id === run.current) setState('loading')
    }
  }
  const chip = (active: boolean) =>
    'rounded-full px-2.5 py-1 text-[11px] font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-300 ' +
    (active ? 'bg-zinc-900/[0.06] text-zinc-900 ring-1 ring-black/10 dark:bg-white/12 dark:text-white dark:ring-white/15' : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200')
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(90%_70%_at_50%_30%,#15131d,#050507)] px-6 pb-8 pt-10 ring-1 ring-black/[0.06] dark:ring-white/5">
      <ParticleMorphLoader
        size={220}
        color={tint}
        shapes={shape === 'all' ? PM_SHAPES : [shape]}
        state={state}
        onRetry={() => finish('loading')}
      />
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Shape">
        {(['all', ...PM_SHAPES] as const).map((s) => (
          <button key={s} type="button" aria-pressed={shape === s} className={chip(shape === s)} onClick={() => setShape(s)}>
            {s === 'all' ? 'Cycle all' : s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5" role="group" aria-label="Tint">
          {PM_TINTS.map((t) => (
            <button
              key={t.hex}
              type="button"
              aria-label={t.name}
              aria-pressed={tint === t.hex}
              onClick={() => setTint(t.hex)}
              className={'h-5 w-5 rounded-full outline-none ring-offset-2 ring-offset-white transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:ring-offset-[#0b0a10] dark:focus-visible:ring-white ' + (tint === t.hex ? 'ring-2 ring-zinc-900/60 dark:ring-white/70' : '')}
              style={{ background: t.hex }}
            />
          ))}
        </div>
        <span className="h-4 w-px bg-black/10 dark:bg-white/10" />
        <button type="button" className={chip(state === 'done')} onClick={() => finish('done')}>Resolve</button>
        <button type="button" className={chip(state === 'error')} onClick={() => finish('error')}>Fail</button>
      </div>
      <div className="flex items-end justify-center gap-8 border-t border-black/5 pt-6 dark:border-white/5">
        <ParticleMorphLoader size={72} points={160} color="#7dd3fc" showLabel={false} speed={1.3} shapes={['shell', 'ring', 'helix']} />
        <ParticleMorphLoader size={96} points={220} color="#fdba74" showLabel={false} shapes={['tetra', 'sphere', 'ribbon']} />
        <ParticleMorphLoader size={120} points={260} color="#f9a8d4" labels={['Indexing…', 'Linking…', 'Ranking…']} speed={0.8} shapes={['ribbon', 'shell']} />
      </div>
    </div>
  )
}

function FaceScanPayDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-5 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#141a2e,#07090f)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <FaceScanPayButton
        onPay={async () => {
          await wait(1900)
          if (fail) throw new Error('declined')
        }}
      />
      <FailSwitch on={fail} onChange={setFail} label="Simulate decline" />
    </div>
  )
}

function OrbitDotExportDemo() {
  const [fail, setFail] = React.useState(false)
  const failing = (report: (p: number) => void) =>
    new Promise<void>((resolve, reject) => {
      let p = 0
      const t = window.setInterval(() => {
        p += 0.06
        report(p)
        if (fail && p > 0.55) {
          window.clearInterval(t)
          reject(new Error('export failed'))
        } else if (p >= 1) {
          window.clearInterval(t)
          resolve()
        }
      }, 120)
    })
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <OrbitDotExportButton onExport={fail ? failing : undefined} />
      <div className="flex flex-wrap items-start justify-center gap-4">
        <OrbitDotExportButton dot="diamond" accent="#7dd3fc" label="Export CSV" doneLabel="Open CSV" />
        <OrbitDotExportButton dot="spark" accent="#c4b5fd" label="Render" doneLabel="Preview" />
      </div>
      <FailSwitch on={fail} onChange={setFail} />
    </div>
  )
}

function ShredderDeleteDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 pb-10 pt-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <div className="flex flex-wrap items-center justify-center gap-5">
        <ShredderDeleteButton variant="violet" onDelete={fail ? async () => { await wait(300); throw new Error('jam') } : undefined} />
        <ShredderDeleteButton variant="light" label="Discard draft" />
        <ShredderDeleteButton variant="danger" label="Purge logs" strips={9} />
      </div>
      <FailSwitch on={fail} onChange={setFail} label="Jam the first one" />
    </div>
  )
}

function CloudLaunchDemo() {
  const [fail, setFail] = React.useState(false)
  const failing = (report: (p: number) => void) =>
    new Promise<void>((_, reject) => {
      let p = 0
      const t = window.setInterval(() => {
        p += 0.05
        report(p)
        if (p > 0.62) {
          window.clearInterval(t)
          reject(new Error('publish failed'))
        }
      }, 110)
    })
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-5 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1a1d29,#0b0c12)] px-6 py-14 ring-1 ring-black/[0.06] dark:ring-white/5">
        <CloudLaunchPublishButton onPublish={fail ? failing : undefined} />
        <FailSwitch on={fail} onChange={setFail} />
      </div>
      <div className="dark flex flex-col items-center justify-center gap-5 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#1a1d29,#0b0c12)] px-6 py-14 ring-1 ring-white/5">
        <CloudLaunchPublishButton variant="dark" label="Publish site" doneLabel="Deployed" />
        <span className="text-[11px] font-medium text-slate-400">variant=&quot;dark&quot; · always dark</span>
      </div>
    </div>
  )
}

function RadialShareDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-[28px] bg-[radial-gradient(120%_90%_at_50%_0%,#f6eee2,#e6d8c3)] px-6 pb-6 pt-8 shadow-[inset_0_1px_0_rgb(255_255_255/0.7)] ring-1 ring-[#d6c4a8]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7b5f]">Field notes · Issue 14</p>
      <h3 className="text-center text-lg font-semibold tracking-tight text-[#2b211a]">Quiet interfaces, loud details</h3>
      <RadialShareMenu
        url="https://framekit-ui.vercel.app/#/docs/radial-share-menu"
        onShare={fail ? async () => { await wait(200); throw new Error('nope') } : undefined}
      />
      <FailSwitch on={fail} onChange={setFail} light />
    </div>
  )
}

/* ---------- batch 3: image-inspired originals ---------- */

const BUDDY_STATES: BubbleBuddyState[] = ['idle', 'listening', 'thinking', 'speaking']
const BUDDY_HUES = [
  { name: 'Sky', hue: 212 },
  { name: 'Lilac', hue: 262 },
  { name: 'Mint', hue: 160 },
  { name: 'Peach', hue: 18 },
]

const BUDDY_SCRIPT: { state: BubbleBuddyState; ms: number; who?: 'You' | 'Buddy'; line: string }[] = [
  { state: 'idle', ms: 5200, line: 'Just hanging out — wave your cursor nearby.' },
  { state: 'listening', ms: 3600, who: 'You', line: 'Can you move my 3pm with Priya to tomorrow?' },
  { state: 'thinking', ms: 2600, line: 'Checking both calendars…' },
  { state: 'speaking', ms: 4600, who: 'Buddy', line: 'Done! Moved to Thursday at 10:30 — Priya’s free then too.' },
]

function GlassBubbleBuddyDemo() {
  const [state, setState] = React.useState<BubbleBuddyState>('idle')
  const [auto, setAuto] = React.useState(true)
  const [step, setStep] = React.useState(0)
  const [hue, setHue] = React.useState(212)
  React.useEffect(() => {
    if (!auto) return
    const cur = BUDDY_SCRIPT[step]
    setState(cur.state)
    const id = window.setTimeout(() => setStep((i) => (i + 1) % BUDDY_SCRIPT.length), cur.ms)
    return () => window.clearTimeout(id)
  }, [auto, step])
  const pick = (s: BubbleBuddyState) => {
    setAuto(false)
    setState(s)
  }
  const caption = auto ? BUDDY_SCRIPT[step] : null
  const chip = (active: boolean) =>
    'rounded-full px-3 py-1.5 text-[11px] font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 ' +
    (active
      ? 'bg-zinc-900/[0.06] text-zinc-900 ring-1 ring-black/10 dark:bg-white/12 dark:text-white dark:ring-white/15'
      : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200')
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#eef1f6)] px-6 pb-8 pt-10 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_70%_at_50%_30%,#0f1626,#040508)] dark:shadow-none dark:ring-white/5">
      <GlassBubbleBuddy
        state={state}
        hue={hue}
        size={210}
        onClick={() => pick(BUDDY_STATES[(BUDDY_STATES.indexOf(state) + 1) % BUDDY_STATES.length])}
      />
      <p aria-live="polite" className="flex h-5 items-center gap-2 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
        {caption ? (
          <>
            {caption.who && (
              <span className="rounded-full bg-zinc-900/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {caption.who}
              </span>
            )}
            <span key={step}>{caption.line}</span>
          </>
        ) : (
          <span>Click the buddy for a boing — hover for a shy smile.</span>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1" role="radiogroup" aria-label="Assistant state">
        <button type="button" role="radio" aria-checked={auto} className={chip(auto)} onClick={() => { setAuto(true); setStep(0) }}>
          Auto
        </button>
        {BUDDY_STATES.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={!auto && state === s} className={chip(!auto && state === s)} onClick={() => pick(s)}>
            {s}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {BUDDY_HUES.map((h) => (
          <button
            key={h.hue}
            type="button"
            aria-label={h.name}
            aria-pressed={hue === h.hue}
            onClick={() => setHue(h.hue)}
            className={'mx-0.5 h-5 w-5 rounded-full outline-none ring-offset-2 ring-offset-white transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:ring-offset-[#0b0d14] dark:focus-visible:ring-white ' + (hue === h.hue ? 'ring-2 ring-zinc-900/60 dark:ring-white/70' : '')}
            style={{ background: `hsl(${h.hue} 90% 68%)` }}
          />
        ))}
      </div>
      <div className="flex items-end justify-center gap-6 border-t border-black/5 pt-6 dark:border-white/5">
        <GlassBubbleBuddy size={64} hue={262} state="listening" label="Mini assistant" />
        <GlassBubbleBuddy size={84} hue={160} state="thinking" label="Mini assistant" />
        <GlassBubbleBuddy size={64} hue={18} state="speaking" label="Mini assistant" />
        <GlassBubbleBuddy size={64} hue={212} mood="sleepy" label="Sleepy assistant" />
      </div>
    </div>
  )
}


/* ---------- batch 4: reel-inspired originals ---------- */

const demoChip = (active: boolean) =>
  'rounded-full px-3 py-1.5 text-[11px] font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fuchsia-400 ' +
  (active
    ? 'bg-zinc-900/[0.06] text-zinc-900 ring-1 ring-black/10 dark:bg-white/12 dark:text-white dark:ring-white/15'
    : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200')

const MESH_STATES: MeshPillOrbState[] = ['idle', 'listening', 'thinking', 'speaking']
const MESH_SCRIPT: { state: MeshPillOrbState; ms: number; who?: 'You' | 'Agent'; line: string }[] = [
  { state: 'idle', ms: 4200, line: 'Standing by — say the word.' },
  { state: 'listening', ms: 3800, who: 'You', line: 'What’s left on the launch checklist for Friday?' },
  { state: 'thinking', ms: 2600, line: 'Scanning the project board…' },
  { state: 'speaking', ms: 5000, who: 'Agent', line: 'Two items: final QA pass and the pricing page copy. Both owned by Mira.' },
]

function MeshPillOrbDemo() {
  const [auto, setAuto] = React.useState(true)
  const [step, setStep] = React.useState(0)
  const [state, setState] = React.useState<MeshPillOrbState>('idle')
  const [palette, setPalette] = React.useState<keyof typeof MESH_PILL_ORB_PALETTES>('lava')
  React.useEffect(() => {
    if (!auto) return
    const cur = MESH_SCRIPT[step]
    setState(cur.state)
    const id = window.setTimeout(() => setStep((i) => (i + 1) % MESH_SCRIPT.length), cur.ms)
    return () => window.clearTimeout(id)
  }, [auto, step])
  const pick = (s: MeshPillOrbState) => {
    setAuto(false)
    setState(s)
  }
  const caption = auto ? MESH_SCRIPT[step] : null
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-7 overflow-hidden rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f1eef8)] px-6 pb-8 pt-20 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_70%_at_50%_35%,#120a1f,#030204)] dark:shadow-none dark:ring-white/5">
      <MeshPillOrb
        state={state}
        size={200}
        colors={MESH_PILL_ORB_PALETTES[palette]}
        onClick={() => pick(MESH_STATES[(MESH_STATES.indexOf(state) + 1) % MESH_STATES.length])}
        label="Launch assistant"
      />
      <p className="flex min-h-5 items-center gap-2 text-center text-[12px] text-zinc-500 dark:text-zinc-400">
        {caption ? (
          <>
            {caption.who && (
              <span className="rounded-full bg-zinc-900/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
                {caption.who}
              </span>
            )}
            <span key={step}>{caption.line}</span>
          </>
        ) : (
          <span>Click the orb to cycle states — it glances toward your cursor.</span>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-1" role="radiogroup" aria-label="Orb state">
        <button type="button" role="radio" aria-checked={auto} className={demoChip(auto)} onClick={() => { setAuto(true); setStep(0) }}>
          Auto
        </button>
        {MESH_STATES.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={!auto && state === s} className={demoChip(!auto && state === s)} onClick={() => pick(s)}>
            {s}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {(Object.keys(MESH_PILL_ORB_PALETTES) as (keyof typeof MESH_PILL_ORB_PALETTES)[]).map((k) => {
          const c = MESH_PILL_ORB_PALETTES[k]
          return (
            <button
              key={k}
              type="button"
              aria-label={`${k} palette`}
              aria-pressed={palette === k}
              onClick={() => setPalette(k)}
              className={'mx-0.5 h-5 w-5 rounded-full outline-none ring-offset-2 ring-offset-white transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-zinc-900 dark:ring-offset-[#07050b] dark:focus-visible:ring-white ' + (palette === k ? 'ring-2 ring-zinc-900/60 dark:ring-white/70' : '')}
              style={{ background: `conic-gradient(${c[0]}, ${c[1]}, ${c[3]}, ${c[2]}, ${c[0]})` }}
            />
          )
        })}
      </div>
      <div className="flex items-end justify-center gap-8 border-t border-black/5 pt-6 dark:border-white/5">
        <MeshPillOrb size={56} state="listening" colors={MESH_PILL_ORB_PALETTES.lagoon} rings={false} label="Mini orb" />
        <MeshPillOrb size={72} state="speaking" colors={MESH_PILL_ORB_PALETTES.lava} rings={false} label="Mini orb" />
        <MeshPillOrb size={56} state="thinking" colors={MESH_PILL_ORB_PALETTES.dusk} rings={false} label="Mini orb" />
      </div>
    </div>
  )
}

function StarMorphBuddyDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#eef0fb)] px-6 pb-6 pt-8 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_80%_at_50%_20%,#1a1740,#07060f)] dark:shadow-none dark:ring-white/5">
      <StarMorphBuddy
        onActivate={async () => {
          await wait(1400)
          if (fail) throw new Error('offline')
        }}
      />
      <FailSwitch on={fail} onChange={setFail} />
      <div className="mt-2 flex w-full items-center justify-center gap-5 border-t border-black/5 pt-5 dark:border-white/5">
        <StarMorphBuddy size={92} name="Juno" idleText="Need a recipe idea?" hoverText="Juno here — tell me what’s in your fridge." highlight="what’s in your fridge" className="[&_button]:px-2 [&_span]:text-[13px]" />
        <StarMorphBuddy size={92} name="Orbit" idleText="Plan a trip?" hoverText="Orbit here — I’ll sketch a weekend itinerary." highlight="weekend itinerary" className="[&_button]:px-2 [&_span]:text-[13px]" />
      </div>
    </div>
  )
}

function LoopFlightSendDemo() {
  const [fail, setFail] = React.useState(false)
  const [slow, setSlow] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLButtonElement>('button[aria-label]')?.click(), 1100)
    return () => window.clearTimeout(t)
  }, [])
  const send = async () => {
    await wait(slow ? 3600 : 500)
    if (fail) throw new Error('network')
  }
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div ref={ref} className="flex flex-col gap-2 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#eef0f7)] px-6 pb-5 pt-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(120%_100%_at_50%_0%,#191a2b,#0a0a12)] dark:shadow-none dark:ring-white/5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#fbbf24,#f472b6)] text-[11px] font-bold text-white">AK</span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-zinc-900 dark:text-white">To: Amara Kent</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Re: Q3 roadmap draft · “Tightened the milestones, beta moves to week 6.”</p>
          </div>
        </div>
        <div className="grid h-52 place-items-center">
          <LoopFlightSendButton onSend={send} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-black/5 pt-3 dark:border-white/5">
          <FailSwitch on={fail} onChange={setFail} />
          <FailSwitch on={slow} onChange={setSlow} label="Slow network (holds in orbit)" />
        </div>
      </div>
      <div className="dark grid h-56 place-items-center rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#23204a,#09080f)] ring-1 ring-white/5">
        <div className="flex flex-col items-center gap-3">
          <LoopFlightSendButton label="Send invite" sentLabel="Invited!" />
          <span className="text-[11px] font-medium text-zinc-400">inside a .dark wrapper</span>
        </div>
      </div>
    </div>
  )
}

type GobblerDemoMode = 'auto' | 'manual' | 'indeterminate' | 'failure'

function GhostGobblerDemo() {
  const [mode, setMode] = React.useState<GobblerDemoMode>('auto')
  const [progress, setProgress] = React.useState(0.5)
  const [runKey, setRunKey] = React.useState(0)
  const [busy, setBusy] = React.useState(false)
  const replayTimer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(replayTimer.current), [])
  const failingTask = React.useMemo(
    () => () => new Promise<void>((_, reject) => window.setTimeout(() => reject(new Error('Cursed network')), 5200)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runKey],
  )
  const pick = (m: GobblerDemoMode) => {
    window.clearTimeout(replayTimer.current)
    setMode(m)
    setRunKey((k) => k + 1)
  }
  const summon = () => {
    if (busy) return
    setBusy(true)
    window.setTimeout(() => setBusy(false), 4200)
  }
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5 rounded-2xl bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff,#eeecf3)] px-6 pb-6 pt-6 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_75%_at_50%_35%,#1b1726,#07060a)] dark:shadow-none dark:ring-white/5">
      <GhostGobblerSkull
        key={mode}
        mode={mode === 'indeterminate' ? 'indeterminate' : 'determinate'}
        progress={mode === 'manual' ? progress : undefined}
        task={mode === 'failure' ? failingTask : undefined}
        resetKey={runKey}
        label={mode === 'failure' ? 'Summoning report' : 'Loading spirits'}
        onComplete={() => {
          if (mode !== 'auto') return
          window.clearTimeout(replayTimer.current)
          replayTimer.current = window.setTimeout(() => setRunKey((k) => k + 1), 3400)
        }}
      />
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Skull loader controls">
        {([
          ['auto', 'Autoplay'],
          ['manual', 'Determinate'],
          ['indeterminate', 'Indeterminate'],
          ['failure', 'Simulate failure'],
        ] as const).map(([m, l]) => (
          <button key={m} type="button" aria-pressed={mode === m} className={demoChip(mode === m)} onClick={() => pick(m)}>
            {l}
          </button>
        ))}
        <button type="button" className={demoChip(false)} onClick={() => pick(mode)}>
          Replay
        </button>
      </div>
      {mode === 'manual' && (
        <label className="flex w-full max-w-xs items-center gap-3 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
          Progress
          <input type="range" min={0} max={1} step={0.125} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="flex-1 accent-violet-500" aria-label="Loading progress" />
          <span className="w-9 text-right tabular-nums">{Math.round(progress * 100)}%</span>
        </label>
      )}
      <div className="grid w-full gap-3 border-t border-black/5 pt-5 sm:grid-cols-3 dark:border-white/5">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/70 p-4 ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/5">
          <button
            type="button"
            onClick={summon}
            aria-busy={busy}
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-zinc-900 pl-3 pr-4 text-[13px] font-semibold text-white shadow-sm outline-none transition hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-violet-400 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {busy ? (
              <GhostGobblerSkull size={24} spread={1.3} mode="indeterminate" speed={1.4} interactive={false} showLabel={false} label="Exporting" />
            ) : (
              <span aria-hidden className="text-base leading-none">☠</span>
            )}
            {busy ? 'Exporting…' : 'Export CSV'}
          </button>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Inline button loader</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/70 p-3 ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/5">
          <GhostGobblerSkull size={78} spread={1.5} mode="idle" label="Nothing haunted here" showLabel={false} />
          <span className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300">Inbox exorcised</span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Mascot / empty state — hover & click me</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/70 p-3 ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/5">
          <GhostGobblerSkull size={78} spread={1.6} mode="indeterminate" speed={1.25} ghostColor="#2a1240" glowPalette={['#86efac', '#4ade80', '#22c55e', '#a3e635', '#bef264', '#d9f99d', '#6ee7b7', '#fef08a']} label="Syncing" showLabel={false} />
          <span className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300">Syncing vault…</span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Indeterminate · violet smoke</span>
        </div>
      </div>
    </div>
  )
}

function LiquidChargeDemo() {
  const [auto, setAuto] = React.useState(true)
  const [level, setLevel] = React.useState(8)
  const [charging, setCharging] = React.useState(true)
  const [cycle, setCycle] = React.useState(0)
  React.useEffect(() => {
    if (!auto) return
    let alive = true
    let lvl = 8
    setLevel(8)
    setCharging(true)
    const run = async () => {
      await wait(500)
      while (alive && lvl < 100) {
        lvl = Math.min(100, lvl + 2)
        setLevel(lvl)
        await wait(lvl > 90 ? 150 : 95)
      }
      if (!alive) return
      await wait(2800)
      if (!alive) return
      setCharging(false)
      await wait(600)
      while (alive && lvl > 9) {
        lvl = Math.max(9, lvl - 3)
        setLevel(lvl)
        await wait(60)
      }
      await wait(1600)
      if (alive) setCycle((c) => c + 1)
    }
    void run()
    return () => {
      alive = false
    }
  }, [auto, cycle])
  const manual = (fn: () => void) => {
    setAuto(false)
    fn()
  }
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#eef1f4)] px-6 pb-6 pt-10 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] ring-1 ring-black/[0.06] dark:bg-[radial-gradient(90%_70%_at_50%_30%,#0f1a17,#040605)] dark:shadow-none dark:ring-white/5">
      <div className="flex items-end justify-center gap-10">
        <LiquidChargeCapsule level={level} charging={charging} onLevelChange={(v) => manual(() => setLevel(v))} label="Phone battery" />
        <div className="hidden flex-col gap-5 pb-16 sm:flex">
          <LiquidChargeCapsule height={96} level={14} showReadout={false} label="Earbuds battery" />
          <LiquidChargeCapsule height={96} level={52} charging showReadout={false} label="Watch battery" />
        </div>
        <div className="hidden pb-16 sm:block">
          <LiquidChargeCapsule height={96} level={100} showReadout={false} label="Tablet battery" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Battery controls">
        <button type="button" aria-pressed={auto} className={demoChip(auto)} onClick={() => { setAuto(true); setCycle((c) => c + 1) }}>
          Auto
        </button>
        <button type="button" role="switch" aria-checked={charging} className={demoChip(charging)} onClick={() => manual(() => setCharging((c) => !c))}>
          {charging ? 'Plugged in' : 'Unplugged'}
        </button>
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {[
          { name: 'Low', v: 11 },
          { name: 'Half', v: 52 },
          { name: 'Full', v: 100 },
        ].map((p) => (
          <button key={p.name} type="button" className={demoChip(!auto && level === p.v)} onClick={() => manual(() => setLevel(p.v))}>
            {p.name}
          </button>
        ))}
        <button type="button" className={demoChip(false)} onClick={() => manual(() => { setLevel(0); window.setTimeout(() => { setCharging(true); setLevel(100) }, 350) })}>
          Replay fill
        </button>
      </div>
    </div>
  )
}

/* ───────────── Batch 5 demos ───────────── */
const SNAKE_STEPS = ['Fetching 36 projects', 'Syncing 1,284 files', 'Rendering previews', 'Warming up the editor']
const SNAKE_ACCENTS = [
  { name: 'Emerald', value: undefined, swatch: '#10b981' },
  { name: 'Violet', value: '#8b5cf6', swatch: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b', swatch: '#f59e0b' },
]

function SnakeLoaderDemo() {
  const [progress, setProgress] = React.useState(0)
  const [run, setRun] = React.useState(0)
  const [failed, setFailed] = React.useState(false)
  const [skin, setSkin] = React.useState<SnakeLoaderSkin>('tiles')
  const [determinate, setDeterminate] = React.useState(true)
  const [accent, setAccent] = React.useState<string | undefined>(undefined)
  React.useEffect(() => {
    if (failed) return
    let alive = true
    setProgress(0)
    const go = async () => {
      await wait(700)
      let p = 0
      while (alive && p < 100) {
        p = Math.min(100, p + 0.6 + Math.random() * 3.4)
        setProgress(Math.round(p))
        await wait(p > 84 ? 480 : 220 + Math.random() * 280)
      }
    }
    void go()
    return () => {
      alive = false
    }
  }, [run, failed])
  const done = progress >= 100
  const restart = () => {
    setFailed(false)
    setRun((r) => r + 1)
  }
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5">
      <SnakeLoader
        progress={determinate ? progress : undefined}
        state={failed ? 'error' : done ? 'done' : 'loading'}
        label="Importing your workspace"
        description={failed ? `Connection dropped at ${progress}%` : done ? '36 projects · 1,284 files' : `${SNAKE_STEPS[Math.min(3, Math.floor(progress / 25))]}…`}
        readyLabel="Workspace imported"
        errorLabel="Import interrupted"
        onContinue={restart}
        onRetry={restart}
        skin={skin}
        color={accent}
      />
      <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label="Snake loader options">
        {(['tiles', 'lcd'] as const).map((s) => (
          <button key={s} type="button" aria-pressed={skin === s} className={demoChip(skin === s)} onClick={() => setSkin(s)}>
            {s === 'lcd' ? 'LCD' : 'Tiles'}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        <button type="button" role="switch" aria-checked={determinate} className={demoChip(determinate)} onClick={() => setDeterminate((d) => !d)}>
          {determinate ? 'Progress' : 'Indeterminate'}
        </button>
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        {SNAKE_ACCENTS.map((a) => (
          <button
            key={a.name}
            type="button"
            aria-label={`${a.name} accent`}
            aria-pressed={accent === a.value}
            onClick={() => setAccent(a.value)}
            className="grid h-7 w-7 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
          >
            <span className={`h-3.5 w-3.5 rounded-full ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 ${accent === a.value ? 'ring-2 ring-zinc-900/70 dark:ring-white/70' : ''}`} style={{ backgroundColor: a.swatch }} />
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-black/10 dark:bg-white/10" />
        <button type="button" className={demoChip(failed)} disabled={failed || done} onClick={() => setFailed(true)}>
          Fail
        </button>
        <button type="button" className={demoChip(false)} onClick={restart}>
          Reload
        </button>
      </div>
    </div>
  )
}

function TumblerLockDemo() {
  return (
    <TumblerLockOtp
      hint="Demo: 246810 unlocks — any other code fails."
      onVerify={(code) => code === '246810'}
    />
  )
}

function OrigamiUnfoldDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex flex-col items-center gap-4 pb-6">
      <OrigamiUnfoldCard
        onAction={async () => {
          await wait(1100)
          return !fail
        }}
      />
      <div className="mt-6"><FailSwitch on={fail} onChange={setFail} /></div>
    </div>
  )
}

function IronFilingsDemo() {
  return (
    <IronFilingsField className="max-w-3xl">
      <div className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center text-center">
        <span className="rounded-full bg-white/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 ring-1 ring-black/[0.06] backdrop-blur dark:bg-black/40 dark:text-zinc-300 dark:ring-white/10">Field study</span>
        <h3 className="mt-3 font-display text-4xl tracking-tight text-zinc-900 dark:text-white">Opposites attract.</h3>
      </div>
    </IronFilingsField>
  )
}

function SeatScaleDemo() {
  const [fail, setFail] = React.useState(false)
  return (
    <div className="flex flex-col items-center gap-4">
      <SeatScalePricing
        onCheckout={async () => {
          await wait(1200)
          return !fail
        }}
      />
      <FailSwitch on={fail} onChange={setFail} />
    </div>
  )
}

function PolarBloomDemo() {
  const [fail, setFail] = React.useState(false)
  const [nonce, setNonce] = React.useState(0)
  const failRef = React.useRef(fail)
  failRef.current = fail
  const load = React.useCallback(async () => {
    await wait(900)
    if (failRef.current) throw new Error('Network')
    return DEFAULT_POLAR_SERIES
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce])
  return (
    <div className="flex flex-col items-center gap-4">
      <PolarBloomChart load={load} />
      <div className="flex items-center gap-2">
        <FailSwitch on={fail} onChange={setFail} label="Fail next load" />
        <button type="button" className={demoChip(false)} onClick={() => setNonce((n) => n + 1)}>Reload data</button>
      </div>
    </div>
  )
}

/* ───────── Portfolio category + new heroes: demos ───────── */
function PfScrollFrame({ label, height = 520, children }: { label: string; height?: number; children: (ref: React.RefObject<HTMLDivElement | null>) => React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} role="region" aria-label={label} tabIndex={0} style={{ height }} className="relative w-full max-w-4xl overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200 bg-stone-50 p-4 sm:p-8 dark:border-zinc-800 dark:bg-zinc-950">
      {children(ref)}
    </div>
  )
}

function PfFlagSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
      {label}
    </label>
  )
}

function ContactFormDemo() {
  const [fail, setFail] = React.useState(false)
  const failRef = React.useRef(false)
  failRef.current = fail
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <ContactFormCard headingAs="h2" onSubmit={async () => { await wait(900); if (failRef.current) throw new Error('offline') }} />
      <PfFlagSwitch label="Simulate failure" checked={fail} onChange={setFail} />
    </div>
  )
}

function AvailabilityDemo() {
  const [s, setS] = React.useState<'open' | 'limited' | 'booked'>('open')
  return (
    <div className="flex flex-col items-center gap-5">
      <AvailabilityBadge status={s} timeZone="Europe/Lisbon" />
      <div role="radiogroup" aria-label="Availability status" onKeyDown={handleTablistKeys} className="flex gap-1.5 rounded-full border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
        {(['open', 'limited', 'booked'] as const).map((k) => (
          <button key={k} type="button" role="radio" aria-checked={s === k} tabIndex={s === k ? 0 : -1} onClick={() => setS(k)} className={`min-h-11 rounded-full px-4 text-sm font-medium capitalize ${s === k ? 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950' : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'}`}>{k}</button>
        ))}
      </div>
    </div>
  )
}

function CaseStudyDemo() {
  return <PfScrollFrame label="Case study preview (scrollable)" height={560}>{(ref) => <CaseStudyScroll scrollContainer={ref} titleAs="h2" className="mx-auto" />}</PfScrollFrame>
}
function CareerTimelineDemo() {
  return <PfScrollFrame label="Career timeline preview (scrollable)" height={520}>{(ref) => <CareerTimeline scrollContainer={ref} titleAs="h2" className="mx-auto" />}</PfScrollFrame>
}

function SectionSpyDemo() {
  const sections = [
    { id: 'demo-spy-work', label: 'Work' },
    { id: 'demo-spy-about', label: 'About' },
    { id: 'demo-spy-journal', label: 'Journal' },
    { id: 'demo-spy-contact', label: 'Contact' },
  ]
  const body: Record<string, string> = {
    'demo-spy-work': 'Six case studies across product, web and brand — each with the problem, the process and the numbers.',
    'demo-spy-about': 'Nine years across design and engineering, currently leading motion language for a product team of forty.',
    'demo-spy-journal': 'Notes on craft: motion budgets, accessible animation, and why springs beat easing curves.',
    'demo-spy-contact': 'Booking projects from November. Say hello and tell me about the thing you want to make.',
  }
  return (
    <PfScrollFrame label="Section spy preview (scrollable)" height={480}>
      {(ref) => (
        <>
          <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 bg-stone-50/90 px-4 pb-2 pt-4 backdrop-blur sm:-mx-8 sm:-mt-8 sm:px-8 sm:pt-8 dark:bg-zinc-950/90"><SectionSpyNav sections={sections} scrollContainer={ref} /></div>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="flex min-h-[340px] scroll-mt-20 flex-col justify-center gap-3 border-b border-zinc-200 py-8 outline-none last:border-0 dark:border-zinc-800">
              <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">0{i + 1}</p>
              <h2 id={`${s.id}-h`} className="font-display text-5xl text-zinc-950 dark:text-zinc-50">{s.label}</h2>
              <p className="max-w-[46ch] text-zinc-700 dark:text-zinc-300">{body[s.id]}</p>
            </section>
          ))}
        </>
      )}
    </PfScrollFrame>
  )
}

function ReadingTocDemo() {
  return <PfScrollFrame label="Blog post preview (scrollable)" height={520}>{(ref) => <ReadingProgressToc scrollContainer={ref} className="mx-auto" />}</PfScrollFrame>
}

function IntroPreloaderDemo() {
  const [k, setK] = React.useState(0)
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3">
      <IntroPreloader runKey={k} className="h-[440px]">
        <div className="flex h-full flex-col justify-between bg-stone-100 p-8 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nova Reyes — portfolio</p>
          <h2 className="font-display text-[clamp(56px,11vw,120px)] leading-[0.9] tracking-tight text-zinc-950 dark:text-zinc-50">Design that<br />moves with you.</h2>
          <div className="flex gap-2">{[3, 11, 19].map((s) => <div key={s} className="h-20 flex-1 overflow-hidden rounded-xl"><PortfolioArt seed={s} /></div>)}</div>
        </div>
      </IntroPreloader>
      <button type="button" onClick={() => setK((x) => x + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-300 px-4 text-sm font-medium text-zinc-800 hover:bg-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"><RotateCcw className="h-4 w-4" aria-hidden />Replay intro</button>
    </div>
  )
}

function ScrollRevealDemo() {
  const effects = ['rise', 'fade', 'blur', 'scale', 'clip', 'slide-left', 'slide-right'] as const
  return (
    <PfScrollFrame label="Scroll reveal preview (scrollable)" height={480}>
      {(ref) => (
        <div className="mx-auto max-w-xl space-y-24 py-10">
          <p className="text-center text-sm text-zinc-700 dark:text-zinc-300">Scroll down — each block enters with its own effect.</p>
          {effects.map((e) => (
            <ScrollReveal key={e} effect={e} scrollContainer={ref}>
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="font-mono text-xs text-signal-700 dark:text-signal-300">effect=&quot;{e}&quot;</p>
                <p className="mt-2 font-display text-4xl text-zinc-950 dark:text-zinc-50">{e === 'rise' ? 'Rise gently' : e === 'fade' ? 'Fade in' : e === 'blur' ? 'Focus pull' : e === 'scale' ? 'Scale up' : e === 'clip' ? 'Unwipe' : e === 'slide-left' ? 'From the left' : 'From the right'}</p>
              </div>
            </ScrollReveal>
          ))}
          <ScrollReveal stagger={0.1} effect="rise" scrollContainer={ref} className="grid grid-cols-3 gap-3">
            {[3, 11, 19].map((s) => <div key={s} className="aspect-square overflow-hidden rounded-2xl"><PortfolioArt seed={s} /></div>)}
          </ScrollReveal>
          <p className="pb-6 text-center text-sm text-zinc-700 dark:text-zinc-300">stagger={'{0.1}'} reveals direct children one by one ↑</p>
        </div>
      )}
    </PfScrollFrame>
  )
}

function ResumeDownloadDemo() {
  const href = React.useMemo(() => URL.createObjectURL(new Blob(['Nova Reyes — Résumé\nDesign engineer & motion designer\n\nThis is a demo file generated in your browser.\n'], { type: 'text/plain' })), [])
  React.useEffect(() => () => URL.revokeObjectURL(href), [href])
  return <ResumeDownloadButton href={href} fileName="nova-reyes-resume.txt" meta="PDF · 184 KB" />
}

const pfCard = 'flex w-full max-w-4xl flex-col items-center justify-center gap-4'

const portfolioDemos: Record<string, React.ReactNode> = {
  'project-reveal-list': <ProjectRevealList titleAs="h2" />,
  'project-filter-gallery': <ProjectFilterGallery titleAs="h2" />,
  'case-study-scroll': <CaseStudyDemo />,
  'before-after-slider': <BeforeAfterSlider />,
  'career-timeline': <CareerTimelineDemo />,
  'skills-marquee': <SkillsMarquee />,
  'skill-meters': <SkillMeters />,
  'impact-stats': <ImpactStats />,
  'testimonial-carousel': <TestimonialCarousel />,
  'client-logo-strip': <ClientLogoStrip />,
  'contact-form-card': <ContactFormDemo />,
  'social-dock': <div className={pfCard}><SocialDock /></div>,
  'copy-email-button': <CopyEmailButton />,
  'availability-badge': <AvailabilityDemo />,
  'portfolio-footer': <PortfolioFooter className="max-w-3xl" />,
  'section-spy-nav': <SectionSpyDemo />,
  'project-lightbox': <ProjectLightbox titleAs="h2" />,
  'intro-preloader': <IntroPreloaderDemo />,
  'reading-progress-toc': <ReadingTocDemo />,
  'resume-download-button': <ResumeDownloadDemo />,
  'services-cards': <ServicesCards titleAs="h2" />,
  'scroll-reveal': <ScrollRevealDemo />,
  'portfolio-studio-template': <PortfolioStudioTemplate />,
  'portfolio-developer-template': <PortfolioDeveloperTemplate />,
  'kinetic-name-hero': <KineticNameHero className="max-w-3xl" />,
  'spotlight-reveal-hero': <SpotlightRevealHero className="max-w-3xl" />,
  'depth-parallax-hero': <DepthParallaxHero className="max-w-3xl" />,
  'role-morph-hero': <RoleMorphHero className="max-w-3xl" />,
  'photo-strip-hero': <PhotoStripHero className="max-w-3xl" />,
  'terminal-dev-hero': <TerminalDevHero className="max-w-3xl" />,
}

// p2-demos:start
function CommandMenuDemo() {
  const [last, setLast] = React.useState('Open the palette (click, or press Ctrl/⌘ J — the docs shell owns ⌘ K) and pick something.')
  const items = React.useMemo(() => [
    { id: 'home', label: 'Go to Home', group: 'Navigate', keywords: ['start', 'top'], shortcut: ['G', 'H'], icon: <P2Home className="size-4" /> },
    { id: 'work', label: 'Selected work', group: 'Navigate', keywords: ['projects', 'portfolio', 'case studies'], shortcut: ['G', 'W'], icon: <P2Briefcase className="size-4" /> },
    { id: 'about', label: 'About me', group: 'Navigate', keywords: ['bio', 'story'], shortcut: ['G', 'A'], icon: <P2User className="size-4" /> },
    { id: 'writing', label: 'Writing & notes', group: 'Navigate', keywords: ['blog', 'articles'], icon: <P2Pen className="size-4" /> },
    { id: 'p1', label: 'Fieldnotes for Trails', group: 'Projects', hint: 'case study', keywords: ['pwa', 'offline'], icon: <P2Folder className="size-4" /> },
    { id: 'p2', label: 'Quill Pricing Lab', group: 'Projects', hint: 'case study', keywords: ['saas', 'stripe'], icon: <P2Layers className="size-4" /> },
    { id: 'copy', label: 'Copy email address', group: 'Actions', keywords: ['mail', 'contact'], shortcut: ['C'], icon: <P2Mail className="size-4" /> },
    { id: 'theme', label: 'Toggle theme', group: 'Actions', keywords: ['dark', 'light', 'mode'], shortcut: ['T'], icon: <P2Moon className="size-4" /> },
    { id: 'cv', label: 'Download résumé', group: 'Actions', hint: 'PDF', keywords: ['cv'], icon: <P2FileDown className="size-4" /> },
    { id: 'chat', label: 'Start a conversation', group: 'Elsewhere', keywords: ['hire', 'call'], icon: <P2Chat className="size-4" /> },
    { id: 'gh', label: 'Open GitHub', group: 'Elsewhere', hint: 'external', keywords: ['code', 'repo'], icon: <P2Ext className="size-4" /> },
  ], [])
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <CommandMenu hotkey="j" items={items} onSelect={(it) => setLast(`Ran “${it.label}”`)} />
      <p role="status" aria-live="polite" className="text-center text-sm text-zinc-700 dark:text-zinc-300">{last}</p>
    </div>
  )
}

function IslandNavDemo() {
  const secs = [
    { id: 'isl-intro', label: 'Intro', icon: <P2Home />, seed: 3, t: 'Hello, I make interfaces feel inevitable.' },
    { id: 'isl-work', label: 'Work', icon: <P2Briefcase />, seed: 11, t: 'Selected work from the last three years.' },
    { id: 'isl-notes', label: 'Notes', icon: <P2Pen />, seed: 19, t: 'Short essays on motion, type and craft.' },
    { id: 'isl-contact', label: 'Contact', icon: <P2Mail />, seed: 26, t: 'Say hello — I reply within a day.' },
  ]
  return (
    <PfScrollFrame label="Island nav preview (scrollable)" height={500}>
      {(ref) => (
        <div className="mx-auto max-w-2xl">
          {secs.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-2 pb-8">
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-40 sm:h-48"><PortfolioArt seed={s.seed} /></div>
                <div className="p-6"><p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">0{i + 1} / {s.label}</p><h2 className="mt-2 font-display text-3xl leading-tight text-zinc-950 dark:text-zinc-50">{s.t}</h2></div>
              </div>
            </section>
          ))}
          <IslandSectionNav sections={secs.map(({ id, label, icon }) => ({ id, label, icon }))} scrollContainer={ref} />
        </div>
      )}
    </PfScrollFrame>
  )
}

function StickyStackDemo() {
  return (
    <PfScrollFrame label="Sticky card stack preview (scrollable)" height={560}>
      {(ref) => (
        <div className="mx-auto max-w-3xl">
          <p className="pb-6 text-center text-sm text-zinc-700 dark:text-zinc-300">Scroll — each card pins and the one below slides over it ↓</p>
          <StickyCardStack scrollContainer={ref} cardHeight={340} titleAs="h2" />
          <p className="pb-8 pt-4 text-center text-sm text-zinc-700 dark:text-zinc-300">That&rsquo;s the stack.</p>
        </div>
      )}
    </PfScrollFrame>
  )
}

function PinnedReelDemo() {
  return (
    <PfScrollFrame label="Pinned project reel preview (scrollable)" height={520}>
      {(ref) => (
        <div className="-mx-4 -my-4 sm:-mx-8 sm:-my-8">
          <p className="px-6 py-10 text-center text-sm text-zinc-700 dark:text-zinc-300">Scroll down — the reel pins and slides sideways ↓</p>
          <PinnedProjectReel scrollContainer={ref} height={440} titleAs="h2" />
          <p className="px-6 py-16 text-center text-sm text-zinc-700 dark:text-zinc-300">…and releases the page again.</p>
        </div>
      )}
    </PfScrollFrame>
  )
}

function ScrollTextFillDemo() {
  return (
    <PfScrollFrame label="Scroll text fill preview (scrollable)" height={480}>
      {(ref) => (
        <div className="mx-auto max-w-3xl">
          <p className="pb-48 pt-24 text-center text-sm text-zinc-700 dark:text-zinc-300">Scroll ↓ — the words light up as you read.</p>
          <ScrollTextFill scrollContainer={ref} />
          <div className="h-72" aria-hidden />
        </div>
      )}
    </PfScrollFrame>
  )
}

function XrayPoster({ bp }: { bp: boolean }) {
  const label = bp ? 'text-sky-300' : 'text-zinc-600 dark:text-zinc-400'
  return (
    <div className={`relative grid min-h-[400px] gap-6 p-6 sm:grid-cols-2 sm:p-10 ${bp ? 'bg-[#0a2540] text-sky-100 [background-image:linear-gradient(rgba(125,211,252,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,.2)_1px,transparent_1px)] [background-size:24px_24px]' : 'bg-white text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50'}`}>
      <div className="flex flex-col justify-center gap-4">
        <p className={`font-mono text-xs uppercase tracking-[0.2em] ${label}`}>{bp ? '[ label · 12px · +0.2em ]' : 'Studio notes — volume 04'}</p>
        <h2 className={`font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl ${bp ? 'text-transparent [-webkit-text-stroke:1px_#7dd3fc]' : ''}`}>Design is how it works.</h2>
        <p className={`max-w-sm text-base leading-relaxed ${bp ? 'text-sky-200' : 'text-zinc-700 dark:text-zinc-300'}`}>Every surface here is drawn twice — once for people, once for the people who build it. Move the lens to see the bones.</p>
        <div className="flex gap-3">
          <span className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium ${bp ? 'border border-dashed border-sky-300 text-sky-200' : 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950'}`}>Read the notes</span>
          <span className={`inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-medium ${bp ? 'border-dashed border-sky-300 text-sky-200' : 'border-zinc-300 dark:border-zinc-600'}`}>Archive</span>
        </div>
      </div>
      <div className={`relative min-h-48 overflow-hidden rounded-3xl ${bp ? 'border border-dashed border-sky-300' : ''}`}>
        <div className={bp ? 'opacity-0' : ''}><PortfolioArt seed={14} /></div>
        {bp && <><span className="absolute inset-0 [background:linear-gradient(to_top_right,transparent_calc(50%-1px),#7dd3fc_50%,transparent_calc(50%+1px)),linear-gradient(to_bottom_right,transparent_calc(50%-1px),#7dd3fc_50%,transparent_calc(50%+1px))] opacity-50" /><span className="absolute bottom-3 left-3 rounded bg-[#0a2540] px-2 py-1 font-mono text-[10px] text-sky-200">image · 4:3 · radius 24</span></>}
      </div>
    </div>
  )
}

function XrayDemo() {
  return <XrayLensCursor reveal={<XrayPoster bp />}><XrayPoster bp={false} /></XrayLensCursor>
}

function CharmDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <CharmText as="h2" />
      <CharmText variant="chip" className="text-[1.9rem] sm:text-[2.4rem]" segments={[
        'Currently building with ', { text: 'Motion', glyph: 'bolt', tone: 'amber', hint: 'animation library' }, ' and ', { text: 'Tailwind', glyph: 'drop', tone: 'sky', hint: 'styling' },
        ', shipping to ', { text: 'Postgres', glyph: 'leaf', tone: 'emerald', hint: 'database' }, ' by day and writing for the ', { text: 'night', glyph: 'moon', tone: 'violet', hint: 'side projects' }, ' crowd.',
      ]} />
    </div>
  )
}

function GrainGradientFieldDemo() {
  const [pal, setPal] = React.useState<'aurora' | 'ember' | 'lagoon' | 'orchid'>('aurora')
  const pals = ['aurora', 'ember', 'lagoon', 'orchid'] as const
  return (
    <div className="w-full max-w-4xl">
      <GrainGradientField palette={pal} className="min-h-[380px]">
        <div className="flex min-h-[380px] flex-col items-center justify-center px-5 py-10 text-center">
          <div className="max-w-lg rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/60 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">Backgrounds / grain gradient</p>
            <h3 className="mt-3 font-display text-4xl leading-[1.05] text-zinc-950 dark:text-zinc-50 sm:text-5xl">Colour with a little tooth.</h3>
            <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">Four slow blobs, real film grain and a light that follows you.</p>
            <div role="radiogroup" aria-label="Palette" className="mt-5 flex flex-wrap justify-center gap-2">
              {pals.map((p) => (
                <button key={p} type="button" role="radio" aria-checked={pal === p} onClick={() => setPal(p)} className={'min-h-11 rounded-full border px-4 text-sm font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal-600 dark:focus-visible:ring-signal-300 ' + (pal === p ? 'border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950' : 'border-zinc-300 bg-white/70 text-zinc-900 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100')}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </GrainGradientField>
    </div>
  )
}

function ThemeRevealToggleDemo() {
  const [dark, setDark] = React.useState(false)
  return (
    <div className={(dark ? 'dark' : 'light') + ' w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800'}>
      <div className="bg-stone-50 p-6 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400">Preview / {dark ? 'night' : 'day'}</p>
          <ThemeRevealToggle checked={dark} onCheckedChange={setDark} aria-label="Dark mode for this preview" />
        </div>
        <h3 className="mt-6 font-display text-4xl leading-[1.05] sm:text-5xl">{dark ? 'Lights down, work up.' : 'Morning, everyone.'}</h3>
        <p className="mt-3 max-w-md text-sm text-zinc-700 dark:text-zinc-300">The change blooms out of the switch as a circle. With reduced motion it simply swaps.</p>
        <div className="mt-6 flex gap-2">
          <span className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-950">Primary</span>
          <span className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700">Secondary</span>
        </div>
      </div>
    </div>
  )
}

function MiniDesktopDemo({ open = ['about'] }: { open?: string[] }) {
  const apps = [
    { id: 'about', title: 'About', icon: <P2User className="size-5" />, tone: 'sky' as const, size: { w: 360, h: 260 }, content: (
      <div className="space-y-2"><p className="font-display text-2xl leading-tight">Hello — I build calm, quick interfaces.</p><p className="text-zinc-600 dark:text-zinc-400">Ten years across product design and front-end. Currently open to one or two new collaborations.</p></div>
    ) },
    { id: 'work', title: 'Work', icon: <P2Folder className="size-5" />, tone: 'amber' as const, size: { w: 420, h: 300 }, content: (
      <ul className="grid grid-cols-2 gap-3">{SAMPLE_PROJECTS.slice(0, 4).map((p) => (<li key={p.id} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"><div className="aspect-[4/3]"><PortfolioArt seed={p.seed} /></div><p className="px-2 py-1.5 text-xs font-medium">{p.title}</p></li>))}</ul>
    ) },
    { id: 'notes', title: 'Notes', icon: <P2Pen className="size-5" />, tone: 'emerald' as const, size: { w: 340, h: 250 }, content: (
      <ul className="list-disc space-y-1.5 pl-4 text-zinc-700 dark:text-zinc-300"><li>Ship the small thing today.</li><li>Easing is half the personality.</li><li>Write the empty state first.</li></ul>
    ) },
    { id: 'mail', title: 'Mail', icon: <P2Mail className="size-5" />, tone: 'rose' as const, size: { w: 340, h: 220 }, content: (
      <div className="space-y-3"><p>Say hello — replies within a day.</p><a href="mailto:hello@example.com" className="inline-flex min-h-11 items-center rounded-full bg-zinc-950 px-4 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:bg-zinc-50 dark:text-zinc-950">hello@example.com</a></div>
    ) },
  ]
  return <MiniDesktopOS apps={apps} defaultOpen={open} />
}

function LoginGateDemo() {
  return (
    <LoginGateIntro name="Guest Studio" role="Design engineer" className="max-w-5xl" onEnter={() => undefined}>
      <MiniDesktopDemo open={['about', 'work']} />
    </LoginGateIntro>
  )
}

const portfolio2Demos: Record<string, React.ReactNode> = {
  'year-activity-grid': <YearActivityGrid />,
  'now-playing-widget': <NowPlayingWidget />,
  'world-clock-globe': <WorldClockGlobe />,
  'bento-profile-board': <BentoProfileBoard headingAs="h2" />,
  'scatter-desk-collage': <ScatterDeskCollage />,
  'kudos-wall': <KudosWall />,
  'book-spine-shelf': <BookSpineShelf />,
  'mesh-project-cards': <MeshProjectCards titleAs="h2" />,
  'command-menu': <CommandMenuDemo />,
  'island-section-nav': <IslandNavDemo />,
  'sticky-card-stack': <StickyStackDemo />,
  'pinned-project-reel': <PinnedReelDemo />,
  'scroll-text-fill': <ScrollTextFillDemo />,
  'xray-lens-cursor': <XrayDemo />,
  'charm-text': <CharmDemo />,
  'big-type-footer': <BigTypeFooter timeZone="Europe/Lisbon" />,
  'grain-gradient-field': <GrainGradientFieldDemo />,
  'theme-reveal-toggle': <ThemeRevealToggleDemo />,
  'mini-desktop-os': <MiniDesktopDemo />,
  'login-gate-intro': <LoginGateDemo />,
  'route-chooser-hero': <RouteChooserHero />,
  'discovery-scene': <DiscoveryScene />,
}
// p2-demos:end

function HourglassDemo() {
  const [p, setP] = React.useState(12)
  React.useEffect(() => {
    const t = window.setInterval(() => setP((v) => (v >= 100 ? 0 : Math.min(100, v + 7))), 900)
    return () => window.clearInterval(t)
  }, [])
  return (
    <div className="flex flex-wrap items-end justify-center gap-14">
      <HourglassLoader />
      <HourglassLoader progress={p} accent="#c2410c" label={p >= 100 ? 'Backup restored' : 'Restoring your backup…'} />
    </div>
  )
}


function SignalBeamDemo() {
  return <SignalBeamDiagram />
}

function HorizonGridDemo() {
  return (
    <HorizonGridField className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-300">Now in beta</p>
      <h3 className="mx-auto mt-3 max-w-md text-balance text-4xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-5xl dark:text-white">The road to launch, already paved</h3>
      <p className="mx-auto mt-3 max-w-sm text-pretty text-sm text-zinc-700 dark:text-zinc-300">Preview, review and ship from one calm workspace.</p>
    </HorizonGridField>
  )
}

function FlickerDotDemo() {
  const [shape, setShape] = React.useState<'square' | 'dot'>('square')
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3">
      <FlickerDotField shape={shape} flicker={shape === 'dot' ? 0.25 : 0.5}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-signal-700 dark:text-signal-300">Status</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-5xl dark:text-white">All systems normal</h3>
        <p className="mt-2 text-sm tabular-nums text-zinc-700 dark:text-zinc-300">99.99% uptime · last incident 41 days ago</p>
      </FlickerDotField>
      <div role="radiogroup" aria-label="Mark shape" onKeyDown={handleTablistKeys} className="inline-flex rounded-full bg-black/[0.04] p-1 dark:bg-white/[0.06]">
        {(['square', 'dot'] as const).map((s) => (
          <button key={s} type="button" role="radio" aria-checked={shape === s} tabIndex={shape === s ? 0 : -1} onClick={() => setShape(s)} className={'min-h-11 rounded-full px-4 text-xs font-medium capitalize transition-colors ' + (shape === s ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-700 dark:text-zinc-300')}>
            {s === 'square' ? 'LED squares' : 'Dot pattern'}
          </button>
        ))}
      </div>
    </div>
  )
}

function DeviceFrameDemo() {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:items-end md:justify-center">
      <DeviceFrame className="md:max-w-xl" />
      <DeviceFrame variant="phone" className="w-[220px]" />
    </div>
  )
}


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

const productUiDemos: Record<string, React.ReactNode> = {
  'glass-segmented-control': <SegmentedDemo />,
  'dynamic-status-island': <DynamicStatusIsland defaultState="uploading" />,
  'detent-sheet': <DetentSheet />,
  'vibrancy-context-menu': <VibrancyContextMenu />,
  'deploy-timeline': <DeployTimeline />,
  'usage-quota-meter': <UsageQuotaMeter />,
  'onboarding-stepper': <OnboardingStepper />,
  'sortable-data-table': <SortableDataTable />,
  'date-range-picker': <DateRangePicker />,
  'feedback-state-panel': <FeedbackStatePanel showSwitcher />,
  'kbd-shortcut-hint': <KbdShortcutHint />,
  'inset-settings-list': <InsetSettingsList />,
  'rolling-number-stepper': <RollingNumberStepper />,
  'file-drop-uploader': <FileDropUploader />,
}

const magicBatchDemos: Record<string, React.ReactNode> = {
  'signal-beam-diagram': <SignalBeamDemo />,
  'feature-bento-grid': <FeatureBentoGrid />,
  'live-feed-stack': <LiveFeedStack />,
  'file-tree-explorer': <FileTreeExplorer />,
  'device-frame': <DeviceFrameDemo />,
  'avatar-stack': <div className="pb-40 pt-16"><AvatarStack /></div>,
  'neon-halo-card': <NeonHaloCard />,
  'horizon-grid-field': <HorizonGridDemo />,
  'flicker-dot-field': <FlickerDotDemo />,
  'confetti-burst-button': <ConfettiBurstButton />,
  'video-lightbox-dialog': <VideoLightboxDialog />,
  'word-cycle-text': <WordCycleText />,
  'highlight-marker-text': <HighlightMarkerText />,
  'velocity-marquee': <VelocityMarquee className="max-w-4xl" />,
  'sparkle-text': <p className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">Make it <SparkleText className="text-[1em] sm:text-[1em]" /></p>,
}

const batchFolderDemos: Record<string, React.ReactNode> = {
  'folder-fan-showcase': <FolderFanShowcase className="max-w-4xl" />,
  'swipe-carousel-post': <SwipeCarouselPost />,
  'editorial-spread-card': <EditorialSpreadCard />,
  'tear-stub-boarding-pass': <TearStubBoardingPass />,
  'wax-seal-button': (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <WaxSealButton />
      <WaxSealButton monogram="AR" accent="#1e3a8a" label="Seal the contract" sealedLabel="Contract sealed" />
    </div>
  ),
  'ink-bleed-text': (
    <div className="w-full max-w-2xl rounded-3xl bg-[#faf6ef] px-6 py-10 ring-1 ring-black/[0.05] sm:px-10 dark:bg-zinc-950 dark:ring-white/[0.07]">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-800 dark:text-rose-300">Issue 12 · Essay</p>
      <InkBleedText showReplay={false} />
      <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">Notes on why the best products feel inevitable in hindsight, and painfully slow while you are building them.</p>
      <p className="mt-6 text-[12px] text-zinc-600 dark:text-zinc-400">Use ↻ Replay above to bleed it again.</p>
    </div>
  ),
  'paper-fold-accordion': <PaperFoldAccordion />,
  'dealer-deck-testimonials': <DealerDeckTestimonials className="max-w-3xl" />,
  'swing-price-tag': <SwingPriceTag />,
  'hourglass-loader': <HourglassDemo />,
  'signature-pad-field': <SignaturePadField />,
  'receipt-print-toast': <ReceiptPrintToast receipt={DEFAULT_RECEIPTS[0]} />,
  // batch-folder:demos
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-zinc-950/[0.04] ring-1 ring-zinc-950/[0.06] dark:bg-white/[0.06] dark:ring-white/10">
          <UpBranch aria-hidden className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
        </div>
        <CardTitle>Preview deployments</CardTitle>
        <CardDescription>Every push gets its own URL, so reviews happen on the real thing.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          {['Comments on any element', 'Automatic HTTPS', 'Instant rollback'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <UpCheck aria-hidden className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              {t}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-between border-t border-zinc-950/[0.06] pt-4 dark:border-white/[0.08]">
        <span className="text-[13px] tabular-nums text-zinc-500 dark:text-zinc-400">12 previews this week</span>
        <Button size="sm">Open</Button>
      </CardFooter>
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
  'magnetic-button': (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <MagneticButton>
        Get started <UpArrow aria-hidden className="h-4 w-4" />
      </MagneticButton>
      <MagneticButton variant="glass">View docs</MagneticButton>
    </div>
  ),
  'spotlight-card': (
    <SpotlightCard className="w-full max-w-sm">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-framekit-500/10 ring-1 ring-framekit-500/20">
        <UpGauge aria-hidden className="h-5 w-5 text-framekit-600 dark:text-framekit-400" />
      </div>
      <h3 className="text-[17px] font-semibold tracking-[-0.012em]">Edge-fast by default</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Pages render close to your visitors, with a median time-to-first-byte under 50&nbsp;ms.
      </p>
      <a href="#/docs/spotlight-card" className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-md text-sm font-medium text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-600 dark:text-white dark:focus-visible:ring-signal-300">
        Learn more <UpArrow aria-hidden className="h-4 w-4" />
      </a>
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
    <TiltCard className="w-full max-w-xs">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">Member</p>
        <span className="h-6 w-9 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 ring-1 ring-amber-500/30" aria-hidden />
      </div>
      <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em]">Framekit Pro</h3>
      <p className="mt-1 font-mono text-[13px] tabular-nums text-zinc-500 dark:text-zinc-400">•••• 2048 · 09/29</p>
    </TiltCard>
  ),
  'aurora-background': (
    <AuroraBackground className="flex h-40 w-full max-w-lg items-center justify-center">
      <p className="text-lg font-semibold text-zinc-900 dark:text-white">Aurora skies</p>
    </AuroraBackground>
  ),
  'infinite-marquee': (
    <div className="w-full max-w-lg space-y-3">
      <InfiniteMarquee className="py-1" speed={26} gap={12} label="Highlights">
        {['Motion', 'Tailwind v4', 'React 19', 'Accessible', 'Copy-paste', 'MIT licensed'].map((t, i) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-zinc-800 ring-1 ring-zinc-950/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-zinc-900 dark:text-zinc-200 dark:ring-white/10"
          >
            <span aria-hidden className={['bg-framekit-500', 'bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][i] + ' h-1.5 w-1.5 rounded-full'} />
            {t}
          </span>
        ))}
      </InfiniteMarquee>
      <InfiniteMarquee className="py-1" speed={32} gap={12} reverse showControls label="Integrations">
        {['Dark mode', 'Reduced motion', 'Keyboard first', 'Zero runtime', 'shadcn CLI', 'Type-safe'].map((t) => (
          <span
            key={t}
            className="inline-flex items-center rounded-full bg-zinc-950/[0.04] px-3.5 py-1.5 text-[13px] text-zinc-600 ring-1 ring-zinc-950/[0.05] dark:bg-white/[0.05] dark:text-zinc-300 dark:ring-white/[0.06]"
          >
            {t}
          </span>
        ))}
      </InfiniteMarquee>
    </div>
  ),
  'number-ticker': (
    <dl className="grid w-full max-w-xl grid-cols-1 divide-y divide-zinc-950/[0.07] rounded-2xl bg-white ring-1 ring-zinc-950/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/[0.08] dark:bg-zinc-900/60 dark:ring-white/[0.08]">
      {[
        { v: 12840, label: 'components shipped', d: 0, p: '', s: '' },
        { v: 99.98, label: 'uptime, last 90 days', d: 2, p: '', s: '%' },
        { v: 4.2, label: 'installs per month', d: 1, p: '', s: 'M' },
      ].map((x, i) => (
        <div key={x.label} className="px-6 py-5 text-center sm:text-left">
          <dt className="text-[13px] text-zinc-500 dark:text-zinc-400">{x.label}</dt>
          <dd className="mt-1 text-4xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
            <NumberTicker value={x.v} decimals={x.d} prefix={x.p} suffix={x.s} delay={i * 120} />
          </dd>
        </div>
      ))}
    </dl>
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
    <BorderBeam className="w-full max-w-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 text-[13px] font-medium text-framekit-700 dark:text-framekit-300">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inset-0 rounded-full bg-framekit-500 motion-safe:animate-ping" />
            <span className="relative h-2 w-2 rounded-full bg-framekit-500" />
          </span>
          Live
        </div>
        <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.012em]">Launch week, day 3</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">Streaming now — new primitives for motion and layout.</p>
      </div>
    </BorderBeam>
  ),
  'morphing-text': (
    <p className="text-4xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
      Build{' '}
      <MorphingText className="text-framekit-600 dark:text-framekit-400" phrases={['faster', 'bolder', 'yours', 'animated']} />
    </p>
  ),
  'spark-button': <SparkButton>Click for sparks</SparkButton>,
  'cursor-trail': <CursorTrail className="w-full max-w-lg" />,
  'glass-card': (
    <div
      className="relative w-full max-w-lg overflow-hidden rounded-[32px] p-6 sm:p-12"
      style={{
        background:
          'radial-gradient(40% 50% at 20% 25%, #fb923c, transparent 70%), radial-gradient(45% 55% at 85% 20%, #e879f9, transparent 70%), radial-gradient(50% 60% at 70% 95%, #6366f1, transparent 70%), linear-gradient(135deg, #f97316, #c026d3 50%, #3730a3)',
      }}
    >
      <div aria-hidden className="absolute top-8 left-10 h-28 w-28 rounded-full bg-amber-200/80 blur-[2px]" />
      <GlassCard className="relative mx-auto max-w-xs">
        <div className="flex items-center gap-2 text-[13px] font-medium text-white/85">
          <UpTimer aria-hidden className="h-4 w-4" /> Focus
        </div>
        <p className="mt-2 text-5xl font-semibold tracking-[-0.03em] tabular-nums text-white">24:59</p>
        <p className="mt-1 text-sm text-white/80">Deep work · session 2 of 4</p>
        <div className="mt-5 flex gap-2">
          <button type="button" aria-label="Pause" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/30 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <UpPause aria-hidden className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Skip" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <UpSkip aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </GlassCard>
    </div>
  ),
  'swipe-cards': (
    <SwipeCards
      cards={[
        { id: '1', title: 'Ember', subtitle: 'Warm accent tones', color: 'linear-gradient(160deg, #fb923c, #c2410c)' },
        { id: '2', title: 'Volt', subtitle: 'Electric accents', color: 'linear-gradient(160deg, #a78bfa, #6d28d9)' },
        { id: '3', title: 'Ion', subtitle: 'Cool contrast', color: 'linear-gradient(160deg, #60a5fa, #1d4ed8)' },
        { id: '4', title: 'Moss', subtitle: 'Grounded neutrals', color: 'linear-gradient(160deg, #6ee7b7, #047857)' },
      ]}
    />
  ),
  typewriter: (
    <Typewriter
      className="text-xl font-medium"
      phrases={['Framekit UI', 'Own your components', 'Ship with motion']}
    />
  ),
  'pixel-reveal': (
    <PixelReveal className="w-full max-w-md" pattern="diagonal" showReplay>
      <div className="flex h-full flex-col justify-end p-5 text-white">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase opacity-85">Collection</p>
        <p className="text-xl font-semibold tracking-[-0.02em] [text-shadow:0_1px_12px_rgba(0,0,0,0.3)]">Golden hour, generated</p>
      </div>
    </PixelReveal>
  ),
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
      <p className="text-sm font-medium tracking-[0.2em] text-signal-800/80 dark:text-white/80">PRISM TIDAL</p>
    </PrismTidalField>
  ),
  'constellation-breathing-grid': (
    <ConstellationBreathingGrid className="flex h-56 w-full max-w-xl items-center justify-center">
      <p className="rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-white/70">constellation</p>
    </ConstellationBreathingGrid>
  ),
  'paperfold-gradient-plane': (
    <PaperfoldGradientPlane className="flex h-56 w-full max-w-xl items-center justify-center">
      <p className="rounded-xl bg-white/50 px-4 py-2 text-sm font-medium text-zinc-800 backdrop-blur dark:bg-black/40 dark:text-zinc-100">Paperfold</p>
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
      <p className="text-xs tracking-[0.2em] text-signal-700 dark:text-signal-200">SILK SHEAR</p>
    </SilkShearField>
  ),
  'void-lattice-drift': (
    <VoidLatticeDrift className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-zinc-500 dark:text-white/50">VOID LATTICE</p>
    </VoidLatticeDrift>
  ),
  'ember-drift': (
    <EmberDrift className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-amber-800/70 dark:text-amber-100/70">EMBER DRIFT</p>
    </EmberDrift>
  ),
  'chromatic-mist': (
    <ChromaticMist className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-zinc-600 dark:text-zinc-300">CHROMATIC MIST</p>
    </ChromaticMist>
  ),
  'pulse-rings': (
    <PulseRings className="flex h-56 w-full max-w-xl items-end p-6">
      <p className="text-xs tracking-[0.2em] text-signal-700 dark:text-signal-200">PULSE RINGS</p>
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
    <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-zinc-950/80 dark:ring-0 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Stage · Prism</p>
      <PrismSweepShimmer className="w-full" />
    </div>
  ),
  'mercury-vein-shimmer': (
    <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 p-6 dark:bg-zinc-950/80">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Stage · Mercury</p>
      <MercuryVeinShimmer className="w-full" />
    </div>
  ),
  'glyph-aurora-shimmer': (
    <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-zinc-950/80 dark:ring-0 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Stage · Aurora</p>
      <GlyphAuroraShimmer />
    </div>
  ),
  'edge-flare-shimmer': (
    <div className="flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-zinc-950/80 dark:ring-0 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Stage · Edge flare</p>
      <EdgeFlareShimmer className="w-full" />
    </div>
  ),
  'skeleton-wave-shimmer': (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#121018] dark:ring-0 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Loading · Skeleton wave</p>
      <SkeletonWaveShimmer className="w-full" />
    </div>
  ),
  'card-sheen-loader': (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-200 p-8 dark:from-[#121018] dark:to-zinc-950">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Loading · Card sheen</p>
      <CardSheenLoader />
    </div>
  ),
  'list-bloom-shimmer': (
    <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#121018] dark:ring-0 p-6">
      <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Loading · List bloom</p>
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
    <div className="w-full max-w-md rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#07060c] dark:ring-0 p-3">
      <ParallaxReelScroll className="w-full" />
    </div>
  ),
  'snap-magnet-scroll': (
    <div className="w-full max-w-md rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#07060c] dark:ring-0 p-3">
      <SnapMagnetScroll className="w-full" />
    </div>
  ),
  'velocity-fade-stack': (
    <div className="w-full max-w-md rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#07060c] dark:ring-0 p-3">
      <VelocityFadeStack className="w-full" />
    </div>
  ),
  'hologram-flip-card': <HologramFlipCard />,
  'liquid-morph-card': <LiquidMorphCard />,
  'gravity-expand-card': <GravityExpandCard />,

  'rail-bloom-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#121018] dark:ring-0 p-6">
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
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Agent handoff</p>
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
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#0c0a12] dark:ring-0 p-10">
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
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#0c0a12] dark:ring-0 p-8">
      <PrismMeshOrb />
    </div>
  ),
  'liquid-metal-orb': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#0c0a12] dark:ring-0 p-8">
      <LiquidMetalOrb />
    </div>
  ),
  'aurora-core-orb': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#0c0a12] dark:ring-0 p-8">
      <AuroraCoreOrb />
    </div>
  ),
  'particle-halo-orb': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#0c0a12] dark:ring-0 p-8">
      <ParticleHaloOrb />
    </div>
  ),
  'ribbon-helix-wave': (
    <div className="w-full max-w-lg p-2">
      <RibbonHelixWave />
    </div>
  ),
  'radial-sonar-wave': (
    <div className="flex w-full max-w-sm justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#0c0a12] dark:ring-0 p-6">
      <RadialSonarWave />
    </div>
  ),
  'media-carousel-bubble': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#121018] dark:ring-0 p-6">
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
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#121018] dark:ring-0 p-6">
      <GlassWorkspaceSidebar />
    </div>
  ),
  'timeline-rail-sidebar': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#121018] dark:ring-0 p-4">
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
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-zinc-100/80 ring-1 ring-black/[0.04] dark:bg-[#121018] dark:ring-0 p-4">
      <OrbitSwitcherSidebar />
    </div>
  ),

  'dispatch-truck-button': (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <DispatchTruckButton />
    </div>
  ),
  'drop-in-cart-button': (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <DropInCartButton />
    </div>
  ),
  'fill-progress-download-button': (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <FillProgressDownloadButton fileName="framekit-brand-kit.zip · 24.6 MB" />
    </div>
  ),
  'swallow-delete-button': (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-6 rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_100%_at_50%_0%,#1b1924,#0c0b10)] px-6 py-12 ring-1 ring-black/[0.06] dark:ring-white/5">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <SwallowDeleteButton variant="violet" />
        <SwallowDeleteButton variant="neutral" label="Remove" />
        <SwallowDeleteButton variant="danger" label="Discard" confirm />
      </div>
    </div>
  ),
  'lens-reveal-404': <LensReveal404 className="w-full max-w-2xl" homeHref="/" />,
  'flip-checkout-card': (
    <div className="flex w-full max-w-lg justify-center rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff,#f0eff4)] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_16px_40px_-24px_rgb(24_24_27/0.25)] dark:shadow-none dark:bg-[radial-gradient(120%_90%_at_50%_0%,#221d33,#0b0a10)] px-4 py-10 ring-1 ring-black/[0.06] dark:ring-white/5">
      <FlipCheckoutCard />
    </div>
  ),
  'particle-morph-loader': <ParticleMorphLoaderDemo />,
  'snake-loader': <SnakeLoaderDemo />,
  'face-scan-pay-button': <FaceScanPayDemo />,
  'orbit-dot-export-button': <OrbitDotExportDemo />,
  'shredder-delete-button': <ShredderDeleteDemo />,
  'cloud-launch-publish-button': <CloudLaunchDemo />,
  'radial-share-menu': <RadialShareDemo />,
  'glow-arc-hero': <GlowArcHero className="max-w-3xl" />,
  'glow-leaderboard-list': <GlowLeaderboardList />,
  'podium-stack-leaderboard': <PodiumStackLeaderboard />,
  'curved-tile-wall': <CurvedTileWall className="max-w-3xl" />,
  'fan-deck-carousel': <FanDeckCarousel className="max-w-3xl" />,
  'glass-bubble-buddy': <GlassBubbleBuddyDemo />,
  'mesh-pill-orb': <MeshPillOrbDemo />,
  'star-morph-buddy': <StarMorphBuddyDemo />,
  'loop-flight-send-button': <LoopFlightSendDemo />,
  'liquid-charge-capsule': <LiquidChargeDemo />,
  'ghost-gobbler-skull': <GhostGobblerDemo />,
  'split-flap-hero': <SplitFlapHero className="max-w-3xl" />,
  'ridgeline-horizon-hero': <RidgelineHorizonHero className="max-w-3xl" />,
  'tumbler-lock-otp': <TumblerLockDemo />,
  'crystal-strength-password': <CrystalStrengthPassword />,
  'origami-unfold-card': <OrigamiUnfoldDemo />,
  'lenticular-shift-card': <LenticularShiftCard />,
  'tumble-letters': <TumbleLetters autoDrop={1600} />,
  'plucked-string-tabs': <PluckedStringTabs />,
  'iron-filings-field': <IronFilingsDemo />,
  'pull-cord-lamp-toggle': <PullCordLampToggle />,
  'seat-scale-pricing': <SeatScaleDemo />,
  'polar-bloom-chart': <PolarBloomDemo />,
  ...portfolioDemos,
  ...portfolio2Demos,
  ...batchFolderDemos,
  ...magicBatchDemos,
  ...productUiDemos,
}
