import { GithubIcon } from '@/components/icons'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Moon, Sun } from 'lucide-react'
import { SITE } from '@/config/site'
import { useThemeToggle } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { NumberTicker } from '@/components/ui/number-ticker'
import { componentDocs } from '@/docs/registry'
import { PrismTidalField } from '@/components/ui/prism-tidal-field'
import { ConstellationBreathingGrid } from '@/components/ui/constellation-breathing-grid'
import { PaperfoldGradientPlane } from '@/components/ui/paperfold-gradient-plane'
import { OrbitCommit } from '@/components/ui/orbit-commit'
import { InklineAction } from '@/components/ui/inkline-action'
import { FocusBloomButton } from '@/components/ui/focus-bloom-button'
import { TideDeck } from '@/components/ui/tide-deck'
import { WindowpaneStoryCard } from '@/components/ui/windowpane-story-card'
import { Wordloom } from '@/components/ui/wordloom'
import { GlyphWeather } from '@/components/ui/glyph-weather'
import { MomentumCaption } from '@/components/ui/momentum-caption'
import { HaloMenu } from '@/components/ui/halo-menu'
import { SignalPebble } from '@/components/ui/signal-pebble'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { MothLanternToggle } from '@/components/ui/moth-lantern-toggle'
import { LiquidFillButton } from '@/components/ui/liquid-fill-button'
import { RibbonTrailCursor } from '@/components/ui/ribbon-trail-cursor'
import { RadialToolburst } from '@/components/ui/radial-toolburst'
import { SilkShearField } from '@/components/ui/silk-shear-field'
import { GooglyGazeButton } from '@/components/ui/googly-gaze-button'
import { GlassOrbSwitch } from '@/components/ui/glass-orb-switch'
import { DayNightCapsule } from '@/components/ui/day-night-capsule'
import { WatchfulEyeToggle } from '@/components/ui/watchful-eye-toggle'

export function LandingPage() {
  const { theme, toggle } = useThemeToggle()
  const navigate = useNavigate()
  const signatureCount = componentDocs.filter((c) => c.isNew).length

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-950 dark:bg-[#0c0c0c] dark:text-zinc-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-[11px] font-bold tracking-wide text-signal-300 dark:bg-zinc-100 dark:text-signal-800">
            F
          </span>
          <span className="text-sm font-semibold tracking-tight">{SITE.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={toggle} className="rounded-lg p-2 hover:bg-zinc-200/60 dark:hover:bg-zinc-800" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a href={SITE.github} className="rounded-lg p-2 hover:bg-zinc-200/60 dark:hover:bg-zinc-800" aria-label="GitHub" target="_blank" rel="noreferrer">
            <GithubIcon className="h-4 w-4" />
          </a>
          <Link to="/docs/introduction" className="ml-1">
            <Button size="sm" className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900">
              Docs
            </Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <p className="mb-5 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
          Open source · MIT · Copy-paste
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-7xl dark:text-white">
          Components that{' '}
          <span className="italic text-signal-600 dark:text-signal-300" style={{ fontFamily: 'var(--font-display)' }}>
            feel alive
          </span>
          .
        </h1>
        <p className="mt-6 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
          Editorial surfaces, lilac signal accents, and physically motivated motion — ship as original source you own.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <MagneticButton onClick={() => navigate('/docs/watchful-eye-toggle')}>Explore toggles</MagneticButton>
          <Link to="/docs/installation">
            <Button variant="outline" className="gap-2 rounded-full">
              Install guide <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-8 text-sm text-zinc-500">
          <div>
            <NumberTicker value={componentDocs.length} className="text-2xl font-semibold text-zinc-900 dark:text-white" /> components
          </div>
          <div>
            <NumberTicker value={signatureCount} className="text-2xl font-semibold text-zinc-900 dark:text-white" /> signature originals
          </div>
          <SignalPebble status="idle" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="flex flex-wrap gap-2">
          {[
            { to: '/docs/watchful-eye-toggle', label: 'Toggles' },
            { to: '/docs/liquid-fill-button', label: 'Buttons' },
            { to: '/docs/silk-shear-field', label: 'Backgrounds' },
            { to: '/docs/glyph-weather', label: 'Text' },
            { to: '/docs/tide-deck', label: 'Cards' },
            { to: '/docs/ribbon-trail-cursor', label: 'Cursors' },
          ].map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-signal-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      
      <section className="border-y border-zinc-200/80 bg-white/60 py-14 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">Five categories · five heroes</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Best unique motion, by category</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link to="/docs/silk-shear-field" className="group block overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <SilkShearField className="h-44">
                <div className="flex h-full items-end p-4"><span className="text-xs text-signal-200">Backgrounds · Silk Shear</span></div>
              </SilkShearField>
            </Link>
            <Link to="/docs/radial-toolburst" className="flex h-44 flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">Navigation</p>
              <RadialToolburst />
            </Link>
            <Link to="/docs/ribbon-trail-cursor" className="block overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <p className="px-4 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">Cursors</p>
              <RibbonTrailCursor className="border-0" />
            </Link>
            <Link to="/docs/liquid-fill-button" className="flex h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">Buttons</p>
              <LiquidFillButton>Liquid fill</LiquidFillButton>
            </Link>
            <Link to="/docs/watchful-eye-toggle" className="flex h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-[#f7f5f0] md:col-span-2 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal-600">Toggles · hero</p>
              <div className="flex items-center gap-8">
                <WatchfulEyeToggle defaultChecked aria-label="Watchful eye" />
                <MothLanternToggle defaultChecked />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Live showcase grid */}
      <section className="border-y border-zinc-200/80 bg-white/50 py-14 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">Showcase</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">Motion you can feel</h2>
            </div>
            <Link to="/docs/orbit-commit" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
              View all →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="flex min-h-[240px] flex-col items-center justify-center gap-6 rounded-2xl border border-zinc-200 bg-white p-6 md:col-span-2 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-600">Toggles</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <WatchfulEyeToggle defaultChecked aria-label="Watchful eye demo" />
                <DayNightCapsule defaultChecked={false} />
                <GlassOrbSwitch defaultChecked />
              </div>
              <p className="text-center text-sm text-zinc-500">Watchful Eye · Day Night Capsule · Glass Orb — click to play.</p>
              <GooglyGazeButton />
            </div>

            <PrismTidalField className="min-h-[240px] md:col-span-2">
              <div className="flex h-full min-h-[240px] flex-col items-start justify-end p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal-300">Prism Tidal Field</p>
                <p className="mt-2 max-w-md text-lg text-white/90">Move the cursor — tides lean into your velocity.</p>
              </div>
            </PrismTidalField>

            <ConstellationBreathingGrid className="min-h-[220px]">
              <div className="flex h-full min-h-[220px] items-end p-6">
                <p className="text-sm text-white/70">Constellation Breathing Grid</p>
              </div>
            </ConstellationBreathingGrid>

            <PaperfoldGradientPlane className="min-h-[220px]">
              <div className="flex h-full min-h-[220px] items-end p-6">
                <p className="text-sm text-zinc-700">Paperfold Gradient Plane</p>
              </div>
            </PaperfoldGradientPlane>

            <div className="flex min-h-[220px] flex-col items-center justify-center gap-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <OrbitCommit />
              <div className="flex flex-wrap items-center justify-center gap-4">
                <InklineAction>Inkline Action</InklineAction>
                <FocusBloomButton>Focus Bloom</FocusBloomButton>
              </div>
            </div>

            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-zinc-200 bg-[#f3f2ef] p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <TideDeck
                cards={[
                  { id: '1', title: 'North swell', body: 'Corners soften with speed.', tone: '#f7f5fb' },
                  { id: '2', title: 'Cross current', body: 'Drag to feel the tide.', tone: '#eef3f8' },
                  { id: '3', title: 'Quiet cove', body: 'Keyboard next/prev ready.', tone: '#f6efe8' },
                ]}
              />
            </div>

            <WindowpaneStoryCard
              className="min-h-[220px]"
              title="Windowpane Story"
              summary="Frosted content slides to reveal evidence."
              evidence={<p className="text-sm">Mapped pulse · lilac contour · 14:02</p>}
            />

            <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <GlyphWeather text="GLYPH WEATHER" />
              <Wordloom words={['systems', 'rituals', 'signals', 'weather']} />
              <MomentumCaption>Sweep fast — this caption keeps a little inertia.</MomentumCaption>
            </div>

            <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
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
              <SignalPebble status="mapping" progress={40} />
            </div>

            <SpotlightCard className="min-h-[180px] md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-signal-600">Also in the kit</p>
              <h3 className="mt-2 text-xl font-semibold">Magnetic Button · Spotlight · Scramble · Border Beam</h3>
              <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                Existing animated pieces stay polished and copy-paste ready — the Signature set sits above them as landing-page showpieces.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'One gesture, one sentence', body: 'Every Signature demo wears a caption that tells you exactly how to play.' },
            { title: 'Lilac as signal', body: 'Near-black type, off-white stages, and #D4CBE5 used like a status LED — never a flood fill.' },
            { title: 'Own the source', body: 'Copy the file. No runtime lock-in. Reduced-motion fallbacks built in.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <h3 className="font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800">
        {SITE.name} · {SITE.license} · v{SITE.version}
      </footer>
    </div>
  )
}
