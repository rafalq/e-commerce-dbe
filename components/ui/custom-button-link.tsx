import Link from "next/link";
import { Button } from "@/components/ui/button";

type CustomButtonLinkProps = {
  label: string;
  href: string;
};

export default function CustomButtonLink({
  label,
  href,
}: CustomButtonLinkProps) {
  return (
    <Button variant="link" className="underline" asChild>
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
}
