import { ChevronRight, Mic, Sparkles } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProgressRing } from '../components/ProgressRing'
import { TopBar } from '../components/TopBar'
import { AREA_ICONS } from '../lib/areas'
import { computeRoiByArea, computeTotalRoiHours } from '../lib/roi'
import { useBrainOpsStore } from '../lib/store'
import { useVoiceAgent } from '../lib/voiceAgent'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)}d`
}

export function Home() {
  const navigate = useNavigate()
  const { start } = useVoiceAgent()
  const departments = useBrainOpsStore((s) => s.departments)
  const activityLog = useBrainOpsStore((s) => s.activityLog)
  const processes = useBrainOpsStore((s) => s.processes)
  const totalSOPs = useBrainOpsStore((s) => s.totalSOPs())
  const coverage = useBrainOpsStore((s) => s.documentationCoveragePercent())
  const debtHours = useBrainOpsStore((s) => s.documentationDebtHours())
  const roiByArea = useMemo(() => computeRoiByArea(processes), [processes])
  const totalRoiHours = useMemo(() => computeTotalRoiHours(processes), [processes])

  const handleStart = async () => {
    navigate('/agent')
    await start()
  }

  return (
    <div className="pb-28">
      <TopBar title="BrainOps" />

      <section className="px-4 pt-4">
        <div className="rounded-3xl bg-ink px-5 py-6 text-white shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-blue">Comando de sesión</p>
          <h2 className="mt-1 text-2xl font-bold leading-tight">Documenta la operación mientras trabajas.</h2>
          <p className="mt-2 text-sm text-slate-300">
            El agente de IA está escuchando y listo para documentar tus flujos de trabajo en vivo. Solo haz clic
            para iniciar la sincronización cognitiva.
          </p>
          <button
            onClick={handleStart}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left text-ink shadow-floating transition-transform active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
              <Mic size={18} />
            </span>
            <span>
              <span className="block text-sm font-bold">Iniciar documentación</span>
              <span className="block text-xs text-slate-500">Agente de voz · Modo de sincronización activa</span>
            </span>
          </button>
        </div>
      </section>

      <section className="px-4 pt-5">
        <div className="rounded-3xl bg-ink px-5 py-6 text-white shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-300">Cobertura de documentación de procesos</p>
            <Sparkles size={16} className="text-brand-teal" />
          </div>
          <div className="relative mx-auto mt-2 flex h-32 w-32 items-center justify-center">
            <ProgressRing percent={coverage} />
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold">{coverage}%</span>
              <span className="text-[10px] uppercase tracking-wide text-brand-teal">Optimizado</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-xl bg-white/5 p-3 text-center">
              <p className="text-[11px] text-slate-400">SOPs totales</p>
              <p className="text-lg font-bold">{totalSOPs}</p>
            </div>
            <div className="flex-1 rounded-xl bg-white/5 p-3 text-center">
              <p className="text-[11px] text-slate-400">Deuda de documentación</p>
              <p className="text-lg font-bold">{debtHours}h</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink dark:text-white">Áreas que generan ROI</h3>
          <button onClick={() => navigate('/library')} className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
            Ver catálogo <ChevronRight size={14} />
          </button>
        </div>
        <p className="mb-3 text-xs text-slate-400">Ventas, Marketing, Operaciones y Finanzas — documentación e impacto por área.</p>
        <div className="space-y-3">
          {departments.map((dept) => {
            const Icon = AREA_ICONS[dept.icon]
            const liveRoi = roiByArea[dept.icon]
            return (
              <div key={dept.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card dark:border-white/10 dark:bg-ink-soft">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink dark:text-white">{dept.name}</p>
                      <span className="text-right">
                        <span className="block text-sm font-bold text-brand-teal">
                          {liveRoi > 0 ? `${liveRoi}h` : dept.roiValue}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {liveRoi > 0 ? 'horas ahorradas / semana' : dept.roiMetric}
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{dept.description}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Completitud</span>
                      <span className="font-semibold text-ink dark:text-white">{dept.completeness}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div className="h-full rounded-full bg-brand-blue" style={{ width: `${dept.completeness}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h3 className="mb-3 text-lg font-bold text-ink dark:text-white">Registro de actividad</h3>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card dark:border-white/10 dark:bg-ink-soft">
          <ul className="space-y-3">
            {activityLog.slice(0, 4).map((entry) => (
              <li key={entry.id} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" />
                <span className="text-slate-600 dark:text-slate-300">
                  {entry.text} <span className="text-xs text-slate-400">· {timeAgo(entry.timestamp)}</span>
                </span>
              </li>
            ))}
          </ul>
          <button onClick={() => navigate('/analytics')} className="mt-3 text-xs font-medium text-slate-500 hover:underline dark:text-slate-400">
            Ver auditoría completa
          </button>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="rounded-3xl bg-gradient-to-br from-brand-navy to-ink p-5 text-white shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-teal">Insight</p>
          <h4 className="mt-1 text-lg font-bold">ROI acumulado por documentación</h4>
          <p className="mt-1 text-sm text-slate-300">
            {totalRoiHours > 0
              ? `Tus ${totalSOPs} procesos documentados están ahorrando ${totalRoiHours}h/semana en tu operación (~${totalRoiHours * 4}h/mes) entre Ventas, Marketing, Operaciones y Finanzas.`
              : 'Aún no has registrado el impacto estimado de tus procesos. Añade horas ahorradas por semana en cada proceso para ver tu ROI acumulado aquí.'}
          </p>
          <button
            onClick={() => navigate('/analytics')}
            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink"
          >
            Ver detalle de ROI
          </button>
        </div>
      </section>
    </div>
  )
}
