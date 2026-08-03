import { motion } from 'framer-motion'
import type { AgentPhase } from '../lib/voiceAgent'

const PHASE_COLORS: Record<AgentPhase, { core: string; ring1: string; ring2: string; label: string }> = {
  idle: { core: '#CBD5E1', ring1: '#E2E8F0', ring2: '#F1F5F9', label: '#64748B' },
  connecting: { core: '#F5C453', ring1: '#FDE9B4', ring2: '#FEF6E0', label: '#B8860B' },
  listening: { core: '#3DA9E0', ring1: '#9AD3F0', ring2: '#DCEEFB', label: '#1F5C86' },
  speaking: { core: '#1FC0B8', ring1: '#8CE4DE', ring2: '#DBFAF7', label: '#0F7A73' },
  ended: { core: '#94A3B8', ring1: '#E2E8F0', ring2: '#F1F5F9', label: '#475569' },
  error: { core: '#F26D6D', ring1: '#FBC7C7', ring2: '#FDE8E8', label: '#B42323' },
}

export function VoiceBubble({ phase, size = 260 }: { phase: AgentPhase; size?: number }) {
  const colors = PHASE_COLORS[phase]
  const active = phase === 'listening' || phase === 'speaking'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute rounded-full animate-blobDrift"
        style={{ width: size * 1.35, height: size * 1.35, background: colors.ring2 }}
        animate={{ scale: active ? [1, 1.08, 1] : 1 }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full animate-blobDrift"
        style={{ width: size * 1.05, height: size * 1.05, background: colors.ring1 }}
        animate={{ scale: active ? [1, phase === 'speaking' ? 1.18 : 1.1, 1] : 1 }}
        transition={{ duration: phase === 'speaking' ? 1.4 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full shadow-floating"
        style={{ width: size * 0.62, height: size * 0.62, background: colors.core }}
        animate={{
          scale: phase === 'speaking' ? [1, 1.12, 0.96, 1.08, 1] : active ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: phase === 'speaking' ? 1.1 : 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {phase === 'connecting' && (
        <motion.div
          className="absolute rounded-full border-2 border-dashed"
          style={{ width: size * 0.8, height: size * 0.8, borderColor: colors.core }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  )
}

export function phaseLabel(phase: AgentPhase) {
  switch (phase) {
    case 'idle':
      return 'Listo'
    case 'connecting':
      return 'Conectando…'
    case 'listening':
      return 'Escuchando…'
    case 'speaking':
      return 'Hablando…'
    case 'ended':
      return 'Sesión finalizada'
    case 'error':
      return 'Problema de conexión'
  }
}
