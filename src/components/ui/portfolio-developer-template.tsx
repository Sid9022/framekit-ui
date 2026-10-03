import * as React from 'react'
import { CareerTimeline } from '@/components/ui/career-timeline'
import { CopyEmailButton } from '@/components/ui/copy-email-button'
import { PortfolioFooter } from '@/components/ui/portfolio-footer'
import { ProjectRevealList } from '@/components/ui/project-reveal-list'
import { ResumeDownloadButton } from '@/components/ui/resume-download-button'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SectionSpyNav } from '@/components/ui/section-spy-nav'
import { SkillMeters } from '@/components/ui/skill-meters'
import { SkillsMarquee } from '@/components/ui/skills-marquee'
import { SocialDock } from '@/components/ui/social-dock'
import { TerminalDevHero } from '@/components/ui/terminal-dev-hero'
import { SAMPLE_PROJECTS, type PortfolioProject } from '@/lib/portfolio-art'
import { cn } from '@/lib/cn'

export type PortfolioDeveloperTemplateProps = {
  name?: string
  email?: string
  projects?: PortfolioProject[]
  resumeHref?: string
  /** Fixed height of the scrolling frame (px). Pass 0 to render as a normal page. */
  frameHeight?: number
  className?: string
}

/**
 * Dev Folio template — a developer-flavoured one-pager composed from Framekit parts: terminal hero, skills marquee,
 * hover-preview project index, scroll-drawn career timeline, skill meters, social dock, copy-email + résumé download
 * and a statement footer. Installing it pulls in every part it uses.
 */
export function PortfolioDeveloperTemplate({ name = 'Sam Okoye', email = 'hello@samokoye.dev', projects = SAMPLE_PROJECTS, resumeHref, frameHeight = 680, className }: PortfolioDeveloperTemplateProps) {
  const scroller = React.useRef<HTMLDivElement>(null)
  const framed = frameHeight > 0
  const sc = framed ? scroller : undefined
  return (
    <div className={cn('w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-300 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.4)] dark:border-zinc-800', className)}>
      <div ref={scroller} className={cn('relative bg-stone-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50', framed && 'overflow-y-auto overscroll-contain')} style={framed ? { height: frameHeight } : undefined} tabIndex={framed ? 0 : undefined} role={framed ? 'region' : undefined} aria-label={framed ? 'Developer portfolio template preview (scrollable)' : undefined}>
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-zinc-200 bg-stone-50/85 px-4 py-2 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85">
          <span className="font-mono text-sm font-semibold">{name.toLowerCase().replace(' ', '.')}<span className="text-framekit-600 dark:text-framekit-400">_</span></span>
          <SectionSpyNav className="w-full max-w-xs" scrollContainer={sc} sections={[{ id: 'dev-work', label: 'Work' }, { id: 'dev-path', label: 'Path' }, { id: 'dev-skills', label: 'Skills' }, { id: 'dev-hire', label: 'Hire' }]} />
        </header>
        <main className="space-y-20 px-4 pb-6 pt-6 sm:px-8">
          <TerminalDevHero className="mx-auto max-w-none" />
          <SkillsMarquee className="mx-auto" />
          <section id="dev-work" className="mx-auto max-w-3xl scroll-mt-20" aria-labelledby="dev-work-h">
            <h2 id="dev-work-h" className="mb-4 font-display text-5xl tracking-tight">Things I’ve built</h2>
            <ProjectRevealList items={projects} className="max-w-none" titleAs="h3" />
          </section>
          <section id="dev-path" className="mx-auto max-w-3xl scroll-mt-20" aria-labelledby="dev-path-h">
            <h2 id="dev-path-h" className="mb-6 font-display text-5xl tracking-tight">The path so far</h2>
            <CareerTimeline scrollContainer={sc} className="max-w-none" />
          </section>
          <section id="dev-skills" className="mx-auto max-w-3xl scroll-mt-20" aria-labelledby="dev-skills-h">
            <h2 id="dev-skills-h" className="mb-6 font-display text-5xl tracking-tight">What I’m good at</h2>
            <ScrollReveal scrollContainer={sc} effect="scale"><SkillMeters className="max-w-none" /></ScrollReveal>
          </section>
          <section id="dev-hire" className="mx-auto flex max-w-3xl scroll-mt-20 flex-col items-center gap-6 text-center" aria-labelledby="dev-hire-h">
            <h2 id="dev-hire-h" className="font-display text-5xl tracking-tight">Let’s build something</h2>
            <div className="flex flex-wrap items-center justify-center gap-4"><CopyEmailButton email={email} /><ResumeDownloadButton href={resumeHref} fileName={`${name.toLowerCase().replace(' ', '-')}-resume.pdf`} /></div>
            <SocialDock />
          </section>
          <PortfolioFooter name={name} email={email} headline="Say hello." className="mx-auto max-w-none" onBackToTop={() => scroller.current?.scrollTo({ top: 0, behavior: 'smooth' })} />
        </main>
      </div>
    </div>
  )
}
