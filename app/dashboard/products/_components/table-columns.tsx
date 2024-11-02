"use client";

import { PlusCircle } from "lucide-react";
import Image from "next/image";

import CustomTooltip from "@/components/ui/custom-tooltip";
import { ColumnDef } from "@tanstack/react-table";

import ProductVariant from "./product-variant";
import TableActions from "./table-actions";

import type { ProductColumn } from "@/app/dashboard/products/_types/product-column";
import type { VariantsWithImagesTags } from "@/app/dashboard/products/_types/variants-with-images-tags";
import FormProductVariant from "./form-product-variant";

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
      const variants = row.getValue("variants") as VariantsWithImagesTags[];

      return (
        <div className="flex justify-center items-center gap-2">
          {variants.map((variant) => (
            <div key={variant.id}>
              <CustomTooltip text={variant.productType}>
                <ProductVariant
                  productId={variant.productId}
                  variant={variant}
                  editMode={true}
                >
                  <div
                    key={variant.id}
                    className="rounded-full w-5 h-5"
                    style={{ background: variant.variantValue }}
                  />
                </ProductVariant>
              </CustomTooltip>
            </div>
          ))}
          <CustomTooltip text="Add new variant">
            <ProductVariant
              productId={row.original.id}
              editMode={false}
              triggerButtonContent={
                <PlusCircle className="w-4 h-4 cursor-pointer" />
              }
            >
              <FormProductVariant editMode={false} />
            </ProductVariant>
          </CustomTooltip>
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
        <Image src={image} alt={title + " image"} width={50} height={50} />
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
