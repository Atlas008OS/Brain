import { Bell, Mic, Shield, Trash2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { TopBar } from '../components/TopBar'
import { AGENT_ID } from '../lib/voiceAgent'

export function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [autoPublish, setAutoPublish] = useState(false)

  const clearData = () => {
    if (confirm('Esto borrará todos los procesos y la actividad guardados localmente. ¿Continuar?')) {
      localStorage.removeItem('brainops-storage')
      window.location.reload()
    }
  }

  return (
    <div className="pb-28">
      <TopBar title="Ajustes" />
      <div className="space-y-5 px-4 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
            <UserRound size={20} />
          </div>
          <div>
            <p className="font-semibold text-ink">alejo.lopez191104@gmail.com</p>
            <p className="text-xs text-slate-400">Propietario del workspace de BrainOps</p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <Mic size={16} /> Agente de voz
          </h3>
          <div className="flex items-center justify-between rounded-xl bg-mist-50 px-3 py-2 text-sm">
            <span className="text-slate-500">ID del agente</span>
            <span className="font-mono text-xs text-ink">{AGENT_ID}</span>
          </div>
          <ToggleRow
            label="Publicar automáticamente SOPs con alta confianza"
            description="Omite 'Necesita revisión' cuando el agente captura con más del 90% de confianza."
            checked={autoPublish}
            onChange={setAutoPublish}
          />
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <Bell size={16} /> Notificaciones
          </h3>
          <ToggleRow
            label="Alertas de actividad"
            description="Recibe una notificación cuando el agente documente o marque un proceso."
            checked={notifications}
            onChange={setNotifications}
          />
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <Shield size={16} /> Datos
          </h3>
          <p className="mb-3 text-xs text-slate-400">
            Todos los procesos y la actividad se almacenan localmente en este navegador (sin base de datos en servidor
            configurada).
          </p>
          <button
            onClick={clearData}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-500"
          >
            <Trash2 size={16} /> Borrar datos locales
          </button>
        </section>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-slate-400">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-9 shrink-0 accent-ink"
      />
    </label>
  )
}
