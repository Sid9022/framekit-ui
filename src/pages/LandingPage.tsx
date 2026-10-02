import * as React from 'react'
import { GithubIcon } from '@/components/icons'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SITE } from '@/config/site'
import { Button } from '@/components/ui/button'
import { NumberTicker } from '@/components/ui/number-ticker'
import { categorySlug, componentDocs, getNavGroups } from '@/docs/registry'
import { BrandLink, SearchTrigger, ThemeToggleButton, iconBtn } from '@/components/docs/chrome'
import { LazyMount } from '@/components/docs/lazy-mount'
import { CopyButton, registryItemUrl } from '@/components/docs/install-block'
import { cn } from '@/lib/cn'
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

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-400'

const wordIn: Variants = {
  hidden: { opacity: 0, y: '0.5em', filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}
const heroStagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const MotionLink = motion.create(Link)

/** A demo tile with a real link to its docs (links never wrap live, interactive demos). */
function Tile({ to, label, children, className }: { to: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-[border-color,box-shadow] duration-300 hover:border-signal-400 hover:shadow-[0_18px_40px_-24px_rgb(100_82_122/0.5)] dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-signal-500', className)}>
      {children}
      <Link
        to={to}
        className="absolute bottom-3 right-3 z-10 inline-flex min-h-8 items-center gap-1 rounded-full border border-zinc-300 bg-white/90 px-3 py-1 text-xs font-medium text-zinc-800 backdrop-blur transition-[background-color,transform] duration-150 hover:bg-white active:scale-95 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100"
      >
        {label} <ArrowUpRight className="h-3 w-3" aria-hidden />
      </Link>
    </div>
  )
}

export function LandingPage() {
  const [showAllCats, setShowAllCats] = React.useState(false)
  const signatureCount = componentDocs.filter((c) => c.isNew).length
  const categories = getNavGroups().filter((g) => g.title !== 'Getting Started')
  const featured = [...categories].sort((a, b) => b.items.length - a.items.length).slice(0, 10).map((c) => c.title)
  const visibleCats = showAllCats ? categories : categories.filter((c) => featured.includes(c.title))
  const installCmd = `npx shadcn@latest add ${registryItemUrl('magnetic-button')}`

  React.useEffect(() => {
    document.title = 'Framekit UI — components that feel alive'
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-zinc-950 dark:bg-[#0c0c0c] dark:text-zinc-50">
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('main')?.focus()
        }}
        className="sr-only z-[80] rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3 dark:bg-white dark:text-zinc-950"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-transparent bg-[#f7f7f5]/75 backdrop-blur-xl dark:bg-[#0c0c0c]/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:px-4">
          <BrandLink />
          <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 md:flex">
            <Link to="/docs/introduction" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">Docs</Link>
            <Link to="/docs/category/buttons" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">Components</Link>
            <Link to="/docs/installation" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">Install</Link>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <SearchTrigger />
            <ThemeToggleButton />
            <a href={SITE.github} target="_blank" rel="noreferrer" className={iconBtn} aria-label="Framekit UI on GitHub (opens in a new tab)">
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="relative isolate overflow-hidden" aria-labelledby="hero-h">
          <div className="fk-hero-field -z-10" aria-hidden />
          <div className="fk-grid-mask absolute inset-0 -z-10" aria-hidden />
          <motion.div variants={heroStagger} initial="hidden" animate="show" className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
            <motion.p variants={rise} className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-700 backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-300">
              <span aria-hidden className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full rounded-full bg-signal-500 opacity-60 motion-safe:animate-ping" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-600" /></span>
              Open source · MIT · Copy-paste
            </motion.p>
            <h1 id="hero-h" className="max-w-4xl text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] text-zinc-950 sm:text-7xl dark:text-white">
              {['Components', 'that'].map((w) => (
                <motion.span key={w} variants={wordIn} className="mr-[0.25em] inline-block">{w}</motion.span>
              ))}
              <motion.span variants={wordIn} className="mr-[0.05em] inline-block italic text-signal-700 dark:text-signal-300" style={{ fontFamily: 'var(--font-display)' }}>
                feel alive
              </motion.span>
              <motion.span variants={wordIn} className="inline-block">.</motion.span>
            </h1>
            <motion.p variants={rise} className="mt-6 max-w-xl text-base leading-relaxed text-zinc-700 sm:text-lg dark:text-zinc-300">
              {componentDocs.length} animated React + Tailwind components with editorial surfaces and physically motivated motion — copy the source, own it, ship it.
            </motion.p>

            <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
              <MotionLink
                to="/docs/category/buttons"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgb(0_0_0/0.5)] ring-1 ring-white/10 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:shadow-black/40 dark:hover:bg-zinc-200"
              >
                Browse components <ArrowRight className="h-4 w-4" aria-hidden />
              </MotionLink>
              <Link to="/docs/installation">
                <Button variant="outline" className="h-12 rounded-full px-6">Install guide</Button>
              </Link>
            </motion.div>

            <motion.div variants={rise} className="mt-6 flex max-w-2xl items-center gap-2 rounded-xl border border-zinc-300 bg-white/80 py-1.5 pl-4 pr-1.5 backdrop-blur dark:border-zinc-700 dark:bg-zinc-950/70">
              <code tabIndex={0} aria-label="Install command" className="framekit-scroll min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-sm font-mono text-[12.5px] text-zinc-800 dark:text-zinc-200">
                <span className="select-none text-signal-700 dark:text-signal-300">$ </span>{installCmd}
              </code>
              <CopyButton value={installCmd} label="Copy install command" meta={{ kind: 'landing-install' }} />
            </motion.div>

            <motion.dl variants={rise} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm text-zinc-700 dark:text-zinc-300">
              <div className="flex items-baseline gap-2">
                <dt className="sr-only">Components</dt>
                <dd><NumberTicker value={componentDocs.length} className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white" /> <span>components</span></dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="sr-only">Signature originals</dt>
                <dd><NumberTicker value={signatureCount} className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white" /> <span>signature originals</span></dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="sr-only">Categories</dt>
                <dd><NumberTicker value={categories.length} className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white" /> <span>categories</span></dd>
              </div>
            </motion.dl>
          </motion.div>
        </section>

        <nav aria-label="Browse by category" className="mx-auto max-w-6xl px-4 pb-12">
          <p className={cn(eyebrow, 'mb-3')}>Browse by category</p>
          <ul className="flex flex-wrap gap-2">
            {visibleCats.map((c) => (
              <li key={c.title}>
                <Link
                  to={`/docs/category/${categorySlug(c.title)}`}
                  className="fk-touch inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3.5 py-2 text-xs font-medium text-zinc-800 transition-[border-color,background-color,transform] duration-150 hover:border-signal-500 hover:bg-signal-50 active:scale-95 motion-reduce:active:scale-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {c.title}
                  <span className="tabular-nums text-zinc-600 dark:text-zinc-400">{c.items.length}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                aria-expanded={showAllCats}
                onClick={() => setShowAllCats((v) => !v)}
                className="fk-touch inline-flex items-center rounded-full px-3.5 py-2 text-xs font-medium text-zinc-700 underline underline-offset-4 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                {showAllCats ? 'Show fewer' : `Show all ${categories.length}`}
              </button>
            </li>
          </ul>
        </nav>

        <section className="border-y border-zinc-200/80 bg-white/60 py-14 dark:border-zinc-800 dark:bg-zinc-950/50" aria-labelledby="heroes-h">
          <div className="mx-auto max-w-6xl px-4">
            <p className={eyebrow}>Five categories · five heroes</p>
            <h2 id="heroes-h" className="mt-1 text-2xl font-semibold tracking-tight">Best unique motion, by category</h2>
            <LazyMount minHeight={420} className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                <Tile to="/docs/silk-shear-field" label="Silk Shear">
                  <SilkShearField className="h-44">
                    <div className="flex h-full items-end p-4"><span className="text-xs text-signal-200">Backgrounds</span></div>
                  </SilkShearField>
                </Tile>
                <Tile to="/docs/radial-toolburst" label="Radial Toolburst" className="flex h-44 flex-col items-center justify-center p-4">
                  <p className={cn(eyebrow, 'mb-2')}>Navigation</p>
                  <RadialToolburst />
                </Tile>
                <Tile to="/docs/ribbon-trail-cursor" label="Ribbon Trail">
                  <p className={cn(eyebrow, 'px-4 pt-3')}>Cursors</p>
                  <RibbonTrailCursor className="border-0" />
                </Tile>
                <Tile to="/docs/liquid-fill-button" label="Liquid Fill" className="flex h-44 flex-col items-center justify-center gap-3">
                  <p className={eyebrow}>Buttons</p>
                  <LiquidFillButton>Liquid fill</LiquidFillButton>
                </Tile>
                <Tile to="/docs/watchful-eye-toggle" label="Toggles" className="flex h-44 flex-col items-center justify-center gap-3 bg-[#f7f5f0] md:col-span-2">
                  <p className={cn(eyebrow, 'text-signal-700 dark:text-signal-300')}>Toggles · hero</p>
                  <div className="flex items-center gap-8">
                    <WatchfulEyeToggle defaultChecked aria-label="Watchful eye" />
                    <MothLanternToggle defaultChecked />
                  </div>
                </Tile>
              </motion.div>
            </LazyMount>
          </div>
        </section>

        {/* Live showcase grid */}
        <section className="py-14" aria-labelledby="showcase-h">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className={eyebrow}>Showcase</p>
                <h2 id="showcase-h" className="mt-1 text-2xl font-semibold tracking-tight">Motion you can feel</h2>
              </div>
              <Link to="/docs/category/animated-backgrounds" className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-medium text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:text-white">
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            <LazyMount minHeight={900}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-4 md:grid-cols-2"
              >
                <div className="flex min-h-[240px] flex-col items-center justify-center gap-6 rounded-2xl border border-zinc-200 bg-white p-6 md:col-span-2 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className={cn(eyebrow, 'text-signal-700 dark:text-signal-300')}>Toggles</p>
                  <div className="flex flex-wrap items-center justify-center gap-8">
                    <WatchfulEyeToggle defaultChecked aria-label="Watchful eye demo" />
                    <DayNightCapsule defaultChecked={false} />
                    <GlassOrbSwitch defaultChecked />
                  </div>
                  <p className="text-center text-sm text-zinc-700 dark:text-zinc-400">Watchful Eye · Day Night Capsule · Glass Orb — click to play.</p>
                  <GooglyGazeButton />
                </div>

                <PrismTidalField className="min-h-[240px] md:col-span-2">
                  <div className="flex h-full min-h-[240px] flex-col items-start justify-end p-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal-200">Prism Tidal Field</p>
                    <p className="mt-2 max-w-md text-lg text-white">Move the cursor — tides lean into your velocity.</p>
                  </div>
                </PrismTidalField>

                <ConstellationBreathingGrid className="min-h-[220px]">
                  <div className="flex h-full min-h-[220px] items-end p-6">
                    <p className="text-sm text-white/85">Constellation Breathing Grid</p>
                  </div>
                </ConstellationBreathingGrid>

                <PaperfoldGradientPlane className="min-h-[220px]">
                  <div className="flex h-full min-h-[220px] items-end p-6">
                    <p className="text-sm text-zinc-800">Paperfold Gradient Plane</p>
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
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-signal-700 dark:text-signal-300">Also in the kit</p>
                  <h3 className="mt-2 text-xl font-semibold">Magnetic Button · Spotlight · Scramble · Border Beam</h3>
                  <p className="mt-2 max-w-2xl text-sm text-zinc-700 dark:text-zinc-400">
                    Existing animated pieces stay polished and copy-paste ready — the Signature set sits above them as landing-page showpieces.
                  </p>
                </SpotlightCard>
              </motion.div>
            </LazyMount>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20" aria-labelledby="principles-h">
          <h2 id="principles-h" className="sr-only">Principles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'One gesture, one sentence', body: 'Every Signature demo wears a caption that tells you exactly how to play.' },
              { title: 'Lilac as signal', body: 'Near-black type, off-white stages, and #D4CBE5 used like a status LED — never a flood fill.' },
              { title: 'Own the source', body: 'Copy the file. No runtime lock-in. Reduced-motion fallbacks built in.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-zinc-200 p-6 transition-colors duration-300 hover:border-signal-400 dark:border-zinc-800 dark:hover:border-signal-500">
                <h3 className="font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-10 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-700 sm:flex-row dark:text-zinc-400">
          <p>{SITE.name} · {SITE.license} · v{SITE.version}</p>
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-1">
            {[
              ['/docs/introduction', 'Docs'],
              ['/docs/installation', 'Install'],
              ['/docs/theming', 'Theming'],
            ].map(([to, label]) => (
              <Link key={to} to={to} className="inline-flex min-h-11 items-center rounded-lg px-3 hover:text-zinc-950 hover:underline dark:hover:text-white">{label}</Link>
            ))}
            <a href={SITE.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-lg px-3 hover:text-zinc-950 hover:underline dark:hover:text-white">GitHub<span className="sr-only"> (opens in a new tab)</span></a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
