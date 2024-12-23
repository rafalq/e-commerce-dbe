import FormFieldWrapper from "@/components/form/form-field-box";
import { Input } from "@/components/ui/input";
import type { TypeSchemaSignIn } from "@/types/schema-sign-in";
import type { TypeApiResponse } from "@/types/type-api-response";
import type { HookActionStatus } from "next-safe-action/hooks";

const FieldEmail = ({
  apiResponse,
  status,
}: {
  apiResponse: TypeApiResponse | null;
  status: HookActionStatus;
}) => (
  <FormFieldWrapper<TypeSchemaSignIn> fieldName="email" label="Email">
    {(field) => (
      <Input
        {...field}
        placeholder="me@email.com"
        disabled={
          (apiResponse && apiResponse.status.includes("two-factor")) ||
          status === "executing"
        }
      />
    )}
  </FormFieldWrapper>
);

export default FieldEmail;
