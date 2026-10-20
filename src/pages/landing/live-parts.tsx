import * as React from 'react'

/* Heavy demos load on demand (their own chunks), and only mount near the viewport (<Live>). */
export const lazyNamed = <K extends string>(load: () => Promise<Record<K, React.ComponentType<any>>>, name: K) =>
  React.lazy(() => load().then((m) => ({ default: m[name] })))
export const ParticleMorphLoader = lazyNamed(() => import('@/components/ui/particle-morph-loader'), 'ParticleMorphLoader')
export const LiquidMetalOrb = lazyNamed(() => import('@/components/ui/liquid-metal-orb'), 'LiquidMetalOrb')
export const AuroraCoreOrb = lazyNamed(() => import('@/components/ui/aurora-core-orb'), 'AuroraCoreOrb')
export const StarMorphBuddy = lazyNamed(() => import('@/components/ui/star-morph-buddy'), 'StarMorphBuddy')
export const ShredderDeleteButton = lazyNamed(() => import('@/components/ui/shredder-delete-button'), 'ShredderDeleteButton')
export const PullCordLampToggle = lazyNamed(() => import('@/components/ui/pull-cord-lamp-toggle'), 'PullCordLampToggle')
export const ParticleHaloOrb = lazyNamed(() => import('@/components/ui/particle-halo-orb'), 'ParticleHaloOrb')
export const MothLanternToggle = lazyNamed(() => import('@/components/ui/moth-lantern-toggle'), 'MothLanternToggle')
export const CosmicSparkleToggle = lazyNamed(() => import('@/components/ui/cosmic-sparkle-toggle'), 'CosmicSparkleToggle')
export const WatchfulEyeToggle = lazyNamed(() => import('@/components/ui/watchful-eye-toggle'), 'WatchfulEyeToggle')
export const InkBloomToggle = lazyNamed(() => import('@/components/ui/ink-bloom-toggle'), 'InkBloomToggle')
export const WeatherVaneToggle = lazyNamed(() => import('@/components/ui/weather-vane-toggle'), 'WeatherVaneToggle')
export const TideglassToggle = lazyNamed(() => import('@/components/ui/tideglass-toggle'), 'TideglassToggle')

export const GhostGobblerSkull = lazyNamed(() => import('@/components/ui/ghost-gobbler-skull'), 'GhostGobblerSkull')
