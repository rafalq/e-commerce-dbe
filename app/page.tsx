import Image from "next/image";
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
      <div>
        <Hero />
      </div>
      <Algolia />
      <ProductTags variantTags={uniqueTags} />
      <Products pVariants={productsData} />
    </>
  );
}

function Hero() {
  return (
    <div className="relative flex justify-center items-center mb-6 [clip-path:polygon(0%_0%,100%_0%,100%_80%,0%_100%)]">
      {/* <div className="absolute bg-gradient-to-r from-[#7ed56f] to-[#28b485] opacity-70 w-full h-full"></div> */}
      <div className="absolute bg-gradient-to-r from-primary to-secondary opacity-80 w-full h-full"></div>
      <Image
        src="https://utfs.io/f/EKbOhwrOVbBqnsWIKeqxBz9OoMDqQ5GvXlunkIY4PR7WfUAZ"
        alt="Mountain view"
        width={1000}
        height={507}
        className="bg-cover bg-center"
      />
    </div>
  );
}
