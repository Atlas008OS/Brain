import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProcessCard } from '../components/ProcessCard'
import { TopBar } from '../components/TopBar'
import { useBrainOpsStore } from '../lib/store'
import type { ProcessStatus } from '../types'

const PAGE_SIZE = 6
type FilterTab = 'All' | ProcessStatus

const TAB_LABELS: Record<FilterTab, string> = {
  All: 'Todos los procesos',
  Published: 'Publicados',
  Draft: 'Borradores',
  'Needs Review': 'Necesitan revisión',
}

export function Library() {
  const navigate = useNavigate()
  const processes = useBrainOpsStore((s) => s.processes)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<FilterTab>('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return processes.filter((p) => {
      const matchesTab = tab === 'All' || p.status === tab
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [processes, tab, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const counts = {
    All: processes.length,
    Published: processes.filter((p) => p.status === 'Published').length,
    Draft: processes.filter((p) => p.status === 'Draft').length,
  }

  return (
    <div className="pb-28">
      <TopBar title="BrainOps" />
      <div className="px-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink dark:text-white">Biblioteca de procesos</h2>
            <p className="text-sm text-slate-400">Gestiona y optimiza tus flujos de inteligencia operativa.</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/agent')}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3 font-semibold text-white shadow-card dark:bg-white dark:text-ink"
        >
          <Plus size={18} /> Nuevo proceso
        </button>

        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Buscar procesos, etiquetas o autores"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-blue dark:border-white/10 dark:bg-ink-soft dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 text-sm">
          {(['All', 'Published', 'Draft'] as FilterTab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t)
                setPage(1)
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                tab === t
                  ? 'bg-ink text-white dark:bg-white dark:text-ink'
                  : 'bg-mist-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'
              }`}
            >
              {TAB_LABELS[t]} ({counts[t as keyof typeof counts] ?? 0})
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {pageItems.length === 0 && (
            <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400 dark:border-white/10">
              Ningún proceso coincide con tu búsqueda.
            </p>
          )}
          {pageItems.map((process) => (
            <ProcessCard key={process.id} process={process} />
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>
              Mostrando {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}{' '}
              procesos
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 w-7 rounded-full border border-slate-200 disabled:opacity-30 dark:border-white/10"
              >
                ‹
              </button>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-white dark:bg-white dark:text-ink">
                {page}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 w-7 rounded-full border border-slate-200 disabled:opacity-30 dark:border-white/10"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
