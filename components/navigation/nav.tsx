import { auth } from "@/server/auth";
import ButtonSign from "./button-sign";
import ButtonUser from "./button-user";
import Logo from "./logo";

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
    <nav>
      <ul className="flex justify-between px-4 py-2">
        <li>
          <Logo />
        </li>
        <li>{userAuth}</li>
      </ul>
    </nav>
  );
}
