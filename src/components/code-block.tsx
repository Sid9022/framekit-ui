import * as React from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useThemeToggle } from '@/components/theme-provider'

export function CodeBlock({
  code,
  language = 'tsx',
  className,
}: {
  code: string
  language?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const { theme } = useThemeToggle()

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800', className)}>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <Highlight
        theme={theme === 'dark' ? themes.oneDark : themes.github}
        code={code.trimEnd()}
        language={language}
      >
        {({ className: cls, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(cls, 'framekit-scroll max-h-[480px] overflow-auto p-4 text-[13px] leading-relaxed')}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
