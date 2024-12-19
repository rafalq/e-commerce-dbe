"use client";

import { formSignIn } from "@/app/auth/_components/in-progress/form-sign-in";
import FormWrapper from "@/components/form/in-progress/form-wrapper-new";
import { signInEmail } from "@/server/actions/sign-in-email";
import { SchemaSignIn } from "@/types/schema-sign-in";
import type { TypeSafeActionFn } from "@/types/type-safe-action-fn";

const FormSignIn = () => {
  const defaultValues = {
    email: "",
    password: "",
    code: "",
  };

  return (
    <FormWrapper
      schema={SchemaSignIn}
      defaultValues={defaultValues}
      mode="onChange"
      action={signInEmail as TypeSafeActionFn}
      formTitle="Sign In"
      hasSocialAuth
      formFields={formSignIn}
      hasSubmitButton
      hasHaveAccountLink
    />
  );
};

export default FormSignIn;

// "use client";

// import FormFieldWrapper from "@/components/form/form-field-wrapper";
// import FormWrapper from "@/components/form/form-wrapper";
// import CustomButtonLink from "@/components/ui/custom-button-link";
// import CustomButtonSubmit from "@/components/ui/custom-button-submit";
// import CustomInputCode from "@/components/ui/custom-input-code";
// import CustomInputPassword from "@/components/ui/custom-input-password";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { signInEmail } from "@/server/actions/sign-in-email";
// import { SchemaSignIn, type TypeSchemaSignIn } from "@/types/schema-sign-in";
// import type { TypeApiResponse } from "@/types/type-api-response";
// import type { TypeSafeActionFn } from "@/types/type-safe-action-fn";
// import type { HookActionStatus } from "next-safe-action/hooks";

// export default function FormSignIn() {
//   return (
//     <FormWrapper
//       schema={SchemaSignIn}
//       defaultValues={{ email: "", password: "", code: "" }}
//       mode="onChange"
//       action={signInEmail as TypeSafeActionFn}
//       hasSocialAuth
//       hasSubmitButton={false}
//     >
//       {(apiResponse, status) => (
//         <>
//           {/* ----- email ----- */}
//           <FormFieldWrapper<TypeSchemaSignIn> fieldName="email" label="Email">
//             {(field) => (
//               <Input
//                 {...field}
//                 placeholder="me@email.com"
//                 disabled={
//                   (apiResponse && apiResponse.status.includes("two-factor")) ||
//                   status === "executing"
//                 }
//               />
//             )}
//           </FormFieldWrapper>

//           {/* ----- password ----- */}
//           {apiResponse === null && (
//             <FormFieldWrapper<TypeSchemaSignIn>
//               fieldName="password"
//               label="Password"
//             >
//               {(field) => <CustomInputPassword {...field} />}
//             </FormFieldWrapper>
//           )}
//           {/* ----- code ----- */}
//           {apiResponse && apiResponse.status.includes("two-factor") && (
//             <FormFieldWrapper<TypeSchemaSignIn>
//               fieldName="code"
//               label="Confirmation Code"
//               description="Enter the confirmation code we sent to your email"
//             >
//               {(field) => (
//                 <CustomInputCode
//                   {...field}
//                   slotsAmount={6}
//                   disabled={status === "executing"}
//                 />
//               )}
//             </FormFieldWrapper>
//           )}
//           <TwoFactorSubmitButton apiResponse={apiResponse} status={status} />
//         </>
//       )}
//     </FormWrapper>
//   );
// }

// const TwoFactorSubmitButton = ({
//   apiResponse,
//   status,
// }: {
//   apiResponse: TypeApiResponse;
//   status: HookActionStatus;
// }) => {
//   if (apiResponse && apiResponse.status.includes("two-factor")) {
//     return (
//       <CustomButtonSubmit
//         disabled={status === "executing"}
//         className={cn(status === "executing" && "animate-pulse")}
//       />
//     );
//   } else {
//     return (
//       <div className="flex sm:flex-row flex-col justify-between mt-6">
//         <CustomButtonLink
//           label="Forgot your password?"
//           href="/auth/reset-password"
//         />
//         <CustomButtonSubmit
//           disabled={status === "executing"}
//           className={cn(status === "executing" && "animate-pulse")}
//         />
//       </div>
//     );
//   }
// };
