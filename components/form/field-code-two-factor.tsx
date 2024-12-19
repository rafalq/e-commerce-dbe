import FormFieldWrapper from "@/components/form/form-field-wrapper";
import CustomInputCode from "@/components/ui/custom-input-code";
import type { TypeSchemaSignIn } from "@/types/schema-sign-in";
import type { TypeApiResponse } from "@/types/type-api-response";
import type { HookActionStatus } from "next-safe-action/hooks";

const FieldCodeTwoFactor = ({
  apiResponse,
  status,
}: {
  apiResponse: TypeApiResponse | null;
  status: HookActionStatus;
}) =>
  apiResponse && apiResponse.status.includes("two-factor") ? (
    <FormFieldWrapper<TypeSchemaSignIn>
      fieldName="code"
      label="Confirmation Code"
      description="Enter the confirmation code we sent to your email"
    >
      {(field) => (
        <CustomInputCode
          {...field}
          slotsAmount={6}
          disabled={status === "executing"}
        />
      )}
    </FormFieldWrapper>
  ) : null;

export default FieldCodeTwoFactor;
