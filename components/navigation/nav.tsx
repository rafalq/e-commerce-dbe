import { auth } from "@/server/auth";

import ButtonSign from "./button-sign";
import ButtonUser from "./button-user";
import Logo from "./logo";
import Link from "next/link";

export default async function Nav() {
  const session = await auth();

  let userAuth: JSX.Element | null = null;

  if (session) {
    userAuth = (
      <ButtonUser expires={session?.expires as string} user={session?.user} />
    );
  } else {
    userAuth = <ButtonSign />;
  }

  return (
    <nav className="bg-primary/10">
      <ul className="flex justify-around items-center px-4 py-4">
        <li>
          <Link href="/" aria-label="e-commerce dbe logo">
            <Logo text="E-commerce dbe" />
          </Link>
        </li>
        <li className="flex items-center">{userAuth}</li>
      </ul>
    </nav>
  );
}
