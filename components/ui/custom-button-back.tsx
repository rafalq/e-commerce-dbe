"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type CustomButtonBackProps = {
  href: string;
  label: string;
};

export default function CustomButtonBack({
  href,
  label,
}: CustomButtonBackProps) {
  return (
    <Button variant={"link"} className="font-semibold underline" asChild>
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
}
