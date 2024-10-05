"use client";

import CardAuth from "./card-auth";
import FormSignUp from "./form-sign-up";

export default function FormSignUpWrapper() {
  return (
    <CardAuth
      cardTitle="Create an account"
      buttonBackHref="/auth/sign-in"
      buttonBackLabel="Have an account?"
      showSocials
    >
      <div className="w-full md:max-w-lg mx-auto">
        <FormSignUp />
      </div>
    </CardAuth>
  );
}
