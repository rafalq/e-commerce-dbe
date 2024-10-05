import { TiTick } from "react-icons/ti";

type FormSuccessProps = {
  message?: string;
};

export default function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className="bg-teal-400 text-secondary-foreground p-3">
      <TiTick className="w-4 h-4" />
      <p className="text-teal-400">{message}</p>
    </div>
  );
}
