'use client';

import CardAuth from './card-auth';
import FormCredentials from './form-credentials';

export default function FormSignIn() {
  return (
    <CardAuth
      cardTitle='Welcome!'
      buttonBackHref='/auth/sign-up'
      buttonBackLabel='Create a new account'
      showSocials
    >
      <div className='w-full md:max-w-lg mx-auto'>
        <FormCredentials />
      </div>
    </CardAuth>
  );
}
