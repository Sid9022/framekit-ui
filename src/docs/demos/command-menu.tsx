import * as React from 'react'
import { Home as P2Home, Briefcase as P2Briefcase, User as P2User, PenLine as P2Pen, FolderOpen as P2Folder, Layers as P2Layers, Mail as P2Mail, Moon as P2Moon, FileDown as P2FileDown, MessageCircle as P2Chat, ExternalLink as P2Ext } from 'lucide-react'
import { CommandMenu } from '@/components/ui/command-menu'

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

const demo: React.ReactNode = <CommandMenuDemo />

export default demo
