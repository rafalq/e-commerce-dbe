import FormSignIn from "@/app/auth/_components/form-sign-in";
import ButtonBack from "@/components/ui/custom/button-back";
import { auth } from "@/server/auth";

export default async function SignInPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="mx-auto p-4 w-full md:max-w-3xl">
        <FormSignIn />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-6 mt-12">
      <h1 className="font-semibold text-3xl">You are already logged in.</h1>
      <h4 className="font-medium text-lg">
        First you need to sign out to sign in or
      </h4>
      <ButtonBack href="/" label="Go to Home page" />
    </div>
  );
}
