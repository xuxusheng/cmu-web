import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface SystemState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useSystemStore = create<SystemState>()((set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  setTheme: (theme: Theme) => {
    set({ theme })
    // 存入缓存
    localStorage.setItem('theme', theme)
  }
}))
