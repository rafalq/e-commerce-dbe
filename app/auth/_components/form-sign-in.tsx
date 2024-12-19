"use client";

import ButtonSubmitTwoFactor from "@/components/form/button-submit-two-factor";
import FieldCodeTwoFactor from "@/components/form/field-code-two-factor";
import FieldEmail from "@/components/form/field-email";
import FieldPasswordTwoFactor from "@/components/form/field-password-two-factor";
import FormWrapper from "@/components/form/form-wrapper";
import { signInEmail } from "@/server/actions/sign-in-email";
import { SchemaSignIn } from "@/types/schema-sign-in";
import type { TypeSafeActionFn } from "@/types/type-safe-action-fn";

export default function FormSignIn() {
  return (
    <FormWrapper
      formTitle="Sign in"
      schema={SchemaSignIn}
      defaultValues={{ email: "", password: "", code: "" }}
      mode="onChange"
      action={signInEmail as TypeSafeActionFn}
      hasSocialAuth
      hasNoAccountLink
      hasSubmitButton={false}
    >
      {(apiResponse, status) => (
        <>
          <FieldEmail apiResponse={apiResponse} status={status} />
          <FieldPasswordTwoFactor apiResponse={apiResponse} status={status} />
          <FieldCodeTwoFactor apiResponse={apiResponse} status={status} />
          <ButtonSubmitTwoFactor apiResponse={apiResponse} status={status} />
        </>
      )}
    </FormWrapper>
  );
}
