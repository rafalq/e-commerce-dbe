"use client";

import { UploadButton } from "@/app/api/uploadthing/_components";
import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import CustomFormField from "@/components/ui/custom-form-field";
import FormCard from "@/components/ui/custom-form-wrapper";
import CustomInputPassword from "@/components/ui/custom-input-password";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { updateSettings } from "@/server/actions/update-settings";
import { SchemaSettings } from "@/types/schema-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, LoaderCircle, Pen } from "lucide-react";
import type { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type FormSettings = {
  session: Session;
};

export function FormSettings({ session }: FormSettings) {
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isSubmitButtonBlocked, setIsSubmitButtonBlocked] = useState(true);

  const form = useForm({
    resolver: zodResolver(SchemaSettings),
    defaultValues: {
      name: session?.user?.name || "",
      image: session.user.image || "",
      email: session?.user?.email || "",
      currentPassword: "",
      newPassword: "",
      isTwoFactorEnabled: session?.user?.isTwoFactorEnabled || false,
    },
  });

  const { execute, status } = useAction(updateSettings, {
    onExecute() {
      toast.loading("Operation in progress...");
    },
    onSuccess(data) {
      toast.dismiss();

      if (data.data?.status === "error") {
        toast.error(data.data.message || "Something went wrong.");
      } else if (data.data?.status === "success") {
        // Show success message
        toast.success(data.data.message || "Operation done successfully!");

        form.resetField("currentPassword");
        form.resetField("newPassword");
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  // Watch for any input change and unblock the submit button
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsSubmitButtonBlocked(false);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(parsedInput: z.infer<typeof SchemaSettings>) {
    execute(parsedInput);
  }

  return (
    <FormCard
      title="Settings"
      footer={
        <p className="flex gap-2">
          <CircleAlert className="w-4 h-4 text-red-700" />
          <span className="text-sm">
            Settings disabled when using social authentication.
          </span>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between">
            {/* ---- avatar input ---- */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <CustomFormField label="Avatar">
                  <div className="flex items-center">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        className="rounded-full"
                        alt="User Image"
                      />
                    )}
                    <UploadButton
                      className="ut-button:-top-12 ut-button:absolute ut-allowed-content:hidden ut-label:hidden hover:ut-button:bg-primary/40 ut-button:bg-primary/30 ut-label:bg-red-50 ut-button:p-2 ut-button:rounded-full ut-button:ring-primary ut-button:w-auto ut-button:h-auto ut-button:font-semibold ut:button:transition-all ut-button:duration-500 scale-50"
                      endpoint="avatarUploader"
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url!);
                        setAvatarUploading(false);
                        return;
                      }}
                      content={{
                        button({ ready }) {
                          if (ready) return <Pen />;
                          return <LoaderCircle className="animate-spin" />;
                        },
                      }}
                    />
                  </div>
                </CustomFormField>
              )}
            />
            {/* ---- name input ---- */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <CustomFormField label="Name">
                  <Input
                    type="text"
                    autoComplete="email"
                    disabled={status === "executing"}
                    className="sm:min-w-72"
                    {...field}
                  />
                </CustomFormField>
              )}
            />
          </div>
          {/* ---- email input ---- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <CustomFormField label="Email" alertLabel>
                <Input
                  type="email"
                  autoComplete="email"
                  disabled={
                    status === "executing" || !!session.user.isOAuth === true
                  }
                  {...field}
                />
              </CustomFormField>
            )}
          />
          {/* ---- current password input ---- */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <CustomFormField label="Current Password" alertLabel>
                <CustomInputPassword
                  disabled={
                    status === "executing" || !!session.user.isOAuth === true
                  }
                  {...field}
                />
              </CustomFormField>
            )}
          />
          {/* ---- new password input ---- */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <CustomFormField
                label="New Password"
                alertLabel
                description="Must be different than your current password."
              >
                <CustomInputPassword
                  disabled={
                    status === "executing" || !!session.user.isOAuth === true
                  }
                  {...field}
                />
              </CustomFormField>
            )}
          />

          {/* --- enable two factor auth input --- */}
          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <CustomFormField
                label="Two Factor Authentication"
                alertLabel
                description="Enable Two Factor Authentication for your account that, \n
                  in addition to the password, requires a code sent to your
                  email."
              >
                <span className="flex items-center">
                  <Switch
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    disabled={
                      status === "executing" || !!session.user.isOAuth === true
                    }
                  />
                </span>
              </CustomFormField>
            )}
          />

          {/* ---- submit button ---- */}
          <CustomButtonSubmit
            disabled={
              status === "executing" || avatarUploading || isSubmitButtonBlocked
            }
            className={cn(status === "executing" && "animate-pulse")}
          />
        </form>
      </Form>
    </FormCard>
  );
}
