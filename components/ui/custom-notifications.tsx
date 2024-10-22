import { IoMdAlert } from "react-icons/io";
import { TiTick } from "react-icons/ti";

type CustomNotificationErrorProps = {
  message?: string;
};

export function CustomNotificationError({
  message,
}: CustomNotificationErrorProps) {
  if (!message) return null;

  return (
    <div className="flex justify-center items-center gap-4 bg-rose-300 p-3 text-secondary-foreground">
      <IoMdAlert className="w-6 h-6" />
      <p className="font-semibold">{message}</p>
    </div>
  );
}

type CustomNotificationSuccessProps = {
  message?: string;
};

export function CustomNotificationSuccess({
  message,
}: CustomNotificationSuccessProps) {
  if (!message) return null;

  return (
    <div className="flex justify-center items-center gap-4 bg-teal-300 shadow p-3 text-secondary-foreground">
      <TiTick className="w-8 h-8" />
      <p className="font-semibold">{message}</p>
    </div>
  );
}
