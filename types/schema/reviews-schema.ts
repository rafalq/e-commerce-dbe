import { z } from "zod";

export const ReviewsSchema = z.object({
  productId: z.number(),
  rating: z.number().min(1, { message: "At least 1 star required" }).max(5),
  comment: z
    .string()
    .min(2, { message: "Comment needs at least 2 characters" }),
});

export type ReviewsSchemaType = z.infer<typeof ReviewsSchema>;
