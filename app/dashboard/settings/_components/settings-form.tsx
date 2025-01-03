"use client";

import { KeyRound, LoaderCircle, Pen, UserPen } from "lucide-react";
import { useAction, type HookActionStatus } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { UploadButton } from "@/app/api/uploadthing/_components";
import CustomTooltip from "@/components/ui/custom/custom-tooltip";
import FormCard from "@/components/ui/custom/form-card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  updateAccount,
  updatePassword,
} from "@/server/actions/update-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldWrapper from "@/components/form/form-field-wrapper";
import PasswordField from "@/components/form/password-field";
import TextField from "@/components/form/text-field";
import AvatarFallback from "@/components/ui/custom/avatar-fallback";
import SubmitButton from "@/components/ui/custom/submit-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setToast } from "@/lib/set-toast";
import type { ApiResponseType } from "@/types/api-response-type";
import {
  AccountSchema,
  PasswordSchema,
  type AccountSchemaType,
  type PasswordSchemaType,
} from "@/types/schema/settings-schema";
import { isEqual } from "lodash";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";

type SettingsFormProps = {
  session: Session;
};

export default function SettingsForm({ session }: SettingsFormProps) {
  const [avatarUploading, setAvatarUploading] = useState(false);

  const router = useRouter();

  const accountForm = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      name: session?.user?.name || undefined,
      image: session.user.image || undefined,
      email: session?.user?.email || undefined,
      isTwoFactorEnabled: session?.user?.isTwoFactorEnabled || false,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const { execute: accountExecute, status: accountStatus } = useAction(
    updateAccount,
    {
      onExecute() {
        toast.loading("Operation in progress...");
      },
      onSuccess(data) {
        toast.dismiss();
        setToast(data.data as ApiResponseType);
        if (data.data?.status.includes("success")) {
          router.refresh();
        }
      },
      onError() {
        toast.dismiss();
        toast.error("Something went wrong.");
      },
    }
  );

  function onAccountSubmit(parsedInput: AccountSchemaType) {
    if (isEqual(accountForm.formState.defaultValues, parsedInput)) {
      return toast.warning("No changes detected");
    }
    accountExecute(parsedInput);
  }

  const { execute: passwordExecute, status: passwordStatus } = useAction(
    updatePassword,
    {
      onExecute() {
        toast.loading("Operation in progress...");
      },
      onSuccess(data) {
        toast.dismiss();
        setToast(data.data as ApiResponseType);
        if (data.data?.status.includes("success")) {
          passwordForm.reset();
        }
      },
      onError() {
        toast.dismiss();
        toast.error("Something went wrong.");
      },
    }
  );

  function onPasswordSubmit(parsedInput: PasswordSchemaType) {
    // if (parsedInput.newPassword.trim().length <= 0) {
    //   return toast.warning("You need to provide a new password");
    // }

    passwordExecute(parsedInput);
  }

  if (session.user.isOAuth) {
    return (
      <FormCard
        cardTitle="Account"
        cardDescription=" Make changes to your account here. Click save when you are done."
      >
        <Form {...accountForm}>
          <form
            onSubmit={accountForm.handleSubmit(onAccountSubmit)}
            className="space-y-6"
          >
            <div className="flex md:flex-row flex-col md:justify-between">
              <AvatarField
                session={session}
                onAvatarUpload={setAvatarUploading}
              />
              <TextField<AccountSchemaType>
                name="name"
                label="Name"
                status={accountStatus}
              />
            </div>

            <SubmitButton
              isLoading={accountStatus === "executing" || avatarUploading}
              title="update account"
            >
              <UserPen className="w-4 h-4" />
            </SubmitButton>
          </form>
        </Form>
      </FormCard>
    );
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="account">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <FormCard
            cardTitle="Account"
            cardDescription=" Make changes to your account here. Click save when you are done."
          >
            <Form {...accountForm}>
              <form
                onSubmit={accountForm.handleSubmit(onAccountSubmit)}
                className="space-y-6"
              >
                <div className="flex md:flex-row flex-col md:justify-between">
                  <AvatarField
                    session={session}
                    onAvatarUpload={setAvatarUploading}
                  />
                  <TextField<AccountSchemaType>
                    name="name"
                    label="Name"
                    status={accountStatus}
                  />
                </div>

                <TextField<AccountSchemaType>
                  name="email"
                  label="Email"
                  status={accountStatus}
                />

                <TwoFactorSwitch session={session} status={accountStatus} />

                <SubmitButton
                  isLoading={accountStatus === "executing" || avatarUploading}
                  title="update account"
                >
                  <UserPen className="w-4 h-4" />
                </SubmitButton>
              </form>
            </Form>
          </FormCard>
        </TabsContent>
        <TabsContent value="password">
          <FormCard
            cardTitle="Password"
            cardDescription="Change your password here."
          >
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <PasswordField<PasswordSchemaType>
                  name="newPassword"
                  label="New Password"
                  description="Must be different than your current password"
                  status={passwordStatus}
                />

                <PasswordField<PasswordSchemaType>
                  name="currentPassword"
                  label="Current Password"
                  status={passwordStatus}
                />
                <SubmitButton
                  isLoading={passwordStatus === "executing"}
                  title="update password"
                >
                  <KeyRound className="w-4 h-4" />
                </SubmitButton>
              </form>
            </Form>
          </FormCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type AvatarFieldProps = {
  session: Session;
  onAvatarUpload: (isUploading: boolean) => void;
};

function AvatarField({ session, onAvatarUpload }: AvatarFieldProps) {
  const form = useFormContext();
  return (
    <FormFieldWrapper<AccountSchemaType> name="image" label="Avatar">
      {() => (
        <div className="flex items-center">
          {!form.getValues("image") && (
            <AvatarFallback name={session.user?.name || ""} />
          )}
          {form.getValues("image") && (
            <Image
              src={form.getValues("image")!}
              width={42}
              height={42}
              style={{ height: "auto", width: "auto" }}
              className="rounded-full"
              alt="User Image"
            />
          )}
          <CustomTooltip text="Change Avatar">
            <UploadButton
              className="ut-button:-top-12 ut-button:absolute ut-allowed-content:hidden ut-label:hidden hover:ut-button:bg-primary/40 ut-button:bg-primary/30 ut-label:bg-red-50 ut-button:p-2 ut-button:rounded-full ut-button:ring-primary ut-button:w-auto ut-button:h-auto ut-button:font-semibold ut:button:transition-all ut-button:duration-500 group scale-50"
              endpoint="avatarUploader"
              onUploadBegin={() => {
                onAvatarUpload(true);
              }}
              onUploadError={(error) => {
                form.setError("image", {
                  type: "validate",
                  message: error.message,
                });

                onAvatarUpload(false);
                return;
              }}
              onClientUploadComplete={(res) => {
                form.setValue("image", res[0].url!);
                form.trigger("image");
                onAvatarUpload(false);

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
      )}
    </FormFieldWrapper>
  );
}

type TwoFactorSwitchProps = {
  session: Session;
  status: HookActionStatus;
};

function TwoFactorSwitch({ session, status }: TwoFactorSwitchProps) {
  return (
    <FormFieldWrapper<AccountSchemaType>
      name="isTwoFactorEnabled"
      label="Enable Two Factor Authentication"
      description="Enable Two Factor Authentication for your account that, 
      in addition to the password, requires a code sent to your
      email."
    >
      {(field) => (
        <span className="flex items-center">
          <Switch
            onCheckedChange={field.onChange}
            checked={!!field.value}
            disabled={status === "executing" || !!session.user.isOAuth === true}
            className="mt-4"
          />
        </span>
      )}
    </FormFieldWrapper>
  );
}
