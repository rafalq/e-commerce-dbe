CREATE TABLE IF NOT EXISTS "variantTypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"values" text[] DEFAULT '{}'::text[] NOT NULL,
	"productId" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "productVariants" ADD COLUMN "value" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTypes" ADD CONSTRAINT "variantTypes_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "productVariants" DROP COLUMN IF EXISTS "values";