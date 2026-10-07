"use client"

import * as React from "react"
import { computeLineDiff, DiffResult } from "../lib/text-diff-engine"
import { Button } from "@/components/ui/button"
import { GitCompare, Sparkles, Trash2, Copy, Check, ArrowRight, Plus, Minus } from "lucide-react"
import { toast } from "sonner"

const SAMPLE_ORIGINAL = `Chapter 1: The Beginning
In the beginning, we launched ToolHub as a simple PDF utility.
It had basic support for merging documents.
The performance was moderate.
Users wanted more document features.`

const SAMPLE_MODIFIED = `Chapter 1: The Beginning
In the beginning, we launched ToolHub as a high-speed document suite.
It had advanced support for merging and splitting documents.
The performance was blazingly fast.
Users loved the extensive document features and privacy guarantees.`

export function TextDiffTool() {
  const [original, setOriginal] = React.useState(SAMPLE_ORIGINAL)
  const [modified, setModified] = React.useState(SAMPLE_MODIFIED)
  const [diffResult, setDiffResult] = React.useState<DiffResult | null>(null)
  const [copied, setCopied] = React.useState(false)

  const handleCompare = React.useCallback(() => {
    const res = computeLineDiff(original, modified)
    setDiffResult(res)
  }, [original, modified])

  React.useEffect(() => {
    handleCompare()
  }, [handleCompare])

  const handleLoadSample = () => {
    setOriginal(SAMPLE_ORIGINAL)
    setModified(SAMPLE_MODIFIED)
    toast.success("Loaded sample texts")
  }

  const handleClear = () => {
    setOriginal("")
    setModified("")
    setDiffResult(null)
    toast.info("Cleared texts")
  }

  const handleCopyDiff = async () => {
    if (!diffResult) return
    const text = diffResult.lines
      .map((l) => {
        const prefix = l.type === "added" ? "+ " : l.type === "removed" ? "- " : "  "
        return prefix + l.content
      })
      .join("\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied diff output to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed border-[2px] border-on-background rounded-full font-label-bold text-xs uppercase tracking-wider mb-2">
          <GitCompare className="w-4 h-4 text-tertiary" /> Document Comparison
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl text-on-background mb-2">
          Document Comparator (Text Diff)
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Compare two versions of a document side-by-side and highlight additions, deletions, and modifications.
        </p>
      </div>

      {/* Input Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Original */}
        <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-error inline-block" /> Original Text
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              {original.split("\n").length} lines
            </span>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original document text here..."
            className="w-full h-56 p-3 bg-surface font-mono text-xs leading-relaxed border-2 border-on-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        {/* Modified */}
        <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-label-bold text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Modified Text
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              {modified.split("\n").length} lines
            </span>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste revised document text here..."
            className="w-full h-56 p-3 bg-surface font-mono text-xs leading-relaxed border-2 border-on-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-surface-container-low border-[3px] border-on-background rounded-xl p-3 neubrutal-shadow">
        <div className="flex items-center gap-3">
          {diffResult && (
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#d1f4e0] text-[#00875a] border border-[#00875a] font-bold">
                <Plus className="w-3 h-3" /> {diffResult.addedCount} Added
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#ffe6d5] text-[#e65c00] border border-[#e65c00] font-bold">
                <Minus className="w-3 h-3" /> {diffResult.removedCount} Removed
              </span>
              <span className="text-on-surface-variant">
                {diffResult.unchangedCount} Unchanged
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadSample} className="h-9 gap-1 text-xs">
            <Sparkles className="w-3.5 h-3.5" /> Sample
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyDiff} className="h-9 gap-1 text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Diff"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-9 gap-1 text-xs text-error hover:bg-error-container"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Diff Output Viewer */}
      <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow overflow-hidden">
        <div className="p-3 bg-surface-container border-b-[2px] border-on-background font-label-bold text-xs uppercase tracking-wider text-on-surface flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" /> Visual Diff Inspection
          </span>
          <span className="font-mono text-xs text-on-surface-variant">Unified View</span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed divide-y divide-surface-variant">
          {diffResult && diffResult.lines.length > 0 ? (
            diffResult.lines.map((line, idx) => {
              if (line.type === "added") {
                return (
                  <div key={idx} className="flex items-start gap-3 py-1 px-2 bg-[#d1f4e0]/60 text-[#006644]">
                    <span className="w-8 shrink-0 text-right select-none opacity-50 font-semibold">{line.newLineNumber}</span>
                    <span className="w-4 shrink-0 font-bold select-none">+</span>
                    <span className="flex-1 whitespace-pre-wrap font-medium">{line.content}</span>
                  </div>
                )
              }
              if (line.type === "removed") {
                return (
                  <div key={idx} className="flex items-start gap-3 py-1 px-2 bg-[#ffe6d5]/70 text-[#b34700]">
                    <span className="w-8 shrink-0 text-right select-none opacity-50 font-semibold">{line.oldLineNumber}</span>
                    <span className="w-4 shrink-0 font-bold select-none">-</span>
                    <span className="flex-1 whitespace-pre-wrap line-through opacity-80">{line.content}</span>
                  </div>
                )
              }
              return (
                <div key={idx} className="flex items-start gap-3 py-1 px-2 text-on-surface hover:bg-surface-container-low">
                  <span className="w-8 shrink-0 text-right select-none text-on-surface-variant opacity-40">{line.oldLineNumber}</span>
                  <span className="w-4 shrink-0 text-on-surface-variant opacity-40 select-none"> </span>
                  <span className="flex-1 whitespace-pre-wrap">{line.content}</span>
                </div>
              )
            })
          ) : (
            <p className="text-center py-8 text-on-surface-variant italic">
              Enter text in both boxes above to see diff comparisons.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
