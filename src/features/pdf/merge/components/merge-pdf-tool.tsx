"use client"

import * as React from "react"
import { FileItem } from "../../shared/types"
import { ProcessingStage } from "../../shared/types"
import { FileUploader } from "../../shared/components/file-uploader"
import { SortableFileList } from "../../shared/components/sortable-file-list"
import { ProcessingStatus } from "../../shared/components/processing-status"
import { SuccessView } from "./success-view"
import { mergePdfs } from "../lib/merge-engine"
import { Button } from "@/components/ui/button"
import { AlertCircle, Lock } from "lucide-react"

export function MergePdfTool() {
  const [files, setFiles] = React.useState<FileItem[]>([])
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [mergedBlobUrl, setMergedBlobUrl] = React.useState<string | null>(null)
  const [finalSize, setFinalSize] = React.useState<number>(0)

  // We don't revoke in useEffect cleanup because React Strict Mode will revoke it immediately.
  // Instead, we revoke it when the user resets or creates a new one.

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    const newItems: FileItem[] = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      size: file.size,
      previewUrl: "" // Stubbed for now
    }))
    setFiles(prev => [...prev, ...newItems])
    setError(null)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least two PDF files to merge.")
      return
    }

    try {
      setError(null)
      setStage("reading")
      
      const fileObjects = files.map(f => f.file)
      const mergedBlob = await mergePdfs(fileObjects, (progressStage) => {
        // "merging" was custom to Merge PDF, we map it to "processing" in the new shared type or keep it and pass stageInfo
        // For compatibility with the new type, we can map "merging" to "processing"
        const mappedStage = progressStage === "merging" ? "processing" : progressStage
        setStage(mappedStage as ProcessingStage)
      })

      const url = URL.createObjectURL(mergedBlob)
      setMergedBlobUrl(url)
      setFinalSize(mergedBlob.size)
      setStage("success")
      
    } catch (err) {
      console.error(err)
      setError((err as Error).message || "An unexpected error occurred while merging the PDFs.")
      setStage("error")
    }
  }

  const handleReset = () => {
    if (mergedBlobUrl) {
      URL.revokeObjectURL(mergedBlobUrl)
      setMergedBlobUrl(null)
    }
    setFiles([])
    setStage("idle")
    setError(null)
    setFinalSize(0)
  }

  if (stage === "success" && mergedBlobUrl) {
    return (
      <SuccessView 
        mergedBlobUrl={mergedBlobUrl}
        originalFileCount={files.length}
        finalSize={finalSize}
        onReset={handleReset}
      />
    )
  }

  const isProcessing = stage !== "idle" && stage !== "error"

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Merge PDF</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Combine multiple PDFs into a single document. Your files never leave your device—processing is 100% private and happens locally in your browser.
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

      {/* Main Workspace */}
      {!isProcessing ? (
        <div className="w-full flex flex-col gap-6">
          <FileUploader onFilesAccepted={handleFilesAccepted} isUploading={false} />
          
          {files.length > 0 && (
            <div className="w-full mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline-md text-on-surface">Selected Files ({files.length})</h3>
                <span className="text-label-sm text-on-surface-variant">Drag to reorder</span>
              </div>
              <SortableFileList files={files} setFiles={setFiles} />
              
              <div className="mt-8 flex justify-end gap-4 border-t-[3px] border-on-background pt-6">
                <Button variant="outline" onClick={handleReset} type="button">Clear All</Button>
                <Button 
                  size="lg" 
                  onClick={handleMerge} 
                  disabled={files.length < 2}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Merge {files.length} Files
                </Button>
              </div>
              {files.length === 1 && (
                <p className="text-right text-label-sm text-error mt-2">Add at least one more file to merge.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <ProcessingStatus 
          stage={stage} 
          stageInfo={{ processing: { text: "Merging pages...", value: 60 } }}
        />
      )}
    </div>
  )
}
