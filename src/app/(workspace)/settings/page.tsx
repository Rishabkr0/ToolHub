import * as React from "react"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display-lg text-[32px] text-on-background mb-8 flex items-center gap-4">
        <Settings className="w-8 h-8" />
        Settings
      </h1>
      <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl p-lg neubrutal-shadow mb-6">
        <h2 className="font-headline-lg text-on-surface mb-4">Preferences</h2>
        <p className="font-body-md text-on-surface-variant">
          User preferences and account settings will go here.
        </p>
      </div>
    </div>
  )
}
