import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CustomButtonSubmitProps = {
  label?: string;
  className?: string;
};

export default function CustomButtonSubmit({
  label,
  className,
  ...props
}: CustomButtonSubmitProps & ButtonProps) {
  return (
    <div className="block sm:flex sm:flex-row-reverse">
      <Button type="submit" className={cn(`${className}`)} {...props}>
        <div className="flex items-center gap-2">
          <p className="font-semibold uppercase">{label ? label : "submit"}</p>
        </div>
      </Button>
    </div>
  );
}
