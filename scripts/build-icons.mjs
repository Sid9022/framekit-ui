#!/usr/bin/env node
/**
 * One-off icon generator (outputs are committed to public/): renders the Keyframe mark to the PNG / ICO
 * sizes browsers and the web manifest expect. Re-run after changing the mark:  node scripts/build-icons.mjs
 *
 *   public/favicon-16.png, favicon-32.png, favicon.ico (16+32+48, PNG-in-ICO)   ← public/favicon.svg
 *   public/icon-192.png, icon-512.png       (purpose "any": rounded app tile)
 *   public/icon-maskable-512.png            (purpose "maskable": full-bleed, mark inside the 80% safe zone)
 */
import fs from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { ROOT } from './lib/load-ts.mjs'

const PUB = path.join(ROOT, 'public')
const INK = '#0A0A0A'
const PAPER = '#F8F8F8'
const LIME = '#D9F95C'
const F = 'M56 50A10 10 0 0 1 66 40L194 40A10 10 0 0 1 204 50L204 78A10 10 0 0 1 194 88L104 88L104 206A10 10 0 0 1 94 216L66 216A10 10 0 0 1 56 206Z'
const KEY = 'M167.05 114.95A7 7 0 0 1 176.95 114.95L213.05 151.05A7 7 0 0 1 213.05 160.95L176.95 197.05A7 7 0 0 1 167.05 197.05L130.95 160.95A7 7 0 0 1 130.95 151.05Z'

/** Mark bounds on its 256 grid: x 56–213, y 40–216 → centre (134.5, 128). */
const mark = (cx, cy, s) => `<g transform="translate(${cx - 134.5 * s} ${cy - 128 * s}) scale(${s})"><path fill="${PAPER}" d="${F}"/><path fill="${LIME}" d="${KEY}"/></g>`
const tile = (size, rx, markScale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${rx}" fill="${INK}"/>${mark(size / 2, size / 2, markScale)}</svg>`

const png = (svg, w) => new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng()
const favicon = fs.readFileSync(path.join(PUB, 'favicon.svg'), 'utf8')

const out = {
  'favicon-16.png': png(favicon, 16),
  'favicon-32.png': png(favicon, 32),
  // "any": rounded tile like the app icon (rx ≈ 22.5%), mark ~76% of the tile.
  'icon-192.png': png(tile(512, 116, 1.95), 192),
  'icon-512.png': png(tile(512, 116, 1.95), 512),
  // "maskable": square, full-bleed ink; mark ~45% wide so it survives circle / squircle masks (safe zone r = 40%).
  'icon-maskable-512.png': png(tile(512, 0, 1.45), 512),
}
for (const [name, buf] of Object.entries(out)) fs.writeFileSync(path.join(PUB, name), buf)

// favicon.ico with embedded PNGs (supported by every current browser and by Windows).
const icoImgs = [16, 32, 48].map((s) => ({ s, buf: png(favicon, s) }))
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(icoImgs.length, 4)
let offset = 6 + 16 * icoImgs.length
const dir = icoImgs.map(({ s, buf }) => {
  const e = Buffer.alloc(16)
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3)
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12)
  offset += buf.length
  return e
})
fs.writeFileSync(path.join(PUB, 'favicon.ico'), Buffer.concat([header, ...dir, ...icoImgs.map((i) => i.buf)]))
console.log('icons:', [...Object.keys(out), 'favicon.ico'].join(', '))
