import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border-[3px] border-on-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-surface-container hover:bg-surface-container-high text-on-surface neubrutal-shadow-sm active:shadow-none active:translate-y-[2px] active:translate-x-[2px]",
        primary: "bg-primary-container text-on-primary-container neubrutal-shadow-sm active:shadow-none active:translate-y-[2px] active:translate-x-[2px]",
        secondary: "bg-secondary-container text-on-secondary-container neubrutal-shadow-sm active:shadow-none active:translate-y-[2px] active:translate-x-[2px]",
        ghost: "border-transparent shadow-none hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface",
        rounded: "rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface neubrutal-shadow-sm active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
      },
      size: {
        default: "h-10 w-10 rounded-lg",
        sm: "h-8 w-8 rounded-md",
        lg: "h-14 w-14 rounded-xl",
        icon: "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }
