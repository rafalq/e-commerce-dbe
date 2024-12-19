"use client";

import CustomButtonLink from "@/components/ui/custom-button-link";
import CustomCardWrapper from "@/components/ui/custom-card-wrapper";
import { verifyEmail } from "@/server/actions/tokens";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function FormEmailVerification() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = useSearchParams().get("token");

  const router = useRouter();
  const pathname = usePathname();

  const handleVerification = useCallback(() => {
    if (success || error) {
      toast.dismiss();
      return;
    }

    if (pathname !== "/auth/sing-in") {
      if (!token) {
        toast.dismiss();
        setError("No token found");
        toast.error("No token found");
        return;
      }

      verifyEmail(token).then((data) => {
        toast.loading("Verification in progress...");
        if (data.status.includes("success")) {
          toast.dismiss();
          setSuccess(data.message as string);
          toast.success(data.message || "Email verified successfully!");
          router.push("/auth/sign-in");
        } else if (data.status.includes("error")) {
          setError(data.message as string);
          toast.dismiss();
          setError("Something went wrong");
          toast.error(data.message || "Something went wrong");
        }
      });
    }
  }, [error, router, success, token, pathname]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <CustomCardWrapper title="Email Verification">
      <div className="text-center">
        <CustomButtonLink label="Back To Sign In?" href="/auth/sign-in" />
      </div>
    </CustomCardWrapper>
  );
}
