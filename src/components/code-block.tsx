import * as React from 'react'
import { Highlight, themes, type PrismTheme } from 'prism-react-renderer'
import { Check, Copy } from 'lucide-react'
import { track } from '@vercel/analytics'
import { cn } from '@/lib/cn'
import { useThemeToggle } from '@/components/theme-provider'

/* ── WCAG-safe syntax themes ────────────────────────────────────────────────
 * The stock oneDark comment colour is 2.3:1 on its background. We nudge any token colour that
 * falls under 4.5:1 toward white (dark themes) or black (light themes) until it passes.
 */
/** Accepts #rrggbb or rgb(r, g, b); returns [r,g,b] or null. */
const parse = (c: string): [number, number, number] | null => {
  const hex = c.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const rgb = c.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i)
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3]]
  const hsl = c.match(/^hsla?\(\s*([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%/i)
  if (hsl) {
    const h = +hsl[1]
    const s = +hsl[2] / 100
    const l = +hsl[3] / 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))
    return [f(0), f(8), f(4)]
  }
  return null
}
const lum = (c: string) => {
  const rgb = parse(c) ?? [0, 0, 0]
  const ch = rgb.map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const toward = (color: string, target: number, t: number) => {
  const rgb = parse(color) ?? [0, 0, 0]
  const c = rgb.map((v) => Math.round(v + (target - v) * t))
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}
function accessible(theme: PrismTheme, dark: boolean): PrismTheme {
  const bg = theme.plain.backgroundColor ?? (dark ? '#282c34' : '#ffffff')
  const fix = (color?: string) => {
    if (!color || !parse(color)) return color
    let c = color
    for (let i = 0; i < 20 && ratio(c, bg) < 4.5; i++) c = toward(c, dark ? 255 : 0, 0.08)
    return c
  }
  return {
    plain: { ...theme.plain, color: fix(theme.plain.color) },
    styles: theme.styles.map((s) => ({ ...s, style: { ...s.style, color: fix(s.style.color as string | undefined) } })),
  }
}
const THEME_DARK = accessible(themes.oneDark, true)
const THEME_LIGHT = accessible(themes.github, false)

export function CodeBlock({
  code,
  language = 'tsx',
  className,
  trackMeta,
  label,
}: {
  code: string
  language?: string
  className?: string
  /** When set, a `copy` analytics event is sent with these props. */
  trackMeta?: { slug?: string; kind: string }
  /** Accessible name for the scrollable code region. */
  label?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const { theme } = useThemeToggle()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Clipboard can be blocked (insecure context / permissions) — fall back to a hidden textarea.
      const ta = document.createElement('textarea')
      ta.value = code
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    if (trackMeta) track('copy', { slug: trackMeta.slug ?? 'site', kind: trackMeta.kind })
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800', className)}>
      <button
        type="button"
        onClick={copy}
        className={cn(
          'fk-touch absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-lg border bg-white/95 px-2.5 py-1.5 text-xs font-medium backdrop-blur transition-[background-color,color,transform] duration-150 active:scale-95 motion-reduce:active:scale-100 dark:bg-zinc-900/95',
          copied
            ? 'border-emerald-400 text-emerald-800 dark:border-emerald-500/60 dark:text-emerald-300'
            : 'border-zinc-300 text-zinc-700 hover:bg-white hover:text-zinc-950 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white',
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <Highlight theme={theme === 'dark' ? THEME_DARK : THEME_LIGHT} code={code.trimEnd()} language={language}>
        {({ className: cls, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            tabIndex={0}
            role="group"
            aria-label={label ?? `${language} code`}
            className={cn(cls, 'framekit-scroll max-h-[480px] overflow-auto p-4 pr-24 text-[13px] leading-relaxed')}
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
