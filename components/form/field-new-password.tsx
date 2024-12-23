import FormFieldWrapper from "@/components/form/form-field-box";
import CustomInputPassword from "@/components/ui/custom-input-password";
import type { TypeSchemaNewPassword } from "@/types/schema-new-password";
import type { HookActionStatus } from "next-safe-action/hooks";

type FieldNewPasswordProps = {
  status: HookActionStatus;
};

const FieldPassword = ({ status }: FieldNewPasswordProps) => {
  return (
    <FormFieldWrapper<TypeSchemaNewPassword>
      fieldName="password"
      label="Password"
    >
      {(field) => (
        <CustomInputPassword
          {...field}
          value={field.value ?? ""}
          disabled={status === "executing"}
        />
      )}
    </FormFieldWrapper>
  );
};

const FieldPasswordConfirmation = ({ status }: FieldNewPasswordProps) => {
  return (
    <FormFieldWrapper<TypeSchemaNewPassword>
      fieldName="passwordConfirmation"
      label="Password Confirmation"
    >
      {(field) => (
        <CustomInputPassword
          {...field}
          value={field.value ?? ""}
          disabled={status === "executing"}
        />
      )}
    </FormFieldWrapper>
  );
};

const FieldNewPassword = ({ status }: FieldNewPasswordProps) => {
  return (
    <>
      <FieldPassword status={status} />
      <FieldPasswordConfirmation status={status} />
    </>
  );
};

export default FieldNewPassword;
