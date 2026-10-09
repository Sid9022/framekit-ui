#!/usr/bin/env node
/**
 * Generates public/llms.txt (index, https://llmstxt.org format) and public/llms-full.txt (every component with
 * install command and props) from src/docs/registry.ts. Runs in `prebuild`.
 *
 *   node scripts/build-llms.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, loadTs } from './lib/load-ts.mjs'

const seo = await loadTs('src/docs/seo.ts')
const { getNavGroups, categorySlug, componentDocs } = await loadTs('src/docs/registry.ts')
const { SITE } = await loadTs('src/config/site.ts')
const { LANDING_FAQ, faqAnswerText } = await loadTs('src/docs/faq.ts')
const guides = await loadTs('src/docs/guides.ts')
const U = seo.SITE_URL
const groups = getNavGroups()
const cats = groups.filter((g) => g.title !== 'Getting Started')

/** First sentence, single line, ≤ 160 chars. */
const oneLiner = (s) => {
  const flat = s.replace(/\s+/g, ' ').trim()
  const first = flat.match(/^(.+?[.!?])(\s|$)/)?.[1] ?? flat
  return seo.clip(first, 160)
}

const intro = `# ${SITE.name}

> ${SITE.name} is a free, open-source (${SITE.license}) library of ${componentDocs.length} animated React components built with React 19, TypeScript, Tailwind CSS v4 and Motion (motion/react). Every component is one self-contained file you own, ships light and dark styles, supports the keyboard and prefers-reduced-motion, and installs with the shadcn CLI.

- Docs: ${U}/
- Source: ${SITE.github}
- shadcn registry index: ${U}/r/registry.json

## Install

Requires a React project on Tailwind CSS v4 with a shadcn \`components.json\` and an \`@/*\` path alias (run \`npx shadcn@latest init\` once if needed).

\`\`\`bash
npx shadcn@latest add ${U}/r/<slug>.json
\`\`\`

Example: \`${seo.installCommand('glass-app-dock')}\`. The CLI writes \`components/ui/<slug>.tsx\`, adds shared helpers (\`lib/cn.ts\`, \`lib/use-reduced-motion.ts\`…) and installs npm dependencies such as \`motion\` and \`lucide-react\`. Optionally register the namespace in \`components.json\` (\`"registries": { "@framekit": "${U}/r/{name}.json" }\`) and run \`npx shadcn@latest add @framekit/<slug>\`. Import with \`import { PascalCaseName } from '@/components/ui/<slug>'\`. In the Next.js App Router, add \`"use client"\` to the component file (they use hooks).
`

const guidesSection = `## Guides

${guides.GUIDES.map((g) => `- [${g.title}](${U}/guides/${g.slug}): ${g.description}`).join('\n')}
`

const docsSection = `## Docs

${groups[0].items.map((d) => `- [${d.title}](${U}/docs/${d.slug}): ${oneLiner(d.description)}`).join('\n')}
`

const catSections = cats
  .map(
    (g) => `## ${g.title}

[All ${g.title} components](${U}/docs/category/${categorySlug(g.title)}): ${seo.CATEGORY_SEO[g.title].blurb}

${g.items.map((d) => `- [${d.title}](${U}/docs/${d.slug}): ${oneLiner(d.description)}`).join('\n')}
`,
  )
  .join('\n')

const optional = `## Optional

- [Full component reference](${U}/llms-full.txt): every component with description, install command and props
- [Sitemap](${U}/sitemap.xml): every docs URL
- [Contributing guide](${SITE.github}/blob/master/AGENTS.md): conventions for adding components
`

fs.writeFileSync(path.join(ROOT, 'public/llms.txt'), [intro, guidesSection, docsSection, catSections, optional].join('\n'))

/* ── guides as Markdown (full text, same source as the pages) ─────────── */
const mdInline = (t) => t // guides.ts inline markup is already Markdown-compatible; make relative links absolute:
  .replace(/\]\((\/[^)]*)\)/g, `](${U}$1)`)
const mdCell = (t) => mdInline(t).replace(/\|/g, '\\|')
function mdBlock(b) {
  switch (b.type) {
    case 'p':
      return mdInline(b.text)
    case 'note':
      return `> **${b.tone === 'warn' ? 'Note' : 'Tip'}:** ${mdInline(b.text)}`
    case 'list':
      return b.items.map((i, n) => `${b.ordered ? `${n + 1}.` : '-'} ${mdInline(i)}`).join('\n')
    case 'steps':
      return b.items.map((st, n) => `${n + 1}. **${st.title}.** ${mdInline(st.text)}${st.code ? `\n\n   \`\`\`${st.code.lang}\n${st.code.code.split('\n').map((l) => `   ${l}`).join('\n')}\n   \`\`\`` : ''}`).join('\n')
    case 'code':
      return `${b.label ? `${b.label}:\n\n` : ''}\`\`\`${b.lang}\n${b.code}\n\`\`\``
    case 'table':
      return `${b.caption}\n\n| ${b.head.join(' | ')} |\n| ${b.head.map(() => '---').join(' | ')} |\n${b.rows.map((r) => `| ${r.map(mdCell).join(' | ')} |`).join('\n')}`
    case 'examples':
      return `Examples: ${b.slugs.map((x) => `[${x}](${U}/docs/${x})`).join(', ')}`
  }
  return ''
}
const guideMd = (g) =>
  [`## Guide: ${g.title}`, '', `URL: ${U}/guides/${g.slug}`, '', mdInline(g.summary), '', ...g.sections.flatMap((x) => [`### ${x.title}`, '', mdInline(x.answer), '', ...x.blocks.flatMap((b) => [mdBlock(b), ''])]), '### FAQ', '', ...g.faq.flatMap((f) => [`**${f.q}**`, '', mdInline(f.a), '']), ''].join('\n')

/* ── llms-full.txt ───────────────────────────────────────────────────── */
const pascal = (slug) => slug.replace(/(^|-)([a-z0-9])/g, (_, __, ch) => ch.toUpperCase())
const exportName = (slug) => {
  const file = path.join(ROOT, 'src/components/ui', `${slug}.tsx`)
  const code = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  const p = pascal(slug)
  if (new RegExp(`export\\s+(?:function|const)\\s+${p}\\b`).test(code)) return p
  return code.match(/export\s+function\s+([A-Z][a-z]\w*)/)?.[1] ?? code.match(/export\s+const\s+([A-Z][a-z]\w*)/)?.[1] ?? p
}
const full = [
  intro,
  ...guides.GUIDES.map(guideMd),
  `## Frequently asked questions\n\n${LANDING_FAQ.map((f) => `### ${f.q}\n\n${faqAnswerText(f.a)}`).join('\n\n')}\n`,
  ...cats.map(
    (g) =>
      `## ${g.title}\n\n${seo.CATEGORY_SEO[g.title].blurb} (${U}/docs/category/${categorySlug(g.title)})\n\n` +
      g.items
        .map((d) => {
          const lines = [`### ${d.title}`, '', `URL: ${U}/docs/${d.slug}`, '', d.description.replace(/\s+/g, ' ').trim(), '']
          if (d.gesture) lines.push(`Interaction: ${d.gesture}`, '')
          lines.push('```bash', seo.installCommand(d.slug), '```', '', '```tsx', `import { ${exportName(d.slug)} } from '@/components/ui/${d.slug}'`, '```', '')
          if (d.props?.length) {
            lines.push('| Prop | Type | Default | Notes |', '| --- | --- | --- | --- |')
            const cell = (s) => String(s ?? '—').replace(/\|/g, '\\|').replace(/\s+/g, ' ')
            for (const p of d.props) lines.push(`| ${cell(p.name)} | ${cell(p.type)} | ${cell(p.default)} | ${cell(p.description)} |`)
            lines.push('')
          }
          if (d.dependencies?.length) lines.push(`Dependencies: ${d.dependencies.join(', ')}`, '')
          return lines.join('\n')
        })
        .join('\n'),
  ),
].join('\n')
fs.writeFileSync(path.join(ROOT, 'public/llms-full.txt'), full)
console.log(`llms.txt: ${cats.length} categories, ${componentDocs.length} components · llms-full.txt: ${(Buffer.byteLength(full) / 1024).toFixed(0)} KB`)
