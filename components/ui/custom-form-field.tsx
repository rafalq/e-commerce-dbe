import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CircleAlert } from "lucide-react";
import { ReactNode } from "react";

type CustomFormFieldProps = {
  label?: string;
  alertLabel?: boolean;
  description?: string;
  children: ReactNode; // Allow any type of input or field to be passed here
};

export default function CustomFormField({
  label,
  alertLabel,
  description,
  children,
}: CustomFormFieldProps) {
  return (
    <FormItem className="pt-4">
      <>
        {label && (
          <FormLabel className="flex gap-2 py-2 font-semibold">
            {label}
            {alertLabel && <CircleAlert className="w-3 h-3 text-red-700" />}
          </FormLabel>
        )}
        {description && (
          <FormDescription className="pt-1 pb-2 text-xs">
            {description}
          </FormDescription>
        )}
      </>
      <FormControl>{children}</FormControl>
      <div className="mt-3">
        <FormMessage className="inline bg-red-50 px-2 py-1 rounded-md font-semibold" />
      </div>
    </FormItem>
  );
}
