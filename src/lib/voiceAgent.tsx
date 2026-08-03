import { useConversation } from '@elevenlabs/react'
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { TranscriptLine } from '../types'

export const AGENT_ID = 'agent_6501kz2xb6zefavrwzkzdwtepvth'

export type AgentPhase = 'idle' | 'connecting' | 'listening' | 'speaking' | 'ended' | 'error'

interface IncomingMessage {
  source?: string
  role?: string
  message?: string
  text?: string
}

interface VoiceAgentContextValue {
  phase: AgentPhase
  isMuted: boolean
  transcript: TranscriptLine[]
  errorMessage: string | null
  startedAt: number | null
  start: () => Promise<void>
  stop: () => Promise<TranscriptLine[]>
  toggleMute: () => void
  clearError: () => void
}

const VoiceAgentContext = createContext<VoiceAgentContextValue | null>(null)

export function VoiceAgentProvider({ children }: { children: ReactNode }) {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([])
  const [phase, setPhase] = useState<AgentPhase>('idle')
  const [isMuted, setIsMuted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const transcriptRef = useRef<TranscriptLine[]>([])

  const pushLine = useCallback((speaker: 'user' | 'agent', text: string) => {
    if (!text) return
    setTranscript((prev) => {
      const next = [...prev, { id: `t-${Date.now()}-${prev.length}`, speaker, text, timestamp: new Date().toISOString() }]
      transcriptRef.current = next
      return next
    })
  }, [])

  const conversation = useConversation({
    onConnect: () => setPhase('listening'),
    onDisconnect: () => setPhase((p) => (p === 'error' ? p : 'ended')),
    onMessage: (message: IncomingMessage) => {
      const speaker = message.source === 'user' || message.role === 'user' ? 'user' : 'agent'
      const text = message.message ?? message.text ?? ''
      pushLine(speaker, text)
    },
    onError: (error: unknown) => {
      const msg = typeof error === 'string' ? error : 'Error de conexión con el agente de voz.'
      setErrorMessage(msg)
      setPhase('error')
    },
    onModeChange: (mode: { mode: string }) => {
      if (mode?.mode === 'speaking') setPhase('speaking')
      else if (mode?.mode === 'listening') setPhase('listening')
    },
  })

  const start = useCallback(async () => {
    setErrorMessage(null)
    setTranscript([])
    transcriptRef.current = []
    setPhase('connecting')
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      await conversation.startSession({ agentId: AGENT_ID, connectionType: 'webrtc' })
      setStartedAt(Date.now())
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Se necesita acceso al micrófono para iniciar la sesión de documentación.',
      )
      setPhase('error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stop = useCallback(async () => {
    try {
      await conversation.endSession()
    } catch {
      // session may already be closed
    }
    setPhase('ended')
    setStartedAt(null)
    return transcriptRef.current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev
      conversation.setVolume?.({ volume: next ? 0 : 1 })
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearError = useCallback(() => setErrorMessage(null), [])

  const value = useMemo(
    () => ({ phase, isMuted, transcript, errorMessage, startedAt, start, stop, toggleMute, clearError }),
    [phase, isMuted, transcript, errorMessage, startedAt, start, stop, toggleMute, clearError],
  )

  return <VoiceAgentContext.Provider value={value}>{children}</VoiceAgentContext.Provider>
}

export function useVoiceAgent() {
  const ctx = useContext(VoiceAgentContext)
  if (!ctx) throw new Error('useVoiceAgent must be used within VoiceAgentProvider')
  return ctx
}
