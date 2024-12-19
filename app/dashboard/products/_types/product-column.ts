import type { VariantsWithImagesTags } from "@/app/dashboard/products/_types/variants-with-images-tags";

export type ProductColumn = {
  id: number;
  title: string;
  description?: string;
  price: number;
  image: string;
  variants: VariantsWithImagesTags[];
};
