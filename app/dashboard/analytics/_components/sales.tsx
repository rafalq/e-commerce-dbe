import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import placeholderUser from "@/public/placeholder-user.jpg";
import Image from "next/image";

import type { TypeOrderProduct } from "@/types/type-order-product";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import truncateText from "@/lib/truncate-text";

export default function Sales({
  totalOrders,
}: {
  totalOrders: TypeOrderProduct[];
}) {
  const sliced = totalOrders.slice(0, 8);
  return (
    <Card className="flex-1 h-full shrink-0">
      <CardHeader>
        <CardTitle>New sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent className="w-full h-96 scrollbarY">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sliced.map(({ order, product, quantity, productVariants }) => (
              <TableRow className="font-medium" key={order.id}>
                <TableCell className="max-w-20">
                  {order.user.image && order.user.name ? (
                    <div className="flex items-center gap-2 w-32">
                      <Image
                        src={order.user.image}
                        width={25}
                        height={25}
                        alt={order.user.name}
                        className="rounded-full"
                      />
                      <TooltipProvider key={order.id}>
                        <Tooltip>
                          <TooltipTrigger asChild className="cursor-help">
                            <p className="font-medium text-xs">
                              {truncateText(order.user.name, 6)}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{order.user.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center gap-2">
                      <Image
                        src={placeholderUser}
                        width={25}
                        height={25}
                        alt="user not found"
                        className="rounded-full"
                      />
                      <p className="font-medium text-xs">No User</p>
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>
                  <Image
                    src={productVariants.variantImages[0].url}
                    width={48}
                    height={48}
                    alt={product.title}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
