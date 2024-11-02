import type { VariantsWithImagesTags } from "./variants-with-images-tags";

export type ProductColumn = {
  id: number;
  title: string;
  description?: string;
  price: number;
  image: string;
  variants: VariantsWithImagesTags[];
};
