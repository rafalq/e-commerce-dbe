import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import OrderList from "@/app/dashboard/orders/_components/order-list";

export default async function OrderPage() {
  const user = await auth();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: { with: { variantImages: true } },
          order: true,
        },
      },
    },
    orderBy: [desc(orders.id)],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>Check the status of your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <OrderList userOrders={userOrders} />
      </CardContent>
    </Card>
  );
}
