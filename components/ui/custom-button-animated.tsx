import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CustomButtonAnimatedProps = {
  title?: string;
  icon?: JSX.Element;
  className?: string;
  children?: React.ReactNode;
};

export default function CustomButtonAnimated({
  title,
  icon,
  children,
  className,
}: CustomButtonAnimatedProps) {
  return (
    <Button
      className={cn(
        `flex justify-center items-center hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] 
        active:shadow[0_5px_10px_rgba(0,0,0,0.2)] px-10 py-4 w-auto transition-all hover:-translate-y-1 active:-translate-y-[1px] duration-200 ease-out dark:hover:shadow-[0_10px_20px_rgba(150,150,150,0.4)] 
        dark:active:shadow[0_5px_10px_rgba(150,150,150,0.4)] ${className}`
      )}
    >
      <div className="flex justify-start items-center gap-2">
        {title && <p className="uppercase">{title}</p>}
        {icon && icon}
      </div>
      {children}
    </Button>
  );
}
