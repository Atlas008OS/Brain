import { detectArea } from './areas'
import type { ProcessRecord, ProcessStep, TranscriptLine } from '../types'

const STOPWORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'a', 'y', 'o', 'que', 'en', 'con', 'para',
  'por', 'es', 'yo', 'necesito', 'quiero', 'por favor', 'the', 'a', 'an', 'to', 'of', 'and', 'for', 'in', 'on',
  'is', 'i', 'need', 'want', 'please',
])

function titleFromTranscript(lines: TranscriptLine[]): string {
  const firstUser = lines.find((l) => l.speaker === 'user')?.text ?? 'Nueva sesión de voz'
  const words = firstUser
    .replace(/[.?!]+$/g, '')
    .split(/\s+/)
    .filter((w) => !STOPWORDS.has(w.toLowerCase()))
    .slice(0, 7)
  if (words.length === 0) return 'Nueva sesión de voz'
  const title = words.join(' ')
  return title.charAt(0).toUpperCase() + title.slice(1)
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)
}

function stepsFromTranscript(lines: TranscriptLine[]): ProcessStep[] {
  const agentSentences = lines
    .filter((l) => l.speaker === 'agent')
    .flatMap((l) => splitIntoSentences(l.text))

  const source = agentSentences.length > 0 ? agentSentences : lines.flatMap((l) => splitIntoSentences(l.text))

  if (source.length === 0) {
    return [
      {
        id: `s-${Date.now()}`,
        title: 'Revisar sesión capturada',
        description: 'No se detectaron pasos estructurados automáticamente — revisa la transcripción y añade pasos manualmente.',
        done: false,
      },
    ]
  }

  return source.slice(0, 6).map((sentence, i) => ({
    id: `s-${Date.now()}-${i}`,
    title: sentence.split(' ').slice(0, 5).join(' ').replace(/[,.]$/, ''),
    description: sentence,
    done: false,
  }))
}

export function buildProcessFromTranscript(lines: TranscriptLine[]): ProcessRecord {
  const now = new Date().toISOString()
  const summary =
    lines
      .filter((l) => l.speaker === 'agent')
      .map((l) => l.text)
      .join(' ')
      .slice(0, 220) || 'Capturado mediante una sesión de voz en vivo. Pendiente de revisión y estructuración.'

  const fullText = lines.map((l) => l.text).join(' ')
  const area = detectArea(fullText)

  return {
    id: `proc-${Date.now()}`,
    title: titleFromTranscript(lines),
    summary,
    status: 'Draft',
    category: area ?? 'Captura por Voz',
    area,
    tags: ['Voz', 'Auto-documentado'],
    createdAt: now,
    updatedAt: now,
    steps: stepsFromTranscript(lines),
    contributors: [{ id: 'c-you', name: 'Tú', role: 'Responsable de la sesión' }],
    timeToExecute: '—',
    complexity: 'Medium',
    efficiencyScore: 50,
    sourceType: 'voice',
    transcript: lines,
    aiSuggestions: area
      ? [`Confirmar el impacto estimado en horas/semana para el área de ${area}`, 'Confirmar responsables y asignados para cada paso']
      : ['Asignar este proceso a un área (Ventas, Marketing, Operaciones o Finanzas)', 'Confirmar responsables y asignados para cada paso'],
  }
}
