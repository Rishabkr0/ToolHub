"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw, ImageIcon, FileArchive } from "lucide-react"
import { formatBytes } from "../../shared/lib/utils"
import { PdfToJpgResult } from "../lib/pdf-renderer"
import JSZip from "jszip"

interface PdfToJpgSuccessViewProps {
  result: PdfToJpgResult
  onReset: () => void
}

export function PdfToJpgSuccessView({ result, onReset }: PdfToJpgSuccessViewProps) {
  // Generate blob URLs safely in an effect to avoid strict mode memory leaks
  const [imageUrls, setImageUrls] = React.useState<Record<number, string>>({})

  React.useEffect(() => {
    const urls: Record<number, string> = {}
    result.images.forEach(img => {
      urls[img.pageNumber] = URL.createObjectURL(img.blob)
    })
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageUrls(urls)
    
    return () => {
      Object.values(urls).forEach(url => URL.revokeObjectURL(url))
    }
  }, [result.images])

  const handleDownloadAll = async () => {
    const zip = new JSZip()
    
    result.images.forEach(img => {
      zip.file(img.filename, img.blob)
    })

    const zipBlob = await zip.generateAsync({ type: "blob" })
    const zipUrl = URL.createObjectURL(zipBlob)
    
    const a = document.createElement("a")
    a.href = zipUrl
    // Use the base filename from the first image if possible
    const baseName = result.images.length > 0 ? result.images[0].filename.split("-page-")[0] : "images"
    a.download = `${baseName}-converted.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(zipUrl)
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header Summary */}
      <div className="w-full bg-surface-container-lowest border-[3px] border-on-background rounded-xl p-md lg:p-xl neubrutal-shadow flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-container border-[3px] border-on-background rounded-full flex items-center justify-center shrink-0">
            <ImageIcon className="w-8 h-8 text-on-primary-container" />
          </div>
          <div>
            <h2 className="font-display-md text-on-background mb-1">Conversion Complete</h2>
            <p className="font-body-md text-on-surface-variant">
              Converted {result.images.length} {result.images.length === 1 ? "page" : "pages"} • Total size: {formatBytes(result.totalSize)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {result.images.length > 1 && (
            <Button size="lg" onClick={handleDownloadAll} className="gap-2 shrink-0">
              <FileArchive className="w-5 h-5" />
              Download All as ZIP
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={onReset} className="gap-2 shrink-0">
            <RotateCcw className="w-5 h-5" />
            Convert Another
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.images.map(img => (
          <div key={img.pageNumber} className="bg-surface-container border-[3px] border-on-background rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-[4px_4px_0px_#111111] transition-all">
            <div className="aspect-[1/1.4] bg-surface-container-low border-b-[3px] border-on-background p-4 flex items-center justify-center relative overflow-hidden group">
              {imageUrls[img.pageNumber] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={imageUrls[img.pageNumber]} 
                  alt={`Page ${img.pageNumber}`} 
                  className="max-w-full max-h-full object-contain border-[1px] border-on-background/20 shadow-sm"
                />
              ) : (
                <div className="animate-pulse w-3/4 h-3/4 bg-surface-container-high rounded-sm"></div>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h4 className="font-headline-sm text-on-surface truncate mb-1" title={img.filename}>
                {img.filename}
              </h4>
              <div className="flex justify-between items-center mb-4 text-on-surface-variant font-label-sm">
                <span>Page {img.pageNumber}</span>
                <span>{formatBytes(img.size)}</span>
              </div>
              
              <div className="mt-auto">
                {imageUrls[img.pageNumber] ? (
                  <a href={imageUrls[img.pageNumber]} download={img.filename} className="w-full">
                    <Button variant="outline" className="w-full gap-2 bg-surface hover:bg-surface-container-highest">
                      <Download className="w-4 h-4" />
                      Download JPG
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" disabled className="w-full">Loading...</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
