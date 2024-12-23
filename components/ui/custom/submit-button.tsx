import { Button } from "@/components/ui/button";
import type { HookActionStatus } from "next-safe-action/hooks";
import Loader from "@/components/ui/custom/loader";

type SubmitButtonProps = {
  status: HookActionStatus;
  title?: string;
  children?: React.ReactNode;
};

export default function SubmitButton({
  status,
  title,
  children,
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={status === "executing"} className="w-full">
      {status === "executing" ? (
        <Loader size={8} />
      ) : (
        <>
          <span className="text-lg uppercase tracking-wide"> {title} </span>
          {children}
        </>
      )}
    </Button>
  );
}
