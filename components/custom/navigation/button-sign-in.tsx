'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PiSignIn } from 'react-icons/pi';
export default function ButtonSignIn() {
  const currentPath = usePathname();
  return currentPath !== '/auth/sign-in' ? (
    <Button>
      <Link aria-label='sign-in' href={'/auth/sign-in'}>
        <div className='flex gap-2'>
          <span>Sign In</span>
          <PiSignIn className='w-5 h-5' />
        </div>
      </Link>
    </Button>
  ) : null;
}
