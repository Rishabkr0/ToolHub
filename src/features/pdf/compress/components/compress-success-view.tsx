"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { FileCheck, Download, RotateCcw, Star, AlertTriangle } from "lucide-react"
import { formatBytes } from "../../shared/lib/utils"
import { CompressResult } from "../lib/compress-engine"

interface CompressSuccessViewProps {
  result: CompressResult
  onReset: () => void
}

export function CompressSuccessView({ result, onReset }: CompressSuccessViewProps) {
  const [blobUrl, setBlobUrl] = React.useState<string>("")

  React.useEffect(() => {
    if (result.isOptimized) {
      const url = URL.createObjectURL(result.blob)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlobUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [result.blob, result.isOptimized])

  const savedBytes = result.originalSize - result.compressedSize
  const savedPercent = Math.round((savedBytes / result.originalSize) * 100)

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container-lowest border-[3px] border-on-background rounded-xl p-xl neubrutal-shadow flex flex-col items-center text-center">
      {result.isOptimized ? (
        <>
          <div className="w-20 h-20 bg-primary-container border-[3px] border-on-background rounded-full flex items-center justify-center mb-6">
            <FileCheck className="w-10 h-10 text-on-primary-container" />
          </div>
          <h2 className="font-display-md text-on-background mb-2">PDF Compressed!</h2>
          <p className="font-body-lg text-on-surface-variant mb-6 max-w-md">
            We successfully optimized the structure of your PDF.
          </p>
          
          <div className="w-full max-w-sm bg-surface-container rounded-lg border-[2px] border-on-background p-4 mb-8 text-left flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-label-bold text-on-surface-variant">Original:</span>
              <span className="font-body-md text-on-surface">{formatBytes(result.originalSize)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-bold text-on-surface-variant">Compressed:</span>
              <span className="font-body-md text-on-surface text-primary font-bold">{formatBytes(result.compressedSize)}</span>
            </div>
            <div className="flex justify-between items-center border-t-[2px] border-on-background/20 pt-2 mt-1">
              <span className="font-label-bold text-on-surface-variant">Space Saved:</span>
              <span className="font-body-md text-on-surface">{formatBytes(savedBytes)} ({savedPercent}% smaller)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
            <a href={blobUrl} download={result.filename} className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2">
                <Download className="w-5 h-5" />
                Download PDF
              </Button>
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-error-container border-[3px] border-on-background rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-on-error-container" />
          </div>
          <h2 className="font-display-md text-on-background mb-2">Already Optimized</h2>
          <p className="font-body-lg text-on-surface-variant mb-6 max-w-md">
            This PDF could not be reduced further. It is already fully structurally optimized.
          </p>
          
          <div className="w-full max-w-sm bg-surface-container rounded-lg border-[2px] border-on-background p-4 mb-8 text-left flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-label-bold text-on-surface-variant">Original:</span>
              <span className="font-body-md text-on-surface">{formatBytes(result.originalSize)}</span>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 border-t-[3px] border-on-background pt-6 w-full mt-2">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Compress Another PDF
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => alert("Save to favorites requires authentication.")}>
          <Star className="w-4 h-4" />
          Save to Favorites
        </Button>
      </div>
    </div>
  )
}
