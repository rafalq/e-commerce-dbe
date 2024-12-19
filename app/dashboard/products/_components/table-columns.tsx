"use client";

import { PlusCircle } from "lucide-react";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ColumnDef } from "@tanstack/react-table";

import ProductVariant from "@/app/dashboard/products/_components/product-variant";
import TableActions from "@/app/dashboard/products/_components/table-actions";

import type { ProductColumn } from "@/app/dashboard/products/_types/product-column";
import type { VariantsWithImagesTags } from "@/app/dashboard/products/_types/variants-with-images-tags";
import VariantDisplayIcon from "./variant-display-icon";

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
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue(
        "variants"
      ) satisfies VariantsWithImagesTags[];

      return (
        <div className="flex justify-center items-center gap-2">
          {variants.map((variant) => (
            <TooltipProvider key={variant.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex justify-center items-center h-full">
                    <ProductVariant
                      productId={variant.productId}
                      variant={variant}
                      editMode={true}
                    >
                      <VariantDisplayIcon
                        color={variant.value}
                        // text={truncateText(variant.variantTitle!, 1, "")}
                      />
                    </ProductVariant>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{variant.title ?? "Variant"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex justify-center items-center h-full">
                  <ProductVariant productId={row.original.id} editMode={false}>
                    <PlusCircle className="w-5 h-5" />
                  </ProductVariant>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add variant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
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
        <div className="relative w-[50px] h-[50px]">
          <Image
            src={image}
            alt={`${title} image`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <TableActions
          productId={row.getValue("id")}
          productTitle={row.getValue("title")}
        />
      );
    },
  },
];
