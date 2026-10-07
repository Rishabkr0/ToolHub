"use client"

import * as React from "react"
import { ProcessingStage } from "@/features/pdf/shared/types"
import { FileUploader } from "@/features/pdf/shared/components/file-uploader"
import { ProcessingStatus } from "@/features/pdf/shared/components/processing-status"
import { Button } from "@/components/ui/button"
import { AlertCircle, Image as ImageIcon, Copy, Check, Palette } from "lucide-react"
import { toast } from "sonner"

interface ColorResult {
  hex: string
  rgb: string
  frequency: number
}

// Helper to convert RGB to HEX
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("")
}

// Helper to calculate color distance (simple Euclidean distance)
const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
  return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2))
}

export function ColorExtractorTool() {
  const [file, setFile] = React.useState<File | null>(null)
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [imgSrc, setImgSrc] = React.useState<string>('')
  
  const [palette, setPalette] = React.useState<ColorResult[]>([])

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setError(null)
    setPalette([])
    setStage("idle")
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setImgSrc(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const extractColors = () => {
    if (!imgSrc) return
    
    setStage("processing")
    setError(null)

    // Run in a slight timeout to let UI update to processing state
    setTimeout(() => {
      try {
        const img = new Image()
        img.onload = () => {
          // Draw to a small canvas to naturally downsample and average colors
          const canvas = document.createElement("canvas")
          const MAX_SIZE = 150 // Small size for fast processing
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height
              height = MAX_SIZE
            }
          }

          canvas.width = Math.floor(width)
          canvas.height = Math.floor(height)
          const ctx = canvas.getContext("2d")
          if (!ctx) throw new Error("Could not get canvas context")

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data

          const colorMap = new Map<string, {r: number, g: number, b: number, count: number}>()

          // Loop through pixels
          for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i]
            const g = imageData[i + 1]
            const b = imageData[i + 2]
            const a = imageData[i + 3]

            // Skip transparent pixels or completely white/black pixels to find vibrant colors
            if (a < 128) continue
            if (r > 250 && g > 250 && b > 250) continue // Skip pure white
            if (r < 5 && g < 5 && b < 5) continue // Skip pure black

            // Quantize colors (round to nearest multiple of 16 to group similar colors)
            const quantR = Math.round(r / 16) * 16
            const quantG = Math.round(g / 16) * 16
            const quantB = Math.round(b / 16) * 16
            
            const key = `${quantR},${quantG},${quantB}`
            
            if (colorMap.has(key)) {
              colorMap.get(key)!.count++
            } else {
              colorMap.set(key, { r: quantR, g: quantG, b: quantB, count: 1 })
            }
          }

          // Sort by frequency
          const sortedColors = Array.from(colorMap.values()).sort((a, b) => b.count - a.count)
          
          // Filter out similar colors to get a distinct palette
          const distinctPalette: ColorResult[] = []
          const MIN_DISTANCE = 40 // Minimum visual distance between palette colors

          for (const color of sortedColors) {
            let isDistinct = true
            for (const selected of distinctPalette) {
              // Parse back to RGB for distance check
              const [sr, sg, sb] = selected.rgb.replace('rgb(', '').replace(')', '').split(',').map(Number)
              if (colorDistance(color.r, color.g, color.b, sr, sg, sb) < MIN_DISTANCE) {
                isDistinct = false
                break
              }
            }

            if (isDistinct) {
              distinctPalette.push({
                hex: rgbToHex(color.r, color.g, color.b),
                rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
                frequency: color.count
              })
            }

            if (distinctPalette.length >= 6) break // Stop when we have 6 colors
          }

          setPalette(distinctPalette)
          setStage("success")
        }
        img.onerror = () => {
          throw new Error("Failed to load image for processing")
        }
        img.src = imgSrc
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred extracting colors")
        setStage("error")
      }
    }, 100)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Copied ${text} to clipboard!`)
  }

  const handleReset = () => {
    setFile(null)
    setImgSrc('')
    setPalette([])
    setStage("idle")
    setError(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Color Palette Extractor</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Upload any image to instantly extract its dominant colors. Processed entirely in your browser.
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

      {!file && (
        <div className="w-full flex flex-col gap-6">
          <FileUploader 
            onFilesAccepted={handleFilesAccepted} 
            multiple={false}
            title="Drop an image to extract colors"
            description="Supports PNG, JPG, WebP"
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.webp']
            }}
          />
        </div>
      )}

      {file && stage !== "success" && (
        <div className="w-full p-6 bg-surface-container border-[3px] border-on-background rounded-xl">
          <div className="flex items-center justify-between mb-6 pb-6 border-b-[2px] border-on-background/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center border-[2px] border-on-background">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-headline-sm">{file.name}</h3>
                <p className="text-sm text-on-surface-variant">Ready to extract</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setFile(null)}>Remove</Button>
          </div>

          <div className="flex justify-center mb-6">
            <img src={imgSrc} alt="Preview" className="max-h-[300px] rounded-lg border-[2px] border-on-background object-contain" />
          </div>

          {stage === "processing" ? (
             <ProcessingStatus 
               stage={stage} 
               stageInfo={{ processing: { text: "Analyzing pixels...", value: 60 } }}
             />
          ) : (
            <div className="mt-8 flex justify-end">
              <Button size="lg" onClick={extractColors} className="w-full md:w-auto gap-2">
                <Palette className="w-4 h-4" />
                Extract Colors
              </Button>
            </div>
          )}
        </div>
      )}

      {stage === "success" && palette.length > 0 && (
        <div className="w-full flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="font-headline-md">Extracted Palette</h2>
            <Button variant="outline" onClick={handleReset}>Extract Another</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Reference */}
            <div className="p-4 bg-surface-container rounded-xl border-[2px] border-on-background">
              <img src={imgSrc} alt="Original" className="w-full rounded-lg object-contain max-h-[400px]" />
            </div>
            
            {/* Palette Colors */}
            <div className="flex flex-col gap-4">
              {palette.map((color, index) => (
                <div key={index} className="flex items-stretch bg-surface-container-lowest rounded-xl border-[2px] border-on-background overflow-hidden hover:-translate-y-1 transition-transform neubrutal-shadow">
                  {/* Color Swatch */}
                  <div 
                    className="w-24 shrink-0 border-r-[2px] border-on-background" 
                    style={{ backgroundColor: color.hex }}
                  />
                  
                  {/* Details */}
                  <div className="flex-1 p-4 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-headline-sm uppercase">{color.hex}</span>
                      <button onClick={() => handleCopy(color.hex)} className="p-2 hover:bg-surface-container rounded-md transition-colors" title="Copy HEX">
                        <Copy className="w-4 h-4 text-on-surface-variant" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body-sm text-on-surface-variant">{color.rgb}</span>
                      <button onClick={() => handleCopy(color.rgb)} className="p-2 hover:bg-surface-container rounded-md transition-colors" title="Copy RGB">
                        <Copy className="w-4 h-4 text-on-surface-variant" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
