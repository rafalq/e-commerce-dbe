type CustomSeparatorProps = {
  text?: string;
};

const CustomSeparator = ({ text }: CustomSeparatorProps) => {
  return (
    <div className="relative mt-12">
      <div className="absolute inset-0 flex items-center">
        <div className="border-gray-300 border-b w-full"></div>
      </div>
      {text && (
        <div className="relative flex justify-center">
          <span className="bg-card px-4 text-primary text-sm">{text}</span>
        </div>
      )}
    </div>
  );
};

export default CustomSeparator;
