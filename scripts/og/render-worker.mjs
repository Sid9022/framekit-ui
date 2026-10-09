/** Worker: renders OG cards (satori → resvg) and writes PNGs into the cache. Messages: { card, file }. */
import fs from 'node:fs'
import { parentPort } from 'node:worker_threads'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { card } from './template.mjs'
import { FONT_FILES } from './fonts.mjs'

const fonts = FONT_FILES.map((f) => ({ name: f.name, weight: f.weight, style: f.style, data: fs.readFileSync(f.file) }))

parentPort.on('message', async ({ card: spec, file }) => {
  try {
    const svg = await satori(card(spec), { width: 1200, height: 630, fonts })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 }, font: { loadSystemFonts: false } }).render().asPng()
    const tmp = `${file}.${process.pid}.tmp`
    fs.writeFileSync(tmp, png)
    fs.renameSync(tmp, file)
    parentPort.postMessage({ ok: true })
  } catch (e) {
    parentPort.postMessage({ error: `${spec.title}: ${e?.stack ?? e}` })
  }
})
