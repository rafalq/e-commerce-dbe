"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { resetPassword } from "@/server/actions/reset-password";
import type { FormAuthInput } from "@/types/form-auth";
import { SchemaResetPassword } from "@/types/schema-reset-password";
import { IoIosSend } from "react-icons/io";
import {
  NotificationError,
  NotificationSuccess,
} from "../ui/custom/notifications";
import FormWrapper from "../ui/custom/form-wrapper";

type InputName = {
  name: "email";
};

type FormResetPasswordInput = FormAuthInput & InputName;

const formResetPasswordInputs: FormResetPasswordInput[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "e-commerce-dbe@email.com",
    autoComplete: "email",
  },
];

export default function FormResetPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const form = useForm<z.infer<typeof SchemaResetPassword>>({
    resolver: zodResolver(SchemaResetPassword),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status } = useAction(resetPassword, {
    onSuccess(data) {
      setShowNotification(true);

      if (data.data?.status === "success") {
        setSuccess(data.data.message);
      }

      if (data.data?.status === "error") {
        setError(data.data.message);
      }
    },
  });

  function onSubmit(values: z.infer<typeof SchemaResetPassword>) {
    execute(values);
  }

  return (
    <FormWrapper
      cardTitle="Reset Password"
      buttonBackHref="/auth/sign-in"
      buttonBackLabel="Back To Sign in"
      showSocials={false}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {formResetPasswordInputs.map((input) => (
            <FormField
              key={input.name}
              control={form.control}
              name={input.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{input?.label}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={input.type}
                      placeholder={input?.placeholder}
                      autoComplete={input?.autoComplete}
                      disabled={status === "executing"}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {showNotification && (
            <>
              <NotificationSuccess message={success} />
              <NotificationError message={error} />
            </>
          )}

          <div className="flex flex-row-reverse justify-between mt-2 mb-6">
            <Button
              onClick={() => setShowNotification(false)}
              disabled={status === "executing"}
              type="submit"
              className={cn(
                "px-8",
                status === "executing" ? "animate-pulse" : null
              )}
            >
              <p>{"Submit Request For New Password"}</p>{" "}
              <IoIosSend className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
}
