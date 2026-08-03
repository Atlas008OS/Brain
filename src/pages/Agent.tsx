import { Mic, MicOff, Settings, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { phaseLabel, VoiceBubble } from '../components/VoiceBubble'
import { useBrainOpsStore } from '../lib/store'
import { useVoiceAgent } from '../lib/voiceAgent'

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

export function Agent() {
  const navigate = useNavigate()
  const { phase, transcript, isMuted, toggleMute, start, stop, startedAt, errorMessage } = useVoiceAgent()
  const addProcessFromSession = useBrainOpsStore((s) => s.addProcessFromSession)
  const [elapsed, setElapsed] = useState(0)
  const transcriptEndRef = useRef<HTMLDivElement>(null)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    if (!startedAt) return
    const id = setInterval(() => setElapsed(Date.now() - startedAt), 1000)
    return () => clearInterval(id)
  }, [startedAt])

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  const handleStop = async () => {
    setFinishing(true)
    const lines = await stop()
    const process = addProcessFromSession(lines)
    setTimeout(() => navigate(`/editor/${process.id}`), 900)
  }

  const isActiveSession = phase === 'listening' || phase === 'speaking' || phase === 'connecting'

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-mist-100 via-mist-50 to-white pb-32">
      <header className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-ink">BrainOps</h1>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-card">
          Inteligencia del sistema activa
        </span>
      </header>

      <div className="flex flex-col items-center pb-4 pt-4">
        <VoiceBubble phase={finishing ? 'ended' : phase} size={200} />
        <div className="-mt-6 text-center">
          <h2 className="text-2xl font-bold text-ink">{finishing ? 'Documentando…' : phaseLabel(phase)}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {phase === 'error' ? errorMessage ?? 'Ocurrió un problema.' : 'Inteligencia del sistema activa'}
          </p>
        </div>
      </div>

      {(phase === 'idle' || phase === 'error' || phase === 'ended') && !finishing && (
        <div className="px-4 pb-2 pt-2 text-center">
          <button
            onClick={start}
            className="mx-auto flex items-center gap-2 rounded-2xl bg-ink px-6 py-3 font-semibold text-white shadow-floating"
          >
            <Mic size={18} /> {phase === 'error' ? 'Reintentar conexión' : 'Iniciar documentación'}
          </button>
        </div>
      )}

      <section className="px-4 pt-6">
        <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-card backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              📄 Transcripción en vivo
            </span>
            {isActiveSession && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" /> Grabando {formatDuration(elapsed)}
              </span>
            )}
          </div>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {transcript.length === 0 && (
              <p className="text-sm text-slate-400">
                {isActiveSession ? 'Esperando a que comience la conversación…' : 'Inicia una sesión para capturar tu nota de voz.'}
              </p>
            )}
            {transcript.map((line) =>
              line.speaker === 'user' ? (
                <p key={line.id} className="text-sm text-ink">
                  <span className="font-bold">Tú:</span> "{line.text}"
                </p>
              ) : (
                <p key={line.id} className="border-l-2 border-brand-blue pl-3 text-sm text-slate-700">
                  <span className="font-bold text-brand-navy">Agente:</span> "{line.text}"
                </p>
              ),
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      </section>

      <section className="px-4 pt-4">
        <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-card backdrop-blur">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Procesos activos</p>
          <div className="flex items-center justify-between rounded-xl bg-mist-50 px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">📊 Minería de datos</span>
            <span className="text-sm font-semibold text-brand-teal">
              {isActiveSession ? `${Math.min(99, 40 + Math.floor(elapsed / 400))}%` : '—'}
            </span>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-4 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
        <button
          onClick={toggleMute}
          disabled={!isActiveSession}
          className="flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-full bg-mist-100 text-slate-500 disabled:opacity-40"
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          onClick={handleStop}
          disabled={!isActiveSession || finishing}
          className="flex flex-1 max-w-[220px] items-center justify-center gap-2 rounded-full bg-rose-100 py-4 font-semibold text-rose-600 shadow-card disabled:opacity-40"
        >
          <Square size={16} fill="currentColor" /> {finishing ? 'Guardando…' : 'Detener agente'}
        </button>

        <button className="flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-full bg-mist-100 text-slate-500">
          <Settings size={20} />
        </button>
      </div>
    </div>
  )
}
