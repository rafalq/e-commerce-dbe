CREATE TABLE IF NOT EXISTS "productTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"productId" serial NOT NULL,
	"productVariantId" serial NOT NULL,
	"productVariantTypeId" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productTags" ADD CONSTRAINT "productTags_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productTags" ADD CONSTRAINT "productTags_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productTags" ADD CONSTRAINT "productTags_productVariantTypeId_productVariantTypes_id_fk" FOREIGN KEY ("productVariantTypeId") REFERENCES "public"."productVariantTypes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
