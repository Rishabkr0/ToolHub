"use client"

import * as React from "react"
import { analyzeText, DocumentStats } from "../lib/word-counter-engine"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Copy, 
  Trash2, 
  Upload, 
  Clock, 
  Volume2, 
  Sparkles, 
  Check, 
  BookOpen, 
  BarChart2 
} from "lucide-react"
import { toast } from "sonner"

const SAMPLE_TEXT = `ToolHub is a modern, privacy-first productivity suite built with Next.js and React. All document manipulation happens directly in your browser using high-performance client-side engines. This ensures that sensitive documents, contracts, and financial spreadsheets never leave your device. 

By running tools directly in the browser, users enjoy zero latency, unlimited file processing without paywalls, and complete data privacy. Explore our tools for PDF editing, document formatting, developer utilities, and daily productivity.`

export function WordCounterTool() {
  const [text, setText] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const stats: DocumentStats = React.useMemo(() => analyzeText(text), [text])

  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Text copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setText("")
    toast.info("Text cleared")
  }

  const handleLoadSample = () => {
    setText(SAMPLE_TEXT)
    toast.success("Sample text loaded")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.match(/\.(txt|md|markdown|json|csv|log)$/i)) {
      toast.error("Please upload a text file (.txt, .md, .csv, .json).")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setText(content || "")
      toast.success(`Loaded "${file.name}"`)
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Tool Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed border-[2px] border-on-background rounded-full font-label-bold text-xs uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4 text-primary" /> Document Analytics
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl text-on-background mb-2">
          Word Counter & Text Analyzer
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Analyze text volume, character counts, readability, reading time, and keyword density in real-time.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="p-4 bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow flex flex-col justify-center items-center text-center">
          <span className="font-display-lg text-3xl font-bold text-primary">{stats.words}</span>
          <span className="font-label-bold text-xs text-on-surface-variant uppercase mt-1">Words</span>
        </div>

        <div className="p-4 bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow flex flex-col justify-center items-center text-center">
          <span className="font-display-lg text-3xl font-bold text-secondary">{stats.characters}</span>
          <span className="font-label-bold text-xs text-on-surface-variant uppercase mt-1">Characters</span>
        </div>

        <div className="p-4 bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow flex flex-col justify-center items-center text-center">
          <span className="font-display-lg text-3xl font-bold text-tertiary">{stats.charactersNoSpaces}</span>
          <span className="font-label-bold text-xs text-on-surface-variant uppercase mt-1">No Spaces</span>
        </div>

        <div className="p-4 bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow flex flex-col justify-center items-center text-center">
          <span className="font-display-lg text-3xl font-bold text-on-surface">{stats.sentences}</span>
          <span className="font-label-bold text-xs text-on-surface-variant uppercase mt-1">Sentences</span>
        </div>

        <div className="p-4 bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow flex flex-col justify-center items-center text-center">
          <span className="font-display-lg text-3xl font-bold text-on-surface">{stats.paragraphs}</span>
          <span className="font-label-bold text-xs text-on-surface-variant uppercase mt-1">Paragraphs</span>
        </div>

        <div className="p-4 bg-primary-fixed border-[3px] border-on-background rounded-xl neubrutal-shadow flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-on-surface" />
            <span className="font-display-lg text-xl font-bold text-on-surface">{stats.readingTimeMinutes}</span>
          </div>
          <span className="font-label-bold text-xs text-on-surface uppercase mt-1">Read Time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow p-4 flex flex-col flex-1">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-surface-variant">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.md,.markdown,.csv,.json"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 gap-1 text-xs"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadSample}
                  className="h-9 gap-1 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Sample Text
                </Button>
              </div>

              <div className="flex items-center gap-2">
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
                  onClick={handleClear}
                  disabled={!text}
                  className="h-9 gap-1 text-xs text-error hover:bg-error-container"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </Button>
              </div>
            </div>

            {/* Main Textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your document text here to analyze words, characters, sentences, and readability..."
              className="w-full flex-1 min-h-[360px] p-4 bg-surface text-on-surface font-mono text-sm leading-relaxed border-2 border-on-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            />
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Readability Score */}
          <div className="p-5 bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-label-bold text-base text-on-background">Readability Score</h3>
            </div>
            
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-display-lg text-4xl font-bold">{stats.readingEaseScore}</span>
              <span className="text-xs font-bold px-2.5 py-1 bg-surface-container-high border-[2px] border-on-background rounded-full">
                {stats.readingEaseLabel}
              </span>
            </div>

            <div className="w-full h-3 bg-surface-container-high rounded-full border-[2px] border-on-background overflow-hidden mb-3">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${stats.readingEaseScore}%` }}
              />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Based on the <strong>Flesch Reading Ease</strong> formula. Higher scores indicate material that is easier to read.
            </p>
          </div>

          {/* Speaking Time Card */}
          <div className="p-5 bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed border-[2px] border-on-background flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <span className="block font-label-bold text-sm text-on-background">Speaking Time</span>
                <span className="text-xs text-on-surface-variant">At 130 words per minute</span>
              </div>
            </div>
            <span className="font-display-lg text-xl font-bold">{stats.speakingTimeMinutes}</span>
          </div>

          {/* Keyword Density */}
          <div className="p-5 bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow flex-1">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-5 h-5 text-secondary" />
              <h3 className="font-label-bold text-base text-on-background">Top Keywords</h3>
            </div>

            {stats.topKeywords.length > 0 ? (
              <div className="space-y-2">
                {stats.topKeywords.map((item) => (
                  <div key={item.word} className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium text-on-surface bg-surface-container px-2 py-0.5 rounded border border-surface-variant">
                      {item.word}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">{item.count}×</span>
                      <span className="text-on-surface-variant w-8 text-right">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant italic py-2">
                Type or paste text above to see the most frequent keywords.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
