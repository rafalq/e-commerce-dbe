'use client';

import { signIn } from 'next-auth/react';
import { ButtonCustom } from '../ui/button-custom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function Socials() {
  return (
    <div className='flex flex-col items-center w-full gap-4'>
      <ButtonCustom
        onClick={() => signIn('google', { redirect: false, callbackUrl: '/' })}
        variant='titled'
        title='Sign in with Google'
        icon={<FcGoogle className='w-5 h-5' />}
      />
      <ButtonCustom
        onClick={() => signIn('github', { redirect: false, callbackUrl: '/' })}
        variant='titled'
        title='Sign in with Github'
        icon={<FaGithub className='w-5 h-5' />}
      />
    </div>
  );
}
