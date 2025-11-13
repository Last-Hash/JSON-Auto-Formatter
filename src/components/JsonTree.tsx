import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react'
import { cn, copyToClipboard } from '@/lib/utils'

interface JsonTreeNodeProps {
  data: any
  path: string
  depth: number
  maxDepth: number
  searchTerm?: string
  expandAll?: boolean
  collapseAll?: boolean
}

export function JsonTreeNode({ data, path, depth, maxDepth, searchTerm = '', expandAll, collapseAll }: JsonTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < maxDepth)
  const [copied, setCopied] = useState(false)

  const isObject = typeof data === 'object' && data !== null
  const isArray = Array.isArray(data)
  const isEmpty = isObject && Object.keys(data).length === 0

  // Handle expand/collapse all
  useEffect(() => {
    if (expandAll) {
      setIsExpanded(true)
    }
  }, [expandAll])

  useEffect(() => {
    if (collapseAll) {
      setIsExpanded(depth < maxDepth)
    }
  }, [collapseAll, depth, maxDepth])

  // Highlight search matches
  const highlightText = (text: string) => {
    if (!searchTerm || typeof text !== 'string') return text
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">{part}</mark>
      ) : (
        part
      )
    )
  }

  const handleCopy = async (e: React.MouseEvent, value: string) => {
    e.stopPropagation()
    await copyToClipboard(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderValue = (value: any) => {
    if (value === null) {
      return <span className="json-null">null</span>
    }
    if (typeof value === 'boolean') {
      return <span className="json-boolean">{value.toString()}</span>
    }
    if (typeof value === 'number') {
      return <span className="json-number">{value}</span>
    }
    if (typeof value === 'string') {
      // Check if it's a URL
      if (/^https?:\/\//.test(value)) {
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="json-string underline hover:text-blue-700 dark:hover:text-blue-300"
            onClick={(e) => e.stopPropagation()}
          >
            "{highlightText(value)}"
          </a>
        )
      }
      return <span className="json-string">"{highlightText(value)}"</span>
    }
    return String(value)
  }

  if (!isObject) {
    return (
      <div className="flex items-center gap-2 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded px-1 group">
        <span>{renderValue(data)}</span>
        <button
          onClick={(e) => handleCopy(e, String(data))}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
          title="Copy value"
        >
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
    )
  }

  const entries = Object.entries(data)
  const preview = isEmpty ? (isArray ? '[]' : '{}') : isArray ? `Array(${entries.length})` : `Object`

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded px-1 cursor-pointer group",
          isExpanded && "font-medium"
        )}
        onClick={() => !isEmpty && setIsExpanded(!isExpanded)}
      >
        {!isEmpty && (
          <span className="text-gray-400">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {isEmpty && <span className="w-4" />}
        <span className="json-bracket">{isArray ? '[' : '{'}</span>
        {!isExpanded && (
          <>
            <span className="text-gray-500 text-sm ml-1">{preview}</span>
            <span className="json-bracket">{isArray ? ']' : '}'}</span>
          </>
        )}
        <button
          onClick={(e) => handleCopy(e, JSON.stringify(data, null, 2))}
          className="opacity-0 group-hover:opacity-100 ml-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
          title="Copy object"
        >
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      
      {isExpanded && !isEmpty && (
        <div className="tree-node ml-2">
          {entries.map(([key, value]) => (
            <div key={`${path}.${key}`} className="flex items-start gap-2 py-0.5">
              <span className="json-key">"{highlightText(key)}"</span>
              <span className="text-gray-500">:</span>
              <JsonTreeNode
                data={value}
                path={`${path}.${key}`}
                depth={depth + 1}
                maxDepth={maxDepth}
                searchTerm={searchTerm}
                expandAll={expandAll}
                collapseAll={collapseAll}
              />
            </div>
          ))}
        </div>
      )}
      
      {isExpanded && !isEmpty && (
        <div className="json-bracket pl-1">{isArray ? ']' : '}'}</div>
      )}
    </div>
  )
}

interface JsonTreeProps {
  data: any
  maxDepth?: number
  searchTerm?: string
}

export function JsonTree({ data, maxDepth = 3, searchTerm = '' }: JsonTreeProps) {
  const [expandAll, setExpandAll] = useState(false)
  const [collapseAll, setCollapseAll] = useState(false)

  useEffect(() => {
    const handleExpandAll = () => {
      setExpandAll(true)
      setTimeout(() => setExpandAll(false), 100)
    }

    const handleCollapseAll = () => {
      setCollapseAll(true)
      setTimeout(() => setCollapseAll(false), 100)
    }

    window.addEventListener('expandAll', handleExpandAll)
    window.addEventListener('collapseAll', handleCollapseAll)

    return () => {
      window.removeEventListener('expandAll', handleExpandAll)
      window.removeEventListener('collapseAll', handleCollapseAll)
    }
  }, [])

  return (
    <div className="font-mono text-sm p-4 custom-scrollbar overflow-auto">
      <JsonTreeNode 
        data={data} 
        path="root" 
        depth={0} 
        maxDepth={maxDepth} 
        searchTerm={searchTerm}
        expandAll={expandAll}
        collapseAll={collapseAll}
      />
    </div>
  )
}
