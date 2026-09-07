import * as React from "react"
import { ImageResolution, ImageQuality } from "../lib/pdf-renderer"
import { Settings2 } from "lucide-react"

interface ImageSettingsProps {
  resolution: ImageResolution
  setResolution: (r: ImageResolution) => void
  quality: ImageQuality
  setQuality: (q: ImageQuality) => void
}

export function ImageSettings({ resolution, setResolution, quality, setQuality }: ImageSettingsProps) {
  return (
    <div className="w-full bg-surface-container rounded-xl border-[2px] border-on-background p-md mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-on-surface" />
        <h3 className="font-headline-md text-on-surface">Image Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div>
          <label className="block font-label-bold text-on-surface-variant mb-2">Image Quality</label>
          <div className="flex bg-surface border-[2px] border-on-background rounded-lg overflow-hidden">
            {(["standard", "high", "maximum"] as ImageQuality[]).map(q => (
              <button
                key={`q-${q}`}
                onClick={() => setQuality(q)}
                className={`flex-1 py-2 font-label-bold capitalize transition-colors ${
                  quality === q 
                    ? "bg-primary text-on-primary" 
                    : "bg-transparent text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <p className="text-body-sm text-on-surface-variant mt-2">
            Higher quality produces sharper images but increases file size.
          </p>
        </div>

        <div>
          <label className="block font-label-bold text-on-surface-variant mb-2">Resolution (Scale)</label>
          <div className="flex bg-surface border-[2px] border-on-background rounded-lg overflow-hidden">
            {(["standard", "high", "maximum"] as ImageResolution[]).map(r => (
              <button
                key={`r-${r}`}
                onClick={() => setResolution(r)}
                className={`flex-1 py-2 font-label-bold capitalize transition-colors ${
                  resolution === r 
                    ? "bg-secondary text-on-secondary" 
                    : "bg-transparent text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-body-sm text-on-surface-variant mt-2">
            Increases the dimensions of the output image. Use Maximum for printing.
          </p>
        </div>
      </div>
    </div>
  )
}
