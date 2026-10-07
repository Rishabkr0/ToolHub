"use client"

import * as React from "react"
import { convertCase, CaseType } from "../lib/case-converter-engine"
import { Button } from "@/components/ui/button"
import { Type, Copy, Trash2, Download, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface CaseOption {
  type: CaseType
  label: string
  sample: string
}

const CASE_OPTIONS: CaseOption[] = [
  { type: "sentence", label: "Sentence case", sample: "Sentence case text format." },
  { type: "lower", label: "lower case", sample: "lowercase letters only." },
  { type: "upper", label: "UPPER CASE", sample: "UPPERCASE LETTERS ONLY." },
  { type: "title", label: "Title Case", sample: "Title Case For Headlines" },
  { type: "camel", label: "camelCase", sample: "camelCaseIdentifier" },
  { type: "pascal", label: "PascalCase", sample: "PascalCaseIdentifier" },
  { type: "snake", label: "snake_case", sample: "snake_case_variable" },
  { type: "kebab", label: "kebab-case", sample: "kebab-case-slug" },
  { type: "constant", label: "CONSTANT_CASE", sample: "CONSTANT_CASE_VALUE" },
  { type: "alternating", label: "aLtErNaTiNg", sample: "aLtErNaTiNg cAsE" },
]

export function CaseConverterTool() {
  const [text, setText] = React.useState("")
  const [copied, setCopied] = React.useState(false)

  const handleConvert = (type: CaseType) => {
    if (!text) {
      toast.info("Please enter or paste some text first")
      return
    }
    const converted = convertCase(text, type)
    setText(converted)
    toast.success(`Converted to ${type} case`)
  }

  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setText("")
    toast.info("Cleared text")
  }

  const handleDownload = () => {
    if (!text) return
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted-text.txt"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Downloaded converted text")
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const charCount = text.length

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-fixed border-[2px] border-on-background rounded-full font-label-bold text-xs uppercase tracking-wider mb-2">
          <Type className="w-4 h-4 text-secondary" /> Text Transformation
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl text-on-background mb-2">
          Case Converter
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.
        </p>
      </div>

      <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow p-6 mb-8">
        {/* Buttons Bar */}
        <div className="mb-4">
          <span className="block font-label-bold text-xs uppercase tracking-wider text-on-surface-variant mb-3">
            Choose Target Format
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {CASE_OPTIONS.map((opt) => (
              <Button
                key={opt.type}
                variant="outline"
                size="sm"
                onClick={() => handleConvert(opt.type)}
                className="h-11 flex flex-col items-center justify-center py-1 px-2 border-2 text-xs font-bold hover:bg-primary-fixed hover:border-on-background transition-all"
              >
                <span>{opt.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here, then click any format above to transform it..."
            className="w-full min-h-[280px] p-4 bg-surface text-on-surface font-mono text-sm leading-relaxed border-2 border-on-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        {/* Actions & Metrics Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t-2 border-surface-variant">
          <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant">
            <span><strong>{wordCount}</strong> words</span>
            <span>•</span>
            <span><strong>{charCount}</strong> characters</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setText("The quick brown fox jumps over the lazy dog. Next-generation web applications deliver remarkable speed.")
                toast.success("Loaded sample text")
              }}
              className="h-9 gap-1 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" /> Sample
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!text}
              className="h-9 gap-1 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!text}
              className="h-9 gap-1 text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Download .txt
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={!text}
              className="h-9 gap-1 text-xs text-error hover:bg-error-container"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
