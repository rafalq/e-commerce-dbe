"use client";

import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import CustomFormField from "@/components/ui/custom-form-field";
import FormCard from "@/components/ui/custom-card-wrapper";
import CustomInputPassword from "@/components/ui/custom-input-password";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { newPassword } from "@/server/actions/new-password";
import { SchemaNewPassword } from "@/types/schema-new-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function FormNewPassword() {
  const form = useForm<z.infer<typeof SchemaNewPassword>>({
    resolver: zodResolver(SchemaNewPassword),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { execute, status } = useAction(newPassword, {
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

  function onSubmit(values: z.infer<typeof SchemaNewPassword>) {
    execute({
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
      token,
    });
  }

  return (
    <FormCard title="Change Your Password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          {/* ----passwordConfirmation input ---- */}
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <CustomFormField label="Confirm Password">
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
    </FormCard>
  );
}
