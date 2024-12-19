import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { db } from "@/server";
import Sales from "@/app/dashboard/analytics/_components/sales";
import Earnings from "@/app/dashboard/analytics/_components/earnings";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const totalOrders = await db.query.orderProduct.findMany({
    with: {
      order: { with: { user: true } },
      product: true,
      productVariants: { with: { variantImages: true } },
    },
  });

  if (totalOrders.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Orders</CardTitle>
        </CardHeader>
      </Card>
    );

  if (totalOrders)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Analytics</CardTitle>
          <CardDescription>
            Check your sales, new customers and more
          </CardDescription>
        </CardHeader>
        <CardContent className="flex lg:flex-row flex-col gap-8 w-full">
          <div className="md:w-2/5">
            <Sales totalOrders={totalOrders} />
          </div>
          <div className="md:w-3/5">
            <Earnings totalOrders={totalOrders} />
          </div>
        </CardContent>
      </Card>
    );
}
