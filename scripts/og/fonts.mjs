import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const f = (pkg, file) => require.resolve(`${pkg}/files/${file}`)

/** WOFF (satori reads TTF/OTF/WOFF, not WOFF2) from @fontsource, so the build needs no network or system fonts. */
export const FONT_FILES = [
  { name: 'Geist', weight: 400, style: 'normal', file: f('@fontsource/geist-sans', 'geist-sans-latin-400-normal.woff') },
  { name: 'Geist', weight: 500, style: 'normal', file: f('@fontsource/geist-sans', 'geist-sans-latin-500-normal.woff') },
  { name: 'Geist', weight: 600, style: 'normal', file: f('@fontsource/geist-sans', 'geist-sans-latin-600-normal.woff') },
  { name: 'Geist Mono', weight: 400, style: 'normal', file: f('@fontsource/geist-mono', 'geist-mono-latin-400-normal.woff') },
  { name: 'Geist Mono', weight: 500, style: 'normal', file: f('@fontsource/geist-mono', 'geist-mono-latin-500-normal.woff') },
  { name: 'Instrument Serif', weight: 400, style: 'normal', file: f('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff') },
]
