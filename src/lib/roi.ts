import type { Area } from './areas'
import { AREAS } from './areas'
import type { ProcessRecord } from '../types'

export function computeRoiByArea(processes: ProcessRecord[]): Record<Area, number> {
  const totals = { Ventas: 0, Marketing: 0, Operaciones: 0, Finanzas: 0 } as Record<Area, number>
  for (const p of processes) {
    if (p.area && p.impactHoursPerWeek) {
      totals[p.area] += p.impactHoursPerWeek
    }
  }
  return totals
}

export function computeTotalRoiHours(processes: ProcessRecord[]): number {
  const totals = computeRoiByArea(processes)
  return AREAS.reduce((acc, area) => acc + totals[area], 0)
}
