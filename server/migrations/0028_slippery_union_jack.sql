ALTER TABLE "productVariants" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "productVariants" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "productVariants" ADD COLUMN "values" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "productVariants" DROP COLUMN IF EXISTS "variantTitle";--> statement-breakpoint
ALTER TABLE "productVariants" DROP COLUMN IF EXISTS "variantType";--> statement-breakpoint
ALTER TABLE "productVariants" DROP COLUMN IF EXISTS "variants";