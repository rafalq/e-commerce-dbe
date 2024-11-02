import * as z from "zod";

export const SchemaProductVariant = z.object({
  id: z.number().optional(),
  variantTitle: z.string().optional(),
  variantType: z.string(),
  variantValue: z.string(),
  productType: z
    .string()
    .min(3, { message: "Product type must be at least 3 characters long." }),
  editMode: z.boolean(),
  productId: z.number(),
  tags: z.array(z.string()).min(1, {
    message: "Provide at least one tag.",
  }),
  variantImages: z
    .array(
      z.object({
        id: z.number().optional(),
        key: z.string().optional(),
        name: z.string(),
        url: z.string().refine((url) => url.search("blob:") !== 0, {
          message: "Wait for the image to upload.",
        }),
        size: z.number(),
      })
    )
    .min(1, { message: "Provide at least one image." }),
});
