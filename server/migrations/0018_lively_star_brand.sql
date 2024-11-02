CREATE TABLE IF NOT EXISTS "productVariantTypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated" timestamp DEFAULT now(),
	"productVariantId" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantTypes" ADD CONSTRAINT "productVariantTypes_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
