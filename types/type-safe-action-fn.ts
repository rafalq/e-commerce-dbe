import type { SafeActionFn } from "next-safe-action";
import type { z } from "zod";
import type { TypeApiResponse } from "@/types/type-api-response";

export type TypeSafeActionFn = SafeActionFn<
  string,
  z.ZodAny,
  [],
  TypeApiResponse,
  [],
  TypeApiResponse
>;
