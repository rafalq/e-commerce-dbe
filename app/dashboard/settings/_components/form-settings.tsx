"use client";

import { CircleAlert, LoaderCircle, Pen } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { UploadButton } from "@/app/api/uploadthing/_components";
import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import FormCard from "@/components/ui/custom-card-wrapper";
import CustomFormField from "@/components/ui/custom-form-field";
import CustomInputPassword from "@/components/ui/custom-input-password";
import CustomTooltip from "@/components/ui/custom-tooltip";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { updateSettings } from "@/server/actions/update-settings";
import { SchemaSettings } from "@/types/schema-settings";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Session } from "next-auth";

type FormSettings = {
  session: Session;
};

type FormFields = {
  name?: string | undefined;
  image?: string | undefined;
  email?: string | undefined;
  currentPassword?: undefined;
  newPassword?: undefined;
  isTwoFactorEnabled?: boolean | undefined;
};

export function FormSettings({ session }: FormSettings) {
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const [isButtonBlocked, setIsButtonBlocked] = useState(true);
  const [isCurrentPasswordRequired, setIsCurrentPasswordRequired] =
    useState(false);

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(SchemaSettings),
    defaultValues: {
      name: session?.user?.name || undefined,
      image: session.user.image || undefined,
      email: session?.user?.email || undefined,
      currentPassword: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: session?.user?.isTwoFactorEnabled || false,
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsButtonBlocked(false);
    });
    return () => subscription.unsubscribe();
  }, [form]);

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

        form.resetField("newPassword");
        form.resetField("currentPassword");

        if (currentPasswordRef.current) currentPasswordRef.current.value = "";
        if (newPasswordRef.current) newPasswordRef.current.value = "";

        setIsCurrentPasswordRequired(false);
        setIsButtonBlocked(true);
        setIsAvatarChanged(false);
      }
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong.");
    },
  });

  function onSubmit(parsedInput: z.infer<typeof SchemaSettings>) {
    execute(parsedInput);
  }

  function handleNewPasswordChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps
  ) {
    const inputValue = e.target.value;
    field.onChange(inputValue);

    if (inputValue.trim().length > 0) {
      setIsCurrentPasswordRequired(true);
    } else {
      form.resetField("newPassword");
      form.resetField("currentPassword");
      setIsCurrentPasswordRequired(false);
    }
  }

  return (
    <FormCard
      title="Settings"
      description="You can change your account settings here."
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
                    <CustomTooltip text="Change Avatar">
                      <UploadButton
                        className="ut-button:-top-12 ut-button:absolute ut-allowed-content:hidden ut-label:hidden hover:ut-button:bg-primary/40 ut-button:bg-primary/30 ut-label:bg-red-50 ut-button:p-2 ut-button:rounded-full ut-button:ring-primary ut-button:w-auto ut-button:h-auto ut-button:font-semibold ut:button:transition-all ut-button:duration-500 group scale-50"
                        endpoint="avatarUploader"
                        onUploadBegin={() => {
                          setAvatarUploading(true);
                        }}
                        onUploadError={(error) => {
                          form.setError("image", {
                            type: "validate",
                            message: error.message,
                          });
                          setIsAvatarChanged(true);
                          setAvatarUploading(false);
                          return;
                        }}
                        onClientUploadComplete={(res) => {
                          form.setValue("image", res[0].url!);
                          setAvatarUploading(false);
                          setIsButtonBlocked(false);
                          return;
                        }}
                        content={{
                          button({ ready }) {
                            if (ready) return <Pen />;
                            return <LoaderCircle className="animate-spin" />;
                          },
                        }}
                      />
                    </CustomTooltip>
                    <Input name="image" type="hidden" />
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
                    {...field}
                    type="text"
                    autoComplete="email"
                    disabled={status === "executing"}
                    className="sm:min-w-72"
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
                  {...field}
                  type="email"
                  autoComplete="email"
                  disabled={
                    status === "executing" || !!session.user.isOAuth === true
                  }
                />
              </CustomFormField>
            )}
          />

          <div className="flex flex-col gap-4 border-secondary p-4 border">
            {/* ---- new password input ---- */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <CustomFormField
                  label="New Password"
                  alertLabel
                  description="Must be different than your current password. Current Password required."
                >
                  <CustomInputPassword
                    {...field}
                    disabled={
                      status === "executing" || !!session.user.isOAuth === true
                    }
                    value={form.watch("newPassword") || ""}
                    onBlur={field.onBlur}
                    onChange={(e) =>
                      handleNewPasswordChange(
                        e,
                        field as ControllerRenderProps<
                          FormFields,
                          "newPassword"
                        >
                      )
                    }
                    ref={newPasswordRef}
                  />
                </CustomFormField>
              )}
            />
            {/* ---- current password input ---- */}
            {isCurrentPasswordRequired && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <CustomFormField label="Current Password" alertLabel>
                    <CustomInputPassword
                      {...field}
                      disabled={
                        status === "executing" ||
                        !!session.user.isOAuth === true
                      }
                      value={form.watch("currentPassword") || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      ref={currentPasswordRef}
                    />
                  </CustomFormField>
                )}
              />
            )}
          </div>
          {/* --- enable two factor auth input --- */}
          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <CustomFormField
                label="Two Factor Authentication"
                alertLabel
                description="Enable Two Factor Authentication for your account that, 
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
              status === "executing" ||
              avatarUploading ||
              isButtonBlocked ||
              (!form.formState.isDirty && isAvatarChanged)
            }
            className={cn(status === "executing" && "animate-pulse")}
          />
        </form>
      </Form>
    </FormCard>
  );
}
