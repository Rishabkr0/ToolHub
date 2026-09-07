"use client"

import * as React from "react"
import { ProcessingStage } from "../../shared/types"
import { FileUploader } from "../../shared/components/file-uploader"
import { ProcessingStatus } from "../../shared/components/processing-status"
import { PageSelector } from "../../shared/components/page-selector"
import { PdfToJpgSuccessView } from "./pdf-to-jpg-success-view"
import { ImageSettings } from "./image-settings"
import { loadPdfForRendering, renderPageToJpg, ImageQuality, ImageResolution, PdfToJpgResult } from "../lib/pdf-renderer"
import { Button } from "@/components/ui/button"
import { AlertCircle, Image as ImageIcon, FileIcon } from "lucide-react"

export function PdfToJpgTool() {
  const [file, setFile] = React.useState<File | null>(null)
  
  const [pageCount, setPageCount] = React.useState<number>(0)
  const [selectedPages, setSelectedPages] = React.useState<number[]>([])
  
  const [quality, setQuality] = React.useState<ImageQuality>("high")
  const [resolution, setResolution] = React.useState<ImageResolution>("high")

  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<PdfToJpgResult | null>(null)

  const handleFilesAccepted = async (acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    setFile(f)
    setError(null)
    setStage("reading")
    
    try {
      const buffer = await f.arrayBuffer()
      // We load the PDF just to get the page count initially.
      // We don't keep the heavy pdfjs object in state to prevent memory leaks.
      const pdf = await loadPdfForRendering(buffer)
      setPageCount(pdf.numPages)
      setSelectedPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1))
      setStage("idle")
    } catch (err) {
      console.error(err)
      setError("Failed to parse the PDF. It may be encrypted or corrupted.")
      setFile(null)
      setStage("error")
    }
  }

  const handleConvert = async () => {
    if (!file || selectedPages.length === 0) return

    try {
      setError(null)
      setStage("processing")
      
      const buffer = await file.arrayBuffer()
      const pdfDoc = await loadPdfForRendering(buffer)
      
      setStage("generating")
      
      const images: PdfToJpgResult["images"] = []
      let totalSize = 0
      const baseName = file.name.replace(/\.pdf$/i, "")

      // Render sequentially to avoid OOM errors on large PDFs
      for (const pageNum of selectedPages) {
        const { blob, width, height } = await renderPageToJpg(pdfDoc, pageNum, resolution, quality)
        images.push({
          pageNumber: pageNum,
          blob,
          filename: `${baseName}-page-${pageNum}.jpg`,
          width,
          height,
          size: blob.size
        })
        totalSize += blob.size
      }

      setResult({ images, totalSize })
      setStage("success")
      
    } catch (err) {
      console.error(err)
      setError((err as Error).message || "An unexpected error occurred while rendering the PDF.")
      setStage("error")
    }
  }

  const handleReset = () => {
    setFile(null)
    setStage("idle")
    setError(null)
    setResult(null)
    setPageCount(0)
    setSelectedPages([])
  }

  if (stage === "success" && result) {
    return <PdfToJpgSuccessView result={result} onReset={handleReset} />
  }

  const isProcessing = stage !== "idle" && stage !== "error"

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">PDF to JPG</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Convert PDF pages into high-quality JPG images. Processed securely in your browser without uploading to any server.
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
          title="Click or drag a PDF here to convert"
          description="Select a single PDF file."
        />
      ) : isProcessing ? (
        <ProcessingStatus 
          stage={stage}
          stageInfo={{
            reading: { text: "Loading PDF engine...", value: 20 },
            processing: { text: "Preparing pages...", value: 40 },
            generating: { text: "Rendering high-quality JPGs...", value: 75 }
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
                <p className="text-label-sm text-on-surface-variant">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {pageCount} pages
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleReset}>Change File</Button>
          </div>

          <ImageSettings 
            quality={quality} 
            setQuality={setQuality} 
            resolution={resolution} 
            setResolution={setResolution} 
          />

          <PageSelector
            pageCount={pageCount}
            selectedPages={selectedPages}
            onChange={setSelectedPages}
          />

          {/* Action */}
          <div className="flex justify-between items-center pt-4 border-t-[3px] border-on-background mt-2">
            <div className="text-body-sm text-on-surface-variant">
              Selected {selectedPages.length} {selectedPages.length === 1 ? "page" : "pages"}
            </div>
            <Button size="lg" onClick={handleConvert} disabled={selectedPages.length === 0} className="gap-2">
              <ImageIcon className="w-5 h-5" />
              Convert to JPG
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
