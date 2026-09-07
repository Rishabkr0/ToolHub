import * as React from "react"
import { LucideIcon, FileQuestion } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

/**
 * A reusable empty state display.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon: Icon = FileQuestion, title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center p-xl text-center bg-surface-container-lowest border-[3px] border-on-background rounded-xl neubrutal-shadow",
          className
        )}
        {...props}
      >
        <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full border-[3px] border-on-background mb-md">
          <Icon className="w-8 h-8 text-on-surface-variant" />
        </div>
        <h3 className="font-headline-md text-on-surface mb-xs">{title}</h3>
        <p className="font-body-md text-on-surface-variant max-w-md mb-md">
          {description}
        </p>
        {action && <div>{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"
