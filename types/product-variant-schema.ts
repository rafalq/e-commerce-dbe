import * as z from "zod";

export const ProductVariantSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Variant title must be at least 1 character long"),
  type: z.string().min(1, "Variant type is required"),
  value: z.string().min(1, "Variant value is required"),
  editMode: z.boolean(),
  productId: z.number(),
  tags: z.array(z.string()).min(1, {
    message: "Provide at least one tag",
  }),
  variantImages: z
    .array(
      z.object({
        id: z.number().optional(),
        key: z.string().optional(),
        name: z.string(),
        url: z.string().refine((url) => url.search("blob:") !== 0, {
          message: "Wait for the image to upload",
        }),
        size: z.number(),
      })
    )
    .min(1, { message: "Provide at least one image" }),
});

export type ProductVariantSchemaType = z.infer<typeof ProductVariantSchema>;
