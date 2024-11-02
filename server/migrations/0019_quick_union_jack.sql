CREATE TABLE IF NOT EXISTS "productVariantTypeImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" real NOT NULL,
	"productId" serial NOT NULL,
	"productVariantId" serial NOT NULL,
	"productVariantTypeId" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantTypeImages" ADD CONSTRAINT "productVariantTypeImages_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantTypeImages" ADD CONSTRAINT "productVariantTypeImages_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantTypeImages" ADD CONSTRAINT "productVariantTypeImages_productVariantTypeId_productVariantTypes_id_fk" FOREIGN KEY ("productVariantTypeId") REFERENCES "public"."productVariantTypes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
