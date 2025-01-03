"use client";

import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/ui/custom/custom-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setToast } from "@/lib/set-toast";
import { deleteProduct } from "@/server/actions/delete-product";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function TableActions({
  productId,
  productTitle,
}: {
  productId: number;
  productTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { execute } = useAction(deleteProduct, {
    onExecute() {
      toast.loading("Operation in progress...");
    },
    onSuccess(data) {
      toast.dismiss();
      setToast(data.data!);
    },
    onError() {
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  function handleDeleteProduct() {
    execute({ id: productId });
    setIsOpen(false);
  }

  return (
    <>
      <CustomDialog
        title={`Delete "${productTitle}"?`}
        confirmButtonTitle="Delete"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        onConfirm={handleDeleteProduct}
      >
        <p>Are you sure? This operation is irreversible.</p>
      </CustomDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 w-8 h-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel className="text-xs">
            Product Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            asChild
            className="flex justify-center items-center gap-2 focus:bg-primary/30 dark:focus:bg-primary text-primary text-xs focus:text-primary-foreground"
          >
            <Link href={`/dashboard/products/save?id=${productId}`}>
              <Pencil className="w-3 h-3" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="flex justify-center items-center gap-2 dark:focus:bg-destructive focus:bg-destructive/30 text-xs"
          >
            <Trash className="w-3 h-3" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
