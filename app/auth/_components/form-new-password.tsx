"use client";

import FieldNewPassword from "@/components/form/field-new-password";
import FormWrapper from "@/components/form/form-wrapper";
import { newPassword } from "@/server/actions/new-password";
import { SchemaNewPassword } from "@/types/schema-new-password";
import type { TypeSafeActionFn } from "@/types/type-safe-action-fn";
import { useSearchParams } from "next/navigation";
import type { FC } from "react";

const FormNewPassword: FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <FormWrapper
      formTitle="Change your password"
      schema={SchemaNewPassword}
      defaultValues={{ password: "", passwordConfirmation: "" }}
      mode="onChange"
      action={newPassword as TypeSafeActionFn}
      hasSubmitButton
      onSubmit={(values) => ({ ...values, token })}
    >
      {(_, status) => <FieldNewPassword status={status} />}
    </FormWrapper>
  );
};

export default FormNewPassword;
