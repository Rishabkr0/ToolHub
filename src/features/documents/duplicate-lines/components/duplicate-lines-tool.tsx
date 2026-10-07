"use client"

import * as React from "react"
import { cleanDuplicateLines, DuplicateCleanerOptions, DuplicateCleanerResult } from "../lib/duplicate-lines-engine"
import { Button } from "@/components/ui/button"
import { ListFilter, Copy, Check, Download, Trash2, Sparkles, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const SAMPLE_LIST = `apple
banana
orange
apple
grapes
banana
Orange
mango
apple
peach`

export function DuplicateLinesTool() {
  const [input, setInput] = React.useState(SAMPLE_LIST)
  const [copied, setCopied] = React.useState(false)
  const [options, setOptions] = React.useState<DuplicateCleanerOptions>({
    caseSensitive: false,
    trimWhitespace: true,
    removeEmptyLines: true,
    sortOrder: "asc",
  })

  const result: DuplicateCleanerResult = React.useMemo(() => {
    return cleanDuplicateLines(input, options)
  }, [input, options])

  const handleCopy = async () => {
    if (!result.cleanedText) return
    await navigator.clipboard.writeText(result.cleanedText)
    setCopied(true)
    toast.success("Copied unique list to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result.cleanedText) return
    const blob = new Blob([result.cleanedText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cleaned-list.txt"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Downloaded unique lines file")
  }

  const handleClear = () => {
    setInput("")
    toast.info("Cleared list")
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed border-[2px] border-on-background rounded-full font-label-bold text-xs uppercase tracking-wider mb-2">
          <ListFilter className="w-4 h-4 text-primary" /> List Sanitation
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl text-on-background mb-2">
          Duplicate Line Remover & Sorter
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Quickly remove duplicate lines, filter out empty rows, and sort lists alphabetically or by length.
        </p>
      </div>

      {/* Options & Configuration Panel */}
      <div className="p-4 bg-surface-container-low border-[3px] border-on-background rounded-xl neubrutal-shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <div>
            <label className="block font-label-bold text-xs uppercase text-on-surface-variant mb-1">
              Sorting Mode
            </label>
            <select
              value={options.sortOrder}
              onChange={(e) => setOptions({ ...options, sortOrder: e.target.value as any })}
              className="w-full p-2 bg-surface text-on-surface text-xs font-mono font-medium border-2 border-on-background rounded focus:outline-none"
            >
              <option value="original">Preserve Original Order</option>
              <option value="asc">Alphabetical (A → Z)</option>
              <option value="desc">Alphabetical (Z → A)</option>
              <option value="length-asc">Shortest First</option>
              <option value="length-desc">Longest First</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-4 sm:pt-0">
            <input
              type="checkbox"
              checked={options.caseSensitive}
              onChange={(e) => setOptions({ ...options, caseSensitive: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-xs font-bold text-on-surface">Case Sensitive</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.trimWhitespace}
              onChange={(e) => setOptions({ ...options, trimWhitespace: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-xs font-bold text-on-surface">Trim Whitespace</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.removeEmptyLines}
              onChange={(e) => setOptions({ ...options, removeEmptyLines: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-xs font-bold text-on-surface">Remove Empty Rows</span>
          </label>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-surface-container-lowest border-[2px] border-on-background rounded-lg text-center">
          <span className="block text-2xl font-bold font-mono">{result.originalCount}</span>
          <span className="text-xs uppercase text-on-surface-variant font-bold">Input Lines</span>
        </div>
        <div className="p-3 bg-surface-container-lowest border-[2px] border-on-background rounded-lg text-center">
          <span className="block text-2xl font-bold font-mono text-primary">{result.cleanedCount}</span>
          <span className="text-xs uppercase text-on-surface-variant font-bold">Unique Lines</span>
        </div>
        <div className="p-3 bg-surface-container-lowest border-[2px] border-on-background rounded-lg text-center">
          <span className="block text-2xl font-bold font-mono text-secondary">{Math.max(0, result.removedCount)}</span>
          <span className="text-xs uppercase text-on-surface-variant font-bold">Removed</span>
        </div>
      </div>

      {/* Editor Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant">
              Input List
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInput(SAMPLE_LIST)}
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Sample
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-bold text-error hover:underline inline-flex items-center gap-1 ml-2"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your lines here..."
            className="w-full flex-1 min-h-[350px] p-3 bg-surface font-mono text-xs leading-relaxed border-2 border-on-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        {/* Output */}
        <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4" /> Deduplicated & Cleaned List
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!result.cleanedText}
                className="h-8 gap-1 text-xs"
              >
                {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!result.cleanedText}
                className="h-8 gap-1 text-xs"
              >
                <Download className="w-3 h-3" /> Save
              </Button>
            </div>
          </div>
          <textarea
            readOnly
            value={result.cleanedText}
            placeholder="Cleaned list will appear here..."
            className="w-full flex-1 min-h-[350px] p-3 bg-surface-container-low font-mono text-xs leading-relaxed border-2 border-on-background rounded-lg focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  )
}
