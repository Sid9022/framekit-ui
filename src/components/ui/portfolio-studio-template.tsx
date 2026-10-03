import * as React from 'react'
import { AvailabilityBadge } from '@/components/ui/availability-badge'
import { ContactFormCard, type ContactFormCardProps } from '@/components/ui/contact-form-card'
import { ImpactStats } from '@/components/ui/impact-stats'
import { IntroPreloader } from '@/components/ui/intro-preloader'
import { KineticNameHero } from '@/components/ui/kinetic-name-hero'
import { PortfolioFooter } from '@/components/ui/portfolio-footer'
import { ProjectFilterGallery } from '@/components/ui/project-filter-gallery'
import { ProjectLightbox } from '@/components/ui/project-lightbox'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { SectionSpyNav } from '@/components/ui/section-spy-nav'
import { ServicesCards } from '@/components/ui/services-cards'
import { TestimonialCarousel } from '@/components/ui/testimonial-carousel'
import { SAMPLE_PROJECTS, type PortfolioProject } from '@/lib/portfolio-art'
import { cn } from '@/lib/cn'

export type PortfolioStudioTemplateProps = {
  name?: string
  role?: string
  projects?: PortfolioProject[]
  onContactSubmit?: ContactFormCardProps['onSubmit']
  /** Show the intro preloader first. */
  intro?: boolean
  /** Fixed height of the scrolling frame (px). Pass 0 to render as a normal page. */
  frameHeight?: number
  className?: string
}

/**
 * Studio Folio template — a complete one-page designer portfolio composed from Framekit parts: intro preloader,
 * kinetic name hero, spy-nav, impact stats, filterable work with a lightbox, services, testimonials, contact form and
 * footer. Installing it pulls in every part it uses.
 */
export function PortfolioStudioTemplate({ name = 'Nova Reyes', role = 'Design engineer & motion designer', projects = SAMPLE_PROJECTS, onContactSubmit, intro = true, frameHeight = 680, className }: PortfolioStudioTemplateProps) {
  const scroller = React.useRef<HTMLDivElement>(null)
  const [openId, setOpenId] = React.useState<string | null>(null)
  const framed = frameHeight > 0
  const sc = framed ? scroller : undefined
  const page = (
    <div ref={scroller} className={cn('relative bg-stone-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50', framed && 'overflow-y-auto overscroll-contain')} style={framed ? { height: frameHeight } : undefined} tabIndex={framed ? 0 : undefined} aria-label={framed ? 'Portfolio template preview (scrollable)' : undefined} role={framed ? 'region' : undefined}>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-zinc-200 bg-stone-50/85 px-4 py-2 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85">
        <span className="font-display text-xl">{name.split(' ')[0]}<span className="text-framekit-600 dark:text-framekit-400">.</span></span>
        <SectionSpyNav className="w-full max-w-sm" scrollContainer={sc} sections={[{ id: 'tpl-work', label: 'Work' }, { id: 'tpl-services', label: 'Services' }, { id: 'tpl-kind-words', label: 'Words' }, { id: 'tpl-contact', label: 'Contact' }]} />
      </header>
      <main className="space-y-20 px-4 pb-6 pt-6 sm:px-8">
        <KineticNameHero name={name} role={role} className="mx-auto max-w-none" />
        <ScrollReveal scrollContainer={sc} effect="blur"><div className="flex flex-col items-center gap-6"><AvailabilityBadge status="open" timeZone="Europe/Lisbon" /><ImpactStats /></div></ScrollReveal>
        <section id="tpl-work" className="mx-auto max-w-3xl scroll-mt-20" aria-labelledby="tpl-work-h">
          <h2 id="tpl-work-h" className="mb-6 font-display text-5xl tracking-tight">Selected work</h2>
          <ProjectFilterGallery items={projects} onSelect={(p) => setOpenId(p.id)} className="max-w-none" titleAs="h3" />
          <ProjectLightbox items={projects} openId={openId} onOpenChange={setOpenId} className="hidden" />
        </section>
        <section id="tpl-services" className="mx-auto max-w-4xl scroll-mt-20" aria-labelledby="tpl-services-h">
          <h2 id="tpl-services-h" className="mb-6 font-display text-5xl tracking-tight">How I can help</h2>
          <ScrollReveal scrollContainer={sc} effect="rise"><ServicesCards className="max-w-none" /></ScrollReveal>
        </section>
        <section id="tpl-kind-words" className="mx-auto max-w-3xl scroll-mt-20" aria-labelledby="tpl-words-h">
          <h2 id="tpl-words-h" className="mb-6 font-display text-5xl tracking-tight">Kind words</h2>
          <TestimonialCarousel className="max-w-none" interval={0} />
        </section>
        <section id="tpl-contact" className="mx-auto flex max-w-3xl scroll-mt-20 justify-center" aria-labelledby="tpl-contact-h">
          <h2 id="tpl-contact-h" className="sr-only">Contact</h2>
          <ContactFormCard onSubmit={onContactSubmit} headingAs="h3" />
        </section>
        <PortfolioFooter name={name} className="mx-auto max-w-none" onBackToTop={() => scroller.current?.scrollTo({ top: 0, behavior: 'smooth' })} />
      </main>
    </div>
  )
  return (
    <div className={cn('w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-300 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.4)] dark:border-zinc-800', className)}>
      {intro ? <IntroPreloader className="rounded-none">{page}</IntroPreloader> : page}
    </div>
  )
}
