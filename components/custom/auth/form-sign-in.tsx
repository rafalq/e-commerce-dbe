'use client';

import CardAuth from './card-auth';

export default function FormSignIn() {
  return (
    <CardAuth
      cardTitle='Welcome!'
      buttonBackHref='/auth/sign-up'
      buttonBackLabel='Create a new account'
      showSocials
    ></CardAuth>
  );
}
