/**
 * Open Graph card template (1200×630) for scripts/build-og.mjs, rendered with satori (HTML/CSS subset → SVG)
 * and @resvg/resvg-js (SVG → PNG). Pure Node, no browser. Plain objects instead of JSX so no transpile step.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
export const LOGO = `data:image/svg+xml;base64,${fs.readFileSync(path.join(HERE, 'keyframe-app-icon.svg')).toString('base64')}`

const h = (type, style, ...children) => ({ type, props: { style, children: children.flat().filter((c) => c !== null && c !== false && c !== undefined) } })
const img = (src, style) => ({ type: 'img', props: { src, style, width: style.width, height: style.height } })

export const INK = '#0A0A0A'
export const PAPER = '#F8F8F8'
export const LIME = '#D9F95C'

/** Lime keyframe diamond (the logo's motion mark), drawn as an SVG so satori renders it crisply. */
function diamond(size, color, opacity = 1) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}"><rect x="21" y="21" width="58" height="58" rx="9" transform="rotate(45 50 50)" fill="${color}" fill-opacity="${opacity}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

function ring(size, color, opacity, stroke = 1.2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}"><rect x="21" y="21" width="58" height="58" rx="9" transform="rotate(45 50 50)" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="${stroke}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/** Fit a headline: shrink the font for long titles. */
function titleSize(title) {
  const n = title.length
  if (n <= 14) return 112
  if (n <= 20) return 100
  if (n <= 26) return 88
  if (n <= 34) return 76
  if (n <= 48) return 64
  return 56
}

/**
 * @param {{ theme: 'ink' | 'paper', kicker: string, title: string, description: string, command?: string, footer: string, badge?: string }} card
 */
export function card({ theme, kicker, title, description, command, footer, badge, host }) {
  const ink = theme === 'ink'
  const fg = ink ? PAPER : INK
  const muted = ink ? '#A1A1AA' : '#52525B'
  const hair = ink ? 'rgba(255,255,255,0.10)' : 'rgba(10,10,10,0.10)'
  const cmdBg = ink ? '#141414' : '#FFFFFF'
  const cmdSize = command ? Math.min(25, Math.floor(1010 / (command.length * 0.6 + 2))) : 0

  const deco = h(
    'div',
    { position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex' },
    img(ring(560, ink ? LIME : INK, ink ? 0.16 : 0.08, 0.5), { position: 'absolute', left: 790, top: -170, width: 560, height: 560 }),
    img(ring(380, ink ? LIME : INK, ink ? 0.22 : 0.1, 0.7), { position: 'absolute', left: 880, top: -80, width: 380, height: 380 }),
    img(diamond(132, LIME), { position: 'absolute', left: 976, top: 112, width: 132, height: 132 }),
  )

  const brand = h(
    'div',
    { display: 'flex', alignItems: 'center', gap: 18 },
    img(LOGO, { width: 52, height: 52, borderRadius: 12, border: ink ? '1px solid rgba(255,255,255,0.14)' : 'none' }),
    h('div', { display: 'flex', fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }, 'Framekit UI'),
    badge ? h('div', { display: 'flex', marginLeft: 6, fontSize: 18, fontWeight: 500, color: muted, border: `1px solid ${hair}`, borderRadius: 999, padding: '6px 14px' }, badge) : null,
  )

  const body = h(
    'div',
    { display: 'flex', flexDirection: 'column', maxWidth: 960 },
    h(
      'div',
      { display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, fontWeight: 500, color: muted, textTransform: 'uppercase', letterSpacing: '0.14em' },
      h('div', { display: 'flex', width: 10, height: 10, borderRadius: 2, backgroundColor: LIME, transform: 'rotate(45deg)', border: ink ? 'none' : `1px solid ${INK}` }),
      kicker,
    ),
    h('div', { display: 'flex', marginTop: 12, fontFamily: 'Instrument Serif', fontSize: titleSize(title), lineHeight: 1.02, letterSpacing: '-0.02em', color: fg }, title),
    h('div', { display: 'flex', marginTop: 16, fontSize: 26, lineHeight: 1.35, color: muted, maxWidth: 940 }, description),
  )

  const bottom = h(
    'div',
    { display: 'flex', flexDirection: 'column' },
    command
      ? h(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 24px',
            borderRadius: 18,
            backgroundColor: cmdBg,
            border: `1px solid ${hair}`,
            fontFamily: 'Geist Mono',
            fontSize: cmdSize,
            color: fg,
          },
          h('div', { display: 'flex', color: ink ? LIME : '#4D7C0F', fontWeight: 500 }, '$'),
          h('div', { display: 'flex' }, command),
        )
      : null,
    h(
      'div',
      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: command ? 20 : 0, fontSize: 20, color: muted },
      h('div', { display: 'flex' }, footer),
      h('div', { display: 'flex', alignItems: 'center', gap: 10 }, h('div', { display: 'flex', width: 8, height: 8, borderRadius: 999, backgroundColor: LIME, border: ink ? 'none' : `1px solid ${INK}` }), host),
    ),
  )

  return h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      position: 'relative',
      backgroundColor: ink ? INK : PAPER,
      backgroundImage: ink
        ? 'radial-gradient(circle at 92% 8%, rgba(217,249,92,0.20), rgba(217,249,92,0) 42%)'
        : 'radial-gradient(circle at 92% 8%, rgba(217,249,92,0.55), rgba(217,249,92,0) 45%)',
      fontFamily: 'Geist',
      color: fg,
    },
    deco,
    h(
      'div',
      { position: 'absolute', left: 72, top: 56, width: 1056, height: 522, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
      brand,
      body,
      bottom,
    ),
  )
}

/**
 * Landing-page card (/og.png): logo + wordmark, the hero headline, the install pill and the site host.
 * @param {{ headline: string, host: string, pill: string }} spec
 */
export function homeCard({ headline, host, pill }) {
  const lines = headline.split(/(?<=\.)\s+/)
  return h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: PAPER,
      backgroundImage:
        'radial-gradient(ellipse 520px 300px at 50% 92%, rgba(217,249,92,0.55), rgba(217,249,92,0) 100%), linear-gradient(rgba(10,10,10,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.045) 1px, transparent 1px)',
      backgroundSize: '1200px 630px, 48px 48px, 48px 48px',
      fontFamily: 'Geist',
      color: INK,
    },
    h(
      'div',
      { display: 'flex', alignItems: 'center', gap: 26 },
      img(LOGO, { width: 96, height: 96 }),
      h('div', { display: 'flex', fontSize: 64, fontWeight: 600, letterSpacing: -2 }, 'Framekit'),
    ),
    h(
      'div',
      { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 34, fontFamily: 'Instrument Serif', fontSize: 104, lineHeight: 1.0, letterSpacing: -2 },
      ...lines.map((l) => h('div', { display: 'flex' }, l)),
    ),
    h(
      'div',
      { display: 'flex', alignItems: 'center', gap: 18, marginTop: 44 },
      h('div', { display: 'flex', backgroundColor: INK, color: PAPER, borderRadius: 999, padding: '10px 22px', fontFamily: 'Geist Mono', fontSize: 22 }, pill),
      h('div', { display: 'flex', fontSize: 24, color: '#52525B' }, host),
    ),
  )
}
