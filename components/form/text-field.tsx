import type { HookActionStatus } from "next-safe-action/hooks";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import type { FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";

type TextFieldProps<T> = {
  name: Path<T>;
  label: string;
  description?: string;
  status: HookActionStatus;
  isDisabled?: boolean;
};

export default function TextField<T extends FieldValues>({
  name,
  label,
  description,
  status,
  isDisabled,
}: TextFieldProps<T>) {
  return (
    <FormFieldWrapper<T> name={name} label={label} description={description}>
      {(field) => (
        <Input {...field} disabled={status === "executing" || isDisabled} />
      )}
    </FormFieldWrapper>
  );
}
