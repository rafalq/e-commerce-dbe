"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ProductColumn } from "@/app/dashboard/products/_types/product-column";
import Image from "next/image";

export const columns: ColumnDef<ProductColumn>[] = [
  { accessorKey: "id", header: "Id" },
  {
    accessorKey: "title",
    header: "Title",
    cell: (row) => {
      const title = row.getValue() as string;
      return <div className="font-semibold tracking-wider">{title}</div>;
    },
  },
  { accessorKey: "variants", header: "Variants" },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const formatted = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(price);
      return <div className="text-xs">{formatted}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      const title = row.getValue("title");
      return (
        <Image src={image} alt={title + " image"} width={50} height={50} />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 w-8 h-8">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem className="flex justify-start items-center gap-2 focus:bg-primary/30 dark:focus:bg-primary text-primary text-xs focus:text-primary-foreground">
              <Pencil className="w-3 h-3" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem className="flex justify-start items-center gap-2 dark:focus:bg-destructive focus:bg-destructive/30 text-xs">
              <Trash className="w-3 h-3" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
