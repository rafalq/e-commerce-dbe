import { z } from "zod";
import { SchemaProduct } from "@/types/schema-product";

export type ProductToSave = {
  id?: number;
  title: string;
  description?: string;
  price: number;
  created: Date;
};

export type ZProductToSave = z.infer<typeof SchemaProduct>;
