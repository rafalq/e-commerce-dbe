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
import { SignUpSchema } from "@/types/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
import { z } from "zod";

import type { FormAuthInput } from "@/types/form-auth";

type InputName = {
  name: "name" | "email" | "password";
};

type FormSignUpProps = FormAuthInput & InputName;

const formSignUpInputs: FormSignUpProps[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Bob",
    autoComplete: "email",
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
];

export default function FormSignUp() {
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
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

  function onSubmit(values: z.infer<typeof SignUpSchema>) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        <div className="flex flex-row-reverse justify-between mt-2 mb-6">
          <Button
            type="submit"
            className={cn(
              "px-8",
              status === "executing" ? "animate-pulse" : null
            )}
          >
            <p>{"Sign Up"}</p> <IoIosSend className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
