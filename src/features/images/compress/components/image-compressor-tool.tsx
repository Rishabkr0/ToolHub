"use client"

import * as React from "react"
import { ProcessingStage } from "@/features/pdf/shared/types"
import { FileUploader } from "@/features/pdf/shared/components/file-uploader"
import { ProcessingStatus } from "@/features/pdf/shared/components/processing-status"
import { Button } from "@/components/ui/button"
import { AlertCircle, Image as ImageIcon, Download, Minimize2 } from "lucide-react"

type CompressionLevel = "low" | "medium" | "high"

export function ImageCompressorTool() {
  const [file, setFile] = React.useState<File | null>(null)
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [compressionLevel, setCompressionLevel] = React.useState<CompressionLevel>("medium")
  
  const [originalSize, setOriginalSize] = React.useState<number>(0)
  const [compressedSize, setCompressedSize] = React.useState<number>(0)
  const [compressedUrl, setCompressedUrl] = React.useState<string | null>(null)

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setOriginalSize(acceptedFiles[0].size)
    setError(null)
    setCompressedUrl(null)
  }

  const handleCompress = () => {
    if (!file) return
    setError(null)
    setStage("processing")

    // Determine quality based on level
    let quality = 0.8
    if (compressionLevel === "low") quality = 0.92 // Better quality, less compression
    if (compressionLevel === "medium") quality = 0.7 // Good balance
    if (compressionLevel === "high") quality = 0.4 // High compression, worse quality

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        // We could also downscale dimensions here for "high" compression, but let's just use JPEG quality for now
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setError("Failed to get canvas context")
          setStage("error")
          return
        }
        
        // Fill white background in case of transparent PNG to JPG conversion
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        
        // Always compress to JPEG/WebP to ensure size reduction
        const outputFormat = file.type === "image/webp" ? "image/webp" : "image/jpeg"

        canvas.toBlob((blob) => {
          if (!blob) {
            setError("Failed to compress image")
            setStage("error")
            return
          }
          const url = URL.createObjectURL(blob)
          setCompressedUrl(url)
          setCompressedSize(blob.size)
          setStage("success")
        }, outputFormat, quality)
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
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl)
    }
    setFile(null)
    setCompressedUrl(null)
    setCompressedSize(0)
    setStage("idle")
    setError(null)
  }

  const isProcessing = stage === "reading" || stage === "processing" || stage === "generating"
  const savedPercentage = originalSize && compressedSize ? Math.round((1 - (compressedSize / originalSize)) * 100) : 0

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Image Compressor</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Reduce the file size of your images instantly without losing noticeable quality. 100% private client-side processing.
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
              title="Drop an image to compress"
              description="Supports PNG, JPG, WebP"
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.webp']
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
                <label className="font-label-bold text-on-surface">Compression Level:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant={compressionLevel === "low" ? "default" : "outline"} 
                    onClick={() => setCompressionLevel("low")}
                    className="flex flex-col items-center py-8 h-auto gap-2"
                  >
                    <span className="font-headline-sm">Low</span>
                    <span className="text-xs font-normal opacity-80">Better Quality, Larger File</span>
                  </Button>
                  <Button 
                    variant={compressionLevel === "medium" ? "default" : "outline"} 
                    onClick={() => setCompressionLevel("medium")}
                    className="flex flex-col items-center py-8 h-auto gap-2"
                  >
                    <span className="font-headline-sm">Balanced</span>
                    <span className="text-xs font-normal opacity-80">Good Quality, Good Size</span>
                  </Button>
                  <Button 
                    variant={compressionLevel === "high" ? "default" : "outline"} 
                    onClick={() => setCompressionLevel("high")}
                    className="flex flex-col items-center py-8 h-auto gap-2"
                  >
                    <span className="font-headline-sm">High</span>
                    <span className="text-xs font-normal opacity-80">Lower Quality, Smallest File</span>
                  </Button>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={handleCompress} className="w-full md:w-auto gap-2">
                  <Minimize2 className="w-4 h-4" />
                  Compress Image
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <ProcessingStatus 
          stage={stage} 
          stageInfo={{ processing: { text: "Compressing image...", value: 60 } }}
        />
      )}

      {stage === "success" && compressedUrl && (
        <div className="w-full p-8 bg-surface-container-lowest border-[3px] border-on-background rounded-xl flex flex-col items-center text-center neubrutal-shadow gap-6">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center border-[3px] border-on-background text-on-primary-container">
            <Download className="w-10 h-10" />
          </div>
          <div>
            <h2 className="font-headline-lg text-on-background mb-2">Compression Complete!</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              Your image was reduced from {(originalSize / 1024 / 1024).toFixed(2)} MB down to {(compressedSize / 1024 / 1024).toFixed(2)} MB.
            </p>
            {savedPercentage > 0 && (
              <div className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 border-[2px] border-green-800 rounded-full font-label-bold">
                Saved {savedPercentage}% space
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              Compress Another
            </Button>
            <Button asChild className="w-full sm:w-auto group">
              <a 
                href={compressedUrl} 
                download={`compressed-${file?.name.replace(/\.[^/.]+$/, "") || "image"}.jpg`}
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
