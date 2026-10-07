"use client"

import * as React from "react"
import { FileItem, ProcessingStage } from "@/features/pdf/shared/types"
import { FileUploader } from "@/features/pdf/shared/components/file-uploader"
import { ProcessingStatus } from "@/features/pdf/shared/components/processing-status"
import { Button } from "@/components/ui/button"
import { AlertCircle, Image as ImageIcon, Download } from "lucide-react"

type OutputFormat = "image/png" | "image/jpeg" | "image/webp"

export function ImageConverterTool() {
  const [file, setFile] = React.useState<File | null>(null)
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [outputFormat, setOutputFormat] = React.useState<OutputFormat>("image/webp")
  const [convertedUrl, setConvertedUrl] = React.useState<string | null>(null)

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]) // Only process one file at a time for simplicity initially
    setError(null)
    setConvertedUrl(null)
  }

  const handleConvert = () => {
    if (!file) return
    setError(null)
    setStage("processing")

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setError("Failed to get canvas context")
          setStage("error")
          return
        }
        
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (!blob) {
            setError("Failed to convert image")
            setStage("error")
            return
          }
          const url = URL.createObjectURL(blob)
          setConvertedUrl(url)
          setStage("success")
        }, outputFormat, 0.9)
      }
      img.onerror = () => {
        setError("Failed to load image")
        setStage("error")
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      setError("Failed to read file")
      setStage("error")
    }
    reader.readAsDataURL(file)
  }

  const handleReset = () => {
    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl)
    }
    setFile(null)
    setConvertedUrl(null)
    setStage("idle")
    setError(null)
  }

  const isProcessing = stage === "reading" || stage === "processing" || stage === "generating"

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Image Format Converter</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Convert your images to PNG, JPG, or WebP instantly. 100% private client-side processing.
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

      {!isProcessing && stage !== "success" && (
        <div className="w-full flex flex-col gap-6">
          {!file ? (
            <FileUploader 
              onFilesAccepted={handleFilesAccepted} 
              multiple={false}
              title="Drop an image here"
              description="Supports PNG, JPG, WebP, AVIF, SVG"
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg']
              }}
            />
          ) : (
            <div className="w-full p-6 bg-surface-container border-[3px] border-on-background rounded-xl">
              <div className="flex items-center justify-between mb-6 pb-6 border-b-[2px] border-on-background/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center border-[2px] border-on-background">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-headline-sm">{file.name}</h3>
                    <p className="text-sm text-on-surface-variant">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setFile(null)}>Remove</Button>
              </div>

              <div className="flex flex-col gap-4">
                <label className="font-label-bold text-on-surface">Convert to format:</label>
                <div className="flex gap-4">
                  <Button 
                    variant={outputFormat === "image/png" ? "default" : "outline"} 
                    onClick={() => setOutputFormat("image/png")}
                    className="flex-1"
                  >
                    PNG
                  </Button>
                  <Button 
                    variant={outputFormat === "image/jpeg" ? "default" : "outline"} 
                    onClick={() => setOutputFormat("image/jpeg")}
                    className="flex-1"
                  >
                    JPG
                  </Button>
                  <Button 
                    variant={outputFormat === "image/webp" ? "default" : "outline"} 
                    onClick={() => setOutputFormat("image/webp")}
                    className="flex-1"
                  >
                    WebP
                  </Button>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={handleConvert} className="w-full md:w-auto">
                  Convert Image
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <ProcessingStatus 
          stage={stage} 
          stageInfo={{ processing: { text: "Converting image...", value: 60 } }}
        />
      )}

      {stage === "success" && convertedUrl && (
        <div className="w-full p-8 bg-surface-container-lowest border-[3px] border-on-background rounded-xl flex flex-col items-center text-center neubrutal-shadow gap-6">
          <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center border-[3px] border-on-background text-on-secondary-container">
            <Download className="w-10 h-10" />
          </div>
          <div>
            <h2 className="font-headline-lg text-on-background mb-2">Conversion Complete!</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              Your image has been successfully converted.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              Convert Another
            </Button>
            <Button asChild className="w-full sm:w-auto group">
              <a 
                href={convertedUrl} 
                download={`converted-image.${outputFormat.split('/')[1]}`}
              >
                Download Image
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
