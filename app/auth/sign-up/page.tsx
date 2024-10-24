import FormSignUp from "@/app/auth/_components/form-sign-up";
import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import Link from "next/link";

export default async function SignUpPage() {
  const session = await auth();

  if (!session) {
    return <FormSignUp />;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-6 mt-16">
      <h1 className="font-semibold text-3xl">You are already logged in.</h1>
      <h4 className="font-medium text-lg">
        First you need to sign out to sign up or
      </h4>
      <Button variant="link" className="font-semibold underline" asChild>
        <Link aria-label="Go To Home" href="/">
          Go To Home
        </Link>
      </Button>
    </div>
  );
}
