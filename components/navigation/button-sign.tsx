"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";
import { PiSignIn } from "react-icons/pi";
export default function ButtonSign() {
  const currentPath = usePathname();

  if (
    currentPath !== "/auth/sign-in" ||
    currentPath === ("/auth/sign-up" as string)
  ) {
    return (
      <ButtonAuthNav
        linkHref={"/auth/sign-in"}
        buttonTitle={"Sign In"}
        icon={<PiSignIn className="w-5 h-5" />}
      />
    );
  } else {
    return (
      <ButtonAuthNav
        linkHref={"/auth/sign-up"}
        buttonTitle={"Sign Up"}
        icon={<FaUserPlus className="w-5 h-5" />}
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
    <Button>
      <Link aria-label="sign-in" href={linkHref}>
        <div className="flex gap-2">
          <span>{buttonTitle}</span>
          {icon && icon}
        </div>
      </Link>
    </Button>
  );
}
