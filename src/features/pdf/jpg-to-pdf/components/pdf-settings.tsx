import * as React from "react"
import { Settings2 } from "lucide-react"
import { PdfSettings as Settings } from "../lib/jpg-to-pdf-engine"

interface PdfSettingsProps {
  settings: Settings
  onChange: (settings: Settings) => void
}

export function PdfSettings({ settings, onChange }: PdfSettingsProps) {
  const update = (key: keyof Settings, value: string) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="w-full bg-surface-container rounded-xl border-[2px] border-on-background p-md mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-on-surface" />
        <h3 className="font-headline-md text-on-surface">PDF Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Page Size */}
        <div>
          <label className="block font-label-bold text-on-surface-variant mb-2">Page Size</label>
          <select 
            value={settings.pageSize}
            onChange={(e) => update("pageSize", e.target.value)}
            className="w-full bg-surface border-[2px] border-on-background rounded-lg p-2 font-label-bold text-on-surface"
          >
            <option value="auto">Auto (Match Image)</option>
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </div>

        {/* Orientation */}
        <div>
          <label className="block font-label-bold text-on-surface-variant mb-2">Orientation</label>
          <select 
            value={settings.orientation}
            onChange={(e) => update("orientation", e.target.value)}
            disabled={settings.pageSize === "auto"}
            className="w-full bg-surface border-[2px] border-on-background rounded-lg p-2 font-label-bold text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        {/* Margins */}
        <div>
          <label className="block font-label-bold text-on-surface-variant mb-2">Margins</label>
          <select 
            value={settings.margin}
            onChange={(e) => update("margin", e.target.value)}
            className="w-full bg-surface border-[2px] border-on-background rounded-lg p-2 font-label-bold text-on-surface"
          >
            <option value="none">None</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Fit */}
        <div>
          <label className="block font-label-bold text-on-surface-variant mb-2">Image Fit</label>
          <select 
            value={settings.fit}
            onChange={(e) => update("fit", e.target.value)}
            className="w-full bg-surface border-[2px] border-on-background rounded-lg p-2 font-label-bold text-on-surface"
          >
            <option value="fit">Fit to Page</option>
            <option value="fill">Fill Page (Crop)</option>
            <option value="original">Original Size</option>
          </select>
        </div>
      </div>
    </div>
  )
}
