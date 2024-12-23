"use client";

import { CardAuth } from "@/app/(auth)/_components/card-auth";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import CustomLink from "@/components/ui/custom/custom-link";
import SubmitButton from "@/components/ui/custom/submit-button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setToast } from "@/lib/set-toast";
import { resetPassword } from "@/server/actions/reset-password";
import {
  PasswordResetSchema,
  type PasswordResetSchemaType,
} from "@/types/password-reset-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal } from "lucide-react";
import { useAction, type HookActionStatus } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AUTH_PATHS } from "../const";
import { useRouter } from "next/navigation";

export default function PasswordResetForm() {
  const router = useRouter();

  const form = useForm<PasswordResetSchemaType>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: "",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(resetPassword, {
    onExecute() {
      toast.loading("Processing...");
    },
    onSuccess(data) {
      toast.dismiss();
      setToast(data.data!);
      if (data.data?.payload?.redirect) {
        router.push(data.data?.payload.redirect);
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: PasswordResetSchemaType) {
    execute(parsedInput);
  }

  return (
    <section>
      <CardAuth cardTitle="Reset Password">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Info />
            <EmailField status={status} />
            <BackLink />
            <SubmitButton status={status} title="send your email">
              <SendHorizonal className="w-4 h-4" />
            </SubmitButton>
          </form>
        </Form>
      </CardAuth>
    </section>
  );
}

function EmailField({ status }: { status: HookActionStatus }) {
  return (
    <FormFieldWrapper<PasswordResetSchemaType> name="email" label="Email">
      {(field) => <Input {...field} disabled={status === "executing"} />}
    </FormFieldWrapper>
  );
}

function BackLink() {
  return (
    <div className="flex justify-end items-center mb-8">
      <CustomLink href={AUTH_PATHS.signIn} title="Back To Sign-In" text="⇦" />
    </div>
  );
}

function Info() {
  return (
    <div className="mb-4 text-primary/80 text-xs">
      <p>Enter your email address. </p>
      <p>If it matches an email address we have on file,</p>
      <p>
        then we will send you further instructions for resetting your password.
      </p>
      <p>
        If you do not receive an email in 5 minutes, check your spam, resend, or
        try a different email address
      </p>
    </div>
  );
}
