import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { parseJson } from '@/lib/json-parser'

interface JsonEditorProps {
  initialValue: string
  onChange?: (value: string, isValid: boolean) => void
  showLineNumbers?: boolean
}

export function JsonEditor({ initialValue, onChange, showLineNumbers = true }: JsonEditorProps) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(lines)

    // Validate JSON
    const result = parseJson(value)
    if (result.success) {
      setError(null)
      onChange?.(value, true)
    } else {
      setError(result.error?.message || 'Invalid JSON')
      onChange?.(value, false)
    }
  }, [value, onChange])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex-1 flex overflow-hidden">
        {showLineNumbers && (
          <div className="bg-gray-50 dark:bg-gray-900 px-2 py-4 text-right text-gray-500 dark:text-gray-400 text-sm font-mono select-none border-r border-gray-200 dark:border-gray-700">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="leading-6">{i + 1}</div>
            ))}
          </div>
        )}
        <textarea
          value={value}
          onChange={handleChange}
          className="flex-1 p-4 bg-transparent font-mono text-sm resize-none outline-none custom-scrollbar"
          spellCheck={false}
          placeholder="Enter JSON here..."
        />
      </div>
    </div>
  )
}
