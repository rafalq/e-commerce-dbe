import type { InferResultType } from "@/lib/infer-types";

export type TypeOrder = InferResultType<
  "orders",
  {
    orderProduct: {
      with: {
        product: true;
        productVariants: { with: { variantImages: true } };
      };
    };
  }
>;
