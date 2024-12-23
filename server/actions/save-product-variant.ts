"use server";

import { db } from "@/server/index";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
  variantTypes,
} from "@/server/schema";
import { SchemaProductVariant } from "@/types/schema-product-variant";
import type { TypeApiResponse } from "@/types/type-api-response";
import { algoliasearch } from "algoliasearch";
import { eq } from "drizzle-orm";
import { isEmpty } from "lodash";
import { revalidatePath } from "next/cache";
import { getTypeWithValues } from "./get-type-with-values";
import { actionClient } from "./index";

const clientAlgolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_SECRET!
);

export const saveProductVariant = actionClient
  .schema(SchemaProductVariant)
  .action(
    async ({
      parsedInput: {
        id,
        title,
        type,
        value,
        variantImages: newImgs,
        tags,
        productId,
        editMode,
      },
    }) => {
      try {
        const product = await db.query.products.findFirst({
          where: eq(products.id, productId),
        });

        if (!product) throw new Error("Product not found");

        const dbTypes = (await getTypeWithValues(productId)).data;

        if (!isEmpty(dbTypes) && type in dbTypes) {
          const updatedDbTypes = Array.from(new Set([...dbTypes[type], value]));
          await db
            .update(variantTypes)
            .set({
              values: updatedDbTypes,
            })
            .where(eq(variantTypes.type, type))
            .returning();
        } else {
          await db
            .insert(variantTypes)
            .values({
              type,
              values: [value],
              productId,
            })
            .returning();
        }

        if (editMode && id) {
          const updatedVariant = await db
            .update(productVariants)
            .set({
              title,
              type,
              value,
              updated: new Date(),
            })
            .where(eq(productVariants.id, id))
            .returning();

          await db
            .delete(variantTags)
            .where(eq(variantTags.variantId, updatedVariant[0].id));

          const editTags = await db
            .insert(variantTags)
            .values(
              tags.map((tag) => ({ variantId: updatedVariant[0].id, tag }))
            )
            .returning();

          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, updatedVariant[0].id));

          const editImages = await db
            .insert(variantImages)
            .values(
              newImgs.map((img, idx) => ({
                name: img.name,
                size: img.size,
                url: img.url,
                variantId: updatedVariant[0].id,
                order: idx,
              }))
            )
            .returning();

          await clientAlgolia.partialUpdateObject({
            indexName: "products",
            objectID: updatedVariant[0].id.toString(),
            attributesToUpdate: {
              productTitle: product.title,
              price: product.price,
              variantTitle: title,
              variantType: type,
              variantValue: value,
              variantTags: editTags.map((item) => item.tag),
              variantImages: editImages.map((item) => item.url),
            },
          });

          revalidatePath("/dashboard/products");
          revalidatePath("/");

          return {
            status: ["success"],
            message: `Updated "${title}" successfully!`,
          } satisfies TypeApiResponse;
        }

        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              title,
              type,
              value,
              productId,
            })
            .returning();

          const newTags = await db
            .insert(variantTags)
            .values(
              tags.map((tag) => ({
                tag,
                variantId: newVariant[0].id,
              }))
            )
            .returning();

          const newImages = await db
            .insert(variantImages)
            .values(
              newImgs.map((img, idx) => ({
                name: img.name,
                size: img.size,
                url: img.url,
                variantId: newVariant[0].id,
                order: idx,
              }))
            )
            .returning();

          await clientAlgolia.saveObject({
            indexName: "products",
            body: {
              objectID: newVariant[0].id,
              id: productId,
              productTitle: product?.title,
              price: product?.price,
              variantTitle: title,
              variantType: type,
              variantValue: value,
              variantTags: newTags.map((item) => item.tag),
              variantImages: newImages.map((item) => item.url),
            },
          });

          revalidatePath("/dashboard/products");
          revalidatePath("/");

          return {
            status: ["success"],
            message: `Added ${title} successfully!`,
          } satisfies TypeApiResponse;
        }
      } catch (error) {
        console.error(error);
        return {
          status: ["error"],
          message: "Failed to save variant",
        };
      }
    }
  );
