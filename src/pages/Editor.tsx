import { BrainCog, Image as ImageIcon, Plus, Save, Trash2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { useBrainOpsStore } from '../lib/store'

const STATUS_LABELS = {
  Draft: 'Borrador',
  'Needs Review': 'Necesita revisión',
  Published: 'Publicado',
} as const

const LEVEL_LABELS: Record<string, string> = {
  Low: 'Baja',
  Medium: 'Media',
  High: 'Alta',
}

export function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const process = useBrainOpsStore((s) => s.processes.find((p) => p.id === id))
  const toggleStep = useBrainOpsStore((s) => s.toggleStep)
  const addStep = useBrainOpsStore((s) => s.addStep)
  const removeStep = useBrainOpsStore((s) => s.removeStep)
  const updateProcess = useBrainOpsStore((s) => s.updateProcess)
  const [saved, setSaved] = useState(false)

  if (!process) {
    return (
      <div className="pb-28">
        <TopBar title="No encontrado" back />
        <p className="px-4 pt-6 text-sm text-slate-400">Este proceso ya no existe.</p>
      </div>
    )
  }

  const handleSave = () => {
    updateProcess(process.id, {})
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  const applySuggestion = (suggestion: string) => {
    addStep(process.id, suggestion, 'Sugerido por BrainOps Intelligence según procesos exitosos similares.')
  }

  return (
    <div className="pb-32">
      <TopBar title="BrainOps" back />
      <div className="px-4 pt-4">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 font-medium text-brand-blue">
            {process.sourceType === 'voice' ? 'Capturado por voz · Estructurado por IA' : 'Creado manualmente'}
          </span>
          <span>Modificado {new Date(process.updatedAt).toLocaleString()}</span>
        </div>

        <h2 className="text-2xl font-bold text-ink">{process.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{process.summary}</p>

        <div className="mt-3 flex gap-1.5">
          {(['Draft', 'Needs Review', 'Published'] as const).map((status) => (
            <button
              key={status}
              onClick={() => updateProcess(process.id, { status })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                process.status === status ? 'bg-ink text-white' : 'bg-mist-100 text-slate-500'
              }`}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {process.transcript && process.transcript.length > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-mist-50 px-3 py-2 text-xs text-slate-500">
            🎙️ Transcripción original de la sesión ({process.transcript.length} líneas)
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Pasos de ejecución</h3>
          <button
            onClick={() => applySuggestion('Nuevo paso manual')}
            className="flex items-center gap-1 text-sm font-medium text-brand-blue"
          >
            <Plus size={16} /> Añadir paso
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {process.steps.map((step) => (
            <div key={step.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
              <div className="flex gap-3">
                <input
                  type="checkbox"
                  checked={step.done}
                  onChange={() => toggleStep(process.id, step.id)}
                  className="mt-1 h-5 w-5 shrink-0 accent-ink"
                />
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold ${step.done ? 'text-slate-400 line-through' : 'text-ink'}`}>
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                  {(step.priority || step.assignee) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {step.priority && (
                        <span className="rounded-lg bg-mist-100 px-2 py-1 text-xs text-slate-600">
                          Prioridad: <span className="font-semibold">{LEVEL_LABELS[step.priority] ?? step.priority}</span>
                        </span>
                      )}
                      {step.assignee && (
                        <span className="rounded-lg bg-mist-100 px-2 py-1 text-xs text-slate-600">
                          Asignado a: <span className="font-semibold">{step.assignee}</span>
                        </span>
                      )}
                    </div>
                  )}
                  {process.sourceType === 'manual' && (
                    <button className="mt-2 flex items-center gap-1 rounded-lg border border-dashed border-slate-200 px-3 py-1.5 text-xs text-slate-400">
                      <ImageIcon size={13} /> Añadir imagen
                    </button>
                  )}
                </div>
                <button
                  onClick={() => removeStep(process.id, step.id)}
                  className="self-start text-slate-300 hover:text-rose-400"
                  aria-label="Eliminar paso"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {process.aiSuggestions && process.aiSuggestions.length > 0 && (
          <div className="mt-4 rounded-2xl bg-ink p-4 text-white shadow-card">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-teal">
              <BrainCog size={14} /> BrainOps Intelligence
            </p>
            <p className="mt-2 text-sm text-slate-300">
              He detectado que este proceso pertenece a <span className="font-semibold text-white">{process.category}</span>.
              Sugiriendo {process.aiSuggestions.length} pasos adicionales según las auditorías previas exitosas de tu
              equipo:
            </p>
            <ul className="mt-3 space-y-2">
              {process.aiSuggestions.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => applySuggestion(s)}
                    className="flex w-full items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10"
                  >
                    <Plus size={14} className="text-brand-teal" /> {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Colaboradores</h3>
        </div>
        <div className="mt-3 space-y-2">
          {process.contributors.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.role}</p>
                </div>
              </div>
            </div>
          ))}
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500">
            <UserPlus size={16} /> Invitar colaboradores
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
            <p className="text-[11px] uppercase text-slate-400">Tiempo de ejecución</p>
            <p className="text-lg font-bold text-ink">{process.timeToExecute ?? '—'}</p>
          </div>
          <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
            <p className="text-[11px] uppercase text-slate-400">Complejidad</p>
            <p className="text-lg font-bold text-brand-teal">
              {process.complexity ? LEVEL_LABELS[process.complexity] ?? process.complexity : '—'}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-floating transition-transform active:scale-95"
        aria-label="Guardar proceso"
      >
        <Save size={20} />
      </button>

      {saved && (
        <div className="fixed bottom-40 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white shadow-floating">
          Guardado en la Biblioteca de procesos
        </div>
      )}
    </div>
  )
}
