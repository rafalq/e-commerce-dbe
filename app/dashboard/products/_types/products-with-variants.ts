import type { InferResultType } from "@/lib/infer-types";

export type ProductsWithVariants = InferResultType<
  "products",
  { productVariants: true }
>;
