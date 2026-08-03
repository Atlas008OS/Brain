import { TopBar } from '../components/TopBar'
import { AREA_ICONS, AREAS } from '../lib/areas'
import { useBrainOpsStore } from '../lib/store'
import type { ProcessStatus } from '../types'

const STATUS_COLORS: Record<ProcessStatus, string> = {
  Published: '#1FC0B8',
  Draft: '#94A3B8',
  'Needs Review': '#F26D6D',
}

const STATUS_LABELS: Record<ProcessStatus, string> = {
  Published: 'Publicado',
  Draft: 'Borrador',
  'Needs Review': 'Necesita revisión',
}

export function Analytics() {
  const processes = useBrainOpsStore((s) => s.processes)
  const departments = useBrainOpsStore((s) => s.departments)
  const activityLog = useBrainOpsStore((s) => s.activityLog)
  const coverage = useBrainOpsStore((s) => s.documentationCoveragePercent())

  const statusCounts = (['Published', 'Draft', 'Needs Review'] as ProcessStatus[]).map((status) => ({
    status,
    count: processes.filter((p) => p.status === status).length,
  }))
  const maxCount = Math.max(1, ...statusCounts.map((s) => s.count))

  const voiceCaptured = processes.filter((p) => p.sourceType === 'voice').length
  const avgEfficiency = Math.round(
    processes.reduce((acc, p) => acc + (p.efficiencyScore ?? 0), 0) / Math.max(1, processes.length),
  )

  const roiByArea = useBrainOpsStore((s) => s.roiHoursByArea())
  const totalRoiHours = useBrainOpsStore((s) => s.totalRoiHours())
  const maxRoi = Math.max(1, ...AREAS.map((a) => roiByArea[a]))

  return (
    <div className="pb-28">
      <TopBar title="Analítica" />
      <div className="space-y-5 px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricTile label="Cobertura" value={`${coverage}%`} />
          <MetricTile label="Horas ahorradas / semana" value={`${totalRoiHours}h`} accent />
          <MetricTile label="Eficiencia prom." value={`${avgEfficiency}%`} />
          <MetricTile label="Capturados por voz" value={String(voiceCaptured)} />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card dark:border-white/10 dark:bg-ink-soft">
          <h3 className="mb-4 text-sm font-semibold text-ink dark:text-white">ROI por área (horas ahorradas / semana)</h3>
          <div className="space-y-3">
            {AREAS.map((area) => {
              const Icon = AREA_ICONS[area]
              const hours = roiByArea[area]
              return (
                <div key={area}>
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Icon size={13} /> {area}
                    </span>
                    <span className="font-semibold text-brand-teal">{hours}h</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-brand-teal transition-all"
                      style={{ width: `${(hours / maxRoi) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card dark:border-white/10 dark:bg-ink-soft">
          <h3 className="mb-4 text-sm font-semibold text-ink dark:text-white">Procesos por estado</h3>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => (
              <div key={status}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{STATUS_LABELS[status]}</span>
                  <span className="font-semibold text-ink dark:text-white">{count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(count / maxCount) * 100}%`, background: STATUS_COLORS[status] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card dark:border-white/10 dark:bg-ink-soft">
          <h3 className="mb-4 text-sm font-semibold text-ink dark:text-white">Completitud por departamento</h3>
          <div className="space-y-3">
            {departments.map((dept) => (
              <div key={dept.id}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{dept.name}</span>
                  <span className="font-semibold text-ink dark:text-white">{dept.completeness}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full rounded-full bg-brand-blue" style={{ width: `${dept.completeness}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card dark:border-white/10 dark:bg-ink-soft">
          <h3 className="mb-3 text-sm font-semibold text-ink dark:text-white">Auditoría completa</h3>
          <ul className="space-y-3">
            {activityLog.map((entry) => (
              <li key={entry.id} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" />
                <span className="text-slate-600 dark:text-slate-300">
                  {entry.text}
                  <span className="block text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString()}</span>
                </span>
              </li>
            ))}
            {activityLog.length === 0 && <p className="text-sm text-slate-400">Aún no hay actividad registrada.</p>}
          </ul>
        </div>
      </div>
    </div>
  )
}

function MetricTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-card dark:border-white/10 dark:bg-ink-soft">
      <p className={`text-lg font-bold ${accent ? 'text-brand-teal' : 'text-ink dark:text-white'}`}>{value}</p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  )
}
