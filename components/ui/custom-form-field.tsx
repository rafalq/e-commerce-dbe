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
  label: string;
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
    <FormItem>
      <div className="mb-2">
        <FormLabel className="flex gap-2 mb-1 font-semibold">
          {label}
          {alertLabel && <CircleAlert className="w-3 h-3 text-red-700" />}
        </FormLabel>
        {description && (
          <FormDescription className="my-1 text-xs">
            {description}
          </FormDescription>
        )}
      </div>
      <FormControl>{children}</FormControl>
      <FormMessage className="inline bg-red-50 px-2 py-1 rounded-md" />
    </FormItem>
  );
}
