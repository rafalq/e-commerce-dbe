'use client';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

export default function ButtonUser({ user }: Session) {
  return (
    <div>
      <h1>{user?.email}</h1>
      <button
        onClick={() => signOut()}
        className='border border-slate-500 px-1'
      >
        Sign Out
      </button>
    </div>
  );
}
