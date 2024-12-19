import { auth } from "@/server/auth";

import ButtonSign from "./button-sign";
import ButtonUser from "./button-user";
import Logo from "./logo";
import Link from "next/link";
import CartDrawer from "@/components/cart/cart-drawer";

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
    <nav className="bg-primary/10 w-full text-center">
      <ul className="flex justify-around items-center mx-auto px-4 py-4 max-w-8xl">
        <li>
          <Link href="/" aria-label="e-commerce dbe logo">
            <Logo text="E-commerce dbe" />
          </Link>
        </li>
        <div className="flex items-center gap-4">
          <li className="hover:shadow-md active:shadow transition-all hover:-translate-y-1 active:-translate-y-[1px] duration-200 active:scale-105 ease-in-out hover:scale-110 scale-100">
            <CartDrawer />
          </li>
          <li className="flex items-center">{userAuth}</li>
        </div>
      </ul>
    </nav>
  );
}
