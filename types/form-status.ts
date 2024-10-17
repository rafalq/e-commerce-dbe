export type FormStatus = {
  status: "error" | "success" | "two-factor";
  message?: string;
  data?: unknown;
};
