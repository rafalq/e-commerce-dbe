"use client";

import CustomLink from "@/components/ui/custom/custom-link";
import { verifyEmail } from "@/server/actions/tokens";
import { CircleAlert, CircleCheckBig, LoaderCircle } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CardAuth } from "./card-auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VERIFICATION_STATUS = {
  PENDING: "pending",
  ERROR: "error",
  SUCCESS: "success",
} as const;

type ObjectValues<T> = T[keyof T];

type VerificationStatusType = ObjectValues<typeof VERIFICATION_STATUS>;

export default function EmailVerification() {
  const [vStatus, setVStatus] = useState<VerificationStatusType>("pending");
  const [vStatusMessage, setVStatusMessage] = useState<string>(
    "Verification in progress..."
  );

  const token = useSearchParams().get("token");

  const pathname = usePathname();

  const handleVerification = useCallback(() => {
    if (pathname !== "/sing-in") {
      if (!token) {
        setVStatusMessage("No token found");
        setVStatus("error");
        return;
      }

      verifyEmail(token).then((data) => {
        if (data.status === "error") {
          setVStatus("error");
          setVStatusMessage(data.message || "Something went wrong");
        } else if (data.status === "success") {
          setVStatus("success");
          setVStatusMessage(data.message || "Operation succeeded!");
        }
      });
    }
  }, [token, pathname]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <CardAuth cardTitle="Email Verification">
      <div className="text-center">
        {vStatus === "success" && (
          <SuccessNotification message={vStatusMessage} />
        )}
        {vStatus === "error" && <ErrorNotification message={vStatusMessage} />}
        {vStatus === "pending" && (
          <PendingNotification message={vStatusMessage} />
        )}
        <div className="mt-6">
          <CustomLink title="Back To Sign In" href="/sign-in" />
        </div>
      </div>
    </CardAuth>
  );
}

function PendingNotification({ message }: { message: string }) {
  return (
    <div className="px-4 py-3 text-primary/80">
      <div className="flex justify-center items-center gap-4">
        <LoaderCircle className="w-6 h-6 animate-spin" />

        <div>
          <p className="font-bold text-xl">{message}</p>
        </div>
      </div>
    </div>
  );
}

function SuccessNotification({ message }: { message: string }) {
  return (
    <div className="px-4 py-3 text-primary/80">
      <div className="flex justify-center items-center gap-4">
        <div className="py-1">
          <CircleCheckBig className="w-6 h-6 text-green-700 dark:text-green-400" />
        </div>
        <div>
          <p className="font-bold text-green-700 text-xl dark:text-green-400">
            Email verification succeeded!
          </p>
          <p className="mt-2 text-green-600 dark:text-green-300">{message}</p>
        </div>
      </div>
    </div>
  );
}

function ErrorNotification({ message }: { message: string }) {
  return (
    <div className="px-4 py-3 text-primary/80">
      <div className="flex justify-center items-center gap-4">
        <div className="py-1">
          <CircleAlert className="w-6 h-6 text-red-700 dark:text-red-400" />
        </div>
        <div>
          <p className="font-bold text-red-700 text-xl dark:text-red-400">
            Email verification failed!
          </p>
          <p className="mt-2 text-red-600 dark:text-red-300">{message}</p>
        </div>
      </div>
    </div>
  );
}
