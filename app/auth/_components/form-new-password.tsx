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

import { newPassword } from "@/server/actions/new-password";
import type { FormAuthInput } from "@/types/form-auth";
import { SchemaNewPassword } from "@/types/schema-new-password";
import { IoIosSend } from "react-icons/io";
import {
  CustomNotificationError,
  CustomNotificationSuccess,
} from "@/components/ui/custom-notifications";
import FormWrapper from "@/app/auth/_components/form-wrapper";
import { useSearchParams } from "next/navigation";

type InputName = {
  name: "password" | "passwordConfirmation";
};

type FormResetPasswordInput = FormAuthInput & InputName;

const formResetPasswordInputs: FormResetPasswordInput[] = [
  {
    name: "password",
    label: "New Password",
    type: "password",
    placeholder: "**********",
    autoComplete: "current-password",
  },
  {
    name: "passwordConfirmation",
    label: "New Password Confirmation",
    type: "password",
    placeholder: "**********",
    autoComplete: "current-password",
  },
];

export default function FormNewPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotification, setShowNotification] = useState(false);

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
    onSuccess(data) {
      setShowNotification(true);

      if (data.data?.status === "success") {
        setSuccess(data.data.message as string);
      }

      if (data.data?.status === "error") {
        setError(data.data.message as string);
      }
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
              <CustomNotificationSuccess message={success} />
              <CustomNotificationError message={error} />
            </>
          )}

          <div className="flex flex-row-reverse justify-between mt-2 mb-6">
            <Button
              onClick={() => setShowNotification(false)}
              type="submit"
              disabled={status === "executing"}
              className={cn(
                "px-8",
                status === "executing" ? "animate-pulse" : null
              )}
            >
              <p>{"Reset Password"}</p> <IoIosSend className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
}
