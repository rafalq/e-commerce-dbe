import { auth } from '@/server/auth';
import ButtonSignIn from './button-sign-in';
import ButtonUser from './button-user';

export default async function Nav() {
  const session = await auth();

  let userAuth: JSX.Element | null = null;
  if (session) {
    userAuth = (
      <ButtonUser expires={session?.expires as string} user={session?.user} />
    );
  } else {
    userAuth = <ButtonSignIn />;
  }

  return (
    <nav>
      <ul className='flex justify-between py-2 px-4'>
        <li>LOGO</li>
        <li>{userAuth}</li>
      </ul>
    </nav>
  );
}
