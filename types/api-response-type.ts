type TypeApiResponseStatus =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "two-factor-info"
  | "two-factor-success"
  | "two-factor-warning"
  | "two-factor-error";

export type ApiResponseType = {
  status: TypeApiResponseStatus;
  message?: string;
  payload?: Record<string, string> | null;
};
