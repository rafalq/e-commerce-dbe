import type { TypeApiResponse } from "@/types/type-api-response";
import { toast } from "sonner";

export function setToast(data: TypeApiResponse) {
  const message = data.message || "Something went wrong";
  if (data.status.includes("success")) toast.success(message);
  else if (data.status.includes("error")) toast.error(message);
  else if (data.status.includes("warning")) toast.warning(message);
  else if (data.status.includes("info")) toast.info(message);
}
