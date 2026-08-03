import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const prefersDark =
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: prefersDark ? 'dark' : 'light',
      toggleTheme: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
        applyThemeClass(next)
        set({ theme: next })
      },
      setTheme: (theme) => {
        applyThemeClass(theme)
        set({ theme })
      },
    }),
    {
      name: 'brainops-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeClass(state.theme)
      },
    },
  ),
)
