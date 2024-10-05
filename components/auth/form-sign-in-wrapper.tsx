"use client";

import CardAuth from "./card-auth";
import FormSignIn from "./form-sign-in";

export default function FormSignInWrapper() {
  return (
    <CardAuth
      cardTitle="Welcome!"
      buttonBackHref="/auth/sign-up"
      buttonBackLabel="Create a new account"
      showSocials
    >
      <div className="w-full md:max-w-lg mx-auto">
        <FormSignIn />
      </div>
    </CardAuth>
  );
}
