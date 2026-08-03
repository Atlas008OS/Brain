import { BarChart3, FolderKanban, Home, Mic, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/library', label: 'Biblioteca', icon: FolderKanban },
]

const TRAILING = [
  { to: '/analytics', label: 'Analítica', icon: BarChart3 },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-2 pb-[env(safe-area-inset-bottom)] pt-1 dark:border-white/10 dark:bg-ink/95">
      <div className="mx-auto flex max-w-md items-center justify-between px-2">
        {ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <NavLink to="/agent" className="relative -translate-y-4">
          {({ isActive }) => (
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full shadow-floating transition-colors ${
                isActive ? 'bg-brand-teal' : 'bg-ink'
              }`}
            >
              <Mic size={22} className="text-white" />
            </div>
          )}
        </NavLink>

        {TRAILING.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  return (
    <NavLink to={to} className="flex flex-col items-center gap-1 px-2 py-2 text-[11px]">
      {({ isActive }) => (
        <>
          <Icon size={20} className={isActive ? 'text-ink dark:text-white' : 'text-slate-400'} />
          <span className={isActive ? 'font-medium text-ink dark:text-white' : 'text-slate-400'}>{label}</span>
        </>
      )}
    </NavLink>
  )
}
