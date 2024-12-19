"use client";

import FieldEmail from "@/components/form/field-email";
import FormWrapper from "@/components/form/form-wrapper";
import { resetPassword } from "@/server/actions/reset-password";
import { SchemaResetPassword } from "@/types/schema-reset-password";
import type { TypeSafeActionFn } from "@/types/type-safe-action-fn";

export default function FormResetPassword() {
  return (
    <FormWrapper
      formTitle="Reset your password"
      schema={SchemaResetPassword}
      defaultValues={{ email: "" }}
      mode="onChange"
      action={resetPassword as TypeSafeActionFn}
      hasSubmitButton
    >
      {(apiResponse, status) => (
        <FieldEmail apiResponse={apiResponse} status={status} />
      )}
    </FormWrapper>
  );
}
