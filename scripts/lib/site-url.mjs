/**
 * Shared site URL for the Node build scripts. Single source of truth: src/docs/site-url.ts.
 * SITE_URL can be overridden with the SITE_URL env var (e.g. to test a local preview).
 */
import { loadTs } from './load-ts.mjs'

const site = await loadTs('src/docs/site-url.ts')
export const SITE_HOST = site.SITE_HOST
export const LEGACY_HOST = site.LEGACY_HOST
export const SITE_URL = (process.env.SITE_URL || site.SITE_URL_BASE).replace(/\/$/, '')
