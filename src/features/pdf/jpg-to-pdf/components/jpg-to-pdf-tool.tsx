"use client"

import * as React from "react"
import { FileItem, ProcessingStage } from "../../shared/types"
import { FileUploader } from "../../shared/components/file-uploader"
import { ProcessingStatus } from "../../shared/components/processing-status"
import { SortableFileList } from "../../shared/components/sortable-file-list"
import { PdfSettings as PdfSettingsComponent } from "./pdf-settings"
import { JpgToPdfSuccessView } from "./jpg-to-pdf-success-view"
import { convertJpgToPdf, PdfSettings } from "../lib/jpg-to-pdf-engine"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileText, Plus } from "lucide-react"

export function JpgToPdfTool() {
  const [files, setFiles] = React.useState<FileItem[]>([])
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<{ blob: Blob; size: number } | null>(null)

  const [settings, setSettings] = React.useState<PdfSettings>({
    pageSize: "auto",
    orientation: "portrait",
    fit: "fit",
    margin: "small",
    quality: "high",
  })

  // Cleanup blob URLs to prevent memory leaks
  React.useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl)
      })
    }
  }, [files])

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setError(null)
    const newFiles: FileItem[] = acceptedFiles.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      size: f.size,
      previewUrl: URL.createObjectURL(f)
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    try {
      setError(null)
      setStage("processing")
      
      const res = await convertJpgToPdf(files, settings)
      
      setStage("generating")
      setResult(res)
      setStage("success")
      
    } catch (err) {
      console.error(err)
      setError((err as Error).message || "An unexpected error occurred while converting the images.")
      setStage("error")
    }
  }

  const handleReset = () => {
    files.forEach(f => URL.revokeObjectURL(f.previewUrl))
    setFiles([])
    setStage("idle")
    setError(null)
    setResult(null)
  }

  if (stage === "success" && result) {
    return <JpgToPdfSuccessView blob={result.blob} size={result.size} pageCount={files.length} onReset={handleReset} />
  }

  const isProcessing = stage !== "idle" && stage !== "error"

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">JPG to PDF</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Convert JPG and PNG images to a PDF document. Reorder pages and customize layouts locally in your browser.
        </p>
      </div>

      {error && (
        <div className="w-full p-4 bg-error-container border-[3px] border-on-background rounded-xl neubrutal-shadow flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-on-error-container shrink-0 mt-0.5" />
          <div>
            <h3 className="font-headline-sm text-on-error-container mb-1">Conversion Failed</h3>
            <p className="font-body-md text-on-error-container/80">{error}</p>
          </div>
        </div>
      )}

      {files.length === 0 ? (
        <FileUploader 
          onFilesAccepted={handleFilesAccepted} 
          isUploading={false} 
          multiple={true}
          accept={{
            'image/jpeg': ['.jpg', '.jpeg', '.JPG', '.JPEG'],
            'image/jpg': ['.jpg', '.jpeg', '.JPG', '.JPEG'],
            'image/png': ['.png', '.PNG']
          }}
          title="Click or drag images here to convert"
          description="Supports JPG and PNG. You can select multiple files."
        />
      ) : isProcessing ? (
        <ProcessingStatus 
          stage={stage}
          stageInfo={{
            reading: { text: "Reading images...", value: 20 },
            processing: { text: "Applying layout settings...", value: 50 },
            generating: { text: "Building PDF document...", value: 80 }
          }}
        />
      ) : (
        <div className="w-full flex flex-col gap-6 bg-surface-container-lowest p-xl border-[3px] border-on-background rounded-xl neubrutal-shadow">
          <div className="flex items-center justify-between border-b-[3px] border-on-background pb-4">
            <h3 className="font-headline-md text-on-surface">Selected Images ({files.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>Clear All</Button>
            </div>
          </div>

          <PdfSettingsComponent settings={settings} onChange={setSettings} />

          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <SortableFileList files={files} setFiles={setFiles} />
          </div>

          {/* Add more files area */}
          <div className="border-[2px] border-dashed border-on-background/30 rounded-lg p-4 text-center hover:bg-surface-container transition-colors">
            <label className="cursor-pointer flex items-center justify-center gap-2 text-primary font-label-bold">
              <Plus className="w-5 h-5" />
              Add more images
              <input 
                type="file" 
                multiple 
                accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) handleFilesAccepted(Array.from(e.target.files))
                  e.target.value = "" // reset
                }} 
              />
            </label>
          </div>

          {/* Action */}
          <div className="flex justify-between items-center pt-4 border-t-[3px] border-on-background mt-2">
            <div className="text-body-sm text-on-surface-variant">
              Generating {files.length} {files.length === 1 ? "page" : "pages"}
            </div>
            <Button size="lg" onClick={handleConvert} disabled={files.length === 0} className="gap-2">
              <FileText className="w-5 h-5" />
              Generate PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
