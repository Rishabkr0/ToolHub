"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { FileCheck, Download, RotateCcw, Star, Archive } from "lucide-react"
import { formatBytes } from "../../shared/lib/utils"
import { SplitResult } from "../lib/split-engine"

interface SplitSuccessViewProps {
  result: SplitResult
  onReset: () => void
}

export function SplitSuccessView({ result, onReset }: SplitSuccessViewProps) {
  const [blobUrl, setBlobUrl] = React.useState<string>("")

  React.useEffect(() => {
    const url = URL.createObjectURL(result.blob)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlobUrl(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [result.blob])

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container-lowest border-[3px] border-on-background rounded-xl p-xl neubrutal-shadow flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-primary-container border-[3px] border-on-background rounded-full flex items-center justify-center mb-6">
        <FileCheck className="w-10 h-10 text-on-primary-container" />
      </div>
      
      <h2 className="font-display-md text-on-background mb-2">PDF Split Successfully!</h2>
      <p className="font-body-lg text-on-surface-variant mb-8 max-w-md">
        {result.isZip 
          ? `Generated ${result.count} separate PDF files packaged into a ZIP.`
          : "Your extracted pages have been combined into a new PDF document."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-8">
        <a href={blobUrl} download={result.filename} className="w-full sm:w-auto">
          <Button size="lg" className="w-full gap-2">
            {result.isZip ? <Archive className="w-5 h-5" /> : <Download className="w-5 h-5" />}
            Download {result.isZip ? "ZIP" : "PDF"} ({formatBytes(result.blob.size)})
          </Button>
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 border-t-[3px] border-on-background pt-6 w-full mt-2">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Split Another PDF
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => alert("Save to favorites requires authentication.")}>
          <Star className="w-4 h-4" />
          Save to Favorites
        </Button>
      </div>
    </div>
  )
}
