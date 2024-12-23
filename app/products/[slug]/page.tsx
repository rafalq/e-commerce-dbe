import CartAdd from "@/components/cart/cart-add";
import ProductVariant from "@/components/products/product-variant";
import ProductVariantPick from "@/components/products/product-variant-pick";
import ProductVariantShowcase from "@/components/products/product-variant-showcase";
import Reviews from "@/components/reviews/reviews";
import Stars from "@/components/reviews/stars";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format-price";
import { getReviewAverage } from "@/lib/get-review-average";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugId = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugId;
  }

  return [];
}

type ProductPageProps = {
  params: { slug: string };
};

export default async function ProductPage({
  params: { slug },
}: ProductPageProps) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(slug)),
    with: {
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: { variantImages: true, variantTags: true },
          },
        },
      },
    },
  });

  if (variant) {
    const reviewAvg = getReviewAverage(
      variant?.product.reviews.map((r) => r.rating)
    );

    return (
      <div className="max-w-6xl">
        <div className="flex md:flex-row flex-col justify-between gap-4 md:gap-12 p-4 w-full">
          <div className="flex flex-col md:w-3/5">
            <ProductVariantShowcase
              variants={variant.product.productVariants}
            />
          </div>

          <div className="flex flex-col md:place-content-start md:w-2/5">
            <h1 className="font-bold text-4xl">{variant?.product.title}</h1>
            <div className="flex flex-col gap-2">
              <ProductVariant variants={variant.product.productVariants} />
              {variant.product.reviews.length > 0 && (
                <Stars
                  rating={reviewAvg}
                  totalReviews={variant.product.reviews.length}
                />
              )}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex gap-4 my-4">
                {variant.product.productVariants.map((prodVariant) => (
                  <ProductVariantPick
                    key={prodVariant.id}
                    id={prodVariant.id}
                    variantTitle={prodVariant.title || ""}
                    type={prodVariant.type}
                    value={prodVariant.value}
                    productId={variant.productId}
                    productTitle={variant.product.title}
                    price={variant.product.price}
                    image={prodVariant.variantImages[0].url}
                  />
                ))}
              </div>
            </div>
            <p className="py-4 font-medium text-2xl">
              {formatPrice(variant.product.price)}
            </p>
            <div className="flex flex-col mb-8 w-full">
              <CartAdd />
            </div>
            {variant.product.description.length > 0 ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: variant.product.description,
                }}
                className="text-base"
              />
            ) : (
              <p className="p-10 text-center text-medium text-primary">
                No description yet...
              </p>
            )}
          </div>
        </div>
        <Separator className="mt-2" />

        <div className="mt-4">
          <Reviews productId={variant.productId} />
        </div>
      </div>
    );
  }
}
