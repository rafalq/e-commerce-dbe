"use client";

import FormFieldWrapper from "@/components/form/form-field-wrapper";
import FormWrapper from "@/components/form/form-wrapper";
import CustomInputPassword from "@/components/ui/custom-input-password";
import { Input } from "@/components/ui/input";
import { signUpEmail } from "@/server/actions/sign-up-email";
import { SchemaSignUp, type TypeSchemaSignUp } from "@/types/schema-sign-up";
import type { TypeSafeActionFn } from "@/types/type-safe-action-fn";

export default function FormSignUp() {
  return (
    <FormWrapper
      formTitle="Sign up"
      schema={SchemaSignUp}
      defaultValues={{
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      }}
      mode="onChange"
      action={signUpEmail as TypeSafeActionFn}
      hasSocialAuth
      hasSubmitButton
      hasHaveAccountLink
    >
      {(apiResponse, status) => (
        <>
          {/* ----- name ----- */}
          <FormFieldWrapper<TypeSchemaSignUp>
            fieldName="name"
            label="Name"
            description="Your public display name"
          >
            {(field) => (
              <Input
                {...field}
                placeholder="Bobby"
                disabled={status === "executing"}
              />
            )}
          </FormFieldWrapper>

          {/* ----- email ----- */}
          <FormFieldWrapper<TypeSchemaSignUp> fieldName="email" label="Email">
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

          {/* ----- password ----- */}

          <FormFieldWrapper<TypeSchemaSignUp>
            fieldName="password"
            label="Password"
          >
            {(field) => <CustomInputPassword {...field} />}
          </FormFieldWrapper>
          {/* ----- password confirmation----- */}

          <FormFieldWrapper<TypeSchemaSignUp>
            fieldName="passwordConfirmation"
            label="Password Confirmation"
            description="Enter the same password as above"
          >
            {(field) => <CustomInputPassword {...field} />}
          </FormFieldWrapper>
        </>
      )}
    </FormWrapper>
  );
}
