"use client";

import CustomButtonLink from "@/components/ui/custom-button-link";
import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import CustomFormField from "@/components/ui/custom-form-field";
import FormCard from "@/components/ui/custom-card-wrapper";
import CustomInputPassword from "@/components/ui/custom-input-password";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { signInEmail } from "@/server/actions/sign-in-email";
import { SchemaSignIn } from "@/types/schema-sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import SocialsAuth from "./socials-auth";

export default function FormSignIn() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm({
    resolver: zodResolver(SchemaSignIn),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const { execute, status } = useAction(signInEmail, {
    onExecute() {
      toast.loading("Operation in progress...");
    },
    onSuccess(data) {
      toast.dismiss();
      if (data.data?.status === "error") {
        toast.error(data.data.message || "Something went wrong.");
      } else if (data.data?.status === "success") {
        toast.success(data.data.message || "Operation done successfully!");
      } else if (data.data?.status === "two-factor") {
        toast.success(data.data.message || "Operation done successfully!");
        setShowTwoFactor(true);
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(values: z.infer<typeof SchemaSignIn>) {
    execute(values);
  }

  return (
    <FormCard title="Sign In">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ---- email input ---- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <CustomFormField label="Email">
                <Input
                  placeholder="email@email.com"
                  autoComplete="email"
                  disabled={status === "executing"}
                  {...field}
                />
              </CustomFormField>
            )}
          />
          {/* ---- password input ---- */}
          {!showTwoFactor && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <CustomFormField label="Password">
                  <CustomInputPassword
                    autoComplete="current-password"
                    disabled={status === "executing"}
                    {...field}
                  />
                </CustomFormField>
              )}
            />
          )}

          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <CustomFormField
                  label="Confirmation Code"
                  description="Enter the confirmation code we sent to your email."
                >
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    {...field}
                    disabled={status === "executing"}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }, (_, index) => (
                        <InputOTPSlot index={index} key={index}></InputOTPSlot>
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </CustomFormField>
              )}
            />
          )}

          {/* ---- submit button ---- */}

          {!showTwoFactor && (
            <div className="flex sm:flex-row flex-col justify-between mt-6">
              <CustomButtonLink
                label="Forgot your password?"
                href=" /auth/reset-password"
              />
              <CustomButtonSubmit
                disabled={status === "executing"}
                className={cn(status === "executing" && "animate-pulse")}
              />
            </div>
          )}
          {showTwoFactor && (
            <CustomButtonSubmit
              disabled={status === "executing"}
              className={cn(status === "executing" && "animate-pulse")}
            />
          )}
        </form>
      </Form>

      <div className="py-6">
        <SocialsAuth />
      </div>

      <div className="text-center">
        <CustomButtonLink label="No account?" href="/auth/sign-up" />
      </div>
    </FormCard>
  );
}
