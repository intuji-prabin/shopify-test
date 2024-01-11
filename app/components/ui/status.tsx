import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const statusVariants = cva(
    "inline-flex items-center justify-center p-2 min-w-[96px] text-sm font-medium capitalize leading-4",
    {
        variants: {
            variant: {
                awaiting:
                    "border border-solid border-current text-status-awaiting",
                invoice:
                    "border border-solid border-current text-status-invoice",
                partially_pick:
                    "border border-solid border-current text-status-partially_pick",
                shipped: "border border-solid border-current text-status-shipped",
                partially_shipped:
                    "border border-solid border-current text-status-partially_shipped",
                partially_invoice:
                    "border border-solid border-current text-status-partially_invoice",
                fully_pick: "border border-solid border-current text-status-fully_pick",
            },
        },
        defaultVariants: {
            variant: "awaiting",
        },
    }
)

export interface SatusProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> { }

function Status({ className, variant, ...props }: SatusProps) {
    return (
        <div className={cn(statusVariants({ variant }), className)} {...props} />
    )
}

export { Status, statusVariants }
