"use client";

import CustomButtonLink from "@/components/ui/custom-button-link";
import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import CustomFormField from "@/components/ui/custom-form-field";
import FormCard from "@/components/ui/custom-card-wrapper";
import CustomInputPassword from "@/components/ui/custom-input-password";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signUpEmail } from "@/server/actions/sign-up-email";
import { SchemaSignUp } from "@/types/schema-sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import SocialsAuth from "./socials-auth";

export default function FormSignUp() {
  const form = useForm({
    resolver: zodResolver(SchemaSignUp),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { execute, status } = useAction(signUpEmail, {
    onExecute() {
      toast.loading("Operation in progress...");
    },
    onSuccess(data) {
      toast.dismiss();
      if (data.data?.status === "error") {
        toast.error(data.data.message || "Something went wrong.");
      } else if (data.data?.status === "success") {
        toast.success(data.data.message || "Operation done successfully!");
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(values: z.infer<typeof SchemaSignUp>) {
    execute(values);
  }

  return (
    <FormCard title="Sign Up">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ---- name input ---- */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <CustomFormField label="Name">
                <Input
                  type="text"
                  placeholder="Bobby"
                  disabled={status === "executing"}
                  {...field}
                />
              </CustomFormField>
            )}
          />
          {/* ---- email input ---- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <CustomFormField label="Email">
                <Input
                  type="email"
                  placeholder="email@email.com"
                  autoComplete="email"
                  disabled={status === "executing"}
                  {...field}
                />
              </CustomFormField>
            )}
          />
          {/* ---- password input ---- */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <CustomFormField label="Password">
                <CustomInputPassword
                  disabled={status === "executing"}
                  {...field}
                />
              </CustomFormField>
            )}
          />
          {/* ---- password confirmation input ---- */}
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <CustomFormField
                label="Password Confirmation"
                description="Enter the same password as above."
              >
                <CustomInputPassword
                  disabled={status === "executing"}
                  {...field}
                />
              </CustomFormField>
            )}
          />

          {/* ---- submit button ---- */}
          <CustomButtonSubmit
            disabled={status === "executing"}
            className={cn(status === "executing" && "animate-pulse")}
          />
        </form>
      </Form>
      <div className="py-6">
        <SocialsAuth />
      </div>

      <div className="text-center">
        <CustomButtonLink label="Have an account?" href="/auth/sign-in" />
      </div>
    </FormCard>
  );
}
