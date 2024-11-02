CREATE TABLE IF NOT EXISTS "products_productVariants" (
	"productId" serial NOT NULL,
	"productVariantId" serial NOT NULL,
	CONSTRAINT "products_productVariants_productId_productVariantId_pk" PRIMARY KEY("productId","productVariantId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_productVariants" ADD CONSTRAINT "products_productVariants_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_productVariants" ADD CONSTRAINT "products_productVariants_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
