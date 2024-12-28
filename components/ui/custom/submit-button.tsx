import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/custom/loader";

type SubmitButtonProps = {
  isLoading: boolean;
  title?: string;
  children?: React.ReactNode;
};

export default function SubmitButton({
  isLoading,
  title,
  children,
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
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
