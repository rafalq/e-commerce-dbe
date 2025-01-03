"use client";

import { CardAuth } from "@/app/(auth)/_components/card-auth";
import CustomLink from "@/components/ui/custom/custom-link";
import SubmitButton from "@/components/ui/custom/submit-button";
import { Form } from "@/components/ui/form";
import { setToast } from "@/lib/set-toast";
import { signUpEmail } from "@/server/actions/sign-up-email";
import {
  SignUpSchema,
  type SignUpSchemaType,
} from "@/types/schema/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPlus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AUTH_PATHS } from "@/app/(auth)/_const/auth-paths";
import TextField from "@/components/form/text-field";
import PasswordField from "@/components/form/password-field";

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
            <TextField<SignUpSchemaType>
              name="name"
              label="Name"
              status={status}
            />
            <TextField<SignUpSchemaType>
              name="email"
              label="Email"
              status={status}
            />
            <PasswordField<SignUpSchemaType>
              name="password"
              label="Password"
              status={status}
            />
            <PasswordField<SignUpSchemaType>
              name="passwordConfirmation"
              label="Password Confirmation"
              status={status}
            />
            <div className="mt-8">
              <SubmitButton isLoading={status === "executing"} title="sign up">
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
