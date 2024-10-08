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
import { signInEmail } from "@/server/actions/sign-in-email";
import { SchemaSignIn } from "@/types/schema-sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { FormAuthInput } from "@/types/form-auth";
import { IoIosSend } from "react-icons/io";
import FormWrapper from "../ui/custom/form-wrapper";
import {
  NotificationError,
  NotificationSuccess,
} from "../ui/custom/notifications";

type InputName = {
  name: "email" | "password";
};

type FormSignInInput = FormAuthInput & InputName;

const formSignInInputs: FormSignInInput[] = [
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
];

export default function FormSignIn() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const form = useForm({
    resolver: zodResolver(SchemaSignIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, status } = useAction(signInEmail, {
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

  function onSubmit(values: z.infer<typeof SchemaSignIn>) {
    execute(values);
  }

  return (
    <FormWrapper
      cardTitle="Welcome back!"
      buttonBackHref="/auth/sign-up"
      buttonBackLabel="No account?"
      showSocials
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {formSignInInputs.map((input) => (
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
              <NotificationSuccess message={success} />
              <NotificationError message={error} />
            </>
          )}

          <div className="flex justify-between mt-2 mb-6">
            <Button size={"sm"} variant={"link"} asChild>
              <Link href="/auth/reset-password" className="underline">
                Forgot your password?
              </Link>
            </Button>
            <Button
              onClick={() => setShowNotification(false)}
              type="submit"
              className={cn(
                "px-8",
                status === "executing" ? "animate-pulse" : null
              )}
            >
              <p>{"Sign In"}</p> <IoIosSend className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
}
