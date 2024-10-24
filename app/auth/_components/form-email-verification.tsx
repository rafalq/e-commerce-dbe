"use client";

import CustomButtonLink from "@/components/ui/custom-button-link";
import CustomFormWrapper from "@/components/ui/custom-form-wrapper";
import { verifyEmail } from "@/server/actions/tokens";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function FormEmailVerification() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = useSearchParams().get("token");

  const router = useRouter();

  const handleVerification = useCallback(() => {
    if (success || error) return;

    if (!token) {
      toast.error("No token found.");
      return;
    }

    verifyEmail(token).then((data) => {
      toast.loading("Verification in progress...");
      if (data.status === "success") {
        setSuccess(data.message);
        toast.dismiss();
        toast.success(data.message || "Email verified successfully!");
        router.push("/auth/sign-in");
      } else if (data.status === "error") {
        setError(data.message);
        toast.dismiss();
        toast.error(data.message || "Something went wrong.");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <CustomFormWrapper title="Email Verification">
      <div className="text-center">
        <CustomButtonLink label="Back To Sign In?" href="/auth/sign-in" />
      </div>
    </CustomFormWrapper>
  );
}
