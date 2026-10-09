/* Demo helper shared by several docs demos. */
import { User as P2User, FolderOpen as P2Folder, PenLine as P2Pen, Mail as P2Mail } from 'lucide-react'
import { SAMPLE_PROJECTS, PortfolioArt } from '@/lib/portfolio-art'
import { MiniDesktopOS } from '@/components/ui/mini-desktop-os'

export function MiniDesktopDemo({ open = ['about'] }: { open?: string[] }) {
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
