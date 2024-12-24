"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";
import { PiSignIn } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { AUTH_PATHS } from "@/app/(auth)/_const/auth-paths";

export default function ButtonSign() {
  const currentPath = usePathname();

  if (
    currentPath !== AUTH_PATHS.signIn ||
    currentPath === (AUTH_PATHS.signUp as string)
  ) {
    return (
      <ButtonAuthNav
        linkHref={AUTH_PATHS.signIn}
        buttonTitle="SIGN IN"
        icon={<PiSignIn className="w-4 h-4" />}
      />
    );
  } else {
    return (
      <ButtonAuthNav
        linkHref={AUTH_PATHS.signUp}
        buttonTitle="SIGN UP"
        icon={<FaUserPlus className="w-4 h-4" />}
      />
    );
  }
}

type ButtonAuthNavProps = {
  linkHref: string;
  buttonTitle: string;
  icon?: React.ReactNode;
};

function ButtonAuthNav({ linkHref, buttonTitle, icon }: ButtonAuthNavProps) {
  return (
    <Button className="px-6">
      <Link aria-label="sign-in" href={linkHref}>
        <div className="flex justify-center items-center gap-2">
          <span>{buttonTitle}</span>
          {icon && <span>{icon}</span>}
        </div>
      </Link>
    </Button>
  );
}
