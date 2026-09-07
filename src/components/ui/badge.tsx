import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-[2px] border-on-background px-3 py-1 font-label-sm text-label-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-on-primary-fixed hover:bg-primary-fixed",
        secondary:
          "bg-secondary-container text-on-secondary-fixed hover:bg-secondary-fixed",
        tertiary:
          "bg-tertiary-container text-on-tertiary-fixed hover:bg-tertiary-fixed",
        outline:
          "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface",
        destructive:
          "bg-error-container text-on-error-container hover:bg-[#ffb4ab]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
