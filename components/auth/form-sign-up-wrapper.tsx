"use client";

import CardAuth from "./card-auth";
import FormSignUp from "./form-sign-up";

export default function FormSignUpWrapper() {
  return (
    <div className="mx-auto w-full md:max-w-lg">
      <CardAuth
        cardTitle="Create an account"
        buttonBackHref="/auth/sign-in"
        buttonBackLabel="Have an account?"
        showSocials
      >
        <FormSignUp />
      </CardAuth>
    </div>
  );
}
