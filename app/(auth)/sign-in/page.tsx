import SignInForm from "@/app/(auth)/_components/sign-in-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import Link from "next/link";

export default async function SignInPage() {
  const session = await auth();

  if (!session) {
    return <SignInForm />;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-6 mt-12">
      <h1 className="font-semibold text-3xl">You are already logged in.</h1>
      <h4 className="font-medium text-lg">
        First you need to sign out to sign in or
      </h4>
      <Button variant="link" className="font-semibold underline" asChild>
        <Link aria-label="Go To Home" href="/">
          Go To Home
        </Link>
      </Button>
    </div>
  );
}
