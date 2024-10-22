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
import { SchemaSignUp } from "@/types/schema-sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
import { z } from "zod";

import { signUpEmail } from "@/server/actions/sign-up-email";
import type { FormAuthInput } from "@/types/form-auth";
import {
  CustomNotificationSuccess,
  CustomNotificationError,
} from "@/components/ui/custom-notifications";
import FormWrapper from "@/app/auth/_components/form-wrapper";

type InputName = {
  name: "name" | "email" | "password" | "passwordConfirmation";
};

type FormSignUpProps = FormAuthInput & InputName;

const formSignUpInputs: FormSignUpProps[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Bobby",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "e-commerce-dbe@email.com",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "**********",
    autoComplete: "current-password",
  },
  {
    name: "passwordConfirmation",
    label: "Password Confirmation",
    type: "password",
    placeholder: "**********",
    autoComplete: "current-password",
  },
];

export default function FormSignUp() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotification, setShowNotification] = useState(false);

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
    onSuccess(data) {
      setShowNotification(true);
      if (data.data?.status === "error") {
        setError(data.data.message || "");
      } else if (data.data?.status === "success") {
        setSuccess(data.data.message || "");
      }
    },
  });

  function onSubmit(values: z.infer<typeof SchemaSignUp>) {
    execute(values);
  }

  return (
    <FormWrapper
      cardTitle="Create an account"
      buttonBackHref="/auth/sign-in"
      buttonBackLabel="Have an account?"
      showSocials
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {formSignUpInputs.map((input) => (
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
              className={cn(
                "px-8",
                status === "executing" ? "animate-pulse" : null
              )}
            >
              <p>{"Sign Up"}</p> <IoIosSend className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
}
