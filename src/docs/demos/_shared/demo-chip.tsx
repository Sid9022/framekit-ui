/* Demo helper shared by several docs demos. */


export const demoChip = (active: boolean) =>
  'rounded-full px-3 py-1.5 text-[11px] font-medium capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fuchsia-400 ' +
  (active
    ? 'bg-zinc-900/[0.06] text-zinc-900 ring-1 ring-black/10 dark:bg-white/12 dark:text-white dark:ring-white/15'
    : 'text-zinc-500 hover:bg-black/5 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200')
