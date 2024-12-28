"use client";

import { CardAuth } from "@/app/(auth)/_components/card-auth";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import InputPassword from "@/components/ui/custom/input-password";
import SubmitButton from "@/components/ui/custom/submit-button";
import { Form } from "@/components/ui/form";
import { setToast } from "@/lib/set-toast";
import { newPassword } from "@/server/actions/new-password";
import type { ApiResponseType } from "@/types/api-response-type";
import {
  NewPasswordSchema,
  type NewPasswordSchemaType,
} from "@/types/new-password-schema";
import { type SignUpSchemaType } from "@/types/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useAction, type HookActionStatus } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(newPassword, {
    onExecute() {
      toast.loading("Processing...");
    },
    onSuccess(data) {
      toast.dismiss();
      setToast(data.data as ApiResponseType);
      if (data.data?.payload && typeof data.data.payload === "object") {
        const payload = data.data.payload as { redirect: string };
        if (payload.redirect) {
          router.push(payload.redirect);
        }
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: NewPasswordSchemaType) {
    execute({ ...parsedInput, token });
  }

  return (
    <section>
      <CardAuth cardTitle="Change Password" showSocials>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <PasswordField status={status} />
            <PasswordConfirmationField status={status} />
            <div className="mt-8">
              <SubmitButton
                isLoading={status === "executing"}
                title="change password"
              >
                <RefreshCcw className="w-4 h-4" />
              </SubmitButton>
            </div>
          </form>
        </Form>
      </CardAuth>
    </section>
  );
}

function PasswordField({ status }: { status: HookActionStatus }) {
  return (
    <FormFieldWrapper<SignUpSchemaType> name="password" label="Password">
      {(field) => (
        <InputPassword {...field} disabled={status === "executing"} />
      )}
    </FormFieldWrapper>
  );
}

function PasswordConfirmationField({ status }: { status: HookActionStatus }) {
  return (
    <FormFieldWrapper<SignUpSchemaType>
      name="passwordConfirmation"
      label="Password Confirmation"
    >
      {(field) => (
        <InputPassword {...field} disabled={status === "executing"} />
      )}
    </FormFieldWrapper>
  );
}
