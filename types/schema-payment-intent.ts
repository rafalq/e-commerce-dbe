import * as z from "zod";

export const SchemaPaymentIntent = z.object({
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

export type TypeSchemaProduct = z.infer<typeof SchemaPaymentIntent>;
