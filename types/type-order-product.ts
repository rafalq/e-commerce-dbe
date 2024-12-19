import type { InferResultType } from "@/lib/infer-types";

export type TypeOrderProduct = InferResultType<
  "orderProduct",
  {
    order: { with: { user: true } };
    product: true;
    productVariants: {
      with: { variantImages: true };
    };
  }
>;
