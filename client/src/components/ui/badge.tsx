import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-[var(--font-small-size)] font-[var(--font-small-weight)]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-active)] active:bg-[color:var(--primary-active)]",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-[color:var(--secondary-hover)] focus:bg-[color:var(--secondary-active)] active:bg-[color:var(--secondary-active)]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 focus:bg-destructive/90 active:bg-destructive/90",
        outline: "text-foreground border-border bg-background hover:bg-muted focus:bg-muted active:bg-muted",
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
