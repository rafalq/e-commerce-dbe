import { IoMdAlert } from "react-icons/io";

type FormErrorProps = {
  message?: string;
};

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="bg-rose-300 text-secondary-foreground p-3 flex gap-4 justify-center items-center">
      <IoMdAlert className="w-8 h-8" />
      <p className="font-semibold">{message}</p>
    </div>
  );
}
