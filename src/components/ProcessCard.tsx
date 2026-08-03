import { Link } from 'react-router-dom'
import { AREA_BADGE_STYLES, AREA_ICONS } from '../lib/areas'
import type { ProcessRecord } from '../types'

const STATUS_STYLES: Record<ProcessRecord['status'], string> = {
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-slate-200 text-slate-600',
  'Needs Review': 'bg-rose-100 text-rose-600',
}

const BORDER_STYLES: Record<ProcessRecord['status'], string> = {
  Published: 'border-l-brand-teal',
  Draft: 'border-l-slate-300',
  'Needs Review': 'border-l-rose-400',
}

const STATUS_LABELS: Record<ProcessRecord['status'], string> = {
  Published: 'Publicado',
  Draft: 'Borrador',
  'Needs Review': 'Necesita revisión',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Hace un momento'
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `Hace ${days}d`
  return new Date(iso).toLocaleDateString()
}

export function ProcessCard({ process }: { process: ProcessRecord }) {
  const actionLabel =
    process.status === 'Draft' ? 'Editar borrador' : process.status === 'Needs Review' ? 'Revisar ahora' : 'Ver detalles'

  return (
    <div
      className={`rounded-2xl border border-slate-100 border-l-4 bg-white p-4 shadow-card dark:border-white/10 dark:bg-ink-soft ${BORDER_STYLES[process.status]}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[process.status]}`}>
            {STATUS_LABELS[process.status]}
          </span>
          {process.area && (
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${AREA_BADGE_STYLES[process.area]}`}>
              {(() => {
                const AreaIcon = AREA_ICONS[process.area]
                return <AreaIcon size={11} />
              })()}
              {process.area}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400">{timeAgo(process.createdAt)}</span>
      </div>
      <h3 className="text-base font-semibold text-ink dark:text-white">{process.title}</h3>
      {process.owner && <p className="text-xs text-slate-400">Gestionado por {process.owner}</p>}

      {process.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {process.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-mist-100 px-2 py-0.5 text-[11px] text-brand-navy/70 dark:bg-white/10 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 rounded-xl bg-mist-50 p-3 dark:bg-white/5">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-brand-blue">Resumen IA</p>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{process.summary}</p>
      </div>

      {typeof process.impactHoursPerWeek === 'number' && process.impactHoursPerWeek > 0 && (
        <p className="mt-2 text-[11px] font-medium text-brand-teal">
          ⚡ Ahorra {process.impactHoursPerWeek}h/semana{process.impactNote ? ` — ${process.impactNote}` : ''}
        </p>
      )}

      {typeof process.efficiencyScore === 'number' && process.status === 'Published' && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Puntaje de eficiencia</span>
            <span className="font-semibold text-brand-teal">{process.efficiencyScore}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-brand-teal" style={{ width: `${process.efficiencyScore}%` }} />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-2">
          {process.contributors.slice(0, 3).map((c) => (
            <div
              key={c.id}
              title={c.name}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-blue text-[10px] font-semibold text-white dark:border-ink-soft"
            >
              {c.name.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
        <Link to={`/editor/${process.id}`} className="text-sm font-medium text-ink hover:underline dark:text-white">
          {actionLabel} →
        </Link>
      </div>
    </div>
  )
}
