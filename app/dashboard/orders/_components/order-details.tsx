import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";

import type { OrderType } from "@/lib/infer-types";

type OrderDetailsProps = {
  order: OrderType;
};

export default async function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <Button className="w-full" variant={"ghost"}>
                View Details
              </Button>
            </DialogTrigger>
          </DropdownMenuItem>
          {order.receiptURL ? (
            <DropdownMenuItem>
              <Button asChild className="w-full" variant={"ghost"}>
                <Link href={order.receiptURL} target="_blank">
                  Download Receipt
                </Link>
              </Button>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="rounded-md">
        <DialogHeader>
          <DialogTitle>Order Details #{order.id}</DialogTitle>
          <DialogDescription>
            Your order total is ${order.total}
          </DialogDescription>
        </DialogHeader>
        <Card className="flex flex-col gap-4 border-0 p-2 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderProduct.map(
                ({ product, productVariants, quantity }) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={productVariants.variantImages[0].url}
                        width={48}
                        height={48}
                        alt={product.title}
                      />
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          background: productVariants.value,
                        }}
                        className="rounded-full w-4 h-4"
                      ></div>
                    </TableCell>
                    <TableCell>{quantity}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
