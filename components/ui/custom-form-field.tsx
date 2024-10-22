import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReactNode } from "react";

type CustomFormFieldProps = {
  label: string;
  description?: string;
  children: ReactNode; // Allow any type of input or field to be passed here
};

export default function CustomFormField({
  label,
  description,
  children,
}: CustomFormFieldProps) {
  return (
    <FormItem>
      <div className="mb-2">
        <FormLabel className="font-semibold">{label}</FormLabel>
        {description && (
          <FormDescription className="text-xs">{description}</FormDescription>
        )}
      </div>
      <FormControl>{children}</FormControl>
      <div className="mt-1">
        <FormMessage className="inline bg-red-50 px-2 py-1 rounded-md" />
      </div>
    </FormItem>
  );
}
