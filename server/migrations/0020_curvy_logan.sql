ALTER TABLE "productVariantTypeImages" RENAME TO "productVariantImages";--> statement-breakpoint
ALTER TABLE "productVariantImages" DROP CONSTRAINT "productVariantTypeImages_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "productVariantImages" DROP CONSTRAINT "productVariantTypeImages_productVariantId_productVariants_id_fk";
--> statement-breakpoint
ALTER TABLE "productVariantImages" DROP CONSTRAINT "productVariantTypeImages_productVariantTypeId_productVariantTypes_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantImages" ADD CONSTRAINT "productVariantImages_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantImages" ADD CONSTRAINT "productVariantImages_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantImages" ADD CONSTRAINT "productVariantImages_productVariantTypeId_productVariantTypes_id_fk" FOREIGN KEY ("productVariantTypeId") REFERENCES "public"."productVariantTypes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
