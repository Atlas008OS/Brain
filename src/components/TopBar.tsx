import { Bell, ChevronLeft, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function TopBar({ title, back }: { title: string; back?: boolean }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Atrás"
            className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-bold tracking-tight text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button aria-label="Notificaciones" className="text-slate-500 hover:text-ink">
          <Bell size={20} />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
          <UserRound size={16} />
        </div>
      </div>
    </header>
  )
}
