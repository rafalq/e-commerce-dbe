"use client";

import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import CustomFormField from "@/components/ui/custom-form-field";
import FormCard from "@/components/ui/custom-card-wrapper";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/server/actions/reset-password";
import { SchemaResetPassword } from "@/types/schema-reset-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export default function FormResetPassword() {
  const form = useForm<z.infer<typeof SchemaResetPassword>>({
    resolver: zodResolver(SchemaResetPassword),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status } = useAction(resetPassword, {
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

  function onSubmit(values: z.infer<typeof SchemaResetPassword>) {
    execute(values);
  }

  return (
    <FormCard title="Reset Your Password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ---- email input ---- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <CustomFormField
                label="Email"
                description="Enter your email address and we will send you a link."
              >
                <Input disabled={status === "executing"} {...field} />
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
