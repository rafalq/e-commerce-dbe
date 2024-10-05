import { IoMdAlert } from "react-icons/io";

type FormErrorProps = {
  message?: string;
};

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="bg-destructive text-secondary-foreground p-3">
      <IoMdAlert className="w-4 h-4" />
      <p className="text-destructive">{message}</p>
    </div>
  );
}
