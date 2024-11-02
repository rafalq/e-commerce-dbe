import { columns } from "@/app/dashboard/products/_components/table-columns";
import { TableData } from "@/app/dashboard/products/_components/table-data";
import placeholderImg from "@/public/placeholder-img.jpg";
import { db } from "@/server";

export default async function ProductsPage() {
  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No products found");

  const dataTable = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholderImg.src,
        variants: [],
      };
    }

    const image = product.productVariants[0].variantImages[0].url;

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      image,
      variants: product.productVariants,
    };
  });

  if (!dataTable) throw new Error("No data found");

  return <TableData columns={columns} data={dataTable} />;
}
