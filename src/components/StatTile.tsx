export function StatTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex-1 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-card dark:border-white/10 dark:bg-ink-soft">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`text-lg font-bold ${accent ? 'text-brand-teal' : 'text-ink dark:text-white'}`}>{value}</p>
    </div>
  )
}
