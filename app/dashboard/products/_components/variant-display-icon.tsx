import { cn } from "@/lib/utils";

type VariantDisplayIconProps =
  | {
      circleSize?: number;
    } & (
      | { size: string }
      | { color?: undefined; text: string }
      | { text?: undefined; color: string }
    );

export default function VariantDisplayIcon({
  circleSize,
  ...props
}: VariantDisplayIconProps) {
  if ("color" in props) {
    return (
      <div
        className={cn(
          "flex justify-center items-center rounded-full  w-5 h-5",
          circleSize && `w-${circleSize} h-${circleSize}`
        )}
        style={{ background: `${props.color}` }}
      ></div>
    );
  }

  if ("size" in props) {
    return (
      <div
        className={cn(
          "flex justify-center items-center bg-primary text-primary-foreground font-semibold rounded-full border border-primary w-5 h-5",
          circleSize && `w-${circleSize} h-${circleSize}`
        )}
      >
        <div
          className={cn(
            "flex justify-center items-center bg-primary text-primary-foreground font-semibold rounded-full border border-primary",
            (props.size === "small" && "w-2 h-2") ||
              (props.size === "medium" && "w-3 h-3") ||
              (props.size === "large" && "w-4 h-4")
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex justify-center items-center bg-primary text-primary-foreground font-semibold rounded-full border border-primary w-5 h-5",
        circleSize && `w-${circleSize} h-${circleSize}`
      )}
    >
      {props.text}
    </div>
  );
}
