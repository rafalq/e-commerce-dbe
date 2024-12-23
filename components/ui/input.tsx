import * as React from "react";

import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/form";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { error } = useFormField();
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full text-primary rounded-md border border-secondary bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className,
          error &&
            "bg-destructive/10 focus-visible:ring-destructive/50 border-destructive/40"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
