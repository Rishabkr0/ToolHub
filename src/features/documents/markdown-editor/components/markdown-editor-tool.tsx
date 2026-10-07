"use client"

import * as React from "react"
import { renderMarkdownToHtml } from "../lib/markdown-engine"
import { Button } from "@/components/ui/button"
import { 
  FileEdit, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Sparkles, 
  Code, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  Quote 
} from "lucide-react"
import { toast } from "sonner"

const SAMPLE_MARKDOWN = `# Modern Document Suite

Welcome to **ToolHub**, the privacy-first document and utility platform.

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

## Core Architecture
- **Next.js 16**: App Router & Turbopack
- **React 19**: Responsive components
- **Tailwind CSS v4**: Neubrutalist styling
- **100% Client-Side**: Zero data leaks

### Quick Example
\`\`\`typescript
function processDocument(file: File): void {
  console.log("Processing", file.name)
}
\`\`\`

Ready to write your next document? Start typing in the editor on the left!
`

export function MarkdownEditorTool() {
  const [markdown, setMarkdown] = React.useState(SAMPLE_MARKDOWN)
  const [copiedMd, setCopiedMd] = React.useState(false)
  const [copiedHtml, setCopiedHtml] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const renderedHtml = React.useMemo(() => {
    return renderMarkdownToHtml(markdown)
  }, [markdown])

  const insertSyntax = (before: string, after: string = "") => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = markdown.substring(start, end)
    const replacement = `${before}${selected || "text"}${after}`
    const newMarkdown = markdown.substring(0, start) + replacement + markdown.substring(end)
    setMarkdown(newMarkdown)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + (selected ? selected.length : 4))
    }, 10)
  }

  const handleCopyMd = async () => {
    if (!markdown) return
    await navigator.clipboard.writeText(markdown)
    setCopiedMd(true)
    toast.success("Copied Markdown source!")
    setTimeout(() => setCopiedMd(false), 2000)
  }

  const handleCopyHtml = async () => {
    if (!renderedHtml) return
    await navigator.clipboard.writeText(renderedHtml)
    setCopiedHtml(true)
    toast.success("Copied HTML markup!")
    setTimeout(() => setCopiedHtml(false), 2000)
  }

  const handleDownload = (format: "md" | "html") => {
    if (!markdown) return
    const content = format === "md" ? markdown : `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6;}</style></head><body>${renderedHtml}</body></html>`
    const mime = format === "md" ? "text/markdown" : "text/html"
    const blob = new Blob([content], { type: `${mime};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document.${format}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Downloaded .${format} document`)
  }

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed border-[2px] border-on-background rounded-full font-label-bold text-xs uppercase tracking-wider mb-2">
          <FileEdit className="w-4 h-4 text-tertiary" /> Markdown Studio
        </div>
        <h1 className="font-display-lg text-4xl md:text-5xl text-on-background mb-2">
          Markdown Editor & Live Previewer
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Write and format Markdown with instant live preview. Export to HTML or download clean Markdown documents.
        </p>
      </div>

      {/* Editor Main Container */}
      <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow overflow-hidden flex flex-col">
        {/* Toolbar Bar */}
        <div className="p-3 bg-surface-container-low border-b-[2px] border-on-background flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => insertSyntax("**", "**")}
              className="p-1.5 rounded hover:bg-surface-container-high border border-transparent hover:border-on-background"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax("*", "*")}
              className="p-1.5 rounded hover:bg-surface-container-high border border-transparent hover:border-on-background"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-5 bg-surface-variant mx-1" />
            <button
              type="button"
              onClick={() => insertSyntax("# ")}
              className="p-1.5 rounded hover:bg-surface-container-high border border-transparent hover:border-on-background"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax("## ")}
              className="p-1.5 rounded hover:bg-surface-container-high border border-transparent hover:border-on-background"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-5 bg-surface-variant mx-1" />
            <button
              type="button"
              onClick={() => insertSyntax("- ")}
              className="p-1.5 rounded hover:bg-surface-container-high border border-transparent hover:border-on-background"
              title="Bulleted List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax("> ")}
              className="p-1.5 rounded hover:bg-surface-container-high border border-transparent hover:border-on-background"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax("`", "`")}
              className="p-1.5 rounded hover:bg-surface-container-high border border-transparent hover:border-on-background"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMarkdown(SAMPLE_MARKDOWN)
                toast.success("Loaded sample document")
              }}
              className="h-8 gap-1 text-xs"
            >
              <Sparkles className="w-3 h-3" /> Sample
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMd}
              className="h-8 gap-1 text-xs"
            >
              {copiedMd ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              Copy MD
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyHtml}
              className="h-8 gap-1 text-xs"
            >
              {copiedHtml ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
              Copy HTML
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload("md")}
              className="h-8 gap-1 text-xs"
            >
              <Download className="w-3 h-3" /> .md
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload("html")}
              className="h-8 gap-1 text-xs"
            >
              <Download className="w-3 h-3" /> .html
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMarkdown("")
                toast.info("Cleared editor")
              }}
              className="h-8 gap-1 text-xs text-error hover:bg-error-container"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-on-background min-h-[480px]">
          {/* Source Editor */}
          <div className="flex flex-col">
            <div className="px-4 py-2 bg-surface-container font-label-bold text-xs uppercase text-on-surface-variant border-b border-surface-variant">
              Markdown Source
            </div>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write your markdown here..."
              className="w-full flex-1 p-4 bg-surface font-mono text-xs leading-relaxed focus:outline-none resize-none min-h-[380px]"
            />
          </div>

          {/* Live Preview */}
          <div className="flex flex-col bg-surface-container-lowest">
            <div className="px-4 py-2 bg-surface-container font-label-bold text-xs uppercase text-primary border-b border-surface-variant flex items-center justify-between">
              <span>Live Rendered Document</span>
              <span className="font-mono text-[11px] text-on-surface-variant">{wordCount} words</span>
            </div>
            <div 
              className="flex-1 p-6 overflow-y-auto max-h-[550px] text-sm text-on-surface"
              dangerouslySetInnerHTML={{ __html: renderedHtml || "<p class='text-on-surface-variant italic'>Preview will appear here as you type...</p>" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
