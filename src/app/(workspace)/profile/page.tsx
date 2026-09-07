import * as React from "react"
import { User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display-lg text-[32px] text-on-background mb-8">Your Profile</h1>
      <div className="bg-surface-container-lowest border-[3px] border-on-background rounded-xl p-lg neubrutal-shadow flex items-center gap-6">
        <div className="w-24 h-24 bg-primary-container rounded-full border-[3px] border-on-background flex items-center justify-center">
          <User className="w-12 h-12 text-on-primary-container" />
        </div>
        <div>
          <h2 className="font-headline-lg text-on-surface mb-1">Jane Doe</h2>
          <p className="font-body-md text-on-surface-variant">jane.doe@example.com</p>
        </div>
      </div>
    </div>
  )
}
