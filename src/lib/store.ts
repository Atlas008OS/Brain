import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Area } from './areas'
import { AREAS } from './areas'
import { seedActivity, seedDepartments, seedProcesses } from './seed'
import { buildProcessFromTranscript } from './transcriptToProcess'
import type { ActivityEntry, DepartmentNode, ProcessRecord, TranscriptLine } from '../types'

interface BrainOpsState {
  processes: ProcessRecord[]
  departments: DepartmentNode[]
  activityLog: ActivityEntry[]

  addActivity: (text: string) => void
  addProcessFromSession: (lines: TranscriptLine[]) => ProcessRecord
  updateProcess: (id: string, patch: Partial<ProcessRecord>) => void
  toggleStep: (processId: string, stepId: string) => void
  addStep: (processId: string, title: string, description: string) => void
  removeStep: (processId: string, stepId: string) => void

  totalSOPs: () => number
  documentationCoveragePercent: () => number
  documentationDebtHours: () => number
  roiHoursByArea: () => Record<Area, number>
  totalRoiHours: () => number
}

export const useBrainOpsStore = create<BrainOpsState>()(
  persist(
    (set, get) => ({
      processes: seedProcesses,
      departments: seedDepartments,
      activityLog: seedActivity,

      addActivity: (text) =>
        set((state) => ({
          activityLog: [
            { id: `act-${Date.now()}`, text, timestamp: new Date().toISOString() },
            ...state.activityLog,
          ].slice(0, 50),
        })),

      addProcessFromSession: (lines) => {
        const process = buildProcessFromTranscript(lines)
        set((state) => ({ processes: [process, ...state.processes] }))
        get().addActivity(`Agent Brain completó la documentación de "${process.title}".`)
        return process
      },

      updateProcess: (id, patch) =>
        set((state) => ({
          processes: state.processes.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
          ),
        })),

      toggleStep: (processId, stepId) =>
        set((state) => ({
          processes: state.processes.map((p) =>
            p.id === processId
              ? {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  steps: p.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)),
                }
              : p,
          ),
        })),

      addStep: (processId, title, description) =>
        set((state) => ({
          processes: state.processes.map((p) =>
            p.id === processId
              ? {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  steps: [...p.steps, { id: `s-${Date.now()}`, title, description, done: false }],
                }
              : p,
          ),
        })),

      removeStep: (processId, stepId) =>
        set((state) => ({
          processes: state.processes.map((p) =>
            p.id === processId
              ? { ...p, updatedAt: new Date().toISOString(), steps: p.steps.filter((s) => s.id !== stepId) }
              : p,
          ),
        })),

      totalSOPs: () => get().processes.length,

      documentationCoveragePercent: () => {
        const procs = get().processes
        if (procs.length === 0) return 0
        const doneSteps = procs.flatMap((p) => p.steps)
        const completed = doneSteps.filter((s) => s.done).length
        const published = procs.filter((p) => p.status === 'Published').length
        const stepScore = doneSteps.length > 0 ? completed / doneSteps.length : 0
        const publishScore = published / procs.length
        return Math.round(((stepScore + publishScore) / 2) * 100)
      },

      documentationDebtHours: () => {
        const drafts = get().processes.filter((p) => p.status !== 'Published')
        return drafts.reduce((acc, p) => acc + Math.max(1, p.steps.filter((s) => !s.done).length * 2), 0)
      },

      roiHoursByArea: () => {
        const totals = { Ventas: 0, Marketing: 0, Operaciones: 0, Finanzas: 0 } as Record<Area, number>
        for (const p of get().processes) {
          if (p.area && p.impactHoursPerWeek) {
            totals[p.area] += p.impactHoursPerWeek
          }
        }
        return totals
      },

      totalRoiHours: () => {
        const totals = get().roiHoursByArea()
        return AREAS.reduce((acc, area) => acc + totals[area], 0)
      },
    }),
    {
      name: 'brainops-storage',
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as Partial<BrainOpsState> | undefined
        const hasNewShape = state?.departments?.every((d) => 'roiMetric' in d) ?? false
        if (!hasNewShape) {
          return { processes: seedProcesses, departments: seedDepartments, activityLog: seedActivity }
        }
        return state
      },
    },
  ),
)
