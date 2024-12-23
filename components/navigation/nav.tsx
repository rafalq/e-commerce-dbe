import CartDrawer from "@/components/cart/cart-drawer";
import ButtonSign from "@/components/navigation/button-sign";
import ButtonUser from "@/components/navigation/button-user";
import Logo from "@/components/navigation/logo";
import { auth } from "@/server/auth";
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
    <nav className="bg-primary/10 w-full text-center">
      <div className="flex justify-around items-center mx-auto px-4 py-4 max-w-8xl">
        <Link href="/" aria-label="logo image">
          <Logo />
        </Link>

        <ul className="flex items-center gap-4">
          <li className="hover:shadow-md active:shadow transition-all hover:-translate-y-1 active:-translate-y-[1px] duration-200 active:scale-105 ease-in-out hover:scale-110 scale-100">
            <CartDrawer />
          </li>
          <li className="flex items-center">{userAuth}</li>
        </ul>
      </div>
    </nav>
  );
}
