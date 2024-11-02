type CustomTooltipProps = {
  text: string;
  children: React.ReactNode;
};

export default function CustomTooltip({ children, text }: CustomTooltipProps) {
  return (
    <div className="relative m-0 p-0 group">
      {children}
      <div
        className="bottom-6 left-1/2 z-10 absolute border-primary bg-primary-foreground opacity-0 group-hover:opacity-100 shadow-md mb-3 px-4 py-2 border rounded-md font-medium text-primary text-xs whitespace-nowrap transition-opacity -translate-x-1/2 duration-200 delay-700"
        role="tooltip"
        id="top-tooltip"
      >
        <span className="-bottom-1.5 left-1/2 -z-10 absolute border-primary bg-primary-foreground border-r border-b w-3 h-3 -translate-x-1/2 rotate-45"></span>
        <span>{text}</span>
      </div>
    </div>
  );
}
