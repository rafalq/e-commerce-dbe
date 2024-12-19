import type { InferResultType } from "@/lib/infer-types";

export type TypeReviewsWithUser = InferResultType<
  "reviews",
  {
    user: true;
  }
>;
