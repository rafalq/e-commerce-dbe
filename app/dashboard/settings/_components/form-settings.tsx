"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import CustomInputPassword from "@/components/ui/custom-input-password";
import {
  CustomNotificationError,
  CustomNotificationSuccess,
} from "@/components/ui/custom-notifications";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { settingsUpdate } from "@/server/actions/settings-update";
import { SchemaSettings } from "@/types/schema-settings";

import { CircleAlert, LoaderCircle, Pen } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";

import type { Session } from "next-auth";
import { UploadButton } from "@/app/api/uploadthing/_components";

type FormSettings = {
  session: Session;
};

export function FormSettings({ session }: FormSettings) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [isSubmitButtonBlocked, setIsSubmitButtonBlocked] = useState(true);

  const form = useForm({
    resolver: zodResolver(SchemaSettings),
    defaultValues: {
      name: session?.user?.name || undefined,
      image: session.user.image || undefined,
      email: session?.user?.email || undefined,
      currentPassword: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: session?.user?.isTwoFactorEnabled || undefined,
    },
  });

  const { execute, status } = useAction(settingsUpdate, {
    onSuccess(data) {
      setShowNotification(true);
      if (data.data?.status === "error") {
        setError(data.data.message || "Something went wrong.");
      } else if (data.data?.status === "success") {
        setSuccess(data.data.message || "Settings updated successfully!");
      }
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

  function clearNotifications() {
    setShowNotification(false);
    setError("");
    setSuccess("");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex justify-between">
          {/* --- avatar input --- */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Avatar</FormLabel>
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
                <FormControl>
                  <Input
                    {...field}
                    placeholder="User Image"
                    type="hidden"
                    disabled={status === "executing"}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* --- name input --- */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Bobby"
                    disabled={status === "executing"}
                    className="min-w-60"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <>
          {/* --- email input --- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-2 font-semibold">
                  Email{" "}
                  <span>
                    <CircleAlert className="w-3 h-3 text-red-700" />
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="bobby@email.com"
                    disabled={
                      status === "executing" || !!session.user.isOAuth === true
                    }
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* --- current password input --- */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-2 font-semibold">
                  Current Password
                  <span>
                    <CircleAlert className="w-3 h-3 text-red-700" />
                  </span>
                </FormLabel>
                <FormControl>
                  <CustomInputPassword
                    {...field}
                    placeholder="&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;"
                    disabled={
                      status === "executing" || !!session.user.isOAuth === true
                    }
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* --- new password input --- */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-2 font-semibold">
                  New Password
                  <span>
                    <CircleAlert className="w-3 h-3 text-red-700" />
                  </span>
                </FormLabel>
                <FormControl>
                  <CustomInputPassword
                    {...field}
                    placeholder="&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;"
                    disabled={
                      status === "executing" || !!session.user.isOAuth === true
                    }
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* --- enable two factor auth input --- */}
          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-2 font-semibold">
                  Two Factor Authentication{" "}
                  <span>
                    <CircleAlert className="w-3 h-3 text-red-700" />
                  </span>
                </FormLabel>
                <FormDescription className="text-xs">
                  Enable Two Factor Authentication for your account that,
                  <br />
                  in addition to the password, requires a code sent to your
                  email.
                </FormDescription>
                <FormControl>
                  <span className="flex items-center">
                    <Switch
                      onCheckedChange={field.onChange}
                      checked={field.value}
                      disabled={
                        status === "executing" ||
                        !!session.user.isOAuth === true
                      }
                    />
                  </span>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
        {showNotification && (
          <>
            <CustomNotificationSuccess message={success || ""} />
            <CustomNotificationError message={error} />
          </>
        )}
        <div className="flex flex-row-reverse mt-2">
          <Button
            onClick={clearNotifications}
            type="submit"
            disabled={
              status === "executing" || avatarUploading || isSubmitButtonBlocked
            }
            className={cn(
              `px-8 bg-primary`,

              status === "executing" ? "animate-pulse" : null
            )}
          >
            <p>{"Update Settings"}</p> <IoIosSend className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
