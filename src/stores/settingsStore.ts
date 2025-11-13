import { create } from 'zustand'
import { ViewMode, Theme, Settings, DEFAULT_SETTINGS, getSettings, saveSettings } from '@/lib/storage'

interface SettingsStore extends Settings {
  isLoading: boolean
  loadSettings: () => Promise<void>
  updateViewMode: (mode: ViewMode) => Promise<void>
  updateTheme: (theme: Theme) => Promise<void>
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...DEFAULT_SETTINGS,
  isLoading: true,

  loadSettings: async () => {
    const settings = await getSettings()
    set({ ...settings, isLoading: false })
  },

  updateViewMode: async (mode: ViewMode) => {
    await saveSettings({ viewMode: mode })
    set({ viewMode: mode })
  },

  updateTheme: async (theme: Theme) => {
    await saveSettings({ theme })
    set({ theme })
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // Auto mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },

  updateSetting: async (key, value) => {
    await saveSettings({ [key]: value })
    set({ [key]: value })
  }
}))
