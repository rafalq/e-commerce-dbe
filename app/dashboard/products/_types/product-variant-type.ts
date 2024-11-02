import type { InferResultType } from "@/lib/infer-types";

export type ProductVariantTypes = InferResultType<
  "products",
  { products: true; productVariants: true; productVariantTypes: true }
>;
