import { TypeFormFieldDetails } from "@/types/type-form-field-details";
import { TypeSchemaSignIn } from "@/types/schema-sign-in";

export const formSignIn: TypeFormFieldDetails<TypeSchemaSignIn>[] = [
  {
    name: "email",
    label: "Email",
    placeholder: "email@email.com",
    type: "email",
  },
  { name: "password", label: "Password", type: "two-factor-password" },
  {
    name: "code",
    label: "Confirmation code",
    type: "two-factor-code",
    description: "Enter the confirmation code we sent to your email.",
  },
];
