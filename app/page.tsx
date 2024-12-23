import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import { db } from "@/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const revalidate = 60 * 60;

export default async function Home() {
  const productsData = await db.query.productVariants.findMany({
    with: {
      product: true,
      variantTags: true,
      variantImages: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  const allTags: string[] = [];

  productsData.map((product) =>
    product.variantTags
      .map((item) => item)
      .map((i) => i.tag)
      .map((item) => item)
      .forEach((tag) => allTags.push(tag))
  );

  const uniqueTags = Array.from(new Set(allTags));

  return (
    <>
      <Algolia />
      <ProductTags variantTags={uniqueTags} />
      <Products pVariants={productsData} />
    </>
  );
}
