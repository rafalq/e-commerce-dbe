ALTER TABLE "productVariants" ADD COLUMN "variantType" text NOT NULL;--> statement-breakpoint
ALTER TABLE "productVariants" ADD COLUMN "variantValue" text NOT NULL;--> statement-breakpoint
ALTER TABLE "productVariants" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "productVariants" DROP COLUMN IF EXISTS "value";