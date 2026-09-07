import * as React from "react"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw, FileText } from "lucide-react"
import { formatBytes } from "../../shared/lib/utils"

interface JpgToPdfSuccessViewProps {
  blob: Blob
  size: number
  pageCount: number
  onReset: () => void
}

export function JpgToPdfSuccessView({ blob, size, pageCount, onReset }: JpgToPdfSuccessViewProps) {
  const [blobUrl, setBlobUrl] = React.useState<string>("")

  React.useEffect(() => {
    const url = URL.createObjectURL(blob)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBlobUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [blob])

  const handleDownload = () => {
    if (!blobUrl) return
    const a = document.createElement("a")
    a.href = blobUrl
    a.download = "converted-images.pdf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl p-xl neubrutal-shadow flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-primary-container border-[3px] border-on-background rounded-full flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-on-primary-container" />
        </div>
        
        <h2 className="font-display-md text-on-background mb-2">JPG to PDF Complete</h2>
        <p className="font-body-lg text-on-surface-variant max-w-md mx-auto mb-8">
          Successfully converted {pageCount} {pageCount === 1 ? "image" : "images"} into a single PDF document.
        </p>

        <div className="w-full bg-surface-container rounded-lg border-[2px] border-on-background p-4 flex justify-between items-center mb-8">
          <span className="font-label-bold text-on-surface">Output File Size</span>
          <span className="font-label-md text-on-surface-variant bg-surface border-[2px] border-on-background px-3 py-1 rounded-full">
            {formatBytes(size)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button size="lg" onClick={handleDownload} className="flex-1 gap-2 text-lg h-14">
            <Download className="w-6 h-6" />
            Download PDF
          </Button>
          <Button variant="outline" size="lg" onClick={onReset} className="gap-2 h-14 shrink-0">
            <RotateCcw className="w-5 h-5" />
            Convert Another
          </Button>
        </div>
      </div>
    </div>
  )
}
