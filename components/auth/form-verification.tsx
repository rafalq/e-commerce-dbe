"use client";

import { verifyEmail } from "@/server/actions/verification-tokens";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CardAuth from "./card-auth";
import FormSuccess from "./form-success";
import FormError from "./form-error";

export default function FormVerification() {
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
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardAuth>
  );
}
