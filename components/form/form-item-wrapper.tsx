import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type FormItemWrapperProps = {
  description?: string;
  children: ReactNode;
} & (
  | { label?: undefined; labelIcon?: undefined }
  | { label: string; labelIcon?: ReactNode }
);

export default function FormItemWrapper({
  label,
  labelIcon,
  description,
  children,
}: FormItemWrapperProps) {
  const { error } = useFormField();
  return (
    <FormItem>
      {label && (
        <FormLabel className="flex gap-2 pb-2 font-semibold">
          {label}
          {labelIcon && labelIcon}
        </FormLabel>
      )}
      {description && (
        <FormDescription className="pb-2 text-xs">
          {description}
        </FormDescription>
      )}

      <FormControl>{children}</FormControl>
      <div
        className={cn(
          "my-0.5 transition-opacity duration-500",
          error ? "opacity-100" : "opacity-0 h-6"
        )}
      >
        <FormMessage className="inline bg-red-50 px-2 py-1 rounded-md font-semibold text-xs" />
      </div>
    </FormItem>
  );
}
