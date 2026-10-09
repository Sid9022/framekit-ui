/* Demo helper shared by several docs demos. */


export const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))
