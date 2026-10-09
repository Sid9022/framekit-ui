/* Demo helper shared by several docs demos. */


export function FailSwitch({ on, onChange, label = 'Simulate failure', light = false }: { on: boolean; onChange: (v: boolean) => void; label?: string; light?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={
        'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-300 ' +
        (light ? 'text-[#5b4636] hover:bg-black/5' : 'text-zinc-500 hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/5')
      }
    >
      <span className={'relative inline-block h-4 w-7 shrink-0 rounded-full transition-colors ' + (on ? 'bg-rose-500' : light ? 'bg-black/15' : 'bg-black/15 dark:bg-white/15')}>
        <span className={'absolute left-0 top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ' + (on ? 'translate-x-3.5' : 'translate-x-0.5')} />
      </span>
      {label}
    </button>
  )
}
