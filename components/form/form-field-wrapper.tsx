import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

type FormFieldWrapperProps<T extends FieldValues> = {
  name: Path<T>;
  description?: string | ReactNode;
  children: (field: ControllerRenderProps<T, Path<T>>) => ReactNode;
} & (
  | { label?: undefined; labelIcon?: undefined }
  | { label: string | ReactNode; labelIcon?: ReactNode }
);

export default function FormFieldWrapper<T extends FieldValues>({
  name,
  label,
  labelIcon,
  description,
  children,
}: FormFieldWrapperProps<T>) {
  const form = useFormContext();

  if (!form) throw new Error("FormContext is not provided");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItemWrapper
          label={label as string}
          labelIcon={labelIcon}
          description={description}
          field={field as ControllerRenderProps<T, Path<T>>}
        >
          {(field) => children(field)}
        </FormItemWrapper>
      )}
    />
  );
}

type FormItemWrapperProps<T extends FieldValues> = {
  description?: string | ReactNode;
  field: ControllerRenderProps<T, Path<T>>;
  children: (field: ControllerRenderProps<T, Path<T>>) => ReactNode;
} & (
  | { label?: undefined; labelIcon?: undefined }
  | { label: string; labelIcon?: ReactNode }
);

function FormItemWrapper<T extends FieldValues>({
  label,
  labelIcon,
  description,
  field,
  children,
}: FormItemWrapperProps<T>) {
  const { error } = useFormField();
  return (
    <FormItem className="pt-2">
      {label && (
        <FormLabel className="flex gap-2 py-2 font-semibold">
          {label}
          {labelIcon && labelIcon}
        </FormLabel>
      )}
      {description && (
        <FormDescription className="pt-1 pb-2 text-xs">
          {description}
        </FormDescription>
      )}

      <FormControl>
        {children(field as ControllerRenderProps<T, Path<T>>)}
      </FormControl>
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
