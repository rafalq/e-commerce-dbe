import { db } from "@/server";
import placeholderImg from "@/public/placeholder-img.jpg";
import { TableData } from "@/app/dashboard/products/_components/table-data";
import { columns } from "@/app/dashboard/products/_components/table-columns";

export default async function Products() {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No products found.");

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholderImg.src,
    };
  });

  if (!dataTable) throw new Error("No data table found.");

  return <TableData columns={columns} data={dataTable} />;
}
