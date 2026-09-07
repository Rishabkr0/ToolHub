"use client"

import * as React from "react"
import { ProcessingStage } from "../../shared/types"
import { FileUploader } from "../../shared/components/file-uploader"
import { ProcessingStatus } from "../../shared/components/processing-status"
import { SplitSuccessView } from "./split-success-view"
import { PageSelector } from "../../shared/components/page-selector"
import { splitPdf, parsePdfForSplitting, SplitMode, SplitResult } from "../lib/split-engine"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Scissors, FileIcon } from "lucide-react"

export function SplitPdfTool() {
  const [file, setFile] = React.useState<File | null>(null)
  const [pageCount, setPageCount] = React.useState(0)
  
  const [mode, setMode] = React.useState<SplitMode>("all")
  const [selectedPages, setSelectedPages] = React.useState<number[]>([])
  const [rangesStr, setRangesStr] = React.useState("")
  
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<SplitResult | null>(null)

  const handleFilesAccepted = async (acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    setFile(f)
    setStage("reading")
    setError(null)
    try {
      const { pageCount: count } = await parsePdfForSplitting(f)
      setPageCount(count)
      setStage("idle")
      
      // Default to select all for custom mode
      const all = Array.from({ length: count }, (_, i) => i + 1)
      setSelectedPages(all)
    } catch (err) {
      console.error(err)
      setError("Failed to read PDF. It might be encrypted or corrupted.")
      setFile(null)
      setStage("idle")
    }
  }

  const handleSplit = async () => {
    if (!file) return

    try {
      setError(null)
      setStage("processing")
      
      const out = await splitPdf(file, mode, selectedPages, rangesStr, (s) => setStage(s as ProcessingStage))
      setResult(out)
      setStage("success")
      
    } catch (err) {
      console.error(err)
      setError((err as Error).message || "An unexpected error occurred while splitting the PDF.")
      setStage("error")
    }
  }

  const handleReset = () => {
    setFile(null)
    setPageCount(0)
    setStage("idle")
    setError(null)
    setResult(null)
    setMode("all")
    setSelectedPages([])
    setRangesStr("")
  }

  if (stage === "success" && result) {
    return <SplitSuccessView result={result} onReset={handleReset} />
  }

  const isProcessing = stage !== "idle" && stage !== "error" && stage !== "reading"

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Split PDF</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Extract pages or split a PDF into multiple files. Your files never leave your device—processing is 100% private and happens locally in your browser.
        </p>
      </div>

      {error && (
        <div className="w-full p-4 bg-error-container border-[3px] border-on-background rounded-xl neubrutal-shadow flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-on-error-container shrink-0 mt-0.5" />
          <div>
            <h3 className="font-headline-sm text-on-error-container mb-1">Processing Failed</h3>
            <p className="font-body-md text-on-error-container/80">{error}</p>
          </div>
        </div>
      )}

      {!file ? (
        <FileUploader 
          onFilesAccepted={handleFilesAccepted} 
          isUploading={stage === "reading"} 
          multiple={false}
          title="Click or drag a PDF here to split"
          description="Select a single PDF file."
        />
      ) : isProcessing ? (
        <ProcessingStatus 
          stage={stage}
          stageInfo={{
            processing: { text: "Splitting pages...", value: 60 },
            generating: { text: "Bundling output...", value: 90 }
          }}
        />
      ) : (
        <div className="w-full flex flex-col gap-8 bg-surface-container-lowest p-xl border-[3px] border-on-background rounded-xl neubrutal-shadow">
          {/* File Info */}
          <div className="flex items-center justify-between border-b-[3px] border-on-background pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-container rounded-lg border-[2px] border-on-background flex items-center justify-center">
                <FileIcon className="w-6 h-6 text-on-primary-container" />
              </div>
              <div>
                <h3 className="font-headline-sm text-on-surface">{file.name}</h3>
                <p className="text-label-sm text-on-surface-variant">{pageCount} pages</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleReset}>Change File</Button>
          </div>

          {/* Mode Selection */}
          <div className="flex flex-col gap-4">
            <h3 className="font-headline-md text-on-surface">How would you like to split it?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMode("all")}
                className={`p-md rounded-lg border-[3px] text-left transition-all ${
                  mode === "all" ? "border-primary bg-primary-container/20 neubrutal-shadow -translate-y-1" : "border-on-background bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <h4 className="font-headline-sm mb-1">Extract All Pages</h4>
                <p className="text-body-sm text-on-surface-variant">Separate each page into its own PDF file.</p>
              </button>
              
              <button
                onClick={() => setMode("selected")}
                className={`p-md rounded-lg border-[3px] text-left transition-all ${
                  mode === "selected" ? "border-primary bg-primary-container/20 neubrutal-shadow -translate-y-1" : "border-on-background bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <h4 className="font-headline-sm mb-1">Select Pages</h4>
                <p className="text-body-sm text-on-surface-variant">Visually pick specific pages to extract.</p>
              </button>

              <button
                onClick={() => setMode("ranges")}
                className={`p-md rounded-lg border-[3px] text-left transition-all ${
                  mode === "ranges" ? "border-primary bg-primary-container/20 neubrutal-shadow -translate-y-1" : "border-on-background bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <h4 className="font-headline-sm mb-1">Custom Ranges</h4>
                <p className="text-body-sm text-on-surface-variant">Type ranges (e.g., 1-5, 8-10).</p>
              </button>
            </div>
          </div>

          {/* Mode Specific Config */}
          {mode === "selected" && (
            <PageSelector pageCount={pageCount} selectedPages={selectedPages} onChange={setSelectedPages} />
          )}

          {mode === "ranges" && (
            <div className="flex flex-col gap-2 p-md bg-surface-container rounded-lg border-[2px] border-on-background">
              <label htmlFor="ranges" className="font-label-bold text-on-surface">Enter Page Ranges</label>
              <Input
                id="ranges"
                placeholder="e.g. 1-3, 5, 7-10"
                value={rangesStr}
                onChange={(e) => setRangesStr(e.target.value)}
                className="bg-surface border-[2px] border-on-background h-12"
              />
              <p className="text-label-sm text-on-surface-variant mt-1">
                Each range will be extracted as a separate PDF file.
              </p>
            </div>
          )}

          {/* Action */}
          <div className="flex justify-end pt-4 border-t-[3px] border-on-background mt-2">
            <Button size="lg" onClick={handleSplit} className="gap-2">
              <Scissors className="w-5 h-5" />
              Split PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
