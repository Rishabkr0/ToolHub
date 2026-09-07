"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { FileCheck, Download, RotateCcw, Star } from "lucide-react"

interface SuccessViewProps {
  mergedBlobUrl: string
  originalFileCount: number
  finalSize: number
  onReset: () => void
}

import { formatBytes } from "../../shared/lib/utils"

export function SuccessView({ mergedBlobUrl, originalFileCount, finalSize, onReset }: SuccessViewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container-lowest border-[3px] border-on-background rounded-xl p-xl neubrutal-shadow flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-primary-container border-[3px] border-on-background rounded-full flex items-center justify-center mb-6">
        <FileCheck className="w-10 h-10 text-on-primary-container" />
      </div>
      
      <h2 className="font-display-md text-on-background mb-2">PDFs Merged Successfully!</h2>
      <p className="font-body-lg text-on-surface-variant mb-8 max-w-md">
        Combined {originalFileCount} files into a single document entirely within your browser.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
        <a href={mergedBlobUrl} download="merged-document.pdf" className="w-full sm:w-auto">
          <Button size="lg" className="w-full gap-2">
            <Download className="w-5 h-5" />
            Download PDF ({formatBytes(finalSize)})
          </Button>
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 border-t-[3px] border-on-background pt-6 w-full mt-2">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Merge More PDFs
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => alert("Save to favorites requires authentication.")}>
          <Star className="w-4 h-4" />
          Save to Favorites
        </Button>
      </div>
    </div>
  )
}
