"use client";

import SocialsAuth from "@/app/auth/_components/socials-auth";
import CustomButtonLink from "@/components/ui/custom-button-link";
import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import FormCard from "@/components/ui/custom-card-wrapper";
import { Form } from "@/components/ui/form";
import { setToast } from "@/lib/set-toast";
import { cn } from "@/lib/utils";
import type { TypeApiResponse } from "@/types/type-api-response";
import type { TypeSafeActionFn } from "@/types/type-safe-action-fn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, type HookActionStatus } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type DefaultValues, type FieldValues } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import CustomSeparator from "../ui/custom-separator";

type FormWrapperProps<T extends FieldValues> = {
  schema: z.ZodType<T>;
  defaultValues: DefaultValues<T>;
  mode: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
  action: TypeSafeActionFn;
  formTitle?: string;
  hasSocialAuth?: boolean;
  children: (
    apiResponse: TypeApiResponse,
    status: HookActionStatus
  ) => React.ReactNode;
  hasSubmitButton: boolean;
  hasHaveAccountLink?: boolean;
  hasNoAccountLink?: boolean;
  onSubmit?: (values: T) => T | Promise<T>;
};

const FormWrapper = <T extends FieldValues>({
  schema,
  defaultValues,
  mode,
  action,
  formTitle,
  hasSocialAuth,
  children,
  hasSubmitButton,
  hasHaveAccountLink,
  hasNoAccountLink,
  onSubmit,
}: FormWrapperProps<T>) => {
  const [apiResponse, setApiResponse] = useState<TypeApiResponse | null>(null);

  const router = useRouter();

  if (apiResponse && apiResponse?.data?.redirect) {
    router.push(apiResponse.data.redirect);
  }

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  });

  const { execute, status } = useAction(action, {
    onExecute() {
      toast.loading("Operation in progress...");
    },
    onSuccess(data) {
      if (data) {
        toast.dismiss();
        setToast(data.data!);
        setApiResponse(data.data!);
      } else {
        toast.error("No data received");
      }
    },
  });

  async function submitForm(values: T) {
    const modifiedValues = onSubmit ? await onSubmit(values) : values;
    execute(modifiedValues);
  }

  return (
    <FormCard title={formTitle}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-8">
          {/* ---- children ---- */}
          {children((apiResponse as TypeApiResponse) || null, status)}
          {/* ---- submit button ---- */}
          {hasSubmitButton && (
            <CustomButtonSubmit
              disabled={status === "executing"}
              className={cn(
                "tracking-wider",
                status === "executing" && "animate-pulse"
              )}
            />
          )}
        </form>
      </Form>

      {hasSocialAuth && (
        <>
          <CustomSeparator text="or" />
          <div className="py-6">
            <SocialsAuth />
          </div>
        </>
      )}
      {hasHaveAccountLink && (
        <div className="text-center">
          <CustomButtonLink label="Have an account?" href="/auth/sign-in" />
        </div>
      )}
      {hasNoAccountLink && (
        <div className="text-center">
          <CustomButtonLink label="No account?" href="/auth/sign-up" />
        </div>
      )}
    </FormCard>
  );
};

FormWrapper.displayName = "FormWrapper";

export default FormWrapper;
