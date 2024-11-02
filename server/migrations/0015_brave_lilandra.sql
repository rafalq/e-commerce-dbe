CREATE TABLE IF NOT EXISTS "productsToProductVariants" (
	"productId" serial NOT NULL,
	"productVariantId" serial NOT NULL,
	CONSTRAINT "productsToProductVariants_productId_productVariantId_pk" PRIMARY KEY("productId","productVariantId")
);
--> statement-breakpoint
DROP TABLE "productVariantTypes";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productsToProductVariants" ADD CONSTRAINT "productsToProductVariants_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productsToProductVariants" ADD CONSTRAINT "productsToProductVariants_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
