"use client";

import { verifyEmail } from "@/server/actions/tokens";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CardAuth from "./card-auth";
import {
  NotificationSuccess,
  NotificationError,
} from "../ui/custom/notifications";
export default function FormEmailVerification() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = useSearchParams().get("token");

  const router = useRouter();

  const handleVerification = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("No token found.");
      return;
    }

    verifyEmail(token).then((data) => {
      if (data.status === "success") {
        setSuccess(data.message || "Email verified successfully!");
        router.push("/auth/sign-in");
      } else if (data.status === "error") {
        setError(data.message || "Something went wrong.");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <CardAuth
      buttonBackLabel="Back To Login"
      buttonBackHref="/auth/login"
      cardTitle="Email Verification"
    >
      <div className="flex flex-col justify-center items-center p-6 w-full">
        <p>{!success && !error && "Verification in progress..."}</p>
        <NotificationSuccess message={success} />
        <NotificationError message={error} />
      </div>
    </CardAuth>
  );
}
