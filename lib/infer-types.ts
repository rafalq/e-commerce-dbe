import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "@/server/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

// ---- TYPES -----

export type UserWithOrders = InferResultType<
  "users",
  {
    orders: true;
    products: true;
    productVariants: { with: { variantImages: true } };
  }
>;

export type ProductsWithVariants = InferResultType<
  "products",
  { productVariants: true }
>;

export type Variant = InferResultType<"productVariants">;

export type VariantTypes = InferResultType<
  "products",
  { products: true; productVariants: true; productVariantTypes: true }
>;

export type VariantTypeWithValues = InferResultType<"variantTypes">;

export type VariantsWithProduct = InferResultType<
  "productVariants",
  { variantImages: true; variantTags: true; product: true }
>;

export type VariantsWithImagesTags = InferResultType<
  "productVariants",
  { variantImages: true; variantTags: true }
>;

export type OrderType = InferResultType<
  "orders",
  {
    orderProduct: {
      with: {
        product: true;
        productVariants: { with: { variantImages: true } };
      };
    };
  }
>;

export type OrderProductType = InferResultType<
  "orderProduct",
  {
    order: { with: { user: true } };
    product: true;
    productVariants: {
      with: { variantImages: true };
    };
  }
>;

export type ReviewsWithUser = InferResultType<
  "reviews",
  {
    user: true;
  }
>;
