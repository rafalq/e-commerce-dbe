import type { HookActionStatus } from "next-safe-action/hooks";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import type { FieldValues, Path } from "react-hook-form";
import InputPassword from "@/components/ui/custom/input-password";

type PasswordFieldProps<T> = {
  name: Path<T>;
  label: string;
  description?: string;
  status: HookActionStatus;
};

export default function PasswordField<T extends FieldValues>({
  name,
  label,
  description,
  status,
}: PasswordFieldProps<T>) {
  return (
    <FormFieldWrapper<T> name={name} label={label} description={description}>
      {(field) => (
        <InputPassword {...field} disabled={status === "executing"} />
      )}
    </FormFieldWrapper>
  );
}
