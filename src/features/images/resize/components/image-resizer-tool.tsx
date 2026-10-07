"use client"

import * as React from "react"
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { ProcessingStage } from "@/features/pdf/shared/types"
import { FileUploader } from "@/features/pdf/shared/components/file-uploader"
import { ProcessingStatus } from "@/features/pdf/shared/components/processing-status"
import { Button } from "@/components/ui/button"
import { AlertCircle, Image as ImageIcon, Download, Scissors } from "lucide-react"

export function ImageResizerTool() {
  const [file, setFile] = React.useState<File | null>(null)
  const [stage, setStage] = React.useState<ProcessingStage>("idle")
  const [error, setError] = React.useState<string | null>(null)
  
  const [imgSrc, setImgSrc] = React.useState<string>('')
  const imgRef = React.useRef<HTMLImageElement | null>(null)
  
  const [crop, setCrop] = React.useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80
  })
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop | null>(null)
  const [aspect, setAspect] = React.useState<number | undefined>(undefined)
  
  const [croppedUrl, setCroppedUrl] = React.useState<string | null>(null)

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setError(null)
    setCroppedUrl(null)
    setCompletedCrop(null)
    
    // Load image for cropping
    const reader = new FileReader()
    reader.onload = (e) => {
      setImgSrc(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget
    
    // Default crop to center 80%
    setCrop({
      unit: '%',
      x: 10,
      y: 10,
      width: 80,
      height: 80
    })
  }

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect)
    
    if (imgRef.current) {
      const { width, height } = imgRef.current
      
      if (!newAspect) {
        setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 })
        return
      }

      // Start with 80% of width
      let cropWidth = width * 0.8
      let cropHeight = cropWidth / newAspect

      // If it exceeds 90% of image height, constrain by height instead
      if (cropHeight > height * 0.9) {
        cropHeight = height * 0.9
        cropWidth = cropHeight * newAspect
      }

      // Convert to percentages for responsive resizing
      const widthPct = (cropWidth / width) * 100
      const heightPct = (cropHeight / height) * 100
      
      // Center the box
      const xPct = (100 - widthPct) / 2
      const yPct = (100 - heightPct) / 2

      setCrop({
        unit: '%',
        x: xPct,
        y: yPct,
        width: widthPct,
        height: heightPct
      })
    }
  }

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current || !file) {
      setError("Please select a valid crop area.")
      return
    }
    
    setError(null)
    setStage("processing")

    try {
      const image = imgRef.current
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        throw new Error("No 2d context")
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = Math.floor(completedCrop.width * scaleX)
      canvas.height = Math.floor(completedCrop.height * scaleY)

      ctx.imageSmoothingQuality = "high"

      const cropX = completedCrop.x * scaleX
      const cropY = completedCrop.y * scaleY
      const cropWidth = completedCrop.width * scaleX
      const cropHeight = completedCrop.height * scaleY

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      )

      const outputFormat = file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg"
      
      canvas.toBlob((blob) => {
        if (!blob) {
          setError("Failed to crop image")
          setStage("error")
          return
        }
        const url = URL.createObjectURL(blob)
        setCroppedUrl(url)
        setStage("success")
      }, outputFormat, 1)

    } catch (e) {
      setError("An error occurred during cropping.")
      setStage("error")
    }
  }

  const handleReset = () => {
    if (croppedUrl) {
      URL.revokeObjectURL(croppedUrl)
    }
    setFile(null)
    setImgSrc('')
    setCroppedUrl(null)
    setStage("idle")
    setError(null)
    setCompletedCrop(null)
  }

  const isProcessing = stage === "reading" || stage === "processing" || stage === "generating"

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display-lg text-[40px] text-on-background mb-4">Visual Image Cropper</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Visually drag and resize to crop your image exactly how you want it. Processed entirely in your browser.
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
              title="Drop an image to crop"
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
                    <p className="text-sm text-on-surface-variant">Drag the handles on the image to crop</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setFile(null)}>Remove</Button>
              </div>

              <div className="flex flex-col gap-4 bg-surface-container-lowest p-6 rounded-lg border-[2px] border-on-background/10">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <Button variant={aspect === undefined ? "default" : "outline"} size="sm" onClick={() => handleAspectChange(undefined)}>Free Crop</Button>
                  <Button variant={aspect === 1 ? "default" : "outline"} size="sm" onClick={() => handleAspectChange(1)}>1:1 Square</Button>
                  <Button variant={aspect === 16/9 ? "default" : "outline"} size="sm" onClick={() => handleAspectChange(16/9)}>16:9 Landscape</Button>
                  <Button variant={aspect === 9/16 ? "default" : "outline"} size="sm" onClick={() => handleAspectChange(9/16)}>9:16 Portrait</Button>
                  <Button variant={aspect === 4/3 ? "default" : "outline"} size="sm" onClick={() => handleAspectChange(4/3)}>4:3 Classic</Button>
                </div>
                
                <div className="relative w-full max-h-[60vh] flex justify-center bg-black/5 rounded-lg overflow-hidden border-[2px] border-on-background/20">
                  {imgSrc && (
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspect}
                      className="max-h-[60vh]"
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        className="max-h-[60vh] w-auto object-contain"
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button size="lg" onClick={handleCrop} className="w-full md:w-auto gap-2">
                  <Scissors className="w-4 h-4" />
                  Crop & Download
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <ProcessingStatus 
          stage={stage} 
          stageInfo={{ processing: { text: "Cropping image...", value: 60 } }}
        />
      )}

      {stage === "success" && croppedUrl && (
        <div className="w-full p-8 bg-surface-container-lowest border-[3px] border-on-background rounded-xl flex flex-col items-center text-center neubrutal-shadow gap-6">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center border-[3px] border-on-background text-on-primary-container">
            <Download className="w-10 h-10" />
          </div>
          <div>
            <h2 className="font-headline-lg text-on-background mb-2">Crop Complete!</h2>
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
              Your image has been successfully cropped and is ready for download.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              Crop Another
            </Button>
            <Button asChild className="w-full sm:w-auto group">
              <a 
                href={croppedUrl} 
                download={`cropped-${file?.name || "image"}`}
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
