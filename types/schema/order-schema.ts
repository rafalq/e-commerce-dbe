import * as z from "zod";

export const OrderSchema = z.object({
  total: z.number(),
  status: z.string(),
  paymentIntentId: z.string(),
  products: z.array(
    z.object({
      productId: z.number(),
      variantId: z.number(),
      quantity: z.number(),
    })
  ),
});

export type OrderSchemaOrder = z.infer<typeof OrderSchema>;
