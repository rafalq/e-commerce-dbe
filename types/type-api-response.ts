type TypeApiResponseStatus =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "two-factor";

export type TypeApiResponse = {
  status: TypeApiResponseStatus[];
  message?: string;
  data?: Record<string, string> | null | unknown;
};
