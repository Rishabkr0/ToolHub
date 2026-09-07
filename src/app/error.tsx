"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-error-container border-[3px] border-on-background rounded-2xl flex items-center justify-center mb-6 neubrutal-shadow rotate-[-6deg]">
        <AlertTriangle className="w-10 h-10 text-on-error-container" />
      </div>
      <h2 className="font-display-lg text-display-lg text-on-background mb-4">Something went wrong!</h2>
      <p className="font-body-lg text-on-surface-variant max-w-md mb-8">
        We hit a snag processing your request. Our servers have been notified.
      </p>
      <button
        onClick={() => reset()}
        className="px-lg py-sm bg-primary-container text-on-primary-container border-[3px] border-on-background rounded-lg font-label-bold neubrutal-shadow neubrutal-hover uppercase tracking-wider"
      >
        Try again
      </button>
    </div>
  )
}
