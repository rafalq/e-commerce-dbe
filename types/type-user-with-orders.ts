import type { InferResultType } from "@/lib/infer-types";

export type TypeUserWithOrders = InferResultType<
  "users",
  {
    orders: true;
    products: true;
    productVariants: { with: { variantImages: true } };
  }
>;
