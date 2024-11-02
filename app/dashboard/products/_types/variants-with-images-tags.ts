import type { InferResultType } from "@/lib/infer-types";

export type VariantsWithImagesTags = InferResultType<
  "productVariants",
  { variantImages: true; variantTags: true }
>;
