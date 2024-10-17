"use client";

import CardAuth from "@/app/auth/_components/card-auth";

type FormWrapperProps = {
  cardTitle?: string;
  buttonBackHref?: string;
  buttonBackLabel?: string;
  showSocials?: boolean;
  children: React.ReactNode;
};

export default function FormWrapper({
  cardTitle,
  buttonBackHref,
  buttonBackLabel,
  showSocials,
  children,
}: FormWrapperProps) {
  return (
    <div className="mx-auto w-full md:max-w-lg">
      <CardAuth
        cardTitle={cardTitle || ""}
        buttonBackHref={buttonBackHref}
        buttonBackLabel={buttonBackLabel}
        showSocials={showSocials}
      >
        {children}
      </CardAuth>
    </div>
  );
}
