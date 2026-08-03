import { Bell, ChevronLeft, Moon, Sun, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../lib/theme'

export function TopBar({ title, back }: { title: string; back?: boolean }) {
  const navigate = useNavigate()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-ink/90">
      <div className="flex items-center gap-2">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Atrás"
            className="mr-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-bold tracking-tight text-ink dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          className="text-slate-500 hover:text-ink dark:text-slate-400 dark:hover:text-white"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button aria-label="Notificaciones" className="text-slate-500 hover:text-ink dark:text-slate-400 dark:hover:text-white">
          <Bell size={20} />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white dark:bg-white/10">
          <UserRound size={16} />
        </div>
      </div>
    </header>
  )
}
