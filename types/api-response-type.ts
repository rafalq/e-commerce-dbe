export type ApiResponseStatusType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "two-factor-info"
  | "two-factor-success"
  | "two-factor-warning"
  | "two-factor-error";

export type ApiResponseType = {
  status: ApiResponseStatusType;
  message?: string;
  payload?: unknown | null;
};
