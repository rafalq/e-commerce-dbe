import FormFieldWrapper from "@/components/form/form-field-box";
import CustomInputPassword from "@/components/ui/custom-input-password";
import type { TypeSchemaSignIn } from "@/types/schema-sign-in";
import type { TypeApiResponse } from "@/types/type-api-response";
import type { HookActionStatus } from "next-safe-action/hooks";

type FieldPasswordProps = {
  apiResponse: TypeApiResponse | null;
  status: HookActionStatus;
};

const FieldPasswordTwoFactor = ({ apiResponse, status }: FieldPasswordProps) =>
  !apiResponse?.status.includes("two-factor") || apiResponse === null ? (
    <FormFieldWrapper<TypeSchemaSignIn> fieldName="password" label="Password">
      {(field) => (
        <CustomInputPassword {...field} disabled={status === "executing"} />
      )}
    </FormFieldWrapper>
  ) : null;

export default FieldPasswordTwoFactor;
