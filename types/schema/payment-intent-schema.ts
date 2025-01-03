import * as z from "zod";

export const PaymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  cart: z.array(
    z.object({
      quantity: z.number(),
      productId: z.number(),
      title: z.string(),
      price: z.number(),
      image: z.string(),
    })
  ),
});

export type PaymentIntentSchemaType = z.infer<typeof PaymentIntentSchema>;
