import { TiTick } from "react-icons/ti";

type FormSuccessProps = {
  message?: string;
};

export default function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className="bg-teal-300 text-secondary-foreground p-3 flex gap-4 justify-center items-center shadow">
      <TiTick className="w-8 h-8" />
      <p className="font-semibold">{message}</p>
    </div>
  );
}
