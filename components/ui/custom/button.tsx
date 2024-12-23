import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex justify-center items-center disabled:opacity-50 rounded-md font-medium text-sm tracking-wide whitespace-nowrap transition-all transition-colors duration-200 disabled:pointer-events-none ease-out focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:shadow-[0_5px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_10px_20px_rgba(150,150,150,0.4)] dark:active:shadow-[0_5px_10px_rgba(150,150,150,0.4)] hover:-translate-y-1 active:-translate-y-[1px] hover:scale-110 active:scale-105 w-full sm:w-auto duration-200 transition-all",
        destructive:
          "bg-destructive text-destructive-foreground hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:shadow-[0_5px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_10px_20px_rgba(150,150,150,0.4)] dark:active:shadow-[0_5px_10px_rgba(150,150,150,0.4)] hover:-translate-y-1 active:-translate-y-[1px] hover:scale-110 active:scale-105 w-full sm:w-auto duration-200 transition-all",
        outline:
          "border border-input bg-background hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:shadow-[0_5px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_10px_20px_rgba(150,150,150,0.4)] dark:active:shadow-[0_5px_10px_rgba(150,150,150,0.4)] hover:-translate-y-1 active:-translate-y-[1px] hover:scale-110 active:scale-105 w-full sm:w-auto duration-200 transition-all",
        secondary:
          "bg-secondary text-secondary-foreground hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:shadow-[0_5px_10px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_10px_20px_rgba(150,150,150,0.4)] dark:active:shadow-[0_5px_10px_rgba(150,150,150,0.4)] hover:-translate-y-1 active:-translate-y-[1px] hover:scale-110 active:scale-105 w-full sm:w-auto duration-200 transition-all",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        minDefault: "bg-primary text-primary-foreground hover:bg-primary/90",
        minOutline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        minSecondary:
          "bg-secondary text-secondary-foreground hover:bg-primary/10",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
