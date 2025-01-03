import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance, subMinutes } from "date-fns";
import OrderDetails from "@/app/dashboard/orders/_components/order-details";
import { formatPrice } from "@/lib/format-price";

import type { OrderType } from "@/lib/infer-types";

type OrderListProps = {
  userOrders: OrderType[];
};

export default async function OrderList({ userOrders }: OrderListProps) {
  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userOrders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{formatPrice(order.total)}</TableCell>
            <TableCell>
              <Badge
                className={
                  order.status === "succeeded"
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-yellow-700 hover:bg-yellow-800"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="font-medium text-xs">
              {formatDistance(subMinutes(order.created!, 0), new Date(), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell>
              <OrderDetails order={order} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
