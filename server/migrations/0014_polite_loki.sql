DROP TABLE "productVariantTypeImages";--> statement-breakpoint
DROP TABLE "productVariantTypeTags";--> statement-breakpoint
ALTER TABLE "productVariants" DROP CONSTRAINT "productVariants_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "productVariants" DROP COLUMN IF EXISTS "productId";