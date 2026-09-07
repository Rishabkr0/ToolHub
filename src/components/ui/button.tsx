import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-label-bold text-label-bold uppercase tracking-wider transition-all border-[3px] border-on-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-container text-on-primary-container neubrutal-shadow neubrutal-hover",
        secondary:
          "bg-secondary-container text-on-secondary-container neubrutal-shadow neubrutal-hover",
        outline:
          "bg-surface-container-lowest text-on-surface neubrutal-shadow neubrutal-hover",
        danger:
          "bg-error-container text-on-error-container neubrutal-shadow neubrutal-hover",
        ghost: "border-transparent bg-transparent hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-[18px]",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * A highly reusable Button component featuring MD3 colors and Neubrutalist styling.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Standard button for forms, actions, and dialogs.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
