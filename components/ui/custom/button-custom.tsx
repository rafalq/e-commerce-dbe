import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonCustomProps = {
  onClick?: () => void;
  className?: string;
} & (
  | { customVariant: "titled"; title: string; icon?: React.ReactNode }
  | { customVariant: "blank"; children: React.ReactNode }
);

export function ButtonCustom(props: ButtonCustomProps) {
  return (
    <Button
      onClick={props.onClick}
      variant={"outline"}
      className={cn("flex w-full md:max-w-sm", `${props.className}`)}
    >
      {props.customVariant === "blank" && props.children}
      {props.customVariant === "titled" && (
        <div className="flex gap-2">
          <p>{props.title}</p>
          {props.icon && <span>{props.icon}</span>}
        </div>
      )}
    </Button>
  );
}
