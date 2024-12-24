"use client";

import { CardAuth } from "@/app/(auth)/_components/card-auth";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import CustomLink from "@/components/ui/custom/custom-link";
import InputPassword from "@/components/ui/custom/input-password";
import SubmitButton from "@/components/ui/custom/submit-button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setToast } from "@/lib/set-toast";
import { signUpEmail } from "@/server/actions/sign-up-email";
import { SignUpSchema, type SignUpSchemaType } from "@/types/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPlus } from "lucide-react";
import { useAction, type HookActionStatus } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AUTH_PATHS } from "@/app/(auth)/_const/auth-paths";

export default function SignUpForm() {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: "onChange",
  });

  const { execute, status } = useAction(signUpEmail, {
    onExecute() {
      toast.loading("Processing...");
    },
    onSuccess(data) {
      toast.dismiss();
      setToast(data.data!);
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: SignUpSchemaType) {
    execute(parsedInput);
  }

  return (
    <section>
      <CardAuth cardTitle="Create an account" showSocials>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <NameField status={status} />
            <EmailField status={status} />
            <PasswordField status={status} />
            <PasswordConfirmationField status={status} />
            <div className="mt-8">
              <SubmitButton status={status} title="sign up">
                <UserRoundPlus className="w-4 h-4" />
              </SubmitButton>
            </div>
            <SignInLink />
          </form>
        </Form>
      </CardAuth>
    </section>
  );
}

function NameField({ status }: { status: HookActionStatus }) {
  return (
    <FormFieldWrapper<SignUpSchemaType> name="name" label="Name">
      {(field) => <Input {...field} disabled={status === "executing"} />}
    </FormFieldWrapper>
  );
}

function EmailField({ status }: { status: HookActionStatus }) {
  return (
    <FormFieldWrapper<SignUpSchemaType> name="email" label="Email">
      {(field) => <Input {...field} disabled={status === "executing"} />}
    </FormFieldWrapper>
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

function SignInLink() {
  return (
    <div className="mt-8">
      <CustomLink
        text="Already have an account?"
        href={AUTH_PATHS.signIn}
        title="Sign in"
      />
    </div>
  );
}
