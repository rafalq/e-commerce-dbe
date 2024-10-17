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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { signInEmail } from "@/server/actions/sign-in-email";
import { SchemaSignIn } from "@/types/schema-sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FormWrapper from "@/app/auth/_components/form-wrapper";
import InputPassword from "@/components/ui/custom/input-password";
import {
  NotificationError,
  NotificationSuccess,
} from "@/components/ui/custom/notifications";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { IoIosSend } from "react-icons/io";

export default function FormSignIn() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotification, setShowNotification] = useState(false);
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
    onSuccess(data) {
      setShowNotification(true);

      if (data.data?.status === "success") {
        setSuccess(data.data.message as string);
      }

      if (data.data?.status === "error") {
        setError(data.data.message as string);
      }

      if (data.data?.status === "two-factor") {
        setSuccess(data.data.message as string);
        setShowTwoFactor(true);
      }
    },
  });

  function onSubmit(values: z.infer<typeof SchemaSignIn>) {
    execute(values);
  }

  function clearNotifications() {
    setSuccess("");
    setError("");
    setShowNotification(false);
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
          className="flex flex-col gap-4 my-2"
        >
          {/* --- email input --- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="email@email.com"
                    autoComplete="email"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* --- password input --- */}
          {!showTwoFactor && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      placeholder="&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;"
                      autoComplete="current-password"
                      disabled={status === "executing"}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* --- two factor token input --- */}
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 font-semibold">
                    Two Factor Code
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Type the{" "}
                    <span className="font-semibold">confirmation code</span> we
                    have sent to your email.
                  </FormDescription>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      {...field}
                      disabled={status === "executing"}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }, (_, index) => (
                          <InputOTPSlot
                            index={index}
                            key={index}
                          ></InputOTPSlot>
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {showNotification && (
            <>
              <NotificationSuccess message={success} />
              <NotificationError message={error} />
            </>
          )}

          {!showTwoFactor && (
            <div className="flex justify-between mt-4 mb-6">
              <Button size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset-password" className="underline">
                  Forgot your password?
                </Link>
              </Button>
              <Button
                onClick={clearNotifications}
                type="submit"
                className={cn(
                  "px-8",
                  status === "executing" ? "animate-pulse" : null
                )}
              >
                <p>{"Sign In"}</p> <IoIosSend className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

          {showTwoFactor && (
            <div className="flex flex-row-reverse mt-4 mb-6">
              <Button
                onClick={clearNotifications}
                type="submit"
                className={cn(
                  "px-8 w-full md:w-auto",
                  status === "executing" ? "animate-pulse" : null
                )}
              >
                <p>{"Verify Code"}</p> <IoIosSend className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </form>
      </Form>
    </FormWrapper>
  );
}
