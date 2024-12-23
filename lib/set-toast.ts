import { toast } from "sonner";
import type { ApiResponseType } from "@/types/api-response-type";

export function setToast(res: ApiResponseType) {
  const resStatus = res.status;
  const resMsg = res.message;

  switch (resStatus) {
    case "info":
      toast.info(resMsg || "No info provided");
      break;
    case "success":
      toast.success(resMsg || "Operation done successfully");
      break;
    case "warning":
      toast.warning(resMsg || "Operation suspended");
      break;
    case "error":
      toast.error(resMsg || "Operation done successfully");
      break;
    case "two-factor-info":
      toast.success(resMsg || "No info provided");
      break;
    case "two-factor-success":
      toast.success(resMsg || "Operation done successfully");
      break;
    case "two-factor-warning":
      toast.warning(resMsg || "Operation suspended");
      break;
    case "two-factor-error":
      toast.error(resMsg || "Operation failed");
      break;
    default:
      throw new Error("Status response not recognized");
  }
}
