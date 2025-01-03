import { ApiResponseType } from "../api-response-type";
import type { SafeActionFn } from "next-safe-action";
import type { z } from "zod";

export type SafeActionFnType = SafeActionFn<
  string,
  z.ZodAny,
  [],
  ApiResponseType,
  [],
  ApiResponseType
>;
