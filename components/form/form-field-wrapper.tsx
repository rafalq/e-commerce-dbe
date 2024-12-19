import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReactNode } from "react";
import {
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

type FormFieldWrapperProps<T extends FieldValues> = {
  fieldName: Path<T>;
  label: string;
  labelSign?: ReactNode;
  description?: string;
  children: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
};

const FormFieldWrapper = <T extends FieldValues>({
  fieldName,
  label,
  labelSign,
  description,
  children,
}: FormFieldWrapperProps<T>) => {
  const form = useFormContext();

  if (!form) throw new Error("FormContext is not provided");

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex gap-2 mb-3 font-semibold">
            {label}
            {labelSign && labelSign}
          </FormLabel>
          {description && (
            <FormDescription className="mb-1 text-xs">
              {description}
            </FormDescription>
          )}

          <FormControl>
            <>{children(field as ControllerRenderProps<T, Path<T>>)}</>
          </FormControl>
          <div className="mt-3">
            <FormMessage className="inline text-right bg-destructive/10 px-2 py-1 rounded-md" />
          </div>
        </FormItem>
      )}
    />
  );
};

FormFieldWrapper.displayName = "FormFieldWrapper";

export default FormFieldWrapper;
