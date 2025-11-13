import { Sun, Moon, Monitor } from 'lucide-react'
import { Theme } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  theme: Theme
  onChange: (theme: Theme) => void
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => onChange('light')}
        className={cn(
          "p-2 rounded transition-colors",
          theme === 'light' 
            ? "bg-white dark:bg-gray-700 shadow-sm" 
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
        title="Light theme"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('auto')}
        className={cn(
          "p-2 rounded transition-colors",
          theme === 'auto' 
            ? "bg-white dark:bg-gray-700 shadow-sm" 
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
        title="Auto (system)"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('dark')}
        className={cn(
          "p-2 rounded transition-colors",
          theme === 'dark' 
            ? "bg-white dark:bg-gray-700 shadow-sm" 
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        )}
        title="Dark theme"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  )
}
