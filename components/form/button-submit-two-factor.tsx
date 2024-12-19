import type { TypeApiResponse } from "@/types/type-api-response";
import type { HookActionStatus } from "next-safe-action/hooks";
import CustomButtonSubmit from "@/components/ui/custom-button-submit";
import CustomButtonLink from "@/components/ui/custom-button-link";
import { cn } from "@/lib/utils";

const ButtonSubmitTwoFactor = ({
  apiResponse,
  status,
}: {
  apiResponse: TypeApiResponse | null;
  status: HookActionStatus;
}) => (
  <>
    {apiResponse && apiResponse.status.includes("two-factor") ? (
      <CustomButtonSubmit
        disabled={status === "executing"}
        className={cn(status === "executing" && "animate-pulse")}
      />
    ) : (
      <div className="flex sm:flex-row flex-col justify-between mt-6">
        <CustomButtonLink
          label="Forgot your password?"
          href="/auth/reset-password"
        />
        <CustomButtonSubmit
          disabled={status === "executing"}
          className={cn(status === "executing" && "animate-pulse")}
        />
      </div>
    )}
  </>
);

export default ButtonSubmitTwoFactor;
