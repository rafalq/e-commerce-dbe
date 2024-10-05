"use client";

// import { useState } from 'react';
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
import { SignInSchema } from "@/types/sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { FormAuthInput } from "@/types/form-auth";
import { IoIosSend } from "react-icons/io";

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
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const [error, setError] = useState('')

  const { execute, status } = useAction(signInEmail, {
    onSuccess(data) {
      console.log(data);
    },
  });

  function onSubmit(values: z.infer<typeof SignInSchema>) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <div className="flex justify-between mt-2 mb-6">
          <Button size={"sm"} variant={"link"} asChild>
            <Link href="/auth/reset" className="underline">
              Forgot your password?
            </Link>
          </Button>
          <Button
            type="submit"
            className={cn(
              "px-8",
              status === "executing" ? "animate-pulse" : null
            )}
          >
            <p>{"Sign In"}</p> <IoIosSend className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
