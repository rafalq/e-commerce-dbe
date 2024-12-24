"use client";

import { CardAuth } from "@/app/(auth)/_components/card-auth";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import { Button } from "@/components/ui/button";
import CustomLink from "@/components/ui/custom/custom-link";
import InputCode from "@/components/ui/custom/input-code";
import InputPassword from "@/components/ui/custom/input-password";
import SubmitButton from "@/components/ui/custom/submit-button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setToast } from "@/lib/set-toast";
import { signInEmail } from "@/server/actions/sign-in-email";
import { SignInSchema, type SignInSchemaType } from "@/types/sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, LogIn } from "lucide-react";
import { useAction, type HookActionStatus } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AUTH_PATHS } from "@/app/(auth)/_const/auth-paths";

export default function SignInForm() {
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: "onChange",
  });

  const { execute, status, result } = useAction(signInEmail, {
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

  function onSubmit(parsedInput: SignInSchemaType) {
    execute(parsedInput);
  }

  function handleResendCode() {
    const values: SignInSchemaType = {
      email: form.getValues("email"),
      password: form.getValues("password"),
      code: "resend",
    };
    execute(values);
  }

  return (
    <section>
      <CardAuth cardTitle="Sign in to your account" showSocials>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <EmailField status={status} />

            {result.data?.status.includes("two-factor") ? (
              <>
                <CodeField status={status} />
                <ResendCode onClick={handleResendCode} />
                <SubmitButton status={status} title="verify">
                  <CircleCheckBig className="w-4 h-4" />
                </SubmitButton>
              </>
            ) : (
              <>
                <PasswordField status={status} />
                <ForgotLink />
                <SubmitButton status={status} title="sign in">
                  <LogIn className="w-4 h-4" />
                </SubmitButton>
                <SignUpLink />
              </>
            )}
          </form>
        </Form>
      </CardAuth>
    </section>
  );
}

function EmailField({ status }: { status: HookActionStatus }) {
  return (
    <FormFieldWrapper<SignInSchemaType> name="email" label="Email">
      {(field) => <Input {...field} disabled={status === "executing"} />}
    </FormFieldWrapper>
  );
}

function PasswordField({ status }: { status: HookActionStatus }) {
  return (
    <FormFieldWrapper<SignInSchemaType> name="password" label="Password">
      {(field) => (
        <InputPassword {...field} disabled={status === "executing"} />
      )}
    </FormFieldWrapper>
  );
}

function CodeField({ status }: { status: HookActionStatus }) {
  return (
    <FormFieldWrapper<SignInSchemaType>
      name="code"
      description="To log in, enter the code sent to your email"
    >
      {(field) => (
        <InputCode
          {...field}
          slotsAmount={6}
          disabled={status === "executing"}
        />
      )}
    </FormFieldWrapper>
  );
}

function ForgotLink() {
  return (
    <div className="flex justify-end items-center mb-8">
      <CustomLink href={AUTH_PATHS.resetPassword} title="Forgot Password?" />
    </div>
  );
}

function SignUpLink() {
  return (
    <div className="mt-8">
      <CustomLink
        text="Don’t have an account yet?"
        href={AUTH_PATHS.signUp}
        title="Sign up"
      />
    </div>
  );
}

function ResendCode({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-row-reverse mb-6 w-full">
      <Button type="button" variant="link" onClick={onClick}>
        Resend Code
      </Button>
    </div>
  );
}
