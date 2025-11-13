// Suppress React DevTools message - must be before React imports
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true,
    inject: () => {},
    onCommitFiberRoot: () => {},
    onCommitFiberUnmount: () => {},
  }
}

import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { JsonTree } from '@/components/JsonTree'
import { JsonEditor } from '@/components/JsonEditor'
import { parseJson, extractJsonFromPage, isJsonContent, formatJson } from '@/lib/json-parser'
import { getSettings, ViewMode } from '@/lib/storage'
import { getJsonDepth, countJsonNodes, copyToClipboard } from '@/lib/utils'
import '@/styles/globals.css'
import './styles.css'

let jsonData: any = null
let rawJsonText: string = ''
let currentViewMode: ViewMode = 'tree'
let searchTerm: string = ''
let showSearch: boolean = false
let rootElement: HTMLElement | null = null
let reactRoot: any = null

// Check if this is a JSON page
function isJsonPage(): boolean {
  const contentType = document.contentType
  const url = window.location.href
  
  return isJsonContent(contentType, url)
}

// Initialize the formatter
async function init() {
  if (!isJsonPage()) return

  // Extract JSON content
  rawJsonText = extractJsonFromPage() || ''
  if (!rawJsonText) return

  // Parse JSON
  const result = parseJson(rawJsonText)
  if (!result.success) {
    console.error('Failed to parse JSON:', result.error)
    return
  }

  jsonData = result.data

  // Load settings (with fallback for sandboxed environments)
  let settings
  try {
    settings = await getSettings()
    currentViewMode = settings.viewMode
  } catch (error) {
    console.warn('Failed to load settings from storage, using defaults:', error)
    settings = {
      viewMode: 'tree' as ViewMode,
      theme: 'auto' as const,
      autoFormat: true,
      showLineNumbers: true,
      fontSize: 14,
      expandDepth: 3
    }
    currentViewMode = 'tree'
  }

  // Apply theme
  try {
    applyTheme(settings.theme)
  } catch (error) {
    console.warn('Failed to apply theme:', error)
  }

  // Render the formatter
  renderFormatter()

  // Listen for messages from popup
  try {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      handleMessage(request, sendResponse)
      return true // Required for async response
    })
  } catch (error) {
    console.warn('Failed to set up message listener:', error)
  }

  // Export to window for console access
  ;(window as any).json = jsonData
}

function applyTheme(theme: 'light' | 'dark' | 'auto') {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

function renderFormatter() {
  // Clear existing content and set up secure environment
  document.body.innerHTML = ''
  
  // Add CSP meta tag to suppress external script warnings
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' chrome-extension:; script-src 'self' 'unsafe-inline' 'unsafe-eval' chrome-extension:;"
  document.head.appendChild(meta)
  
  // Create root container
  if (!rootElement) {
    rootElement = document.createElement('div')
    rootElement.id = 'json-formatter-root'
    document.body.appendChild(rootElement)
  }

  // Render based on view mode
  renderView()
}

function renderView() {
  if (!rootElement) return

  if (currentViewMode === 'tree') {
    if (!reactRoot) {
      reactRoot = createRoot(rootElement)
    }
    reactRoot.render(
      <div className="min-h-screen bg-background text-foreground">
        <Toolbar />
        <JsonTree data={jsonData} maxDepth={3} searchTerm={searchTerm} />
      </div>
    )
  } else if (currentViewMode === 'code') {
    if (!reactRoot) {
      reactRoot = createRoot(rootElement)
    }
    reactRoot.render(
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Toolbar />
        <div className="flex-1">
          <JsonEditor 
            initialValue={formatJson(jsonData)} 
            showLineNumbers={true}
          />
        </div>
      </div>
    )
  } else if (currentViewMode === 'raw') {
    rootElement.innerHTML = `
      <div class="min-h-screen bg-background text-foreground">
        ${ToolbarHTML()}
        <pre class="p-4 font-mono text-sm whitespace-pre-wrap">${escapeHtml(rawJsonText)}</pre>
      </div>
    `
  }
}

function Toolbar() {
  const [isSearchVisible, setIsSearchVisible] = useState(showSearch)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const handleCopy = () => {
    copyToClipboard(formatJson(jsonData))
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy'))
  }

  const handleDownload = () => {
    downloadJson()
  }

  const handleExpandAll = () => {
    const event = new CustomEvent('expandAll')
    window.dispatchEvent(event)
  }

  const handleCollapseAll = () => {
    const event = new CustomEvent('collapseAll')
    window.dispatchEvent(event)
  }

  const handleSearchToggle = () => {
    showSearch = !showSearch
    setIsSearchVisible(showSearch)
    if (!showSearch) {
      searchTerm = ''
      setLocalSearchTerm('')
      renderView()
    }
  }

  const handleSearchChange = (value: string) => {
    searchTerm = value
    setLocalSearchTerm(value)
    renderView()
  }

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">JSON Formatter</h1>
            <div className="flex gap-2">
              <button
                onClick={() => switchViewMode('tree')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentViewMode === 'tree' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                Tree
              </button>
              <button
                onClick={() => switchViewMode('code')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentViewMode === 'code' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => switchViewMode('raw')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentViewMode === 'raw' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                Raw
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm opacity-90">
              {countJsonNodes(jsonData)} nodes • Depth: {getJsonDepth(jsonData)}
            </div>
            
            <div className="flex gap-2">
              {currentViewMode === 'tree' && (
                <>
                  <button
                    onClick={handleSearchToggle}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      isSearchVisible ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                    title="Search JSON"
                  >
                    Search
                  </button>
                  <button
                    onClick={handleExpandAll}
                    className="px-3 py-1 rounded text-sm hover:bg-white/10 transition-colors"
                    title="Expand All"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={handleCollapseAll}
                    className="px-3 py-1 rounded text-sm hover:bg-white/10 transition-colors"
                    title="Collapse All"
                  >
                    Collapse All
                  </button>
                </>
              )}
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded text-sm hover:bg-white/10 transition-colors"
                title="Copy to Clipboard"
              >
                Copy
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 rounded text-sm hover:bg-white/10 transition-colors"
                title="Download JSON"
              >
                Download
              </button>
            </div>
          </div>
        </div>
        {isSearchVisible && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search in JSON..."
              className="flex-1 px-3 py-2 rounded bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              autoFocus
            />
            <span className="text-sm opacity-90">
              {localSearchTerm && `Highlighting "${localSearchTerm}"`}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function ToolbarHTML(): string {
  return `
    <div class="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-lg font-bold">JSON Formatter</h1>
          <div class="flex gap-2">
            <button onclick="window.location.reload()" class="px-3 py-1 rounded text-sm ${currentViewMode === 'tree' ? 'bg-white/20' : 'hover:bg-white/10'}">Tree</button>
            <button onclick="window.location.reload()" class="px-3 py-1 rounded text-sm ${currentViewMode === 'code' ? 'bg-white/20' : 'hover:bg-white/10'}">Code</button>
            <button onclick="window.location.reload()" class="px-3 py-1 rounded text-sm ${currentViewMode === 'raw' ? 'bg-white/20' : 'hover:bg-white/10'}">Raw</button>
          </div>
        </div>
        <div class="text-sm opacity-90">
          ${countJsonNodes(jsonData)} nodes • Depth: ${getJsonDepth(jsonData)}
        </div>
      </div>
    </div>
  `
}

function switchViewMode(mode: ViewMode) {
  currentViewMode = mode
  renderView()
}

function handleMessage(request: any, sendResponse: (response: any) => void) {
  switch (request.action) {
    case 'getJsonInfo':
      sendResponse({
        info: {
          nodes: countJsonNodes(jsonData),
          depth: getJsonDepth(jsonData),
          size: rawJsonText.length,
          isValid: !!jsonData
        }
      })
      break

    case 'setViewMode':
      currentViewMode = request.mode
      renderView()
      sendResponse({ success: true })
      break

    case 'copyAll':
      copyToClipboard(formatJson(jsonData))
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error: error.message }))
      break

    case 'downloadJson':
      downloadJson()
      sendResponse({ success: true })
      break

    case 'toggleSearch':
      showSearch = !showSearch
      renderView()
      sendResponse({ success: true })
      break

    case 'updateSettings':
      renderView()
      sendResponse({ success: true })
      break

    default:
      sendResponse({ success: false, error: 'Unknown action' })
  }
}

function downloadJson() {
  const blob = new Blob([formatJson(jsonData)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `formatted-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Start the extension
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
