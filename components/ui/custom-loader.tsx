import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export default function CustomLoader({
  size,
  text,
}: {
  size: number;
  text?: string;
}) {
  return (
    <span className={cn("text-cemter", text && "flex gap-2")}>
      <LoaderCircle className={cn(`w-${size} h-${size} animate-spin`)} />
      {text && <span>{text}</span>}
    </span>
  );
}
