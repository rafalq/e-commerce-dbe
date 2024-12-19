"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import FormSaveProductVariant from "@/app/dashboard/products/_components/form-save-product-variant";

import type { VariantsWithImagesTags } from "@/app/dashboard/products/_types/variants-with-images-tags";
import { forwardRef, useState, type PropsWithRef } from "react";

type ProductVariantProps = {
  editMode: boolean;
  children: React.ReactNode;
  variant?: VariantsWithImagesTags;
  productId?: number;
};

const ProductVariant: React.FC<PropsWithRef<ProductVariantProps>> = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ editMode, variant, productId, children }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogContent className="max-w-screen-sm max-h-[740px] md:max-h-[560px] scrollbarY">
          <div className="p-4">
            <DialogHeader className="pb-6">
              <DialogTitle className="font-semibold text-3xl">
                {editMode ? "Edit" : "Add"} Variant
              </DialogTitle>
              <DialogDescription>
                Manage the product variant here
              </DialogDescription>
            </DialogHeader>
            <FormSaveProductVariant
              editMode={editMode}
              variant={variant}
              productId={productId}
              onDialogClose={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

ProductVariant.displayName = "ProductVariant";

export default ProductVariant;
