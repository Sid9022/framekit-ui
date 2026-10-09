import type * as React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { GitBranch as UpBranch, Check as UpCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const demo: React.ReactNode = (
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
  )

export default demo
