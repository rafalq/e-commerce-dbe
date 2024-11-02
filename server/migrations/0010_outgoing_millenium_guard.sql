CREATE TABLE IF NOT EXISTS "productVariantTypeImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" real NOT NULL,
	"productVariantTypeId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productVariantTypeTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"productVariantTypeId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productVariantTypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"productVariantId" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "productVariants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"productType" text NOT NULL,
	"updated" timestamp DEFAULT now(),
	"productId" serial NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantTypeImages" ADD CONSTRAINT "productVariantTypeImages_productVariantTypeId_productVariantTypes_id_fk" FOREIGN KEY ("productVariantTypeId") REFERENCES "public"."productVariantTypes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantTypeTags" ADD CONSTRAINT "productVariantTypeTags_productVariantTypeId_productVariantTypes_id_fk" FOREIGN KEY ("productVariantTypeId") REFERENCES "public"."productVariantTypes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariantTypes" ADD CONSTRAINT "productVariantTypes_productVariantId_productVariants_id_fk" FOREIGN KEY ("productVariantId") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariants" ADD CONSTRAINT "productVariants_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
