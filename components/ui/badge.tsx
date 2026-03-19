import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        show: "border-transparent bg-festival-terracotta text-white",
        exhibition: "border-transparent bg-festival-teal text-white",
        screening: "border-transparent bg-festival-purple text-white",
        workshop: "border-transparent bg-festival-gold text-festival-black",
        performance: "border-transparent bg-festival-blue text-white",
        other: "border-transparent bg-festival-stone text-white",
        livre: "border-festival-teal text-festival-teal",
        "12 anos": "border-festival-gold text-festival-earth",
        "14 anos": "border-festival-gold text-festival-earth",
        "16 anos": "border-festival-terracotta text-festival-terracotta",
        "18 anos": "border-festival-purple text-festival-purple",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
