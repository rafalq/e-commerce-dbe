type SeparatorProps = {
  text?: string;
};

export default function Separator({ text }: SeparatorProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 flex items-center">
        <div className="border-primary/30 border-b w-full"></div>
      </div>
      {text && (
        <div className="relative flex justify-center">
          <span className="bg-primary-foreground/50 px-4 text-primary text-sm">
            {text}
          </span>
        </div>
      )}
    </div>
  );
}
