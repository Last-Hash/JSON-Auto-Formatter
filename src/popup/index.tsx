import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Settings, Copy, Download, Info, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn, formatBytes } from '@/lib/utils'
import { ViewMode } from '@/lib/storage'
import '@/styles/globals.css'

function Popup() {
  const { 
    viewMode, 
    theme, 
    showLineNumbers,
    fontSize,
    expandDepth,
    loadSettings, 
    updateViewMode,
    updateTheme,
    updateSetting,
    isLoading 
  } = useSettingsStore()

  const [jsonInfo, setJsonInfo] = useState<{
    nodes: number
    depth: number
    size: number
    isValid: boolean
  } | null>(null)

  useEffect(() => {
    loadSettings()
    
    // Get info about current JSON from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getJsonInfo' }, (response) => {
          // Ignore connection errors - tab might not have content script
          if (chrome.runtime.lastError) {
            console.log('Content script not loaded on this page')
            return
          }
          if (response?.info) {
            setJsonInfo(response.info)
          }
        })
      }
    })
  }, [])

  const sendMessage = (action: string, data?: any) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action, ...data }, (_response) => {
          // Ignore connection errors - tab might not have content script
          if (chrome.runtime.lastError) {
            console.log('Content script not loaded on this page')
            return
          }
        })
      }
    })
  }

  const handleViewModeChange = (mode: ViewMode) => {
    updateViewMode(mode)
    sendMessage('setViewMode', { mode })
  }

  const handleCopyAll = () => {
    sendMessage('copyAll')
  }

  const handleDownload = () => {
    sendMessage('downloadJson')
  }

  const handleSearch = () => {
    sendMessage('toggleSearch')
  }

  if (isLoading) {
    return <div className="w-80 p-4">Loading...</div>
  }

  return (
    <div className="w-96 bg-background text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">JSON Formatter</h1>
            <p className="text-xs opacity-90">Modern JSON viewer & editor</p>
          </div>
          <Settings className="w-5 h-5 opacity-80" />
        </div>
      </div>

      {/* JSON Info */}
      {jsonInfo ? (
        <div className="p-4 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Document Info</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground">Nodes</div>
              <div className="font-mono font-semibold">{jsonInfo.nodes.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Depth</div>
              <div className="font-mono font-semibold">{jsonInfo.depth}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Size</div>
              <div className="font-mono font-semibold">{formatBytes(jsonInfo.size)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-muted/30 border-b border-border">
          <div className="text-sm text-muted-foreground text-center">
            Open a JSON file to see formatting options
          </div>
        </div>
      )}

      {/* View Mode */}
      <div className="p-4 border-b border-border">
        <label className="text-sm font-medium mb-2 block">View Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {(['tree', 'code', 'raw'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                viewMode === mode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <label className="text-sm font-medium mb-2 block">Quick Actions</label>
        <p className="text-xs text-muted-foreground mb-3">
          Use the toolbar on the JSON page for Copy, Download, and view switching
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSearch}
            disabled={!jsonInfo}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={handleCopyAll}
            disabled={!jsonInfo}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="w-4 h-4" />
            Copy All
          </button>
          <button
            onClick={handleDownload}
            disabled={!jsonInfo}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm col-span-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="p-4 border-b border-border">
        <label className="text-sm font-medium mb-2 block">Theme</label>
        <ThemeToggle theme={theme} onChange={updateTheme} />
      </div>

      {/* Settings */}
      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 flex items-center justify-between">
            <span>Show Line Numbers</span>
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => {
                updateSetting('showLineNumbers', e.target.checked)
                sendMessage('updateSettings', { showLineNumbers: e.target.checked })
              }}
              className="w-4 h-4"
            />
          </label>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Font Size: {fontSize}px
          </label>
          <input
            type="range"
            min="10"
            max="20"
            value={fontSize}
            onChange={(e) => {
              const size = parseInt(e.target.value)
              updateSetting('fontSize', size)
              sendMessage('updateSettings', { fontSize: size })
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Expand Depth: {expandDepth}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={expandDepth}
            onChange={(e) => {
              const depth = parseInt(e.target.value)
              updateSetting('expandDepth', depth)
              sendMessage('updateSettings', { expandDepth: depth })
            }}
            className="w-full"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-muted/30 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          JSON Auto Formatter v2.0
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Made with ❤️ by ProgrammerNomad
        </p>
      </div>
    </div>
  )
}

// Initialize React app
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<Popup />)
}
