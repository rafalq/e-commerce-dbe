"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SocialsAuth() {
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <Button
          onClick={() =>
            signIn("google", { redirect: false, callbackUrl: "/" })
          }
          variant="outline"
          className={"flex gap-2 border border-primary"}
        >
          Sign in with Google <FcGoogle className="w-5 h-5" />
        </Button>
        <Button
          onClick={() =>
            signIn("github", { redirect: false, callbackUrl: "/" })
          }
          variant="outline"
          className={"flex gap-2 border border-primary"}
        >
          Sign in with Github <FaGithub className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
}
