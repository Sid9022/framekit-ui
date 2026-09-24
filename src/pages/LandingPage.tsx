import { GithubIcon } from '@/components/icons'
import { Link } from 'react-router-dom'
import { ArrowRight, Copy, Flame, Moon, Sparkles, Sun, Zap } from 'lucide-react'
import { SITE } from '@/config/site'
import { useThemeToggle } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { ScrambleText } from '@/components/ui/scramble-text'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { BorderBeam } from '@/components/ui/border-beam'
import { MorphingText } from '@/components/ui/morphing-text'
import { NumberTicker } from '@/components/ui/number-ticker'
import { BreathingDot } from '@/components/ui/breathing-dot'
import { componentDocs } from '@/docs/registry'

export function LandingPage() {
  const { theme, toggle } = useThemeToggle()
  const uniqueCount = componentDocs.filter((c) => c.unique).length

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-forge-500 to-orange-600 text-white shadow-lg shadow-forge-500/30">
            <Flame className="h-4 w-4" />
          </span>
          {SITE.name}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggle} className="rounded-xl p-2 hover:bg-zinc-200/70 dark:hover:bg-zinc-800" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a href={SITE.github} className="rounded-xl p-2 hover:bg-zinc-200/70 dark:hover:bg-zinc-800" aria-label="GitHub" target="_blank" rel="noreferrer">
            <GithubIcon className="h-4 w-4" />
          </a>
          <Link to="/docs/introduction">
            <Button size="sm" variant="forge">
              Docs
            </Button>
          </Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-forge-200 bg-forge-50 px-3 py-1 text-xs font-medium text-forge-800 dark:border-forge-900 dark:bg-forge-950/50 dark:text-forge-200">
          <Sparkles className="h-3.5 w-3.5" />
          Open source · MIT · Copy-paste
        </div>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Forge animated UI you{' '}
          <span className="bg-gradient-to-r from-forge-500 to-amber-400 bg-clip-text text-transparent">actually own</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">{SITE.tagline}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/docs/installation">
            <MagneticButton>Start forging</MagneticButton>
          </Link>
          <Link to="/docs/magnetic-button">
            <Button variant="outline" className="gap-2">
              Browse components <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
          <div>
            <NumberTicker value={componentDocs.length} className="text-2xl font-bold text-zinc-900 dark:text-white" /> components
          </div>
          <div>
            <NumberTicker value={uniqueCount} className="text-2xl font-bold text-zinc-900 dark:text-white" /> animated originals
          </div>
          <BreathingDot status="online" label="Dark mode ready" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-2">
        <AuroraBackground className="flex min-h-[220px] items-center justify-center p-8">
          <ScrambleText text="FORGE THE FUTURE" className="text-2xl font-bold text-white sm:text-3xl" />
        </AuroraBackground>
        <SpotlightCard className="min-h-[220px]">
          <p className="text-sm font-medium text-forge-600">Spotlight Card</p>
          <h3 className="mt-2 text-xl font-semibold">Cursor-aware glow</h3>
          <p className="mt-2 text-sm text-zinc-500">Move around — the radial light tracks your pointer.</p>
        </SpotlightCard>
        <BorderBeam className="md:col-span-2">
          <div className="flex flex-col items-center gap-3 p-10 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="text-xl font-semibold">
                Build <MorphingText phrases={['faster', 'bolder', 'yours']} className="text-forge-500" />
              </h3>
              <p className="mt-1 text-sm text-zinc-500">Border beams, morphing type, magnetic CTAs — all copy-paste.</p>
            </div>
            <Link to="/docs/introduction">
              <Button variant="forge" className="gap-2">
                <Zap className="h-4 w-4" /> Open docs
              </Button>
            </Link>
          </div>
        </BorderBeam>
      </section>

      <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          {[
            { icon: Copy, title: 'Copy-paste ownership', body: 'Components live in your repo. Change anything. No wrapper lock-in.' },
            { icon: Sparkles, title: 'Motion-first originals', body: 'Magnetic buttons, pixel reveals, ink grids — built here from scratch.' },
            { icon: Flame, title: 'Accessible defaults', body: 'Focus rings, keyboard paths, and reduced-motion respect where it matters.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <f.icon className="mb-3 h-5 w-5 text-forge-500" />
              <h3 className="font-semibold">{f.title}</h3>
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
