import { InferResultType } from "@/lib/infer-types";

export type VariantsWithProduct = InferResultType<
  "productVariants",
  { variantImages: true; variantTags: true; product: true }
>;
