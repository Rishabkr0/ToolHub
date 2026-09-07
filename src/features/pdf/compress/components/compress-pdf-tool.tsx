"use client"

import * as React from "react"
import { ProcessingStage } from "../../shared/types"
import { FileUploader } from "../../shared/components/file-uploader"
import { ProcessingStatus } from "../../shared/components/processing-status"
import { CompressSuccessView } from "./compress-success-view"
import { compressPdf, CompressMode, CompressResult } from "../lib/compress-engine"
import { Button } from "@/components/ui/button"
import { AlertCircle, Minimize2, FileIcon, Info } from "lucide-react"

export function CompressPdfTool() {
  const [file, setFile] = React.useState<File | null>(null)
  
  const [mode, setMode] = React.useState<CompressMode>("recommended")
  
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<CompressResult | null>(null)

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    setFile(f)
    setError(null)
    setStage("idle")
  }

  const handleCompress = async () => {
    if (!file) return

    try {
      setError(null)
      setStage("processing")
      
      const out = await compressPdf(file, mode, (s) => setStage(s as ProcessingStage))
      setResult(out)
      setStage("success")
      
    } catch (err) {
      console.error(err)
      setError((err as Error).message || "An unexpected error occurred while compressing the PDF.")
      setStage("error")
    }
  }

  const handleReset = () => {
    setFile(null)
    setStage("idle")
    setError(null)
    setResult(null)
    setMode("recommended")
  }

  if (stage === "success" && result) {
    return <CompressSuccessView result={result} onReset={handleReset} />
  }

  const isProcessing = stage !== "idle" && stage !== "error"

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Compress PDF</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Reduce PDF file size by structurally optimizing the document and removing dead objects. 100% private, client-side processing.
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
          isUploading={false} 
          multiple={false}
          title="Click or drag a PDF here to compress"
          description="Select a single PDF file."
        />
      ) : isProcessing ? (
        <ProcessingStatus 
          stage={stage}
          stageInfo={{
            processing: { text: "Optimizing PDF structure...", value: 60 },
            generating: { text: "Rebuilding PDF...", value: 90 }
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
                <p className="text-label-sm text-on-surface-variant">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleReset}>Change File</Button>
          </div>

          {/* Mode Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 text-on-surface-variant mb-2">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-body-sm">
                <strong>Note:</strong> This tool performs strict <em>Structural Optimization</em> in your browser. It removes dead objects and optimizes internal streams. It does <strong>not</strong> down-sample raster images, ensuring zero quality loss.
              </p>
            </div>
            
            <h3 className="font-headline-md text-on-surface">Select Optimization Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setMode("recommended")}
                className={`p-md rounded-lg border-[3px] text-left transition-all ${
                  mode === "recommended" ? "border-primary bg-primary-container/20 neubrutal-shadow -translate-y-1" : "border-on-background bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <h4 className="font-headline-sm mb-1">Recommended</h4>
                <p className="text-body-sm text-on-surface-variant">Cleans up dead objects and optimizes internal structure streams.</p>
              </button>
              
              <button
                onClick={() => setMode("maximum")}
                className={`p-md rounded-lg border-[3px] text-left transition-all ${
                  mode === "maximum" ? "border-primary bg-primary-container/20 neubrutal-shadow -translate-y-1" : "border-on-background bg-surface-container hover:bg-surface-container-high"
                }`}
              >
                <h4 className="font-headline-sm mb-1">Maximum</h4>
                <p className="text-body-sm text-on-surface-variant">Includes recommended optimizations plus stripping all standard metadata.</p>
              </button>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-end pt-4 border-t-[3px] border-on-background mt-2">
            <Button size="lg" onClick={handleCompress} className="gap-2">
              <Minimize2 className="w-5 h-5" />
              Compress PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
