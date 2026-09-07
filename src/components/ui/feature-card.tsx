import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description: string
  iconBgClass?: string
  iconColorClass?: string
}

/**
 * A display card used in marketing pages for highlighting features.
 */
export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon: Icon, title, description, iconBgClass = "bg-primary-container", iconColorClass = "text-on-primary-container", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-md bg-surface-container-lowest border-[3px] border-on-background rounded-xl flex gap-md neubrutal-shadow transition-all hover:translate-y-[-2px] hover:translate-x-[-2px]",
          className
        )}
        {...props}
      >
        <div className={cn("shrink-0 w-12 h-12 rounded-lg border-[3px] border-on-background flex items-center justify-center", iconBgClass)}>
          <Icon className={cn("w-6 h-6", iconColorClass)} />
        </div>
        <div className="flex flex-col">
          <h4 className="font-headline-md text-on-surface mb-xs">{title}</h4>
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    )
  }
)
FeatureCard.displayName = "FeatureCard"
