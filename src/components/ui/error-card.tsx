import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ErrorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
}

/**
 * An inline error display for individual tools or components.
 */
export const ErrorCard = React.forwardRef<HTMLDivElement, ErrorCardProps>(
  ({ title = "An error occurred", message, onRetry, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-error-container border-[3px] border-on-background p-md rounded-xl neubrutal-shadow flex flex-col items-start gap-sm",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 text-on-error-container">
          <AlertCircle className="w-6 h-6" />
          <h3 className="font-headline-md">{title}</h3>
        </div>
        <p className="font-body-md text-on-error-container/80">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-xs px-sm py-1 bg-surface-container-lowest text-on-surface border-[2px] border-on-background rounded font-label-bold neubrutal-shadow-sm hover:translate-y-[-1px] hover:translate-x-[-1px] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }
)
ErrorCard.displayName = "ErrorCard"
