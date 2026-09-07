import Link from "next/link"
import { SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-surface-container-high border-[3px] border-on-background rounded-full flex items-center justify-center mb-6 neubrutal-shadow">
        <SearchX className="w-12 h-12 text-on-surface-variant" />
      </div>
      <h2 className="font-display-lg text-[64px] text-on-background leading-none mb-2">404</h2>
      <h3 className="font-headline-lg text-on-surface mb-4">Page not found</h3>
      <p className="font-body-lg text-on-surface-variant max-w-md mb-8">
        The tool or page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-lg py-sm bg-primary-container text-on-primary-container border-[3px] border-on-background rounded-lg font-label-bold neubrutal-shadow neubrutal-hover uppercase tracking-wider"
      >
        Back to Home
      </Link>
    </div>
  )
}
