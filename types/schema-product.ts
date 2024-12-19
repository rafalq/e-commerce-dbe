import * as z from "zod";

export const SchemaProduct = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string(),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price must be a positive number" }),
});

export type TypeSchemaProduct = z.infer<typeof SchemaProduct>;
