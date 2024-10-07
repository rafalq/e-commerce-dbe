"use client";

import CardAuth from "./card-auth";
import FormSignIn from "./form-sign-in";

export default function FormSignInWrapper() {
  return (
    <div className="mx-auto w-full md:max-w-lg">
      <CardAuth
        cardTitle="Welcome!"
        buttonBackHref="/auth/sign-up"
        buttonBackLabel="Create a new account"
        showSocials
      >
        <FormSignIn />
      </CardAuth>
    </div>
  );
}
