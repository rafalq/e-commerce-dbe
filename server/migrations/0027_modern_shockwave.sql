ALTER TABLE "productVariants" ADD COLUMN "variants" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "productVariants" DROP COLUMN IF EXISTS "variantValue";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "variants";