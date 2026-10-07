"use client"

import * as React from "react"
import { removeBackground } from "@imgly/background-removal"
import { ProcessingStage } from "@/features/pdf/shared/types"
import { FileUploader } from "@/features/pdf/shared/components/file-uploader"
import { ProcessingStatus } from "@/features/pdf/shared/components/processing-status"
import { Button } from "@/components/ui/button"
import { AlertCircle, Image as ImageIcon, Download, Sparkles } from "lucide-react"

export function BgRemoverTool() {
  const [file, setFile] = React.useState<File | null>(null)
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  
  const [imgSrc, setImgSrc] = React.useState<string>('')
  const [resultUrl, setResultUrl] = React.useState<string | null>(null)
  const [progressText, setProgressText] = React.useState<string>("Initializing AI model...")
  const [progressVal, setProgressVal] = React.useState<number>(0)

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setError(null)
    setResultUrl(null)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setImgSrc(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleRemoveBackground = async () => {
    if (!file) return
    
    setError(null)
    setStage("processing")
    setProgressText("Loading AI models (this may take a moment on first run)...")
    setProgressVal(10)

    try {
      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          // Calculate rough progress based on total
          const percent = Math.round((current / total) * 100)
          if (key.includes('fetch')) {
            setProgressText(`Downloading AI models... ${percent}%`)
            setProgressVal(10 + (percent * 0.4))
          } else if (key.includes('compute')) {
            setProgressText("Analyzing image and removing background...")
            setProgressVal(50 + (percent * 0.4))
          }
        }
      })
      
      const url = URL.createObjectURL(blob)
      setResultUrl(url)
      setStage("success")
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to remove background. Please try again with a different image.")
      setStage("error")
    }
  }

  const handleReset = () => {
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl)
    }
    setFile(null)
    setImgSrc('')
    setResultUrl(null)
    setStage("idle")
    setError(null)
    setProgressVal(0)
  }

  const isProcessing = stage === "reading" || stage === "processing" || stage === "generating"

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">AI Background Remover</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Instantly detect and remove the background from any photo using local AI. 100% private, processed entirely in your browser.
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
        <div className="w-full flex flex-col gap-6 max-w-3xl mx-auto">
          {!file ? (
            <FileUploader 
              onFilesAccepted={handleFilesAccepted} 
              multiple={false}
              title="Drop an image to remove background"
              description="Supports PNG, JPG, WebP. High contrast images work best."
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
                    <p className="text-sm text-on-surface-variant">Ready to process</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setFile(null)}>Remove</Button>
              </div>

              <div className="flex justify-center mb-6 bg-surface-container-lowest p-2 rounded-lg border-[2px] border-on-background/10">
                <img src={imgSrc} alt="Original" className="max-h-[400px] object-contain rounded-md" />
              </div>

              <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={handleRemoveBackground} className="w-full md:w-auto gap-2 bg-secondary text-on-secondary hover:bg-secondary/90">
                  <Sparkles className="w-4 h-4" />
                  Remove Background
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="w-full max-w-3xl mx-auto">
          <ProcessingStatus 
            stage={stage} 
            stageInfo={{ processing: { text: progressText, value: progressVal } }}
          />
          <p className="text-center text-sm text-on-surface-variant mt-4">
            First run requires downloading AI models to your browser cache (~40MB). Subsequent runs will be instant!
          </p>
        </div>
      )}

      {stage === "success" && resultUrl && (
        <div className="w-full flex flex-col gap-6">
          <div className="flex justify-between items-center max-w-3xl mx-auto w-full">
            <h2 className="font-headline-md">Background Removed Successfully!</h2>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleReset}>Process Another</Button>
              <Button asChild className="group">
                <a 
                  href={resultUrl} 
                  download={`nobg-${file?.name.replace(/\.[^/.]+$/, "") || "image"}.png`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Transparent PNG
                </a>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
            <div className="p-4 bg-surface-container rounded-xl border-[2px] border-on-background flex flex-col gap-2">
              <span className="font-label-bold text-on-surface-variant uppercase text-xs tracking-wider">Original</span>
              <img src={imgSrc} alt="Original" className="w-full rounded-lg object-contain bg-white" style={{ maxHeight: '600px' }} />
            </div>
            
            <div className="p-4 bg-surface-container rounded-xl border-[2px] border-on-background flex flex-col gap-2">
              <span className="font-label-bold text-secondary uppercase text-xs tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Result
              </span>
              {/* Checkerboard background to show transparency */}
              <div 
                className="w-full rounded-lg relative overflow-hidden" 
                style={{ 
                  maxHeight: '600px',
                  backgroundImage: 'repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), repeating-linear-gradient(45deg, #ccc 25%, #fff 25%, #fff 75%, #ccc 75%, #ccc)',
                  backgroundPosition: '0 0, 10px 10px',
                  backgroundSize: '20px 20px'
                }}
              >
                <img src={resultUrl} alt="Result" className="w-full object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
