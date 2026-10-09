// Run after deliberately replacing the same-layout eight-frame source asset.
// The component owns its frame coordinates; changing the atlas layout requires updating those too.
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const asset = fileURLToPath(new URL('../assets/cook-loading/chef-sprite.webp', import.meta.url))
const component = fileURLToPath(new URL('../src/components/ui/cook-loading.tsx', import.meta.url))
const source = fs.readFileSync(component, 'utf8')
const pattern = /const CHEF_SPRITE = 'data:image\/webp;base64,[A-Za-z0-9+/=]+'/
if (!pattern.test(source)) throw new Error('Embedded chef asset marker not found; no files changed.')
const data = fs.readFileSync(asset)
fs.writeFileSync(component, source.replace(pattern, `const CHEF_SPRITE = 'data:image/webp;base64,${data.toString('base64')}'`))
console.log(`Embedded ${data.length.toLocaleString()} bytes from chef-sprite.webp.`)
