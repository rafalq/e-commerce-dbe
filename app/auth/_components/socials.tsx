"use client";

import { signIn } from "next-auth/react";
import { CustomButton } from "@/components/ui/custom-button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Socials() {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <CustomButton
        onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}
        customVariant="titled"
        title="Sign in with Google"
        icon={<FcGoogle className="w-5 h-5" />}
        className={"border border-primary"}
      />
      <CustomButton
        onClick={() => signIn("github", { redirect: false, callbackUrl: "/" })}
        customVariant="titled"
        title="Sign in with Github"
        icon={<FaGithub className="w-5 h-5" />}
        className={"border border-primary text-primary"}
      />
    </div>
  );
}
